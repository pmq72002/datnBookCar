import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Modal, FlatList, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, SafeAreaView, Linking } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_KEY } from '@env'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import defaultColor from '../../assets/btn/btnColor';
import axios from 'axios';
import { getDistance } from 'geolib'
import mapCarScreenStyles from '../../styles/mapCarScreenStyle';

import defaultIPV4 from '../../assets/ipv4/ipv4Address';
import io from 'socket.io-client';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import chatboxSCreenStyle from '../../styles/chatboxScreenStyle';
import CustomPlacesAutocomplete from '../TestPlacesScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
const socket = io(`http://${defaultIPV4}:3000`, {
  transports: ['websocket'],
});


const locationImg = require('../../assets/png/pin.png')
const destiLocationImg = require('../../assets/png/map-pin.png')


// --------------------------------------------------------Chat box--------------------------------------------------------
interface IMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
}

interface ChatBoxScreenProps {
  visible: boolean;
  onClose: () => void;
  currentUserId: string;
  receiverId: string;
  rideId: string;
  currentUserName: string;
  receiverName: "Tài xế"
}


const ChatBoxModal =({ visible,
  onClose,
  currentUserId,
  receiverId,
  rideId,
  currentUserName,receiverName}:ChatBoxScreenProps)=>{
  
const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState("");

 const formatMessage = (msg: any): IMessage => {
  let createdAt = new Date(msg.timestamp);
  if (isNaN(createdAt.getTime())) {
    createdAt = new Date(); // fallback nếu timestamp lỗi
  }

  let senderName = "Không rõ";
  if (msg.senderId === currentUserId) {
    senderName = currentUserName;
  } else if (msg.senderId === receiverId) {
    senderName = receiverName;
  }

  return {
    _id: msg._id || Math.random().toString(),
    text: msg.message,
    createdAt,
    user: {
      _id: msg.senderId,
      name: senderName,
    },
  };
};



  useEffect(() => {
    if (!visible) return;

    socket.emit("join", currentUserId);

    socket.on("chatMessage", (msg: any) => {
      console.log("Received message on driver app:", msg);
      if (msg.rideId === rideId) {
        setMessages((prev) => [formatMessage(msg), ...prev]);
      }
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [rideId, currentUserId, visible]);

useEffect(() => {
  if (!rideId || !visible) return;

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://${defaultIPV4}:3000/messages/${rideId}`);
      const data = await res.json();
      const formatted = data.map(formatMessage);
      setMessages(formatted);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  fetchMessages();
}, [rideId, visible]);


  const onSend = useCallback(() => {
    if (!inputText.trim()) return;

    const msgToSend = {
      senderId: currentUserId,
      receiverId,
      rideId,
      message: inputText,
      timestamp: new Date(),
      senderName: currentUserName,
    };

    socket.emit("chatMessage", msgToSend);
    setMessages((prev) => [formatMessage(msgToSend), ...prev]);
    setInputText("");
  }, [inputText]);

  const renderItem = ({ item }: { item: IMessage }) => {
    const isCurrentUser = item.user._id === currentUserId;

    return (
      <View
        style={[
          chatboxSCreenStyle.messageContainer,
          isCurrentUser ? chatboxSCreenStyle.myMessage : chatboxSCreenStyle.theirMessage,
        ]}
      >
        <Text style={chatboxSCreenStyle.sender}>{item.user.name}</Text>
        <Text style={chatboxSCreenStyle.message}>{item.text}</Text>
        <Text style={chatboxSCreenStyle.timestamp}>
          {item.createdAt.toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <StatusBar hidden />

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={chatboxSCreenStyle.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            paddingLeft: 15,
            marginTop: 20,
            
          }}
        >
          <Image 
        style={mapCarScreenStyles.backBtnImg}
        source={require("../../assets/png/back-button.png")}
        />
        </TouchableOpacity>
        <FlatList
          inverted
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 10 }}
        />
        <View style={chatboxSCreenStyle.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            style={chatboxSCreenStyle.input}
          />
          <TouchableOpacity onPress={onSend} style={chatboxSCreenStyle.sendButton}>
            <Text style={chatboxSCreenStyle.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};
// --------------------------------------------------------Wait Driver--------------------------------------------------------


interface OnRideProps{
  visible: boolean,
  onClose: () => void,
  dateTime: String,
  originName: String,
  destinationName: String,
  distance: String,
  price: string,
  rideId: string,
  navigation: any
  openChatBoxModal: () => void;
  onOpenChat: (params: {
    currentUserId: string;
    currentUserName: string;
    receiverId: string;
    rideId: string;
  }) => void;
  completeRide: ()=> void
  setDriverLocation: (location: { latitude: number; longitude: number }) => void;
}

const OnRideModal = ({visible,onClose, originName, destinationName, distance, dateTime, price,rideId, navigation,openChatBoxModal, onOpenChat,completeRide, setDriverLocation}:OnRideProps) => {
  const additionalService = 1000;
   const cashPrice = parseInt(price.replace('đ', '').replace('.', '').trim());
  const formattedCashPrice = new Intl.NumberFormat('de-DE').format(cashPrice).replace(/,/g, '.') + 'đ';
    const[isChatBoxModalVisible, setIsChatBoxModalVisible] = React.useState(false);
    const [message, setMessage] = useState<string>('');
   

  const [chatParams, setChatParams] = useState({
  currentUserId: '',
  currentUserName: '',
  receiverId: '',
  rideId: '',
});

useEffect(() => {
  if (!visible) return;

  const handleMessage = (msg: string) => {
    console.log('Nhận message từ server:', msg);
    setMessage(msg);
    completeRide(); 
    socket.off('receiveComplete', handleMessage);
  };

  socket.on('receiveComplete', handleMessage);

  return () => {
    socket.off('receiveComplete', handleMessage);
  };
}, [visible]);

type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  imageUrl: string;
};

const [driver, setDriver] = useState<Driver | null>(null);



useEffect(() => {
  if (!rideId) {
    console.log("❌ rideId chưa có, chưa lắng nghe driverInfo");
    return;
  }

  const eventKey = `driverInfo:${rideId}`;
  console.log("👂 Đăng ký lắng nghe:", eventKey);

  const handleDriverInfo = (driverInfo: any) => {
    console.log("✅ Nhận được thông tin tài xế:", driverInfo);
    setDriver(driverInfo);
    setDriverLocation({
      latitude: driverInfo.latitude,
      longitude: driverInfo.longitude,
    });

    
  };

  socket.on(eventKey, handleDriverInfo);

  return () => {
    socket.off(eventKey, handleDriverInfo);
  };
}, [rideId]);



  return(
    <Modal visible={visible} animationType="fade" transparent={true}>
    <View style={mapCarScreenStyles.modalOnDriveOverlay}>
      <View style={mapCarScreenStyles.modalOnDriveContainer}>
        <ScrollView 
      contentContainerStyle={mapCarScreenStyles.scrollViewContent}
      showsVerticalScrollIndicator={false}>
        <View style={mapCarScreenStyles.onDriveHeader}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Tài xế đang đến điểm đón</Text>
        </View>


        <View style={mapCarScreenStyles.onDriveVehicle}>
          <View style={{alignItems: 'center', justifyContent:'center'}}>
          <Image
          style = {{ width: 80, height: 80, marginTop: 15}}
          source={require('../../assets/png/bike-plus.png')}
        />
          </View>

        <View  style ={{flexDirection: 'row', paddingLeft: 20}}>
          <View style = {{width:60, height:60}}>
            <Image
              style = {{width:60, height:60, borderRadius: 200/2,resizeMode: "cover"}}
              source={{ uri: `http://${defaultIPV4}:3000/uploads/${driver?.imageUrl}` }}
            />
          </View>
          <View style={{paddingLeft:15}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize: 16, fontWeight:'bold'}}>{driver?.name}</Text>
            <Text style={{fontSize: 16, fontWeight:'bold'}}> - </Text>
            <Text style={{fontSize: 16, paddingRight: 5}}>4,9</Text>
          <Image
          style = {{ width: 15, height: 15}}
          source={require('../../assets/png/star.png')}
        />
          </View>
          <View 
          style={{width: 100, backgroundColor:'#343434', height: 25, justifyContent:'center',alignItems:'center', marginTop: 5}}>
            <Text style={{ height: 25, color:'white', fontSize: 16}}
            >{driver?.licensePlate}</Text>
          </View>
          </View>

        </View>
        </View>
        <View style={mapCarScreenStyles.callAndText}>
          <TouchableOpacity
          style={{paddingTop:15}}
          onPress={() => {
          const phoneNumber = `tel:${driver?.phone}`; // driver.phone là số điện thoại, ví dụ: '0987654321'
          Linking.openURL(phoneNumber).catch(err =>
          console.error("Lỗi khi mở điện thoại:", err)
    );
  }}
          >
           <View 
           style={{width:50, height:50,backgroundColor:'#E6E6E6',borderRadius: 200/2,justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../../assets/png/phone-call.png')}
            />
            </View>
            <Text>Gọi tài xế</Text>
          </TouchableOpacity>
          <TouchableOpacity
                    onPress={() => {
    onOpenChat({
      currentUserId: "222",
      currentUserName: "Hành khách",
      receiverId: "111",
      rideId: rideId,
    });
  }}

           style={{paddingTop:15}}>
            <View 
           style={{width:50, height:50,backgroundColor:'#E6E6E6',borderRadius: 200/2,justifyContent: 'center', alignItems: 'center',}}>
              <Image
              style = {{ resizeMode: 'contain'}}
              source={require('../../assets/png/texting.png')}
            />
            </View>
            <Text>Nhắn tin</Text>
          </TouchableOpacity>
          
        </View>

        <View style = {mapCarScreenStyles.infoRide}>

    <Text style={{fontSize: 18, fontWeight:"bold", marginTop:5}}>Chuyến đi</Text>
    <Text>{dateTime}</Text>

  <View style = {mapCarScreenStyles.myLocationRideContainer}>
  <View style={mapCarScreenStyles.myLocationRide}>
    <Image source={require('../../assets/png/myLocateRide.png')} style={{height: 40, width: 40}} />
    <Text style={{fontSize: 16, fontWeight:"bold"}}>{originName}</Text>
  </View>
</View>

<View style = {mapCarScreenStyles.endLocationRideContainer}>
  <View style={mapCarScreenStyles.endRideLocation}>
  <Image source={require('../../assets/png/map-pin.png')} style={{height: 40, width: 40}} />
  <Text style={{fontSize: 16, fontWeight:"bold"}}>{destinationName}</Text>
  </View>
  
</View>

</View>
<View style = {mapCarScreenStyles.distanceShowRide}>
    <Image source={require('../../assets/png/arrow-right.png')} style={{height: 45, width: 30}} />
    <Text style={{fontSize: 16}}>{distance}</Text>
  </View>
<View style= {mapCarScreenStyles.infoPayment}>
  <Text style={{fontSize: 16, fontWeight:"bold", marginLeft:5, marginTop: 5}}>Thông tin thanh toán</Text>
  <View style={mapCarScreenStyles.infoPaymentItems}>
    <Text style={{fontSize: 15, fontWeight:"bold"}}>Giá cước</Text>
    <Text>{price}</Text>
  </View>
  
  <View style={mapCarScreenStyles.infoPaymentItems} >
    <Text style={{fontSize: 15, fontWeight:"bold"}}>Ưu đãi</Text>
    <Text>0đ</Text>
  </View>
  <View style={mapCarScreenStyles.infoPaymentTotal}>
    <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
      <Image 
    style = {{width: 30, height:30, backgroundColor:"#F3F3F3", borderRadius: 200/2, marginRight: 5}}
    source={require("../../assets/png/money.png")}/>
    <Text style={{fontSize: 16, fontWeight:"bold"}}>Tiền mặt</Text>
    </View>
    
    <Text style={{fontWeight:"bold", fontSize: 16}}>{formattedCashPrice}</Text>
  </View>
  
</View>
<View style={{backgroundColor:"white", width:"100%", marginTop: 5, alignItems:"center",height:"100%"}}>
  <TouchableOpacity style={mapCarScreenStyles.cancelSearchBtn} onPress={() => onClose()}>
    <Text style={{fontSize: 16, fontWeight: 500}}>Hủy chuyến</Text>
  </TouchableOpacity>
</View>

      </ScrollView>
        
      </View>
      
      </View>
      </Modal>
  )
}

interface SearchDriverProps{
  visible: boolean;
  onClose: () => void,
  dateTime: String,
  originName: String,
  destinationName: String,
  distance: String,
  price: string,
  onRide: ()=>void
  
}
const SearchDriverModal = ({visible, onClose, originName, destinationName, distance, dateTime, price, onRide}:SearchDriverProps) => {
const [message, setMessage] = useState<string>('');
const [isOnRideModalVisible,setIsOnRideModalVisible] = useState(false)
  useEffect(() => {
    const handleMessage = (msg: string) => {
    console.log('Nhận message từ server:', msg);
    setMessage(msg);  // cập nhật message nếu cần
    onRide()
  };
  socket.on('receiveMessage', handleMessage);

  return () => {
    socket.off('receiveMessage',handleMessage);  // tắt listener khi component unmount
  };
}, []);

   // additional service fee
   const additionalService = 1000; 

   // Calculate "Tiền mặt" 
   const cashPrice = parseInt(price.replace('đ', '').replace('.', '').trim());
   
   // Format 
   const formattedCashPrice = new Intl.NumberFormat('de-DE').format(cashPrice).replace(/,/g, '.') + 'đ';

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
    <View style={mapCarScreenStyles.modalSearchOverlay}>
      <View style={mapCarScreenStyles.modalSearchContainer}>
      <ScrollView 
      contentContainerStyle={mapCarScreenStyles.scrollViewContent}
      showsVerticalScrollIndicator={false}>
<View style  ={mapCarScreenStyles.searchHeader}>
    <Text style={{fontSize: 18, fontWeight:"bold", marginBottom:5}}>Tìm tài xế, {message}</Text>
    <Text style={{fontSize: 14, fontWeight:"400"}}>Đang kết nối với tài xế xung quanh...</Text>
</View>



<View style = {mapCarScreenStyles.infoRide}>

    <Text style={{fontSize: 18, fontWeight:"bold", marginTop:5}}>Chuyến đi</Text>
    <Text>{dateTime}</Text>

  <View style = {mapCarScreenStyles.myLocationRideContainer}>
  <View style={mapCarScreenStyles.myLocationRide}>
    <Image source={require('../../assets/png/myLocateRide.png')} style={{height: 40, width: 40}} />
    <Text style={{fontSize: 16, fontWeight:"bold"}}>{originName}</Text>
  </View>
</View>

<View style = {mapCarScreenStyles.endLocationRideContainer}>
  <View style={mapCarScreenStyles.endRideLocation}>
  <Image source={require('../../assets/png/map-pin.png')} style={{height: 40, width: 40}} />
  <Text style={{fontSize: 16, fontWeight:"bold"}}>{destinationName}</Text>
  </View>
  
</View>

</View>
<View style = {mapCarScreenStyles.distanceShowRide}>
    <Image source={require('../../assets/png/arrow-right.png')} style={{height: 45, width: 30}} />
    <Text style={{fontSize: 16}}>{distance}</Text>
  </View>
<View style= {mapCarScreenStyles.infoPayment}>
  <Text style={{fontSize: 16, fontWeight:"bold", marginLeft:5, marginTop: 5}}>Thông tin thanh toán</Text>
  <View style={mapCarScreenStyles.infoPaymentItems}>
    <Text style={{fontSize: 15, fontWeight:"bold"}}>Giá cước</Text>
    <Text>{price}</Text>
  </View>
  
  <View style={mapCarScreenStyles.infoPaymentItems} >
    <Text style={{fontSize: 15, fontWeight:"bold"}}>Ưu đãi</Text>
    <Text>0đ</Text>
  </View>
  <View style={mapCarScreenStyles.infoPaymentTotal}>
    <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
      <Image 
    style = {{width: 30, height:30, backgroundColor:"#F3F3F3", borderRadius: 200/2, marginRight: 5}}
    source={require("../../assets/png/money.png")}/>
    <Text style={{fontSize: 16, fontWeight:"bold"}}>Tiền mặt</Text>
    </View>
    
    <Text style={{fontWeight:"bold", fontSize: 16}}>{formattedCashPrice}</Text>
  </View>
  
</View>
<View style={{backgroundColor:"white", width:"100%", marginTop: 5, alignItems:"center",height:"100%"}}>
  <TouchableOpacity style={mapCarScreenStyles.cancelSearchBtn} onPress={() => onClose()}>
    <Text style={{fontSize: 16, fontWeight: 500}}>Hủy chuyến</Text>
  </TouchableOpacity>
</View>
</ScrollView>
</View>
      
      </View>
    </Modal>
    
  )
}

// --------------------------------------------------------vehicle select screen--------------------------------------------------------
interface VehicleSelectionModalProps {
  visible: boolean;
  onClose: (vehicle: { name: string; price: string } | null) => void;
  onClicked: (vehicle: { name: string; price: string; isSelected: boolean } | null) => void;
  onSubmit: () => void; 
  distance: number;
}
const VehicleSelectionModal = ({ visible, onClose,onClicked, onSubmit, distance }: VehicleSelectionModalProps) => {
  const [isSearchModalVisible, setIsSearchModalVisible] = React.useState(false)


 const handleUnSearchVehicle = () => {
  setIsSearchModalVisible(false)
 }

  const [vehicleOptions, setVehicleOptions] = React.useState([
    { id: '1', name: 'Car', price: "" , isSelected: false,pricePerKm: 13200, image:require('../../assets/png/hatchback.png')},
    { id: '2', name: 'Bike', price: "", isSelected: false,pricePerKm: 6500, image:require('../../assets/png/scooter.png')},
    { id: '3', name: 'Bike Plus', price: "", isSelected: false,pricePerKm: 8000, image:require('../../assets/png/bike-plus.png')},
  ]);

  //--------------------------------------------------------Price--------------------------------------------------------
  const calculatePrice = (pricePerKm: number, distance: number) => {
    let discount = 0;
    if (distance > 20) {
      discount = 0.3; 
    }else if (distance > 10) {
      discount = 0.2; 
    }else if (distance > 6) {
      discount = 0.15; 
    }
    const price = pricePerKm * distance;
    const finalPrice = price - (price * discount); // Apply discount
    const formattedPrice = new Intl.NumberFormat('de-DE').format(Math.ceil(finalPrice / 1000) * 1000).replace(/,/g, '.') + 'đ';

    return formattedPrice;
  };

  React.useEffect(() => {
    const updatedVehicles = vehicleOptions.map((item) => ({
      ...item,
      price: calculatePrice(item.pricePerKm, distance)
    }));
    setVehicleOptions(updatedVehicles);
  }, [distance]);

  const handleVehiclePress = (vehicleId: string) => {
    // Update the vehicle selection state
    const updatedVehicles = vehicleOptions.map((item) => ({
      ...item,
      isSelected: item.id === vehicleId,
    }));
    setVehicleOptions(updatedVehicles)

    const selectedVehicle = updatedVehicles.find((item) => item.id === vehicleId);
    if (selectedVehicle) {
      onClicked({ ...selectedVehicle, isSelected: true }); 
    }
  };
 return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={mapCarScreenStyles.modalOverlay}>
        <View style={mapCarScreenStyles.modalContainer}>
          <Text style={mapCarScreenStyles.modalTitle}>Chọn phương tiện</Text>
          <FlatList
            data={vehicleOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
              style={[
                mapCarScreenStyles.vehicleOption,
                { borderWidth: item.isSelected? 3 : 1, borderColor: item.isSelected ? defaultColor : 'grey' },
              ]}
              onPress={() => handleVehiclePress(item.id)} 
            >
              <View style = {mapCarScreenStyles.optionContainer}>
                <View style={mapCarScreenStyles.imageContainer}>
                  <Image source={item.image } style={mapCarScreenStyles.vehicleImage} />
                <Text style={{fontSize: 16, fontWeight:"bold",paddingLeft:5}}>{item.name}</Text>
                </View>
                <View>
                  <Text style={{fontSize: 16, fontWeight:"bold"}}>{item.price}</Text>
                </View>
                
              </View>
                
              </TouchableOpacity>
            )}
          />
          <View style={mapCarScreenStyles.btnVehicle}>
            
          <TouchableOpacity style={mapCarScreenStyles.cancelBtn} onPress={() => onClose(null)}>
            <Text style={mapCarScreenStyles.submitBtnText}>Hủy bỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={mapCarScreenStyles.submitCBtn} 
            onPress={()=>onSubmit()}>
            <Text style={mapCarScreenStyles.submitBtnText}>Đặt xe</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      </View>
       
    </Modal>
  );
};

const CancelRide = () => {
  console.log('Gửi CANCEL');
  socket.emit('sendCancel', 'CancelRide từ App Client!');
  
};

  //--------------------------------------------------------MAP SCREEN--------------------------------------------------------------------------

const MapCarScreen =  (props: any) => {
   const {navigation} = props;
  //--------------------------------------------------------On ride--------------------------------------------------------------------------
const [isOnRideModalVisible,setIsOnRideModalVisible] = useState(false)
const handleOnRide = () => {
  setIsSearchModalVisible(false)
  setIsOnRideModalVisible(true)
  
}

      // -----------------------------------------------------------Choose vehicle-----------------------------------------------------------
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [rideId, setRideId] = useState<string | null>(null);
    const [currentRideId, setCurrentRideId] = useState<string | null>(null);

    const [isSearchModalVisible, setIsSearchModalVisible] = React.useState(false);
    const [selectedVehicle, setSelectedVehicle] = React.useState<{ name: string; price: string; isSelected: boolean} | null>(null);
    const[isChatBoxModalVisible, setIsChatBoxModalVisible] = React.useState(false);
    const [userData, setUserData] = useState({ name: '', phone: '' });
const [chatParams, setChatParams] = useState({
  currentUserId: '',
  currentUserName: '',
  receiverId: '',
  rideId: '',
});
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
const handleOpenChat = (params: typeof chatParams) => {
  setChatParams(params);
  setIsChatBoxModalVisible(true);
};
    const handleCloseChatBox = () => {
      setIsChatBoxModalVisible(false)
      setIsOnRideModalVisible(true)
    }

    const handleSelectVehicle = (vehicle: { name: string; price: string; isSelected: boolean } | null) => {
       setSelectedVehicle(vehicle);
       setIsModalVisible(true)
       
     };
     const handleUnSelectVehicle = () => {
      setIsModalVisible(false);
      setIsSearchModalVisible(false);
      
    };
    const handleCancelVehicle =() => {
      handleDeleteRide(currentRideId)
      setIsOnRideModalVisible(false)
    }
    const handleUnSearchVehicle = () =>{
      handleDeleteRide(currentRideId)
      setIsSearchModalVisible(false)
    }

    const handleCompleteRide = useCallback(() => {
  Alert.alert('Thành công', 'Chuyến đi của bạn đã kết thúc');
  setIsOnRideModalVisible(false);
  setIsModalVisible(false)
  setIsConfirmDestination(false)
      navigation.navigate('HomeScreen')

}, []);



   const handleDeleteRide = async (rideId: string | null) => {
    
     try {
    await axios.post(`http://${defaultIPV4}:3000/delete-ride/${rideId}`);
    Alert.alert('Thành công', 'Đã hủy chuyến');
    setCurrentRideId(null);
  } catch (error) {
    Alert.alert('Lỗi', 'Hủy chuyến không thành công');
    console.error(error);
  }
    }

    function handleBookCar(){
      const rideIdRan = Math.floor(100000 + Math.random() * 900000).toString(); // e.g., "783402"
      const rideData={
        name:userData.name,
        mobile:userData.phone,
        price: selectedVehicle?.price || "0",
        distance: `${distance.toFixed(1)} km`,
        clientOriginName: originName,
        clientDestinationName: destinationName,
        clientLatitude: origin.latitude ,
        clientLongitude: origin.longitude,
        clientDestinationLatitude: destination.latitude,
        clientDestinationLongitude: destination.longitude,
        rideId: rideIdRan,
    };
    axios
    .post(`http://${defaultIPV4}:3000/request-ride`,rideData)
    .then(res => {
        console.log(res.data)
        if(res.data.status == 'ok'){
            setCurrentRideId(rideIdRan)
            handleSubmit()
        }else{
            Alert.alert(JSON.stringify(res.data))
        }

    })
    .catch(e => console.log(e))
    }
     const handleSubmit = () => {
      handleDateAndTime();
      setIsSearchModalVisible(true);
    };
    //-------------------------------------------------------other info--------------------------------------------------------------------
 const [mobile, setMobile] = useState("0327831494")
 const [clientName, setClientName] = useState("Pham Minh Quan")

 


  // -----------------------------------------------------------map and location-----------------------------------------------------------
  const mapRef = useRef<MapView | null>(null);
  const [origin, setOrigin] = React.useState({
    latitude: 0,
    longitude: 0,
  });

  const [destination, setDestination] = React.useState({
    latitude: 0,
    longitude: 0,
  });
  
  const [driverLocation, setDriverLocation] = React.useState({
    latitude: 0,
    longitude: 0,
  });

  const [originName, setOriginName] = React.useState('')
  const [destinationName, setDestinationName] = React.useState('')
  const [distance, setDistance] = React.useState(0);
  
  //---------------------------------------------------------date and time ---------------------------------------------------------
  const [dateTime, setDateTime] = React.useState<string>('');
  const handleDateAndTime = () => {
    const currentDate = new Date();

    // Format date to dd/mm/yyyy
    const formattedDate = currentDate.toLocaleDateString('en-GB');  // 'en-GB' gives dd/mm/yyyy

    // Format time to hh:mm (24-hour format)
    const formattedTime = currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Set the formatted date and time to state
    setDateTime(`${formattedDate} - ${formattedTime}`);
  };
  // --------------------------------------------------------current location--------------------------------------------------------

  async function getLocationPermission(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status!== 'granted'){
      alert('Permission denied')
      return
    }
    let location = await Location.getCurrentPositionAsync({})
    const { latitude, longitude} = location.coords
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }
    setOrigin(current)
    const geocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude
     })
    
      if (geocode.length > 0) {
        const locationName = geocode[0].city || geocode[0].street || 'Unnamed Location';
        setOriginName(locationName);
      }
  }
