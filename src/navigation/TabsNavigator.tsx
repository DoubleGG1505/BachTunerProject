import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Login from "../screens/Login";
import MyStrings from "../screens/MyStrings";

export type TabsParamList={
    Home:undefined,
    Login:undefined,
    MyStrings:undefined,
}

const Tab=createBottomTabNavigator<TabsParamList>();

export default function TabNavigator(){
    return(
<Tab.Navigator>
<Tab.Screen name="Login" component={Login}/>
<Tab.Screen name="Home" component={Home}/>
<Tab.Screen name="MyStrings" component={MyStrings}/>
</Tab.Navigator>

    )
}
