const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;

export function decodeBase64ToInt16(base64: string): Int16Array {
  let bufferLength = base64.length * 0.75;
  if (base64[base64.length - 1] === '=') bufferLength--;
  if (base64[base64.length - 2] === '=') bufferLength--;

  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < base64.length; i += 4) {
    let encoded1 = lookup[base64.charCodeAt(i)];
    let encoded2 = lookup[base64.charCodeAt(i + 1)];
    let encoded3 = lookup[base64.charCodeAt(i + 2)];
    let encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }
  return new Int16Array(bytes.buffer);
}

export function detectPitch(buffer: Int16Array, sampleRate: number): number {
  let rms = 0;
  for (let i = 0; i < buffer.length; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / buffer.length);
  if (rms < 300) return 0;

  let maxCorrelation = 0;
  let bestOffset = -1;
  
  const minOffset = Math.floor(sampleRate / 1500); 
  const maxOffset = Math.floor(sampleRate / 100);  

const correlations = new Float32Array(maxOffset + 1);

  for (let offset = minOffset; offset < maxOffset; offset++) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - offset; i++) {
      correlation += buffer[i] * buffer[i + offset];
    }
correlations[offset] = correlation;

    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestOffset = offset;
    }
  }

if (bestOffset > minOffset && bestOffset < maxOffset) {
    const y1 = correlations[bestOffset - 1];
    const y2 = correlations[bestOffset];
    const y3 = correlations[bestOffset + 1];

    const fractionalOffset = bestOffset + (y1 - y3) / (2 * (y1 - 2 * y2 + y3));
    
    return sampleRate / fractionalOffset;
  }

  if (bestOffset > 0) {
    return sampleRate / bestOffset;
  }
  return 0;
}