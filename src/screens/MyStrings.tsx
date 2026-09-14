import { Text,View,StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import { useAppTheme } from "../context/ThemeContext";

export default function MyStrings({navigation}:any){
  const { theme} = useAppTheme();
    return(
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title,{color:theme.title}]}> My Strings Page! </Text>
        <CustomButton title="<- Go back"
        onPress={()=>navigation.goBack()} 
        variant="switch" />
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
});