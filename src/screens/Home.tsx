import React, { useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import CustomButton from "../components/CustomButton";
import { useAppTheme } from "../context/ThemeContext";

export default function Home({ navigation }: any) {
  const { theme } = useAppTheme();
  const [showDog, setShowDog] = useState<boolean>(true);

  const switchScreen = () => {
    navigation.navigate('UserTabs', { screen: 'MyStrings' });
  };

  const toggleImage = () => {
    setShowDog((prev) => !prev);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>Home Page!</Text>

      <Image
        source={
          showDog
            ? require("../../assets/violinDog.jpg")
            : require("../../assets/VanGoghViolin.jpg")
        }
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={[styles.subtitle, { color: theme.subtitle}]}>
        {showDog ? "You before BachTuner" : "You after BachTuner"}
      </Text>

      <CustomButton
        title="See the change"
        onPress={toggleImage}
      />

      <CustomButton
        title="Go to My Strings ->"
        onPress={switchScreen}
        variant="switch"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 6,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 14,
  },
});