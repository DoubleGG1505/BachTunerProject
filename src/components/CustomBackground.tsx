
import React from 'react';
import { StyleSheet, View, SafeAreaView, ViewProps } from 'react-native';

interface CustomBackgroundProps extends ViewProps {
  children: React.ReactNode;
  useSafeArea?: boolean; 
}

export const AppColors={
    background: '#F8F4E1',  // Crema claro (Fondo general de la app)
  secondary:  '#AF8F6F',  // Tono arena/bronce (Bordes de inputs, placeholders, acentos)
  primary:    '#74512D',  // Cafe medio (Botones principales, subtitulos destacados)
  darkText:   '#543310',  // Cafe oscuro (Titulos principales, iconos y texto legible)
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

