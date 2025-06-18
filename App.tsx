import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import HomeScreen from './components/MainBottomNav';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react'
import MainBottomNav from './components/MainBottomNav';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './navigation/popups/MapCarScreen';
import LogInScreen from './navigation/accounts/LogInScreen';
import RegisterScreen from './navigation/accounts/RegisterScreen';
import ChatBoxScreen from './navigation/popups/ChatBoxScreen';
import { UserProvider } from './context/Client';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();



export default function App() {
 const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const userPhone = await AsyncStorage.getItem("userPhone");
      setInitialRoute(userPhone ? "Main" : "Login");
      setIsLoading(false);
    };
    checkLogin();
  }, []);
   if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  //jsx
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute!}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LogInScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainBottomNav} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
        
  )
}




