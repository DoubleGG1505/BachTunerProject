import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CustomCheckboxProps = {
  label: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
};

export default function CustomCheckbox({ label, value, onValueChange }: CustomCheckboxProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onValueChange(!value)}
    >
      <Ionicons 
        name={value ? 'checkbox' : 'square-outline'} 
        size={22} 
        color={value ? '#007AFF' : 'gray'} 
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#e20e0e',
  },
});