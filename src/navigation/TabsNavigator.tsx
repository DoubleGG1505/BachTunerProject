import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import MyStrings from "../screens/MyStrings";
import Profile from "../screens/features/user-settings/Profile";
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from "../context/ThemeContext";

export type TabsParamList = {
    Home: undefined,
    MyStrings: undefined,
    Profile: undefined,
}

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabNavigator() {
   
    const { theme } = useAppTheme();
   
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor:theme.card,
                borderTopColor: theme.border,
            },
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.subtitle,
        }}
        
        >
            <Tab.Screen
                name="Home" component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen 
            name="MyStrings" component={MyStrings}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="violin" size={size} color={color} />
                )
            }}
            />

            <Tab.Screen
                name="Profile" component={Profile}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                    )
                }}
            />

        </Tab.Navigator>

    )
}
