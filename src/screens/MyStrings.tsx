import { Text, View, StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useAppTheme } from "../context/ThemeContext";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addStringProduct } from "../store/slices/stringsSlice";

export default function MyStrings({ navigation }: any) {
  const { theme } = useAppTheme();
  const dispatch = useDispatch();

  const inventory = useSelector((state: RootState) => state.strings.inventory);

 const [brand, setBrand] = useState("");
  const [note, setNote] = useState("");

  const handleAddProduct = () => {
    
    if (brand.trim() === "" || note.trim() === "") return;

    dispatch(addStringProduct({
      id: Date.now().toString(),
      brand: brand,
      note: note,
    }));

    setBrand("");
    setNote("");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>Inventario de Cuerdas</Text>
      
      <View style={styles.form}>
        <CustomInput
          values={brand}
          placeholder="Marca... Dominant, Pirastro..."
          OnChangeText={setBrand}
          hideicon={true}
        />
        <CustomInput
          values={note}
          placeholder="Cuerda...Sol,Re..."
          OnChangeText={setNote}
          hideicon={true}
        />
        <CustomButton
          title="Agregar a Inventario"
          onPress={handleAddProduct}
          icon="add-circle-outline"
        />
      </View>

      <Text style={[styles.subtitle, { color: theme.title, marginTop: 16 }]}>
        Productos en Redux ({inventory.length}):
      </Text>

      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={{ color: theme.subtitle, textAlign: 'center', marginTop: 10 }}>
            No hay productos registrados aún.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.title }]}>{item.brand}</Text>
            <Text style={{ color: theme.subtitle }}>Cuerda: {item.note}</Text>
          </View>
        )}
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
  form: {
    width: "100%",
    alignItems: "center",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});