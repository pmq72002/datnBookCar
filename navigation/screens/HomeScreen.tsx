import Icon from '@react-native-vector-icons/ionicons'
import * as React from 'react'
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import defaultIPV4 from '../../assets/ipv4/ipv4Address';

import { useUser } from '../../context/Client'

const HomeScreen=(props: any) => {
    const {navigation} = props;
// const [userData, setUserData] = useState({ name: '', phone: '' });
const { userData, setUserData } = useUser();

    useEffect(() => {
    const fetchUser = async () => {
      const storedPhone = await AsyncStorage.getItem('userPhone');
      if (storedPhone) {
        try {
          const res = await axios.post(`http://${defaultIPV4}:3000/get-user`, {
            phone: storedPhone,
          });
          setUserData(res.data);
        } catch (err) {
          console.error('Lỗi lấy thông tin người dùng:', err);
        }
      }
    };

    fetchUser();
  }, []);
    return (
        <View style={styles.mainContainer}>

            {/* ---------------------------------------------------------------header image--------------------------------------------------------------- */}

            <Image
                style={styles.headerImage}
                source={require("../../assets/images/testHeader.jpg")}
            />
            <Text style={styles.hello}>
                Xin chào, {userData?.name}
            </Text>
            {/* ---------------------------------------------------------------togo view--------------------------------------------------------------- */}

            <View style={styles.togoContainer}>
                <View style={styles.inputContainer}>
                    <Entypo name="location-pin" size={24} color="black" style={styles.icon} />
                    <TextInput 
                        style={styles.togo} 
                        placeholder='Bạn muốn đi đâu?' 
                        placeholderTextColor="gray"
                        onPress={()=>navigation.navigate("MapCarScreen")}
                        numberOfLines={1}
                    />
                </View>
               
                
            </View>

            {/* ---------------------------------------------------------------vehicles pick view--------------------------------------------------------------- */}

            <View style = {styles.vehiclesContainer}>

            <TouchableOpacity 
            style={styles.vehiclePick}
            onPress={()=>navigation.navigate("MapCarScreen")}
            >
            <Image
                style={styles.vehicleImage}
                source={require("../../assets/png/hatchback.png")}
            />
                            <Text style={styles.vehiclePickText}>Ô tô</Text>
                </TouchableOpacity>

            <TouchableOpacity 
            style={styles.vehiclePick}
            onPress={()=>navigation.navigate("MapCarScreen")}
            >
                
            <Image
                style={styles.vehicleImage}
                source={require("../../assets/png/scooter.png")}
            />
                            <Text style={styles.vehiclePickText}>Xe máy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.vehiclePick}
                onPress={()=>navigation.navigate("DeliveryScreen")}
            >
            <Image
                style={styles.vehicleImage}
                source={require("../../assets/png/express-delivery.png")}
            />
                            <Text style={styles.vehiclePickText}>Giao hàng</Text>
                </TouchableOpacity>
            </View>
            {/* ---------------------------------------------------------------bottom image--------------------------------------------------------------- */}

            <Image
                style={styles.bottomImage}
                source={require("../../assets/images/bottomPic.jpg")}
            />
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerImage: {
        marginTop: 40,
        height: 240,
        width: '100%',
        resizeMode: 'cover', 
    },
    hello: {
        fontSize: 22,
        fontWeight: '600',
        color: "black",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    togoContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20, 
        borderColor: "grey",
        borderWidth: 1,
        marginLeft:15,
        marginRight: 15,
        padding: 5,
        borderRadius: 10,
        maxHeight: 65,
        
        
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 5,
        width: '100%',
        backgroundColor: '#D6D5DA', 
    },
    togo: {
        flex: 1,
        height: 40,
        fontSize: 14,
    },
    icon: {
        marginRight: 10,
    },
  
   
   
    vehiclesContainer:{
        flex: 1,
        alignItems: 'center',
        marginTop: 10, 
        marginLeft:15,
        marginRight: 15,
        padding: 5,
        maxHeight: 120,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    vehiclePick:{
        alignItems: 'center', 
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
        width: 100,
       
    },
    vehiclePickText:{
        fontSize: 14,
        fontWeight: "bold"
    },
    vehicleImage: {
        height: 60,
        width: '100%',
        resizeMode: "center", 
        borderRadius: 10,
        backgroundColor: "#D6D5DA",
    },
    bottomImage:{
        position:"absolute",
        bottom: 30,
        height: 240,
        width: '100%',
        resizeMode: 'cover', 
        marginTop: 10
    }
});

export default HomeScreen