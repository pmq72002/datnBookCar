import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location'
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Modal, FlatList, Alert, ScrollView, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAP_KEY } from '@env'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import defaultColor from '../../assets/btn/btnColor';
import axios from 'axios';
import deliveryScreenStyle from '../../styles/deliveryScreenStyle';
import mapCarScreenStyles from '../../styles/mapCarScreenStyle';
import loginStyles from '../../styles/loginStyle';
import CustomPlacesAutocomplete from '../TestPlacesScreen';
import { useUser } from '../../context/Client';
import defaultIPV4 from '../../assets/ipv4/ipv4Address';
import io from 'socket.io-client';
const socket = io(`http://${defaultIPV4}:3000`, {
  transports: ['websocket'],
});
//----------------------------------------------------onDelivery-----------------------------------------------------
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
  completeDelivery: ()=> void
  size?:string
  type?:string
  weight?:string
  setDriverLocation: (location: { latitude: number; longitude: number }) => void;
}

const OnRideModal = ({
  visible,onClose, originName, destinationName, distance,
   dateTime, price,rideId, navigation, completeDelivery,
   size,type,weight,setDriverLocation
  
  }:OnRideProps) => {
 
   const cashPrice = parseInt(price.replace('đ', '').replace('.', '').trim()) 
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
    completeDelivery()
    socket.off('receiveCompleteDelivery', handleMessage);
  };

  socket.on('receiveCompleteDelivery', handleMessage);

  return () => {
    socket.off('receiveCompleteDelivery', handleMessage);
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
  console.log("👂 Đăng ký lắng nghe delivery:", eventKey);
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
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Tài xế đang đến điểm lấy hàng</Text>
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

        <View style = {{marginTop:5,
      paddingLeft: 15,
      paddingRight: 15,
      width: "100%",
      height: 200,
      backgroundColor:"white",}}>

    <Text style={{fontSize: 18, fontWeight:"bold", marginTop:5}}>Đơn hàng</Text>
    <Text>{dateTime}</Text>
    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
      <View style={{backgroundColor:"#E0DDDD",justifyContent:"center",alignItems:'center',height: 30}}>
        <Text style={{fontSize: 15,paddingLeft:15,paddingRight:15}}>Epress</Text>
      </View>
      <View style={{backgroundColor:"#E0DDDD",justifyContent:"center",alignItems:'center'}}>
        <Text style={{fontSize: 15,paddingLeft:15,paddingRight:15}}>{distance}</Text>
      </View>
      <View style={{backgroundColor:"#E0DDDD",justifyContent:"center",alignItems:'center'}}>
        <Text style={{fontSize: 15,paddingLeft:15,paddingRight:15}}>{size}, {weight}kg, {type}</Text>
      </View>
      
      
      

    </View>

  <View style = {{
    alignItems: 'flex-start',
      marginTop: 20, 
      marginLeft:5,
      marginRight: 5,
      height: 40,
  }}>
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

<View style= {{marginTop:4,
      paddingLeft: 15,
      paddingRight: 15,
      width: "100%",
      height: 190,
      backgroundColor:"white",}}>
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
//-----------------------------------------------------searchDriver--------------------------------------------------
interface SearchDriverProps{
  visible: boolean;
  onClose: () => void,
  dateTime: String,
  originName: String,
  destinationName: String,
  distance: String,
  price: string,
  onRide: ()=>void
  weight: string
  type: string
  size: string
}
const SearchDriverModal = ({visible, onClose, originName, 
  destinationName, distance, dateTime, price, onRide,
weight,size, type
}:SearchDriverProps) => {
const [message, setMessage] = useState<string>('');
const [isOnRideModalVisible,setIsOnRideModalVisible] = useState(false)
  useEffect(() => {
    const handleMessage = (msg: string) => {
    console.log('Nhận message từ server:', msg);
    setMessage(msg);  // cập nhật message nếu cần
    onRide()
  };
  socket.on('receiveDelivery', handleMessage);

  return () => {
    socket.off('receiveDelivery',handleMessage);  // tắt listener khi component unmount
  };
}, []);

   // additional service fee
  

   // Calculate "Tiền mặt" 
   const cashPrice = parseInt(price.replace('đ', '').replace('.', '').trim()) 
   
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

    <Text style={{fontSize: 18, fontWeight:"bold", marginTop:5}}>Chi tiết giao hàng</Text>
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
    <Text style={{fontSize: 16, fontWeight: 500}}>Hủy đơn hàng</Text>
  </TouchableOpacity>
</View>
</ScrollView>
</View>
      
      </View>
    </Modal>
    
  )
}
//----------------------------------------------------- delivery-----------------------------------------------------
interface DeliveryProps {
visible: boolean;
onClose: () => void
originName: String,
  destinationName: String,
  distance: number,
  onSend: () => void,
  onReceive: ()=>void;
  size: string;   
  type: string;
  weight: string;
  detailsGoodsText: String;
  receiverText: String
 onContinue: ()=> void
 onFinalContinue:(price: string) => void,
 receiveName: string,
receivePhone: string,
setPrice:(price:string)=>void
}
const DeliveryModal = ({
   visible, onClose, originName, destinationName, distance, onSend,onReceive,
    size, type,weight, detailsGoodsText,receiverText, onContinue, onFinalContinue, receiveName, receivePhone,
    setPrice
  
  }: DeliveryProps) => {
  const [isDetailsDeliveryModalVisible, setIsDetailsDeliveryModalVisible] = React.useState(false)
//------------------------------------------------------price--------------------------------------------------------

const calculatePrice = ( distance: number) => {
    let discount = 0;
    if (distance > 20) {
      discount = 0.3; 
    }else if (distance > 10) {
      discount = 0.2; 
    }else if (distance > 6) {
      discount = 0.15; 
    }
    const price = 5000 * distance;
    const finalPrice = price - (price * discount); // Apply discount
    const formattedPrice = new Intl.NumberFormat('de-DE').format(Math.ceil(finalPrice / 1000) * 1000).replace(/,/g, '.') + 'đ';

    return formattedPrice;
  };
  
const addCalculatePrice = (distance: number, additional: number) => {
  let discount = 0;
    if (distance > 20) {
      discount = 0.3; 
    }else if (distance > 10) {
      discount = 0.2; 
    }else if (distance > 6) {
      discount = 0.15; 
    }
    const price = 5000 * distance;
    const finalPrice = price - (price * discount) + additional; // Apply discount
    const formattedPrice = new Intl.NumberFormat('de-DE').format(Math.ceil(finalPrice / 1000) * 1000).replace(/,/g, '.') + 'đ';

    return formattedPrice;
};
const [priceText, setPriceText] = useState(calculatePrice(distance))


const [detailGoodsText, setDetailsGoodText] = useState<string>('');
const [receiveText, setReceiveText] = useState<string>('');
const [isOption1Clicked, setIsOption1Clicked] = useState(false);
const [isOption2Clicked, setIsOption2Clicked] = useState(false);

useEffect(() => {
  const calculated = calculatePrice(distance);
  setPriceText(calculated);
}, [distance]);


useEffect(() => {
  setDetailsGoodText(detailGoodsText);
}, [detailsGoodsText]);

useEffect(() => {
  setReceiveText(receiveText);
}, [receiverText]);

const handleOpTionClicked = (option: '1' | '2') => {
  if (option === '1') {
    setIsOption1Clicked(prev => !prev);
  } else {
    setIsOption2Clicked(prev => !prev);
  }
};

const updateTotalPrice = (opt1: boolean, opt2: boolean) => {
  let extra = 0;
  if (opt1) extra += 8000;
  if (opt2) extra += 12000;

  const newPrice = addCalculatePrice(distance, extra);
  setPriceText(newPrice);
  setPrice(newPrice)
};
useEffect(() => {
  updateTotalPrice(isOption1Clicked, isOption2Clicked);
}, [isOption1Clicked, isOption2Clicked]);

const handleInternalContinue = () => {
   let extra = 0;
  if (isOption1Clicked) extra += 8000;
  if (isOption2Clicked) extra += 12000;

  const finalPrice = addCalculatePrice(distance, extra);
  onFinalContinue(finalPrice); // Gửi giá về screen chính
};

const { userData } = useUser();



    return(
        <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={deliveryScreenStyle.modalOverlay}>
        <View style={deliveryScreenStyle.modalContainer}>

        <View style={deliveryScreenStyle.headScreenDetails}>
        <Text style={{fontSize: 20, fontWeight:"bold"}}>Giao Hàng</Text>
        

        <View style = {deliveryScreenStyle.btnBackIndex}>
      <TouchableOpacity 
       onPress={()=>onClose()}
      > 
      <Image 
        style={deliveryScreenStyle.backBtnImg}
        source={require("../../assets/png/back-button.png")}
        />
        </TouchableOpacity>
       
        </View> 
            
        </View>
        <View style={deliveryScreenStyle.locationContainerDetails}>
<View style = {deliveryScreenStyle.myLocationRideDContainer}>
  <View style={deliveryScreenStyle.myLocationRideD}>
    <Image source={require('../../assets/png/myLocateRide.png')} style={{height: 50, width: 50}} />
    <Text style={{fontSize: 17, fontWeight:"bold"}}>{originName}</Text>
  </View>
  <TouchableOpacity 
  onPress={onSend}
  style={{marginLeft: 50}}
  >
    <Text style={{color: "#9D9D9D", fontSize: 15, fontWeight:"500"}}>
      {userData?.name}   {userData?.phone}
      
      </Text>
  </TouchableOpacity>
</View>

<View style = {deliveryScreenStyle.endLocationRideDContainer}>
  <View style={deliveryScreenStyle.endRideDLocation}>
  <Image source={require('../../assets/png/map-pin.png')} style={{height: 50, width: 50}} />
  <Text style={{fontSize: 17, fontWeight:"bold"}}>{destinationName}</Text>
  </View>
  <TouchableOpacity 
  onPress={onReceive}
  style={{marginLeft: 50}}
  >
    <Text style={{color: defaultColor, fontSize: 16, fontWeight: "bold"}}>
      {receiverText}
    </Text>
  </TouchableOpacity>
  
</View>
</View>
    

<View>
    <TouchableOpacity 
    style={deliveryScreenStyle.detailGoods}
    onPress={onContinue}>
        
    <Image source={require('../../assets/png/box.png')} style={{height: 25, width: 25}} />
    <Text style={{fontSize:17, color:defaultColor, marginLeft: 15}}>{detailsGoodsText}</Text>
    <View style={{ flex: 1 }} />
        <Image source={require('../../assets/png/next.png')} style={{height: 25, width: 25, marginRight: 10}} />
    </TouchableOpacity>
    

</View>

<View style={deliveryScreenStyle.extendedService}>
    <Text style={{fontSize:17, fontWeight:'bold'}}>Dịch vụ mở rộng</Text>
    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={{fontSize:17}}>Giao hàng tận tay</Text>
        <TouchableOpacity onPress={()=>handleOpTionClicked('1')}>
            <Image source={
                isOption1Clicked
                ?require('../../assets/png/cancel.png')
                :require('../../assets/png/plus.png')
            } 
                style={{height: 20, width: 20, marginRight: 10}} />
        </TouchableOpacity>
        
    </View>
    
    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={{fontSize:17}}>Hàng cồng kềnh</Text>
        <TouchableOpacity onPress={()=>handleOpTionClicked('2')}>
            <Image 
            source={
                isOption2Clicked
                ?require('../../assets/png/cancel.png')
                :require('../../assets/png/plus.png')
            } 
            style={{height: 20, width: 20, marginRight: 10}} />
        </TouchableOpacity>
        
    </View>
    
</View>

<View>
    <View style={deliveryScreenStyle.priceContainer}>
        <View style={deliveryScreenStyle.priceDeliveryContainer}>
            <View style={{paddingLeft: 15}}>
                 <Image source={require('../../assets/png/express-delivery.png')} style={{height: 50, width: 50}} />
            </View>
            
            <View style={deliveryScreenStyle.priceDelivery} >
                    <Text style={{fontSize: 16, fontWeight:'bold'}}>Express</Text>
                    <Text style={{fontSize: 13, color: '#9B9B9B'}}>Giao trong 30 phút/5km</Text>
                    </View>
            <View style={{flex:1}}></View>
                <Text style={{fontSize: 16, fontWeight: 'bold', paddingRight: 15}}>{priceText}</Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop: 10, height: 30}}>
            <View style={{paddingLeft: 15,width: '10%'}}>
                <Image source={require('../../assets/png/money.png')} style={{height: 25, width: 25}} />
            </View>
            <View style={{borderColor:'grey', borderEndWidth: 1, width: '45%'}}>
                <Text style={{fontSize: 14, color:'#141414'}}>Người gửi trả tiền</Text>
            </View>
            
            <View style={{flex: 1}}></View>
            <View style={{marginRight: 5,width:'45%', flexDirection:'row', alignItems:'center', paddingLeft: 8}}>
                <Image source={require('../../assets/png/tag.png')} style={{height: 15, width: 15}} />
                <Text style={{fontSize: 14, color:'#141414', paddingLeft: 8}}>Ưu đãi</Text>
        </View>
            </View>
            
        
    </View>
    
