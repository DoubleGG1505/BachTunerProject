import { Text,View,StyleSheet,Image } from "react-native";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { CustomBackground,AppColors } from "../components/CustomBackground";

export default function Home({navigation}:any){

    const [showDog,setShowDog]=useState(true);

    const switchScreen=()=>{
        navigation.navigate('UserTabs', {screen:'MyStrings'})
    }

const toggleImage=()=>{
    setShowDog((prev)=>!prev)
};

return(
       <CustomBackground style={styles.container}>
        <Text style={styles.title}> Home Page! </Text>
      
      <Image
        source={showDog
            ? require("../../assets/violinDog.jpg")
            : require("../../assets/VanGoghViolin.jpg")
        }
        style={styles.image}
        resizeMode="cover"
      />
<Text style={styles.subtitle}>{showDog?"You before BachTuner":"You after BachTuner"} </Text>
<CustomButton
        title={"See the change"}
        onPress={toggleImage}
      />

        <CustomButton title="Go to My Strings  -> " onPress={switchScreen} variant="switch"/>
    </CustomBackground>

);

}

const styles=StyleSheet.create({
    container: {
        justifyContent:"center",
        width: "100%",
        alignItems: "center",
        gap:8,
    },
    title: {
    fontSize: 28,
        fontWeight: "700",
        color: AppColors.darkText,
        marginBottom: 8,
        textAlign: "center",
  },
  subtitle:{
 fontSize: 22,
        color: AppColors.primary,
        marginBottom: 28,
        textAlign: "center",

  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 14,
    marginBottom: 8,
  },
});