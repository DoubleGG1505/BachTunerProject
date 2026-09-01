import { Text,Button,StyleSheet,View,TouchableOpacity } from "react-native";

type CustomButtonProps={
title:string;
 onPress: () => void;
    disabled?: boolean;
    variant?: "switch" | "save" | "danger";
};

export default function CustomButton({ title, onPress, disabled = false, variant = "switch" }: CustomButtonProps) {
    const styles = getStyles(variant);

    return (
        <TouchableOpacity style={[styles.button, disabled ? styles.buttonPressed : null]} onPress={onPress} disabled={disabled}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const getStyles = (variant: "switch" | "save" | "danger") =>
    StyleSheet.create({
        container: {
            //backgroundColor: '#007AFF',
        },

        TouchableOpacity: {
            backgroundColor: '#007AFF',
            padding: 10,
            borderRadius: 5,
        },
        button: {
            backgroundColor: variant === "switch" ? '#74512D' :
                variant === "save" ? '#E63946' : '#FED24F',
            width: 150,
            padding: 12,
            borderRadius: 6,
        },

        buttonPressed: {
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#406994',
        },
        buttonText: {
            color: variant === "switch" ? "white" : "black"
        }
    });