</View>
          <View style={deliveryScreenStyle.btnContinue}>
          <TouchableOpacity style={[deliveryScreenStyle.submitBtn,
            { backgroundColor:  receiveText === 'Thêm thông tin người nhận'||detailsGoodsText==='Thông tin chi tiết hàng hóa' ? '#D6D6D6' : defaultColor }
          ]} 
          onPress={handleInternalContinue}
          disabled={receiveText === 'Thêm thông tin người nhận'||detailsGoodsText==='Thông tin chi tiết hàng hóa'}
            >
            <Text style={mapCarScreenStyles.submitBtnText}
            
            >Đặt hàng</Text>
          </TouchableOpacity>
          </View>
          
          
        </View>
        </View>
     
    </Modal>
    )

 }
//-----------------------------------------------------details delivery-----------------------------------------------------
interface DetailsDeliveryProps {
visible: boolean;
onClose: () => void
onSave: (data: { size: string; type: string; weight: string }) => void;

}
const DetailsDeliveryModal = ({ visible, onClose, onSave }: DetailsDeliveryProps) => {
    const [imageSource, setImageSource] = useState(require('../../assets/png/smallPack.png'));
      const [selectedSize, setSelectedSize] = useState('Nhỏ');
      const [selectedType, setSelectedType] = useState('Tài liệu');
      const [weight, setWeight] = useState('');
    const [showError, setShowError] = useState(false);

  const handlePressSize = (size: string, image: any) => {
    setSelectedSize(size);
    setImageSource(image);
  };
 const handlePressType = (type: string) => {
    setSelectedType(type)
  };
  const handleSave = ()=> {
    const data = {
        size: selectedSize,
        type: selectedType,
        weight: weight
    }
   onSave(data)

  }
 
return(
    <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={deliveryScreenStyle.modalOverlay}>
        <View style={deliveryScreenStyle.modalContainer}>

        <View style={deliveryScreenStyle.headScreenDetails}>
        <Text style={{fontSize: 20, fontWeight:"bold"}}>Chi tiết hàng hóa</Text>
        

        <View style = {deliveryScreenStyle.btnBackIndex}>
      <TouchableOpacity 
       onPress={()=>onClose()}
      > 
      <Image 
        style={deliveryScreenStyle.closeBtnImg}
        source={require("../../assets/png/close.png")}
        />
        </TouchableOpacity>
       
        </View> 
            
        </View>
        <View style={{backgroundColor:"white", width: '100%', marginTop: 1, height: 60}}>
            <Text style={{fontSize: 13, color:'#7A7A7A', paddingLeft: 20, paddingRight: 30, paddingTop: 15}}>
                Thông tin này giúp tài xế chuẩn bị và xử lý tốt hơn cho đơn hàng của bạn</Text>
        </View>
        

        <View style={{backgroundColor:'white', height: 130, marginTop: 8}}>
            <Text style={{fontSize:20, fontWeight: 'bold', paddingLeft: 15, paddingTop: 10, paddingBottom: 10}}>Tổng khối lượng</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
            <TextInput
            style={{fontSize:18, marginLeft:15, width: '80%', backgroundColor:'#F3F3F3', borderRadius: 5, paddingLeft: 15}}
            placeholder='Nhập số kg'
            value={weight}
      onChangeText={(text) => {
        setWeight(text);

      }}
            >
            </TextInput>
            <Text style={{fontSize: 18, paddingLeft: 10}}>kg</Text>
            </View>           
            {weight === '' && (
        <Text style={{color: 'red', paddingLeft:20,paddingTop: 10, fontSize: 12}}>Vui lòng nhập khối lượng</Text>
      )}
        </View>

        <View style={{backgroundColor:'white', marginTop: 8, height: 265}}>
            <Text style={{fontSize:18, fontWeight:'bold', paddingLeft:15, paddingTop: 10}}>Kích thước</Text>

            <View style={{justifyContent:'center',alignItems:'center'}}>
                <Image 
                style={{height: 180, width: 180, resizeMode:'center'}}
                source={imageSource}/>
            </View>
            <View style={{flexDirection:'row', paddingTop: 10}}>
                <TouchableOpacity 
                onPress={()=>handlePressSize('Nhỏ',require('../../assets/png/smallPack.png'))}
                style={[
                    deliveryScreenStyle.sizeBtn,
                    selectedSize === 'Nhỏ' && {backgroundColor:'#343434'},
                    ]}>
                    <Text style={selectedSize === 'Nhỏ' && { color: 'white' }}>Nhỏ</Text>
                </TouchableOpacity >
                <TouchableOpacity 
                onPress={()=>handlePressSize('Vừa',require('../../assets/png/mediumPack.png'))}
                style={[
                    deliveryScreenStyle.sizeBtn,
                    selectedSize === 'Vừa' && {backgroundColor:'#343434'},
                    ]}>
                    <Text style={selectedSize === 'Vừa' && { color: 'white' }}>Vừa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>handlePressSize('Lớn',require('../../assets/png/lagrePack.png'))}
                style={[
                    deliveryScreenStyle.sizeBtn,
                    selectedSize === 'Lớn' && {backgroundColor:'#343434'},
                    ]}>
                    <Text style={selectedSize === 'Lớn' && { color: 'white' }}>Lớn</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>handlePressSize('Siêu lớn',require('../../assets/png/superLagrePack.png'))}
                style={[
                    deliveryScreenStyle.sizeBtn,
                    selectedSize === 'Siêu lớn' && {backgroundColor:'#343434'},
                    ]}>
                    <Text style={selectedSize === 'Siêu lớn' && { color: 'white' }}>Siêu lớn</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={{backgroundColor:'white', marginTop: 8, height: 150}}>
        <Text style={{fontSize:18, fontWeight:'bold', paddingLeft:15, paddingTop: 10}}>Loại hàng hóa</Text>

        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingTop: 15, paddingRight: 20, paddingLeft: 15}}>
         <TouchableOpacity 
                onPress={()=>handlePressType('Tài liệu')}
                style={[
                    deliveryScreenStyle.sizeTypeBtn,
                    selectedType === 'Tài liệu' && {backgroundColor:'#343434'},
                    ]}>
                    <Image source={require('../../assets/png/file.png')} 
                    style={[
                    { height: 20, width: 20 , marginRight: 6},
                    selectedType === 'Tài liệu' && { tintColor: 'white' }
                    ]}
                    />
                    <Text style={selectedType === 'Tài liệu' && { color: 'white' }}>Tài liệu</Text>
                </TouchableOpacity >
                <TouchableOpacity 
                onPress={()=>handlePressType('Đồ điện tử')}
                style={[
                    deliveryScreenStyle.sizeTypeBtn,
                    selectedType === 'Đồ điện tử' && {backgroundColor:'#343434'},
                    ]}>
                    <Image source={require('../../assets/png/computer.png')} 
                    style={[
                    { height: 20, width: 20, marginRight: 6 },
                    selectedType === 'Đồ điện tử' && { tintColor: 'white' }
                    ]}
                    />
                    <Text style={selectedType === 'Đồ điện tử' && { color: 'white' }}>Đồ điện tử</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>handlePressType('Đồ ăn')}
                style={[
                    deliveryScreenStyle.sizeTypeBtn,
                    selectedType === 'Đồ ăn' && {backgroundColor:'#343434'},
                    ]}>
                    <Image source={require('../../assets/png/food.png')} 
                    style={[
                    { height: 20, width: 20, marginRight: 6 },
                    selectedType === 'Đồ ăn' && { tintColor: 'white' }
                    ]}
                    />
                    <Text style={selectedType === 'Đồ ăn' && { color: 'white' }}>Đồ ăn</Text>
                </TouchableOpacity>

        </View>
    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingTop: 10 , paddingRight: 20, paddingLeft: 15}}>
         <TouchableOpacity 
                onPress={()=>handlePressType('Quần áo')}
                style={[
                    deliveryScreenStyle.sizeTypeBtn,
                    selectedType === 'Quần áo' && {backgroundColor:'#343434'},
                    ]}>
                    <Image source={require('../../assets/png/clothes.png')} 
                    style={[
                    { height: 20, width: 20 , marginRight: 6},
                    selectedType === 'Quần áo' && { tintColor: 'white' }
                    ]}
                    />
                    <Text style={selectedType === 'Quần áo' && { color: 'white' }}>Quần áo</Text>
                </TouchableOpacity >
                <TouchableOpacity 
                onPress={()=>handlePressType('Hàng dễ vỡ')}
                style={[
                    deliveryScreenStyle.sizeTypeBtn,
                    selectedType === 'Hàng dễ vỡ' && {backgroundColor:'#343434'},
                    ]}>
                        <Image source={require('../../assets/png/bottle.png')} 
                    style={[
                    { height: 20, width: 20 , marginRight: 6},
                    selectedType === 'Hàng dễ vỡ' && { tintColor: 'white' }
                    ]}
                    />
                    <Text style={selectedType === 'Hàng dễ vỡ' && { color: 'white' }}>Hàng dễ vỡ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>handlePressType('Khác')}
                style={[
                    deliveryScreenStyle.sizeTypeBtn,
                    selectedType === 'Khác' && {backgroundColor:'#343434'},
                    ]}>
                        <Image source={require('../../assets/png/supplies.png')} 
                    style={[
                    { height: 20, width: 20 , marginRight: 6},
                    selectedType === 'Khác' && { tintColor: 'white' }
                    ]}
                    />
                    <Text style={selectedType === 'Khác' && { color: 'white' }}>Khác</Text>
                </TouchableOpacity>

        </View>
        </View>

        <View style={deliveryScreenStyle.saveAndContinueContainer}>
            <TouchableOpacity 
            onPress={handleSave}
            disabled={weight === ''}
            style={[
    deliveryScreenStyle.saveAndContinueBtn,
    { backgroundColor: weight === '' ? '#E5E5E5' : defaultColor }
    
  ]}
            >
                <Text style={{fontSize: 21, fontWeight: 'bold', color: weight===''?'#B0B0B0':'white'}}>Lưu và tiếp tục</Text>
            </TouchableOpacity>
        </View>

        </View>
        </View>
     
    </Modal>
)
}
//----------------------------------------------------------recipe info----------------------------------------------------------
interface RecipeInfoSendProps {
visible: boolean;
onClose: () => void,
destinationName: String,
onSaveSend:() => void,


  
}
const RecipeInfoSendModal = ({ visible, onClose, destinationName, onSaveSend}: RecipeInfoSendProps) => {
    const [name, setName] = useState("")
    const [nameVerify, setNameVerify] = useState(false)
    const [phone, setMobile] = useState("")
    const [mobileVerify, setMobileVerify] = useState(false)

    function handleName(e: any){
    const nameVar = e.nativeEvent.text
    setName(nameVar)
    setNameVerify(false)



    if(nameVar.length>1&&nameVar.length<50){
        setNameVerify(true)
    }
    
}
function handelMobile(e:any){
    const mobileVar = e.nativeEvent.text
    setMobile(mobileVar)
    setMobileVerify(false)
    if(/^0[0-9]{9}$/.test(mobileVar)){
        setMobile(mobileVar)
        setMobileVerify(true)
    }
}

const { userData } = useUser();
useEffect(() => {
  if (userData?.phone) {
    setMobile(userData.phone); // Gán vào state khi userData thay đổi
  }
}, [userData]);
return(
        <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={deliveryScreenStyle.modalOverlay}>
        <View style={deliveryScreenStyle.modalRecipeContainer}>

        <View style={deliveryScreenStyle.headScreenDetails}>
        <Text style={{fontSize: 20, fontWeight:"bold"}}>Thông tin người gửi</Text>
        <View style = {deliveryScreenStyle.btnBackIndex}>
      <TouchableOpacity 
       onPress={()=>onClose()}
      > 
      <Image 
        style={deliveryScreenStyle.closeBtnImg}
        source={require("../../assets/png/close.png")}
        />
        </TouchableOpacity>
        </View>   
        </View>


        <View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Địa chỉ</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
            <Image source={require('../../assets/png/map-pin.png')} style={{height: 50, width: 50}} />
            <Text style={{fontSize: 17, fontWeight:"bold"}}>{destinationName}</Text>
            </View>
            </View>
            </View>

<View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Tên người gửi</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
            <TextInput  style = {deliveryScreenStyle.textInput}
                    onChange={e=>handleName(e)}
                    >
                      {userData?.name}
                    </TextInput>
            
                </View>
            </View>
            {(name.length === 0 || !nameVerify) && (
            <Text style={{ marginLeft: 20, color: "red" }}>
            
            </Text>
                    )}
            </View>

<View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Số điện thoại</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
            <TextInput placeholder="Nhập số điện thoại" style = {deliveryScreenStyle.textInput}
                    onChange={e=>handelMobile(e)}
                    maxLength={10}
                    keyboardType="phone-pad"
                    value={phone}
                    ></TextInput>

                </View>
            </View>
            {(phone.length === 0 || !mobileVerify) && (
            <Text style={{ marginLeft: 20, color: "red" }}>
            
            </Text>
                    )}
            </View>

<View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Ghi chú cho tài xế</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
           <TextInput placeholder="Thêm ghi chú, ví dụ: cổng sau, lầu 4." style = {deliveryScreenStyle.textInput}
                    
            />

            </View>
            </View>
            <View style={deliveryScreenStyle.saveAndContinueContainer}>
            <TouchableOpacity 
            onPress={()=>onSaveSend()}
            style={deliveryScreenStyle.saveAndContinueBtn}
            >
                <Text style={{fontSize: 21, fontWeight: 'bold'}}>Lưu và tiếp tục</Text>
            </TouchableOpacity>
        </View>
            </View>
            </View>
        </View>
    </Modal>
    )

 }

