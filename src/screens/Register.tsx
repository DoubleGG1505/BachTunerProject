import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomInput from './../components/CustomInput';
import CustomButton from './../components/CustomButton';
import { useAppTheme } from './../context/ThemeContext';
import { supabase } from './../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function Register({ navigation }: any) {
  const { theme } = useAppTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const formattedEmail = email.trim().toLowerCase();

    if (!formattedEmail || !password || !confirmPassword) {
      Alert.alert('Campos vacios', 'Llene todos los campos.');
      return;
    }

    if (!formattedEmail.includes('@') || !formattedEmail.includes('.com')) {
      Alert.alert('Correo invalido', 'Debe ingresar un correo valido (como Paganini24@dominio.com).');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error de seguridad', 'Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Contraseña debil', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formattedEmail,
      password: password,
    });

    if (error) {
      Alert.alert('Fallo en el registro', error.message);
      setLoading(false);
      return;
    }

    Alert.alert('Registro Exitoso', 'Tu cuenta en BachTuner ha sido creada.');
    setLoading(false);
    navigation.navigate('Login');
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={theme.title} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.title }]}>Crear Cuenta</Text>
          <Text style={[styles.subtitle, { color: theme.subtitle }]}> Unase a BachTuner para su experiencia musical. </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            values={email}
            placeholder="Correo Electronico"
            OnChangeText={setEmail}
            hideicon={false}
          />

          <CustomInput
            values={password}
            placeholder="Contraseña"
            OnChangeText={setPassword}
            type="password"
            hideicon={false}
            secureTextEntry={true}
          />

          <CustomInput
            values={confirmPassword}
            placeholder="Confirmar Contraseña"
            OnChangeText={setConfirmPassword}
            type="password"
            hideicon={false}
            secureTextEntry={true}
          />

          <View style={styles.buttonWrapper}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} />
            ) : (
              <CustomButton
                title="Registrarse"
                onPress={handleRegister}
              />
            )}
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
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
    gap: 15,
  },
  buttonWrapper: {
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
  },
});