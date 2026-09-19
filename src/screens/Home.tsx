import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import CustomButton from "../components/CustomButton";
import { useAppTheme } from "../context/ThemeContext";
import MetronomeModal from "../components/MetronomeModal";
import Ionicons from "@react-native-vector-icons/ionicons";

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

export default function Home({ navigation }: any) {
  const { theme } = useAppTheme();
  const [selectedString, setSelectedString] = useState<ViolinStringTarget>(VIOLIN_STRINGS[2]);
  const [centsOffset, setCentsOffset] = useState<number>(0);
  const [isMetronomeVisible, setIsMetronomeVisible] = useState(false);

  const isTuned = Math.abs(centsOffset) <= 3;
  const needlePosition = Math.max(-100, Math.min(100, centsOffset * 2));

  const getStatusText = () => {
    if (isTuned) return "¡Afinado!";
    return centsOffset < 0 ? "Apretar clavija (Subir ↑)" : "Aflojar clavija (Bajar ↓)";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Afinador BachTuner</Text>
        <Text style={[styles.subtitle, { color: theme.subtitle }]}>
          Cuerda activa: {selectedString.name} ({selectedString.note}) - {selectedString.frequency} Hz
        </Text>
      </View>

      <View style={[styles.gaugeContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
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
            {getStatusText()} ({centsOffset > 0 ? `+${centsOffset}` : centsOffset} cents)
          </Text>
        </View>

        <View style={styles.tuningSimRow}>
          <TouchableOpacity 
            style={[styles.simBtn, { backgroundColor: theme.background }]} 
            onPress={() => setCentsOffset((prev) => Math.max(-45, prev - 5))}
          >
            <Text style={{ color: theme.title, fontWeight: "bold" }}>-5 cents</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.simBtn, { backgroundColor: "#E8F5E9" }]} 
            onPress={() => setCentsOffset(0)}
          >
            <Text style={{ color: "#2E7D32", fontWeight: "bold" }}>Afinar (0)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.simBtn, { backgroundColor: theme.background }]} 
            onPress={() => setCentsOffset((prev) => Math.min(45, prev + 5))}
          >
            <Text style={{ color: theme.title, fontWeight: "bold" }}>+5 cents</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.pegboxCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.pegboxTitle, { color: theme.subtitle }]}>Toca una clavija para afinar</Text>

        <View style={styles.pegboxLayout}>
          <View style={styles.pegColumn}>
            <TouchableOpacity 
              style={[
                styles.pegButton, 
                selectedString.note === "G3" && { backgroundColor: isTuned ? "#27AE60" : theme.primary }
              ]}
              onPress={() => { setSelectedString(VIOLIN_STRINGS[0]); setCentsOffset(-12); }}
            >
              <Text style={[styles.pegText, selectedString.note === "G3" && styles.pegTextActive]}>Sol (G)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.pegButton, 
                selectedString.note === "D4" && { backgroundColor: isTuned ? "#27AE60" : theme.primary }
              ]}
              onPress={() => { setSelectedString(VIOLIN_STRINGS[1]); setCentsOffset(8); }}
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
              onPress={() => { setSelectedString(VIOLIN_STRINGS[2]); setCentsOffset(0); }}
            >
              <Text style={[styles.pegText, selectedString.note === "A4" && styles.pegTextActive]}>La (A)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.pegButton, 
                selectedString.note === "E5" && { backgroundColor: isTuned ? "#27AE60" : theme.primary }
              ]}
              onPress={() => { setSelectedString(VIOLIN_STRINGS[3]); setCentsOffset(-20); }}
            >
              <Text style={[styles.pegText, selectedString.note === "E5" && styles.pegTextActive]}>Mi (E)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 36,
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
  actionRow: {
    width: "100%",
    marginTop: "auto",
  },
});