interface RecipeInfoProps {
visible: boolean;
onClose: () => void
destinationName: String,
onSaveReceive: (data: { name: string; phone: string }) => void;
  
}
const RecipeInfoModal = ({ visible, onClose, destinationName, onSaveReceive}: RecipeInfoProps) => {
    const [name, setName] = useState("")
    const [nameVerify, setNameVerify] = useState(false)
    // const [phone, setMobile] = useState("")
    const [phone, setPhone] = useState('');
    const [mobileVerify, setMobileVerify] = useState(false)
  const [showError, setShowError] = useState(false);

    function handleName(e: any){
    const nameVar = e.nativeEvent.text
    setName(nameVar)
    setNameVerify(false)
    if(nameVar.length>1&&nameVar.length<50){
        setNameVerify(true)
    }
    
}
function handelMobile(e:any){
    const mobileVar = e.nativeEvent.text
    setPhone(mobileVar)
    setMobileVerify(false)
    if(/^0[0-9]{9}$/.test(mobileVar)){
        setPhone(mobileVar)
        setMobileVerify(true)
    }
}

const handleSaveReceive = () => {
  const data = {
    name,
    phone,
  };

  onSaveReceive(data);
};

return(
        <Modal visible={visible} animationType="fade" transparent={true}>
        <View style={deliveryScreenStyle.modalOverlay}>
        <View style={deliveryScreenStyle.modalRecipeContainer}>

        <View style={deliveryScreenStyle.headScreenDetails}>
        <Text style={{fontSize: 20, fontWeight:"bold"}}>Thông tin người nhận</Text>
        <View style = {deliveryScreenStyle.btnBackIndex}>
      <TouchableOpacity 
       onPress={()=>onClose()}
      > 
      <Image 
        style={deliveryScreenStyle.closeBtnImg}
        source={require("../../assets/png/close.png")}
        />
        </TouchableOpacity>
        </View>   
        </View>


        <View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Địa chỉ</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
            <Image source={require('../../assets/png/map-pin.png')} style={{height: 50, width: 50}} />
            <Text style={{fontSize: 17, fontWeight:"bold"}}>{destinationName}</Text>
            </View>
            </View>
            </View>

<View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Tên người nhận</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
            <TextInput placeholder="Thêm tên người nhận" style = {deliveryScreenStyle.textInput}
                    onChange={e=>handleName(e)}
                    />

                </View>
            </View>
            {(name.length === 0 || !nameVerify) && (
            <Text style={{ marginLeft: 20, color: "red" }}>
            Chỉ được nhập từ 2 đến 50 kí tự
            </Text>
                    )}
            </View>

<View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Số điện thoại</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
            <TextInput placeholder="Nhập số điện thoại" style = {deliveryScreenStyle.textInput}
                    onChange={e=>handelMobile(e)}
                    maxLength={10}
                    keyboardType="phone-pad"
                    value={phone}
                    />

                </View>
            </View>
            {(phone.length === 0 || !mobileVerify) && (
            <Text style={{ marginLeft: 20, color: "red" }}>
            Số điện thoại không khả dụng
            </Text>
                    )}
            </View>

<View style={deliveryScreenStyle.locationRecipeContainerDetails}>
            <Text style={{fontSize: 16, paddingLeft: 15}}>Ghi chú cho tài xế</Text>
            <View style = {deliveryScreenStyle.myLocationRideRecipeContainer}>
             <View style={deliveryScreenStyle.myRecipeLocationRide}>
           <TextInput placeholder="Thêm ghi chú, ví dụ: cổng sau, lầu 3." style = {deliveryScreenStyle.textInput}
                    
            />

            </View>
            </View>
            <View style={deliveryScreenStyle.saveAndContinueContainer}>
            <TouchableOpacity 
            onPress={handleSaveReceive}
            
            style={deliveryScreenStyle.saveAndContinueBtn}
            
            >
              
                <Text style={{fontSize: 21, fontWeight: 'bold'}}>Lưu và tiếp tục</Text>
            </TouchableOpacity>
        </View>
            </View>
            </View>
        </View>
    </Modal>
    )

 }