async function currentLocation ( ) {
    mapRef.current?.animateToRegion(
      {
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },100,
    )
  
  }
  React.useEffect(()=>{
    getLocationPermission();
  }, [])
  React.useEffect(()=>{
    if (origin.latitude !== 0 && origin.longitude !== 0) {
      currentLocation();
        
  }
},[origin])
  //--------------------------------------------------------Distance--------------------------------------------------------
 
  async function calculateDistance(origin: { latitude: number; longitude: number; }, destination: { latitude: number; longitude: number; }) {
    const originString = `${origin.latitude},${origin.longitude}`;
    const destinationString = `${destination.latitude},${destination.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}
    &destination=${destinationString}&key=${GOOGLE_MAP_KEY}`;

    try {
      const response = await axios.get(url);
      const route = response.data.routes[0];
      if (route) {
        const legs = route.legs[0];
        const routeDistance = legs.distance.value / 1000; // Convert meters to kilometers
        setDistance(routeDistance);
      } else {
        Alert.alert('Error', 'No route found');
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      Alert.alert('Error', 'Unable to fetch route data');
    }
  };
  
  async function moveToLocation (latitude: number | undefined , longitude: number| undefined ) {
    mapRef.current?.animateToRegion(
      {
        latitude: latitude ?? 0, 
        longitude: longitude ?? 0,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },2000,
    )
  }

  
const distanceString = `${Math.round(distance * 10) / 10} Km`;

  

//--------------------------------------------------------Region zoom--------------------------------------------------------

const getRegion = (origin: any,destination: any) => {
  const latitudes = [origin.latitude, destination.latitude];
  const longitudes = [origin.longitude, destination.longitude];

  // Get the center point
  const latitude = (Math.max(...latitudes) + Math.min(...latitudes)) / 2;
  const longitude = (Math.max(...longitudes) + Math.min(...longitudes)) / 2;

  // Get the deltas to fit both points within the view
  const latitudeDelta = Math.abs(Math.max(...latitudes) - Math.min(...latitudes)) * 1.9;
  const longitudeDelta = Math.abs(Math.max(...longitudes) - Math.min(...longitudes)) * 1.9;


  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};
const handleUpdateRegion = () => {
  const region = getRegion(origin, destination); // Calculate the region that fits both points
  if (mapRef.current) {
    mapRef.current.animateToRegion(region, 500); // Animate to the new region over 1 second
  }
};
useEffect(() => {
  if (destination.latitude !== 0 && destination.longitude !== 0) {
    handleUpdateRegion(); // Call after the destination has been updated
  }
}, [destination, origin]);

const [isConfirmDestination,setIsConfirmDestination] = React.useState(false)


  return (
    
    <View style={mapCarScreenStyles.container}>
      
      {origin && origin.latitude !== 0 ? (
    <>
      <View style = {mapCarScreenStyles.headScreen}>
      <TouchableOpacity 
       onPress={()=>navigation.goBack()}
      > 
      <Image 
        style={mapCarScreenStyles.backBtnImg}
        source={require("../../assets/png/back-button.png")}
        />
        </TouchableOpacity>
       
        </View> 
        <View style = {mapCarScreenStyles.endLocationContainer}>
          <View style={mapCarScreenStyles.endLocation}>
          <Octicons name="location" size={24} color="black"  style={mapCarScreenStyles.icon} />
          
         <CustomPlacesAutocomplete
  onPlaceSelected={(place) => {
    const destination = {
      latitude: place.lat,
      longitude: place.lng,
    };
    const destinationNamed = place.name || 'Unnamed Location';

    setDestinationName(destinationNamed);
    setDestination(destination);
    calculateDistance(origin, destination);
    setIsConfirmDestination(true);
  }}
/>
          </View>
        </View>

      <View>
      <MapView
        ref={mapRef}
        style={mapCarScreenStyles.map}
        provider={PROVIDER_GOOGLE}  
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      >

        {/* Driver */}
        {driverLocation && driverLocation.latitude !== 0  && (
        <Marker
          draggable
          coordinate={driverLocation}
          onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
        >
          <Image
            source={require('../../assets/png/bikeMap.png')}
            style={{ width: 40, height: 40 }}
          />
        </Marker>
)}
        {/* Origin Marker */}
        <Marker
          draggable
          coordinate={origin}
          onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
        >
          <Image
          source={locationImg}
          style={{width: 40, height: 40}}
          />

          
        </Marker>

        {/* Destination Marker */}
        <Marker
          
          draggable
          coordinate={destination}
          onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
        >
          <Image
          source={destiLocationImg}
          style={{width: 45, height: 45}}
          />
        </Marker>

        {/* Directions between origin and destination */}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAP_KEY}
          
          strokeColor={defaultColor}  // Set the color of the route line
          strokeWidth={5}  // Set the width of the line for directions
          onError={(errorMessage) => {
            console.log("Error in Directions API:", errorMessage);
          }}
        />

      </MapView>
      <View style = {mapCarScreenStyles.showLocation}>
      <TouchableOpacity 
       onPress={()=>currentLocation()}
      > 
      <Image 
        style={mapCarScreenStyles.currentLocationBtnImg}
        source={require("../../assets/png/location.png")}
        />
        </TouchableOpacity>
       
        </View> 

      </View>

      
      <View>
        
        <View style = {mapCarScreenStyles.headerLocation}>
          <Text style={{fontSize: 18, fontWeight:"bold"}}>Điểm đón</Text>
        </View>


          <View style={mapCarScreenStyles.locationContainer}>
          <View style = {mapCarScreenStyles.myLocationContainer}>
          <View style={mapCarScreenStyles.myLocation}>
            <MaterialIcons name="my-location" size={24} color="black" style={mapCarScreenStyles.icon}/>
                    <Text
                        style = {mapCarScreenStyles.myLocationInput}
                    >
                      {originName} 
                    </Text>
          </View>
          
        </View>
          
        
          </View>
          <View style={mapCarScreenStyles.locationContainer}>
          <View style = {mapCarScreenStyles.myLocationContainer}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            width: '100%',
            backgroundColor: 'white', 
            borderColor:"grey",
            borderWidth: 1,
          }}>
          <Octicons name="location" size={24} color="black"  style={mapCarScreenStyles.icon} />
                    <Text
                        style = {mapCarScreenStyles.myLocationInput}
                    >
                     {destinationName ? `${destinationName}` : 'Điểm đến'}
                    </Text>
          </View>
          
        </View>
          
        
          </View>

      </View>

      


        {isConfirmDestination&& (
         <View style = {mapCarScreenStyles.submitContainer}> 
         <TouchableOpacity style = {mapCarScreenStyles.submitBtn}
        onPress={()=>setIsModalVisible(true)}
        >
          <Text style = {mapCarScreenStyles.submitText}>Xác nhận điểm đón</Text>
        </TouchableOpacity>

      </View>
        )}
        
            
            <VehicleSelectionModal
              visible={isModalVisible}
              onClose={handleUnSelectVehicle}
              onClicked={handleSelectVehicle}
              onSubmit={handleBookCar} 
              distance={distance}
            />
          {isOnRideModalVisible && (
          <OnRideModal
            visible={isOnRideModalVisible}
            onClose={()=>{
              CancelRide()
              handleCancelVehicle()

            }}
            originName={originName}
            destinationName={destinationName}
            distance={distanceString}
            dateTime={dateTime}
            price={selectedVehicle?.price || '0'}
            rideId={currentRideId || ''}
            navigation={navigation}
            openChatBoxModal={() => setIsChatBoxModalVisible(true)}
            onOpenChat={handleOpenChat}
            completeRide={handleCompleteRide}
            setDriverLocation={setDriverLocation}
          />
        )}

            <ChatBoxModal
            visible={isChatBoxModalVisible}
            onClose={handleCloseChatBox}
            currentUserId={chatParams.currentUserId}
            currentUserName={chatParams.currentUserName}
            receiverId={chatParams.receiverId}
            receiverName='Tài xế'
            rideId={chatParams.rideId}
            />

          {isSearchModalVisible && <SearchDriverModal 
          
            visible={isSearchModalVisible}
            onClose={()=>{
              CancelRide()
              handleUnSearchVehicle()
            }}
            originName={originName}
            destinationName={destinationName}
            distance={distanceString}
            dateTime={dateTime}
            onRide={handleOnRide}
            price={selectedVehicle?.price || '0'}
            
            />}
            
           
           </>
          
           
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={defaultColor} />
      <Text>Đang lấy vị trí hiện tại...</Text>
    </View>
  )}
    </View>
  );
};



export default MapCarScreen;
