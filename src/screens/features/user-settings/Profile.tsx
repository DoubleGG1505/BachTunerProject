import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';
import CustomButton from '../../../components/CustomButton';

export default function Profile({ navigation }: any) {
  const { theme, mode, toggleTheme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>BachTuner Home</Text>
      
   
      <CustomButton
        title={`Cambiar a Tema ${mode === 'light' ? 'Oscuro' : 'Claro'}`}
        onPress={toggleTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});