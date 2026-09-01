import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import CustomCheckbox from "../components/CustomCheckbox";
import { CustomBackground, AppColors } from "../components/CustomBackground";

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailInvalid, setEmailInvalid] = useState("");
    const [passwordInvalid, setPasswordInvalid] = useState("");
    

   const handleLogin = () => {
    setEmailInvalid("");
    setPasswordInvalid("");

    let hasError = false;

    if (email.trim() === "") {
        setEmailInvalid("El correo es obligatorio.");
        hasError = true;
    } else if (!validEmail(email)) {
        setEmailInvalid("El correo debe terminar en @unitec.edu");
        hasError = true;
    }

    if (password.trim() === "") {
        setPasswordInvalid("La contraseña es obligatoria.");
        hasError = true;
    }

    if (!hasError) {
        navigation.navigate('UserTabs', { screen: 'Home' });
    }
};

    const validEmail = (mail: string) => {
        const clean = mail.trim().toLowerCase();
        return clean.endsWith('@unitec.edu');
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);

        if (validEmail(text)) {
            setEmailInvalid("");
        }
    }

    const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.trim() !== "") {
        setPasswordInvalid("");
    }
};

    return (
       <CustomBackground style={styles.container}>
            <Text style={styles.title}>Welcome To BachTuner</Text>
            <Text style={styles.subtitle}>Login to continue</Text>
            <View style={styles.form}>

                <CustomInput
                    values={email}
                    placeholder="Ingrese su correo @unitec.edu"
                    OnChangeText={handleEmailChange}
                    type="email" />

                {emailInvalid ? <Text style={styles.errorText}>{emailInvalid}</Text> : null}
                

                <CustomInput
                    values={password}
                    placeholder="********"
                    OnChangeText={handlePasswordChange}
                    type="password" />
{passwordInvalid ? <Text style={styles.errorText}>{passwordInvalid}</Text> : null}

                <CustomButton
                    title="Login"
                    onPress={() => handleLogin()}
                />
            </View>
        </CustomBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: AppColors.darkText,
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: AppColors.primary,
        marginBottom: 28,
        textAlign: "center",
    },
    form: {
        width: "100%",
        alignItems: "center",
        gap: 8,
    },
    errorText: {
        fontSize: 14,
        color: AppColors.error,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    }
})