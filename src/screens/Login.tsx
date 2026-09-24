import { Text, View, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useAppTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/slices/userSlice";
import { supabase } from "../lib/supabase";


export default function Login({ navigation }: any) {
    const { theme } = useAppTheme();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async () => {
        const formattedEmail = email.trim().toLowerCase();

        if (!formattedEmail || !password) {
            Alert.alert('Campos vacios', 'Ingrese su correo y contraseña.');
            return;
        }

        if (!formattedEmail.includes('@') || !formattedEmail.includes('.com')) {
            Alert.alert('Formato invalido', 'El  formato del correo es invalido.');
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formattedEmail,
            password: password,
        });

        if (error) {
            Alert.alert('Acceso Denegado', 'Correo o contraseña incorrectos.');
            setLoading(false);
            return;
        }

        if (data.user) {
            dispatch(loginUser({
                name: data.user.user_metadata?.first_name || 'Violinista',
                lastName: data.user.user_metadata?.last_name || '',
                email: data.user.email || formattedEmail,
            }));

            setLoading(false);
            navigation.replace('UserTabs');
        }
    };

    const navigateToRegister = () => {
        navigation.navigate('Register');
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.title }]}>BachTuner</Text>
                    <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                        Inicia sesión para continuar.
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <CustomInput
                        values={email}
                        placeholder="Correo Electrónico"
                        OnChangeText={setEmail}
                        hideicon={true}
                    />

                    <CustomInput
                        values={password}
                        placeholder="Contraseña"
                        OnChangeText={setPassword}
                        hideicon={true}
                        secureTextEntry={true}
                    />

                    <View style={styles.buttonWrapper}>
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.primary} />
                        ) : (
                            <CustomButton
                                title="Entrar"
                                onPress={handleLogin}
                            />
                        )}
                    </View>

                    <View style={styles.registerPrompt}>
                        <Text style={[styles.registerText, { color: theme.subtitle }]}>
                            ¿No tienes cuenta?{' '}
                        </Text>
                        <TouchableOpacity onPress={navigateToRegister}>
                            <Text style={[styles.registerLink, { color: theme.primary }]}>
                                Regístrate hoy
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 38,
        fontWeight: '900',
        marginBottom: 10,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
    },
    formContainer: {
        width: '100%',
        gap: 15,
    },
    buttonWrapper: {
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
    },
    registerPrompt: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        fontSize: 14,
    },
    registerLink: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});