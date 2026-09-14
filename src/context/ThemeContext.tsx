import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeColors;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const STORAGE_KEY = '@bachtuner_theme';
const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') {
          setMode(saved);
        }
      } catch (error) {
        console.warn('Error al leer el tema almacenado: ', error);
      }
    };
    loadStoredTheme();
  }, []);

  const toggleTheme = async () => {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch (error) {
      console.warn('Error al guardar tema: ', error);
    }
  };

const theme = mode === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);