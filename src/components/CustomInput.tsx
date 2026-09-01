import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { useState } from 'react';
import { StyleSheet, TextInput, View, Text ,TouchableOpacity} from 'react-native';
import { CustomBackground,AppColors } from './CustomBackground';

type CustomInputProps = {
    values: string;
    placeholder: string;
    OnChangeText: (text: string) => void;
    type?: 'text' | 'email' | 'password' | 'number';
};


export default function CustomInput({ values, placeholder, OnChangeText, type }: CustomInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const KeyboardType =
        type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default';
    const iconName = type === 'email' ? 'mail-outline' : type === 'password' ? 'lock-closed-outline' : type === 'number' ? 'keypad-outline' : 'person-outline';


    return (
        <View style={styles.inputContainer}>
            <Ionicons name={iconName} size={20} color={AppColors.darkText} />
            <TextInput
            style={styles.input}
                value={values}
                placeholderTextColor={AppColors.secondary}
                placeholder={placeholder}
                onChangeText={text => OnChangeText(text)}
                keyboardType={KeyboardType}
                secureTextEntry={type==='password' &&!showPassword} />

            {type==='password' && (
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
        width: 260,
        backgroundColor:"#FFFFFF",
        borderColor: AppColors.secondary,
        borderWidth: 1,
        borderRadius:8,
        marginBottom: 12,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems:'center'

    },

    input: {
    flex: 1,
    marginLeft: 8,
  },

});

