// src/components/CustomButton.tsx
import React from "react";
import { Text, StyleSheet, View, ViewStyle, TouchableOpacity } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type CustomButtonProps = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: "switch" | "save" | "danger" | "outline";
    icon?: keyof typeof Ionicons.glyphMap; 
    style?: ViewStyle; 
};

export default function CustomButton({ 
    title, onPress, disabled = false, variant = "switch", icon, style
}: CustomButtonProps) {
    const { theme } = useAppTheme();
    const isOutline = variant === 'outline';

    // Asignación de colores según la variante
    let buttonColor = theme.primary; 
    if (variant === 'save') buttonColor = theme.error; 
    if (variant === 'danger') buttonColor = '#FED24F'; 
    if (isOutline) buttonColor = 'transparent';

    return (
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={onPress} 
            disabled={disabled}
            style={[
                styles.button, 
                { backgroundColor: buttonColor },
                isOutline && { borderWidth: 1.5, borderColor: theme.primary },
                disabled && styles.buttonDisabled,
                style 
            ]}
        >
            <View style={styles.content}>
                {icon && (
                    <Ionicons 
                        name={icon} 
                        size={20} 
                        color={isOutline ? theme.primary : "white"} 
                        style={styles.icon}
                    />
                )}
                <Text style={[styles.buttonText, { color: isOutline ? theme.primary : "white" }]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 48,
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        width: '100%',
    },
    buttonDisabled: { opacity: 0.5 },
    content: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    icon: { marginRight: 8 },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});