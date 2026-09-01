
import React from 'react';
import { StyleSheet, View, SafeAreaView, ViewProps } from 'react-native';

interface CustomBackgroundProps extends ViewProps {
  children: React.ReactNode;
  useSafeArea?: boolean; // Por si necesitas soporte para notch/isla dinámica
}

export const AppColors={
    background: '#F8F4E1',  // Crema claro (Fondo general de la app)
  secondary:  '#AF8F6F',  // Tono arena/bronce (Bordes de inputs, placeholders, acentos)
  primary:    '#74512D',  // Café medio (Botones principales, subtítulos destacados)
  darkText:   '#543310',  // Café oscuro (Títulos principales, íconos y texto legible)
  error:      '#C0392B',
} 

export const CustomBackground: React.FC<CustomBackgroundProps> = ({ 
  children, 
  useSafeArea = true, 
  style, 
  ...props 
}) => {

  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={[styles.container, style]} {...props}>
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});

