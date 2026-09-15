import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

type CustomInputProps = {
  values: string;
  placeholder: string;
  OnChangeText: (text: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  hideicon?: boolean;
  editable?: boolean;
  multiline?: boolean;
};


export default function CustomInput({ values, placeholder, OnChangeText, type = "text", hideicon = false, editable = true ,multiline=false}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const KeyboardType: KeyboardTypeOptions =
    type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default';
  const iconName = type === 'email' ? 'mail-outline' : type === 'password' ? 'lock-closed-outline' : type === 'number' ? 'keypad-outline' : 'person-outline';
  const theme = useAppTheme();


  return (
    <View style={[styles.inputContainer, { backgroundColor: theme.theme.card, borderColor: theme.theme.border },
      !editable && { opacity: 0.7 },
      multiline && { height: 100, alignItems: 'flex-start', paddingTop: 12 }

    ]}>

{!hideicon && (
        <Ionicons name={iconName} size={20} color={theme.theme.subtitle} style={{ marginTop: multiline ? 2 : 0 }} />
      )}


      <TextInput
        style={[
          styles.input,
          {
            color: theme.theme.subtitle,
            marginLeft: hideicon ? 0 : 8},
            multiline && { textAlignVertical: 'top', height: '100%' }
        ]}
        value={values}
        placeholderTextColor={useAppTheme().theme.subtitle}
        placeholder={placeholder}
        onChangeText={text => OnChangeText(text)}
        keyboardType={KeyboardType}
        secureTextEntry={type === 'password' && !showPassword} />

      {type === 'password' && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'

  },

  input: {
    flex: 1,
    marginLeft: 8,
  },

});



