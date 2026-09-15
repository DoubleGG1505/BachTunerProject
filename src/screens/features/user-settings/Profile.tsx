import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateProfile, logoutUser } from '../../.././store/slices/userSlice';

export default function Profile({ navigation }: any) {
  const { theme, mode, toggleTheme } = useAppTheme();
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => state.user.data);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");


  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setLastName(userData.lastName);
      setBio(userData.bio || "");
    }
  }, [userData]);

  const handleSave = () => {
    if (userData) {
      dispatch(updateProfile({ name: name, lastName: lastName, email: userData.email, bio: bio }));
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>Settings de {userData?.name || "Usuario"}</Text>

      <View style={styles.form}>
        <CustomInput
          values={name}
          placeholder="Ingrese su nombre"
          OnChangeText={setName}
          type="text"
          editable={isEditing}
          hideicon={true}
        />

        <CustomInput
          values={lastName}
          placeholder="Ingrese su apellido"
          OnChangeText={setLastName}
          type="text"
          editable={isEditing}
          hideicon={true}
        />

        <CustomInput
          values={bio}
          placeholder="Ingrese una descripcion"
          OnChangeText={setBio}
          type="text"
          editable={isEditing}
          hideicon={true}
          multiline={true}
        />

        {isEditing ? (
          <CustomButton
            title="Guardar"
            icon='save-outline'
            onPress={handleSave}
            style={{ flex: 1 }}
          />
        ) : (
          <CustomButton
            title="Editar"
            icon='pencil-outline'
            onPress={() => setIsEditing(true)}
            style={{ flex: 1 }}
          />
        )}

      </View>

      <View style={styles.bottomSection}>

        <CustomButton
          title={`Cambiar a Tema ${mode === 'light' ? 'Oscuro' : 'Claro'}`}
          onPress={toggleTheme}
        />

        <CustomButton
          title="Cerrar Sesion"
          onPress={handleLogout}
          variant="save" />

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
  form: {
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  }
});