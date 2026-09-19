import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useAppTheme } from "../context/ThemeContext";
import Ionicons from "@react-native-vector-icons/ionicons";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { addStringProduct, removeStringProduct, loadSavedStrings, ViolinStringProduct } from "../store/slices/stringsSlice";

export default function MyStrings({ navigation }: any) {
  const { theme } = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();

  const inventory = useSelector((state: RootState) => state.strings.inventory);

  const [brand, setBrand] = useState("");
  const [note, setNote] = useState("La - A (2da)");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {

    dispatch(loadSavedStrings());

  }, [dispatch]);

  const handleAddProduct = () => {
    if (!brand.trim()) {
      Alert.alert("Campo requerido", "Por favor ingresa la marca o modelo de la cuerda.");
      return;
    }

    const newString: ViolinStringProduct = {
      id: Date.now().toString(),
      brand: brand.trim(),
      note: note,
      installedDate: date,
      type: note.includes("Set") ? "full_set" : "single",
    };

    dispatch(addStringProduct(newString));
    setBrand("");
  };

  const calculateDaysAndStatus = (installedDate: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(installedDate).getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 60) {
      return { days, text: "Optima", color: "#2E7D32", bg: "#E8F5E9" };
    } else if (days <= 120) {
      return { days, text: "Revisar desgaste", color: "#F57F17", bg: "#FFF8E1" };
    } else {
      return { days, text: "¡Cambio Urgente!", color: "#C0392B", bg: "#FFEBEE" };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>Bitácora de Cuerdas</Text>

      <View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <CustomInput
          values={brand}
          placeholder="Marca (ej. Dominant, Pirastro Evah)"
          OnChangeText={setBrand}
          hideicon={true}
        />

        <View style={styles.selectorRow}>
          {["Mi (E)", "La (A)", "Re (D)", "Sol (G)", "Set Completo"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setNote(item)}
              style={[
                styles.selectorPill,
                { borderColor: theme.border },
                note === item && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
            >
              <Text style={{ color: note === item ? "#FFF" : theme.subtitle, fontSize: 11, fontWeight: "600" }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomInput
          values={date}
          placeholder="Fecha de cambio (AAAA-MM-DD)"
          OnChangeText={setDate}
          hideicon={true}
        />

        <CustomButton
          title="Registrar Cuerda"
          onPress={handleAddProduct}
          icon="add-circle-outline"
        />
      </View>

      <Text style={[styles.subtitle, { color: theme.title }]}>
        Cuerdas Instaladas ({inventory.length})
      </Text>

      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.subtitle }]}>
            No hay registros de cuerdas. Añade una arriba para iniciar el contador.
          </Text>
        }
        renderItem={({ item }) => {
          const status = calculateDaysAndStatus(item.installedDate);
          return (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.cardTitle, { color: theme.title }]}>{item.brand}</Text>
                  <Text style={{ color: theme.subtitle, fontSize: 13 }}>{item.note}</Text>
                </View>

                <TouchableOpacity onPress={() => dispatch(removeStringProduct(item.id))}>
                  <Ionicons name="trash-outline" size={18} color={theme.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.cardFooter}>
                <Text style={{ fontSize: 12, color: theme.subtitle }}>
                  Instalada: {item.installedDate} ({status.days} días de uso)
                </Text>

                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.color }]}>{status.text}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  formCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8
  },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12
  },
  selectorPill: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 16,
    borderWidth: 1
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13
  },
  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700"
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700"
  },
});