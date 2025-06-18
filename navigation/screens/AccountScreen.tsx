import * as React from 'react'
import { Image,StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import defaultIPV4 from '../../assets/ipv4/ipv4Address';

export default function AccountScreen(props: any) {
    const [userData, setUserData] = useState({ name: '', phone: '' });

    const {navigation}=props
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
  const handleLogout = async () => {
  await AsyncStorage.removeItem('userPhone');
  navigation.replace('Login');
};
    return(
        <View style={styles.mainContainer}>
             <Image
                            style={styles.headerImage}
                            source={require("../../assets/images/testHeader.jpg")}
                        />
            <TouchableOpacity style ={styles.infoHeader}>
                <View>
                    <Text style={{fontSize: 24, fontWeight:"bold",marginLeft: 15}}>
                    {userData.name}
                </Text>
                <Text style={{fontSize: 16, color: "grey",marginLeft: 15}}>
                    {`+84${userData.phone.replace(/^0/, "")}`}
                </Text>
                </View>
                <View style={{ flex: 1 }} />
                    <MaterialIcons name="navigate-next" size={30}  style={styles.nextIcon}/>
           
            </TouchableOpacity>

            <View style = {styles.paymentContainer}>
            <View>
                    <TouchableOpacity style={styles.paymentView}>
                    <Ionicons name="wallet-outline" size={24} color="black" style={{paddingLeft: 15,paddingRight: 15}}/>
                    <Text style={styles.containerText}>
                    Thanh toán
                    </Text>
                    <View style={{ flex: 1 }} />
                    <MaterialIcons name="navigate-next" size={30}  style={styles.nextIcon}/>
                    </TouchableOpacity>

                    
            </View>
            </View>


            <View style = {styles.paymentContainer}>
            <View>
                    <TouchableOpacity style={styles.paymentView}>
                    <Ionicons name="document-text-outline" size={24} color="black" style={{paddingLeft: 15,paddingRight: 15}} />
                    <Text style={styles.containerText}>
                    Điều khoản và chính sách
                    </Text>
                    <View style={{ flex: 1 }} />
                    <MaterialIcons name="navigate-next" size={30}  style={styles.nextIcon}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.billView}>
                    <SimpleLineIcons name="earphones-alt" size={24} color="black"  style={{paddingLeft: 15,paddingRight: 15}} />
                    <Text style={styles.containerText}>
                    Trung tâm hỗ trợ
                    </Text>
                    <View style={{ flex: 1 }} />
                    <MaterialIcons name="navigate-next" size={30}  style={styles.nextIcon}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.billView}>
                    <Ionicons name="information-circle-outline" size={24} color="black"  style={{paddingLeft: 15,paddingRight: 15}} />
                    <Text style={styles.containerText}>
                    Thông tin công ty
                    </Text>
                    <View style={{ flex: 1 }} />
                    <MaterialIcons name="navigate-next" size={30}  style={styles.nextIcon}/>
                    </TouchableOpacity>
                    
            </View>
            </View>

            <View style = {styles.paymentContainer}>
            <View>
                    <TouchableOpacity style={styles.paymentView}>
                    <Ionicons name="key-outline" size={24} color="black"  style={{paddingLeft: 15,paddingRight: 15}}/>
                    <Text style={styles.containerText}>
                    Đổi mật khẩu
                    </Text>
                    <View style={{ flex: 1 }} />
                    <MaterialIcons name="navigate-next" size={30}  style={styles.nextIcon}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.billView}>
                    <FontAwesome name="language" size={24} color="black"   style={{paddingLeft: 15,paddingRight: 15}} />
                    <Text style={styles.containerText}>
                    Ngôn ngữ
                    </Text>
                    <View style={{ flex: 1 }} />
                    <MaterialIcons name="navigate-next" size={30}  style={styles.nextIcon}/>
                    </TouchableOpacity>
                    
            </View>
            </View>

            <View style = {styles.logOutBtnContainer}>
            <View>
                <TouchableOpacity style={styles.logOutBtn}
                onPress={()=>handleLogout()}>
                    <MaterialCommunityIcons name="logout" size={26} color="black" style={{paddingLeft: 5, paddingRight:5}} />
                        <Text style={styles.logOutBtnText}>Đăng xuất</Text>
                </TouchableOpacity>

                    
                    
            </View>
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#C9C9C9',
    },
    headerImage: {
        height: 130,
        width: '100%',
        resizeMode: 'cover', 
    },
    infoHeader: {
        backgroundColor: "white",
        paddingBottom: 10,
        paddingTop: 10,
        flexDirection: "row",
        alignItems: "center"

    },
    nextIcon:{
        color: "grey",
        paddingRight: 10
        
    },
    paymentContainer: {
        backgroundColor: "white",
        marginTop: 8
    },
    containerText:{
        fontSize: 18,
        fontWeight: "bold",
    },
    paymentView:{
        flexDirection: "row",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
       
    },
    billView:{
        flexDirection: "row",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    
    },
    logOutBtnContainer:{
        height: 60,
        width: "100%",
        backgroundColor: "white",
        borderWidth: 0.5,
        
    },
    logOutBtn: {
        flexDirection: "row",
        height: "100%",
        width: "100%",
       
        justifyContent: "center",
        alignItems: "center"
       
    },
    logOutBtnText: {
        fontSize: 18,
        fontWeight: "bold"
    }
})