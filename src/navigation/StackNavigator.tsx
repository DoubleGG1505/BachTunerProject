import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Login from "../screens/Login";
import TabNavigator from "./TabsNavigator";
import MyStrings from "../screens/MyStrings";

export type RootStackParamList={
Home:undefined,
Login:undefined,
MyStrings:undefined,
UserTabs:undefined
}

const Stack=createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator(){
return(

<Stack.Navigator initialRouteName="Login">
<Stack.Screen name='Login' component={Login} options={{title:'Login'}} />
<Stack.Screen name='Home' component={Home} options={{title:'Inicio'}} />
<Stack.Screen name='UserTabs' component={TabNavigator} />

</Stack.Navigator>

);

}