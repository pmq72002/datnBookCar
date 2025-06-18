
import { Text, TextInput, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import loginStyles from "../../styles/loginStyle"
import axios from "axios"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState } from "react"
import defaultIPV4 from "../../assets/ipv4/ipv4Address";
import defaultColor from "../../assets/btn/btnColor";

const RegisterScreen = ({ navigation, route }: any) => {
  // Nếu truyền số điện thoại từ LoginScreen thì lấy sẵn ở đây
  const initialPhone = route?.params?.phone || "";

  const [phone, setPhone] = useState(initialPhone);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(""); 
  const [error, setError] = useState("");


  const handleRegister = () => {
    if (!phone || !name || !birthday) {
      return Alert.alert("Vui lòng điền đầy đủ thông tin");
    }
    axios.post(`http://${defaultIPV4}:3000/check-phone`, { phone })
      .then(res => {
        if (res.data.exists) {
          // Số điện thoại đã được đăng ký
          setError("Số điện thoại này đã được đăng ký rồi.");
        } else {
          setError("");
          // Tiếp tục gọi API đăng ký user
          axios.post(`http://${defaultIPV4}:3000/register`, { phone, name, birthday })
            .then(res => {
              if (res.data.success) {
                Alert.alert("Đăng ký thành công");
                navigation.replace("Login");
              } else {
                Alert.alert("Đăng ký thất bại");
              }
            })
            .catch(err => {
              console.error(err);
              Alert.alert("Lỗi khi đăng ký");
            });
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert("Lỗi kết nối server");
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, marginTop: 20 }} keyboardShouldPersistTaps="always">
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Đăng ký tài khoản mới</Text>

      <Text>Số điện thoại:</Text>
      <TextInput
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
        value={phone}
        onChangeText={setPhone}
      />

      <Text>Họ và tên:</Text>
      <TextInput
        placeholder="Nhập họ và tên"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
        value={name}
        onChangeText={setName}
      />

      <Text>Ngày sinh (DD-MM-YYYY):</Text>
      <TextInput
        placeholder="Nhập ngày sinh"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
        value={birthday}
        onChangeText={setBirthday}
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={{ backgroundColor: defaultColor, padding: 15, borderRadius: 5, marginTop: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Đăng ký</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;