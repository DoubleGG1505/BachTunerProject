import { NavigationContainer, ThemeContext } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { navigationRef } from "./src/navigation/NavigationService";
import { ThemeProvider, useAppTheme } from "./src/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

function MainApp() {
  const { theme,mode } = useAppTheme();

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      
      <NavigationContainer ref={navigationRef}>
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}