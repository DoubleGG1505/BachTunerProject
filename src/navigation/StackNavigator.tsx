import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Login from "../screens/Login";
import TabNavigator from "./TabsNavigator";
import { useAppTheme } from "../context/ThemeContext";
import Register from "../screens/Register";

export type RootStackParamList = {
    Home: undefined,
    Login: undefined,
    MyStrings: undefined,
    UserTabs: undefined
    Register: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function StackNavigsator() {
    const { theme } = useAppTheme();

    return (

        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.card,
                },
                headerTintColor: theme.title,
                headerTitleStyle: {
                    color: theme.title,
                },
                headerShadowVisible: true,

                contentStyle: {
                    backgroundColor: theme.background,
                },
            }}
        >


            <Stack.Screen name='Login' component={Login} options={{ title: 'Login' }} />
            <Stack.Screen name='Home' component={Home} options={{ title: 'Inicio' }} />
            <Stack.Screen name='Register' component={Register} options={{ title: 'Registrarse' }} />
            <Stack.Screen name='UserTabs' component={TabNavigator} />

        </Stack.Navigator>

    );

}