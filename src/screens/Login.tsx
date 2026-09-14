import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import CustomCheckbox from "../components/CustomCheckbox";
import { useAppTheme } from "../context/ThemeContext";

export default function Login({ navigation }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailInvalid, setEmailInvalid] = useState("");
    const [passwordInvalid, setPasswordInvalid] = useState("");
    const {theme} = useAppTheme();

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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title,{color:theme.title}]}>Welcome To BachTuner</Text>
            <Text style={[styles.subtitle,{color:theme.subtitle}]}>Login to continue</Text>
            <View style={styles.form}>

                <CustomInput
                    values={email}
                    placeholder="Ingrese su correo @unitec.edu"
                    OnChangeText={handleEmailChange}
                    type="email" />

                {emailInvalid ? <Text style={[styles.subtitle,{color:theme.error}]}>{emailInvalid}</Text> : null}
                

                <CustomInput
                    values={password}
                    placeholder="********"
                    OnChangeText={handlePasswordChange}
                    type="password" />
{passwordInvalid ? <Text style={[styles.subtitle,{color:theme.error}]}>{passwordInvalid}</Text> : null}

                <CustomButton
                    title="Login"
                    onPress={() => handleLogin()}
                />
            </View>
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
  form: {
        width: "100%",
        alignItems: "center",
        gap: 8,
    },
});