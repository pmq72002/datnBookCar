import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import HomeScreen from "../navigation/screens/HomeScreen";
import ActivityScreen from "../navigation/screens/ActivityScreen";
import NotificationScreen from "../navigation/screens/NotificationScreen";
import AccountScreen from "../navigation/screens/AccountScreen";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { createStackNavigator } from "@react-navigation/stack";
import MapScreen from "../navigation/popups/MapCarScreen";
import defaultColor from "../assets/btn/btnColor";
import LogInScreen from "../navigation/accounts/LogInScreen";
import RegisterScreen from "../navigation/accounts/RegisterScreen";
import DeliveryScreen from "../navigation/popups/DeliveryScreen";


const homeName = 'Trang chủ'
const activityName = 'Hoạt động'
const notificationName = 'Thông báo'
const accountName = 'Tài khoản'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function VehicleNav ()  {
 return(
    <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen}
        options={{headerShown: false,}}/>
        <Stack.Screen name="MapCarScreen" component={MapScreen}
        options={{headerShown: false,}}/>
        <Stack.Screen name="DeliveryScreen" component={DeliveryScreen}
        options={{headerShown: false,}}/>
    </Stack.Navigator>
 )
}

const MainBottomNav = () => {

    const [name, setName] = useState<string>("Phạm Minh Quân")
     
    return(
        
        
        <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={{
            headerShown: false
        }}
        >
            <Tab.Screen 
            name={homeName} 
            component={VehicleNav} 
            options={{ 
                tabBarIcon: ({focused})=><AntDesign name="home" size={24} color={focused ? defaultColor : 'grey'} 
                />,
                tabBarLabel: "Trang chủ",
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "bold",
                    
                },
                
                tabBarActiveTintColor: defaultColor,  
                tabBarInactiveTintColor: 'grey'
            }}
            />

            <Tab.Screen 
            name={activityName} 
            component={ActivityScreen}
            options={{ 
                tabBarIcon: ({focused})=><AntDesign name="clockcircleo" size={24} color={focused ? defaultColor : 'grey'}
                />,
                tabBarLabel: "Hoạt động",
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "bold"
                },
                 tabBarActiveTintColor: defaultColor,  
                tabBarInactiveTintColor: 'grey',
                
            }}/>
            
            <Tab.Screen 
            name={notificationName} 
            component={NotificationScreen}
            options={{ 
                tabBarIcon: ({focused})=><Ionicons name="notifications-outline" size={24} color={focused ? defaultColor : 'grey'} />,
                tabBarLabel: "Thông báo",
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "bold"
                },
                 tabBarActiveTintColor: defaultColor,  
                tabBarInactiveTintColor: 'grey'
            }}/>

            <Tab.Screen
             name={accountName} 
             component={AccountScreen}
             options={{ 
                tabBarIcon: ({focused})=><MaterialCommunityIcons name="account-settings-outline" size={24} color={focused ? defaultColor : 'grey'} />,
                tabBarLabel: "Tài khoản",
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "bold"
                },
                 tabBarActiveTintColor: defaultColor,  
                tabBarInactiveTintColor: 'grey'
            }}/>


        </Tab.Navigator>
 
       
        
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40
    },
    hello:{
        marginTop: 20,
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 10,
        marginRight: 10,
        
    },
    togo:{
        borderColor: "gray",
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        
    }
})

export default MainBottomNav