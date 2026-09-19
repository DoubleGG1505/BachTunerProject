import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import CustomButton from './CustomButton';

type MetronomeProps = {
  visible: boolean;
  onClose: () => void;
};

export default function MetronomeModal({ visible, onClose }: MetronomeProps) {
  const { theme } = useAppTheme();

  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTickOn, setIsTickOn] = useState(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isPlaying) {
      const msPerBeat = (60 / bpm) * 1000;

      intervalId = setInterval(() => {
        setIsTickOn(true);
        setTimeout(() => setIsTickOn(false), 100);
      }, msPerBeat);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, bpm]);

  const handleBpmChange = (amount: number) => {
    setBpm((prev) => {
      const newBpm = prev + amount;
      if (newBpm < 40) return 40;
      if (newBpm > 220) return 220;
      return newBpm;
    });
  };

  const closeModal = () => {
    setIsPlaying(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.title }]}>Metrónomo</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close-circle" size={28} color={theme.error} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.visualIndicator,
              {
                backgroundColor: isTickOn ? theme.primary : theme.background,
                borderColor: theme.border,
              },
            ]}
          />

          <Text style={[styles.bpmText, { color: theme.title }]}>{bpm} BPM</Text>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: theme.background }]}
              onPress={() => handleBpmChange(-5)}
            >
              <Text style={[styles.btnText, { color: theme.title }]}>-5</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: theme.background }]}
              onPress={() => handleBpmChange(-1)}
            >
              <Text style={[styles.btnText, { color: theme.title }]}>-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: theme.background }]}
              onPress={() => handleBpmChange(1)}
            >
              <Text style={[styles.btnText, { color: theme.title }]}>+1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: theme.background }]}
              onPress={() => handleBpmChange(5)}
            >
              <Text style={[styles.btnText, { color: theme.title }]}>+5</Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title={isPlaying ? 'Detener' : 'Iniciar'}
            icon={isPlaying ? 'stop' : 'play'}
            variant={isPlaying ? 'danger' : 'save'}
            onPress={() => setIsPlaying(!isPlaying)}
          />

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  visualIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 20,
  },
  bpmText: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});