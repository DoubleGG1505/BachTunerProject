import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity,ScrollView } from "react-native";
import CustomButton from "../components/CustomButton";
import { useAppTheme } from "../context/ThemeContext";
import MetronomeModal from "../components/MetronomeModal";

type ViolinStringTarget = {
  name: string;
  note: string;
  frequency: number;
}

const VIOLIN_STRINGS: ViolinStringTarget[] = [
  { name: "Sol", note: "G3", frequency: 196.00 },
  { name: "Re", note: "D4", frequency: 293.66 },
  { name: "La", note: "A4", frequency: 440.00 },
  { name: "Mi", note: "E5", frequency: 659.25 },
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function Home({ navigation }: any) {
  const { theme } = useAppTheme();
  const [selectedString, setSelectedString] = useState<ViolinStringTarget>(VIOLIN_STRINGS[2]);
  const [centsOffset, setCentsOffset] = useState<number>(0);
  const [isMetronomeVisible, setIsMetronomeVisible] = useState(false);
  const [tunerMode, setTunerMode] = useState<'violin' | 'chromatic'>('violin');
  const [selectedViolinString, setSelectedViolinString] = useState<ViolinStringTarget>(VIOLIN_STRINGS[2]);
  const [currentFreq, setCurrentFreq] = useState<number>(440.00);

  const getChromaticData = (freq: number) => {
    if (freq <= 0) return { note: '--', octave: 0, cents: 0, targetFreq: 0 };
    
    const midiNumber = 12 * (Math.log2(freq / 440)) + 69;
    const roundedMidi = Math.round(midiNumber);
    const noteIndex = ((roundedMidi % 12) + 12) % 12;
    const octave = Math.floor(roundedMidi / 12) - 1;
    const targetFreq = 440 * Math.pow(2, (roundedMidi - 69) / 12);
    const cents = Math.round(1200 * Math.log2(freq / targetFreq));

    return {
      note: NOTE_NAMES[noteIndex],
      octave,
      cents: Math.max(-50, Math.min(50, cents)),
      targetFreq: Number(targetFreq.toFixed(2)),
    };
  };

  const chromaticInfo = getChromaticData(currentFreq);

  const violinCents = Math.round(
    1200 * Math.log2(currentFreq / selectedString.frequency)
  );
  const boundedViolinCents = Math.max(-50, Math.min(50, violinCents));

  const activeCents = tunerMode === 'violin' ? boundedViolinCents : chromaticInfo.cents;
  const isTuned = Math.abs(activeCents) <= 3;
  const needleTranslation = Math.max(-110, Math.min(110, activeCents * 2.2));
  const needlePosition = needleTranslation;

  const handleViolinStringSelect = (item: ViolinStringTarget) => {
    setSelectedString(item);
    setSelectedViolinString(item);
    setCurrentFreq(item.frequency);
    setCentsOffset(0);
  };

  const getTuningGuidance = () => {
    if (isTuned) return '¡Afinado!';
    return activeCents < 0 ? 'Apretar (Subir ↑)' : 'Aflojar (Bajar ↓)';
  };

  const getStatusText = () => {
    if (isTuned) return "¡Afinado!";
    return activeCents < 0 ? "Apretar clavija (Subir ↑)" : "Aflojar clavija (Bajar ↓)";
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: theme.background }} 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    > 
      <View style={[styles.modeToggleBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.modeTab, tunerMode === 'violin' && { backgroundColor: theme.primary }]}
          onPress={() => {
            setTunerMode('violin');
            setCurrentFreq(selectedString.frequency);
          }}
        >
          <Text style={[styles.modeTabText, { color: tunerMode === 'violin' ? '#FFF' : theme.subtitle }]}>
            Violín (4 Cuerdas)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, tunerMode === 'chromatic' && { backgroundColor: theme.primary }]}
          onPress={() => setTunerMode('chromatic')}
        >
          <Text style={[styles.modeTabText, { color: tunerMode === 'chromatic' ? '#FFF' : theme.subtitle }]}>
            Cromático Libre
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Afinador BachTuner</Text>
        {tunerMode === 'violin' ? (
          <Text style={[styles.subtitle, { color: theme.subtitle }]}>
            Cuerda activa: {selectedString.name} ({selectedString.note}) - {selectedString.frequency} Hz
          </Text>
        ) : (
          <Text style={[styles.subtitle, { color: theme.subtitle }]}>
            Nota detectada: {chromaticInfo.note}{chromaticInfo.octave}
          </Text>
        )}
      </View>

      <View style={[styles.gaugeContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {tunerMode === 'chromatic' && (
          <View style={styles.centerReadout}>
            <View style={styles.chromaticNoteRow}>
              <Text style={[styles.mainNoteDisplay, { color: isTuned ? '#27AE60' : theme.title }]}>
                {chromaticInfo.note}
              </Text>
              <Text style={[styles.octaveNumber, { color: isTuned ? '#27AE60' : theme.primary }]}>
                {chromaticInfo.octave}
              </Text>
            </View>
            <Text style={[styles.hzSubtext, { color: theme.subtitle }]}>
              {currentFreq.toFixed(2)} Hz / Objetivo: {chromaticInfo.targetFreq} Hz
            </Text>
          </View>
        )}
        
        {tunerMode === 'violin' && (
          <View style={styles.centerReadout}>
             <Text style={[styles.hzSubtext, { color: theme.subtitle, marginBottom: 12 }]}>
              {currentFreq.toFixed(2)} Hz
            </Text>
          </View>
        )}

        <View style={styles.gaugeScale}>
          <Text style={[styles.scaleLabel, { color: theme.subtitle }]}>-50♭</Text>
          <Text style={[styles.scaleCenterLabel, { color: isTuned ? "#27AE60" : theme.title }]}>0</Text>
          <Text style={[styles.scaleLabel, { color: theme.subtitle }]}>+50♯</Text>
        </View>

        <View style={[styles.centerGuide, { backgroundColor: isTuned ? "#27AE60" : theme.border }]} />

        <View 
          style={[
            styles.needle, 
            { 
              transform: [{ translateX: needlePosition }],
              backgroundColor: isTuned ? "#27AE60" : theme.error
            }
          ]} 
        />

        <View style={[styles.statusPill, { backgroundColor: isTuned ? "#E8F5E9" : theme.background, borderColor: isTuned ? "#27AE60" : theme.border }]}>
          <Text style={[styles.statusText, { color: isTuned ? "#2E7D32" : theme.title }]}>
            {getStatusText()} ({activeCents > 0 ? `+${activeCents}` : activeCents} cents)
          </Text>
        </View>

        <View style={styles.tuningSimRow}>
          <TouchableOpacity 
            style={[styles.simBtn, { backgroundColor: theme.background }]} 
            onPress={() => {
              setCentsOffset((prev) => Math.max(-45, prev - 5));
              setCurrentFreq((f) => Number((f - 1.5).toFixed(2)));
            }}
          >
            <Text style={{ color: theme.title, fontWeight: "bold" }}>-1.5 Hz</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.simBtn, { backgroundColor: "#E8F5E9" }]} 
            onPress={() => {
              setCentsOffset(0);
              setCurrentFreq(tunerMode === 'violin' ? selectedString.frequency : chromaticInfo.targetFreq);
            }}
          >
            <Text style={{ color: "#2E7D32", fontWeight: "bold" }}>Afinar (0)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.simBtn, { backgroundColor: theme.background }]} 
            onPress={() => {
              setCentsOffset((prev) => Math.min(45, prev + 5));
              setCurrentFreq((f) => Number((f + 1.5).toFixed(2)));
            }}
          >
            <Text style={{ color: theme.title, fontWeight: "bold" }}>+1.5 Hz</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {tunerMode === 'violin' ? (
        <View style={[styles.pegboxCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.pegboxTitle, { color: theme.subtitle }]}>Toca una clavija para afinar</Text>

          <View style={styles.pegboxLayout}>
            <View style={styles.pegColumn}>
              <TouchableOpacity 
                style={[
                  styles.pegButton, 
                  selectedString.note === "G3" && { backgroundColor: isTuned ? "#27AE60" : theme.primary }
                ]}
                onPress={() => handleViolinStringSelect(VIOLIN_STRINGS[0])}
              >
                <Text style={[styles.pegText, selectedString.note === "G3" && styles.pegTextActive]}>Sol (G)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.pegButton, 
                  selectedString.note === "D4" && { backgroundColor: isTuned ? "#27AE60" : theme.primary }
                ]}
                onPress={() => handleViolinStringSelect(VIOLIN_STRINGS[1])}
              >
                <Text style={[styles.pegText, selectedString.note === "D4" && styles.pegTextActive]}>Re (D)</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.neckGraphic, { backgroundColor: theme.border }]}>
              <View style={styles.stringLinesContainer}>
                <View style={styles.stringLine} />
                <View style={styles.stringLine} />
                <View style={styles.stringLine} />
                <View style={styles.stringLine} />
              </View>
            </View>

            <View style={styles.pegColumn}>
              <TouchableOpacity 
                style={[
                  styles.pegButton, 
                  selectedString.note === "A4" && { backgroundColor: isTuned ? "#27AE60" : theme.primary }
                ]}
                onPress={() => handleViolinStringSelect(VIOLIN_STRINGS[2])}
              >
                <Text style={[styles.pegText, selectedString.note === "A4" && styles.pegTextActive]}>La (A)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.pegButton, 
                  selectedString.note === "E5" && { backgroundColor: isTuned ? "#27AE60" : theme.primary }
                ]}
                onPress={() => handleViolinStringSelect(VIOLIN_STRINGS[3])}
              >
                <Text style={[styles.pegText, selectedString.note === "E5" && styles.pegTextActive]}>Mi (E)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={[styles.chromaticScaleCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.pegboxTitle, { color: theme.subtitle }]}>Escala Temperada (12 Notas)</Text>
          <View style={styles.chromaticChipsGrid}>
            {NOTE_NAMES.map((n) => {
              const isCurrentPitch = n === chromaticInfo.note;
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => {
                    const idx = NOTE_NAMES.indexOf(n);
                    const newBaseFreq = 440 * Math.pow(2, (idx - 9) / 12);
                    setCurrentFreq(Number(newBaseFreq.toFixed(2)));
                    setCentsOffset(0);
                  }}
                  style={[
                    styles.chromaChip,
                    { borderColor: theme.border },
                    isCurrentPitch && {
                      backgroundColor: isTuned ? '#27AE60' : theme.primary,
                      borderColor: isTuned ? '#27AE60' : theme.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chromaChipText,
                      { color: isCurrentPitch ? '#FFF' : theme.title },
                    ]}
                  >
                    {n}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.actionRow}>
        <CustomButton
          title="Abrir Metrónomo"
          icon="pulse-outline"
          onPress={() => setIsMetronomeVisible(true)}
          variant="outline"
        />
      </View>

      <MetronomeModal 
        visible={isMetronomeVisible} 
        onClose={() => setIsMetronomeVisible(false)} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 36,
  },
  modeToggleBar: { 
    flexDirection: 'row', 
    borderRadius: 10, 
    borderWidth: 1, 
    padding: 3, 
    marginBottom: 14, 
  },
  modeTab: { 
    flex: 1, 
    paddingVertical: 8, 
    borderRadius: 8, 
    alignItems: 'center', 
  },
  modeTabText: { 
    fontSize: 13, 
    fontWeight: 'bold', 
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  gaugeContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    position: "relative",
    marginBottom: 16,
  },
  centerReadout: { 
    alignItems: 'center', 
    marginBottom: 10, 
  },
  chromaticNoteRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
  },
  mainNoteDisplay: { 
    fontSize: 52, 
    fontWeight: '900', 
    lineHeight: 56, 
  },
  octaveNumber: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginLeft: 4, 
    marginBottom: 6, 
  },
  hzSubtext: { 
    fontSize: 13, 
    fontWeight: '600', 
    marginTop: 4, 
  },
  gaugeScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  scaleLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  scaleCenterLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  centerGuide: {
    width: 3,
    height: 40,
    borderRadius: 2,
    marginBottom: 8,
  },
  needle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: -27,
    marginBottom: 16,
  },
  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  tuningSimRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  simBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  pegboxCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  chromaticScaleCard: { 
    borderRadius: 14, 
    borderWidth: 1, 
    padding: 14, 
    alignItems: 'center', 
    marginBottom: 14, 
  },
  pegboxTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
  pegboxLayout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  pegColumn: {
    gap: 14,
  },
  pegButton: {
    width: 80,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#AF8F6F",
    justifyContent: "center",
    alignItems: "center",
  },
  pegText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#74512D",
  },
  pegTextActive: {
    color: "#FFFFFF",
  },
  neckGraphic: {
    width: 60,
    height: 110,
    marginHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  stringLinesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    height: "100%",
  },
  stringLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#F8F4E1",
    opacity: 0.6,
  },
  chromaticChipsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: 8, 
    width: '100%', 
  },
  chromaChip: { 
    width: '21%', 
    height: 36, 
    borderRadius: 8, 
    borderWidth: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  chromaChipText: { 
    fontSize: 13, 
    fontWeight: 'bold', 
  },
  actionRow: {
    width: "100%",
    marginTop: "auto",
  },
});