const CancelRide = () => {
  console.log('Gửi CANCEL');
  socket.emit('sendCancel', 'CancelRide từ App Client!');
  
};

//----------------------------------------------------------screen----------------------------------------------------------
const DeliveryScreen = (props: any) => {
const {navigation} = props;
 
const [price, setPrice] = useState('');
const [weight, setWeight] = useState('');
const [type, setType] = useState('');
const [size, setSize] = useState('');

const [isOnRideModalVisible,setIsOnRideModalVisible] = useState(false)
const handleOnRide = () => {
  setIsSearchModalVisible(false)
  setIsOnRideModalVisible(true)
  handleSaveDetails
  //Alert.alert('Nhận chuyến', 'Chuyến đi của bạn đã có tài xế')
}

const handleBack =() =>{
    setIsModalVisible(false)
}

const handleDetailsBack =() =>{
    setIsDetailsDeliveryModalVisible(false)
    setIsModalVisible(true)
}
const handleContinue = () => {
    setIsModalVisible(false)
    setIsDetailsDeliveryModalVisible(true)
}

const [priceFromModal, setPriceFromModal] = useState('');
const handleContinuePress = (price: string) => {
   console.log('Giá:', price);
  setPrice(price); 
  //setPriceFromModal(price);
  handleBookDelivery(price)
};

const handleInfoRecipe = (info: {size: string;type: string; weight: string}) => {
    setDeliveryDetails(info);
    setIsRecipeInfoModalVisible(true)
    setIsModalVisible(false)
}
const handleInfoSendRecipe = () => {
    setIsRecipeInfoSendModalVisible(true)
    setIsModalVisible(false)
}
const handleRecipeInfoBack =() =>{
    setIsRecipeInfoModalVisible(false)
    setIsRecipeInfoSendModalVisible(false)
    setIsModalVisible(true)
}
const handleRecipeInfoSendBack =() =>{
    setIsRecipeInfoModalVisible(false)
    setIsRecipeInfoSendModalVisible(false)
    setIsModalVisible(true)
}
const handleSaveDetails = (data: { size: string; type: string ;weight: string}) => {
  setDeliveryDetails(data);
  setIsModalVisible(true);
  setWeight(data.weight)
  setType(data.type)
  setSize(data.size)
  setIsDetailsDeliveryModalVisible(false)
    const textValue = data.size === '' && data.type === '' &&data.weight === ''? 'Thông tin chi tiết hàng hóa' : `${data.weight}kg - ${data.size} - ${data.type}`;
  setDetailsGoodText(textValue);

};
const handleCancelVehicle =() => {
      handleDeleteRide(currentRideId)
      setIsOnRideModalVisible(false)
    }
 const handleUnSearchDriver = () =>{
      handleDeleteRide(currentRideId)
      setIsSearchModalVisible(false)
    }

    const handleCompleteDelivery = useCallback(() => {
      Alert.alert('Thành công', 'Chuyến đi của bạn đã kết thúc');
      setIsOnRideModalVisible(false);
      setIsModalVisible(false)
      setIsConfirmDestination(false)
          navigation.navigate('HomeScreen')
    
    }, []);

const handleDeleteRide = async (rideId: string | null) => {
    
     try {
    await axios.post(`http://${defaultIPV4}:3000/delete-ride-delivery/${rideId}`);
    Alert.alert('Thành công', 'Đã hủy chuyến');
    setCurrentRideId(null);
  } catch (error) {
    Alert.alert('Lỗi', 'Hủy chuyến không thành công');
    console.error(error);
  }
    }
const handleSaveSend = () => {
  setIsRecipeInfoModalVisible(false)
setIsModalVisible(true)
}
const handleSaveReceive = (data:{name:string,phone:string}) => {
  setReceiveInfo(data)
  setIsRecipeInfoSendModalVisible(false)
  setIsModalVisible(true)
  const textValue = data.name ===''&&data.phone===''? 'Thêm thông tin người nhận':`${data.name}   ${data.phone}`
  setReceiveText(textValue)
}
const [currentRideId, setCurrentRideId] = useState<string | null>(null);
const [dateTime, setDateTime] = React.useState<string>('');



 const locationImg = require('../../assets/png/pin.png')
const destiLocationImg = require('../../assets/png/map-pin.png')
 const handleDateAndTime = () => {
    const currentDate = new Date();

    // Format date to dd/mm/yyyy
    const formattedDate = currentDate.toLocaleDateString('en-GB');  // 'en-GB' gives dd/mm/yyyy

    // Format time to hh:mm (24-hour format)
    const formattedTime = currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Set the formatted date and time to state
    setDateTime(`${formattedDate} - ${formattedTime}`);
  };
const { userData } = useUser();

function handleBookDelivery(price: string){
      const rideIdRan = Math.floor(100000 + Math.random() * 900000).toString(); 
      const rideData={
        senderName: userData?.name,
        receiverName: receiveInfo.name,
        senderMobile: userData?.phone,
        receiverMobile:receiveInfo.phone,
        price: price,
        distance: `${distance.toFixed(1)} km`,
        clientOriginName: originName,
        clientDestinationName: destinationName,
        weight:  weight,
        type: type,
        size:size,
        senderLatitude:origin.latitude,
        senderLongitude: origin.longitude,
        receiverLatitude: destination.latitude,
        receiverLongitude: destination.longitude,
        rideId: rideIdRan
    };
    axios
    .post(`http://${defaultIPV4}:3000/request-delivery`,rideData)
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

const [isModalVisible, setIsModalVisible] = React.useState(false);
 const [isDetailsDeliveryModalVisible, setIsDetailsDeliveryModalVisible] = React.useState(false)
const [deliveryDetails, setDeliveryDetails] = useState({ size: '', type: '' , weight: ''});
const [detailsGoodsText, setDetailsGoodText] = useState('Thông tin chi tiết hàng hóa')
const [isRecipeInfoModalVisible, setIsRecipeInfoModalVisible] = React.useState(false)
const [isRecipeInfoSendModalVisible, setIsRecipeInfoSendModalVisible] = React.useState(false)
const [receiveInfo, setReceiveInfo] = useState({ name: '', phone: ''});
const [receiveText, setReceiveText] = useState('Thêm thông tin người nhận')
    const [isSearchModalVisible, setIsSearchModalVisible] = React.useState(false);



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
  
  useEffect(() => {
    if (destination.latitude !== 0 && destination.longitude !== 0) {
      handleUpdateRegion(); // Call after the destination has been updated
    }
  }, [destination, origin]);

 const distanceString = `${Math.round(distance * 10) / 10} Km`;
const [isConfirmDestination,setIsConfirmDestination] = React.useState(false)

return (
  
    <View style={deliveryScreenStyle.container}>
   {/* Always show the map */}
  {origin && origin.latitude !== 0 ? (
    <>
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

        <Marker draggable coordinate={origin} onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}>
          <Image source={locationImg} style={{ width: 40, height: 40 }} />
        </Marker>

        <Marker draggable coordinate={destination} onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}>
          <Image source={destiLocationImg} style={{ width: 45, height: 45 }} />
        </Marker>

        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAP_KEY}
          strokeColor={defaultColor}
          strokeWidth={5}
          onError={(errorMessage) => {
            console.log("Error in Directions API:", errorMessage);
          }}
        />
      </MapView>

      {/* Nút định vị luôn hiển thị trên map */}
      <View style={{position: "absolute",
        right: 20,
        bottom: 430,
      
        borderRadius: 200/2}}>
        <TouchableOpacity onPress={currentLocation}>
          <Image
            style={mapCarScreenStyles.currentLocationBtnImg}
            source={require("../../assets/png/location.png")}
          />
        </TouchableOpacity>
      </View>
    </>
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={defaultColor} />
      <Text>Đang lấy vị trí hiện tại...</Text>
    </View>
  )}
{!isSearchModalVisible && !isOnRideModalVisible && (
    <>
      {/* Header */}
      <View style={deliveryScreenStyle.headScreen}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Giao Hàng</Text>
        <View style={deliveryScreenStyle.btnBackIndex}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={deliveryScreenStyle.backBtnImg}
              source={require("../../assets/png/back-button.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Origin Location */}
      <View style={deliveryScreenStyle.locationContainer}>
        <View style={deliveryScreenStyle.myLocationContainer}>
          <View style={deliveryScreenStyle.myLocation}>
            <MaterialIcons name="my-location" size={24} color="black" style={deliveryScreenStyle.icon} />
            <Text style={deliveryScreenStyle.myLocationInput}>{originName}</Text>
          </View>
        </View>
      </View>

      {/* Destination + autocomplete */}
      <View style={deliveryScreenStyle.endLocationContainer}>
        <View style={deliveryScreenStyle.endLocation}>
          <Octicons name="location" size={24} color="black" style={deliveryScreenStyle.icon} />
          <CustomPlacesAutocomplete
            onPlaceSelected={(place) => {
              const destination = {
                latitude: place.lat,
                longitude: place.lng,
              };
              const destinationNamed = place.name || "Unnamed Location";

              setDestinationName(destinationNamed);
              setDestination(destination);
              calculateDistance(origin, destination);
              setIsConfirmDestination(true);
              setIsModalVisible(true);
            }}
          />
        </View>
      </View>
      {/* Modals */}
      <DeliveryModal
        visible={isModalVisible}
        onClose={handleBack}
        originName={originName}
        destinationName={destinationName}
        distance={distance}
        onSend={() => handleInfoRecipe({ size, type, weight })}
        size={deliveryDetails.size}
        type={deliveryDetails.type}
        weight={deliveryDetails.weight}
        detailsGoodsText={detailsGoodsText}
        receiverText={receiveText}
        receiveName={receiveInfo.name}
        receivePhone={receiveInfo.phone}
        onReceive={handleInfoSendRecipe}
        onContinue={handleContinue}
        onFinalContinue={handleContinuePress}
        setPrice={setPrice}
      />

      <DetailsDeliveryModal
        visible={isDetailsDeliveryModalVisible}
        onClose={handleDetailsBack}
        onSave={handleSaveDetails}
      />

      <RecipeInfoModal
        visible={isRecipeInfoSendModalVisible}
        onClose={handleRecipeInfoBack}
        destinationName={destinationName}
        onSaveReceive={handleSaveReceive}
      />

      <RecipeInfoSendModal
        visible={isRecipeInfoModalVisible}
        onClose={handleRecipeInfoSendBack}
        destinationName={destinationName}
        onSaveSend={handleSaveSend}
      />
 </>
  )}
      {isSearchModalVisible && (
        <SearchDriverModal
          visible={isSearchModalVisible}
          onClose={() => {
            CancelRide();
            handleUnSearchDriver();
          }}
          originName={originName}
          destinationName={destinationName}
          distance={distanceString}
          dateTime={dateTime}
          onRide={handleOnRide}
          price={price || "0"}
          size={deliveryDetails.size}
          type={deliveryDetails.type}
          weight={deliveryDetails.weight}
        />
      )}
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
            price={price || '0'}
            rideId={currentRideId || ''}
            navigation={navigation}
            completeDelivery={handleCompleteDelivery}
            size={deliveryDetails.size}
            type={deliveryDetails.type}
            weight={deliveryDetails.weight}
            setDriverLocation={setDriverLocation}
          />
        )}
</View>

)
}

export default DeliveryScreen