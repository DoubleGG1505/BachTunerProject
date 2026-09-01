import { Text,View,StyleSheet } from "react-native";
import { CustomBackground } from "../components/CustomBackground";
import CustomButton from "../components/CustomButton";

export default function MyStrings({navigation}:any){
return(
    <CustomBackground style={styles.container}>
        <Text> My Strings Page! </Text>
        <CustomButton title="<- Go back"
        onPress={()=>navigation.goBack()} 
        variant="switch" />
    </CustomBackground>

);

}

const styles=StyleSheet.create({
    container: {
        justifyContent:"center",
        width: "100%",
        alignItems: "center",
        gap:8,
    }
});