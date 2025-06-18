import { Text, TextInput, View, Image, TouchableOpacity, ScrollView, Alert } from "react-native"
import loginStyles from "../../styles/loginStyle"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import defaultIPV4 from '../../assets/ipv4/ipv4Address';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultColor from "../../assets/btn/btnColor"

const LogInScreen = (props: any) => {
    const {navigation} = props;
const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
 const [resendTimer, setResendTimer] = useState(0);
 useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);
const handleSendOtp = () => {
    if (!phone) return Alert.alert("Vui lòng nhập số điện thoại");

    // Bước 1: Kiểm tra số điện thoại đã đăng ký chưa
    axios.post(`http://${defaultIPV4}:3000/check-phone`, { phone })
      .then(res => {
        if (res.data.exists) {
          // Nếu có user -> gửi OTP bình thường
          axios.post(`http://${defaultIPV4}:3000/send-otp`, { phone })
            .then(res => {
              if (res.data.message === "OTP sent") {
                Alert.alert("Đã gửi OTP");
                setIsOtpSent(true);
              } else {
                Alert.alert("Gửi OTP thất bại");
              }
            })
            .catch(err => {
              console.error(err);
              Alert.alert("Lỗi khi gửi OTP");
            });
        } else {
          // Nếu chưa có user, hỏi chuyển sang đăng ký
          Alert.alert(
            "Số điện thoại chưa đăng ký",
            "Bạn muốn tạo tài khoản mới?",
            [
              { text: "Hủy", style: "cancel" },
              { text: "Đăng ký", onPress: () => navigation.navigate("Register", { phone }) }
            ]
          );
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert("Lỗi kết nối server");
      });
  };

  const handleResendOtp = () => {
    if (!phone) return Alert.alert("Vui lòng nhập số điện thoại");

    axios
      .post(`http://${defaultIPV4}:3000/send-otp`, { phone })
      .then((res) => {
        if (res.data.message === "OTP sent") {
          Alert.alert("Đã gửi lại OTP");
          setResendTimer(30);
        } else {
          Alert.alert("Gửi lại OTP thất bại");
        }
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Lỗi khi gửi lại OTP");
      });
  };
  // Xác minh OTP
   const handleVerifyOtp = () => {
    axios.post(`http://${defaultIPV4}:3000/verify-otp`, { phone, otp })
      .then(async res => {
        if (res.data.message === "Xác thực thành công") {
          await AsyncStorage.setItem('userPhone', phone);
          Alert.alert("Đăng nhập thành công");
          navigation.navigate("Main");
        } else {
          Alert.alert("OTP không đúng hoặc đã hết hạn");
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert("Lỗi khi xác minh OTP");
      });
  };

    return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 , marginTop: 20}} keyboardShouldPersistTaps="always">
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Đăng nhập bằng OTP</Text>

      <Text>Số điện thoại:</Text>
      <TextInput
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 15 }}
        value={phone}
        onChangeText={setPhone}
      />

      {isOtpSent && (
        <>
          <Text>Nhập mã OTP:</Text>
          <TextInput
            placeholder="Mã OTP"
            keyboardType="number-pad"
            style={{ borderBottomWidth: 1, marginBottom: 15 }}
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={resendTimer > 0}
            style={{
              backgroundColor: resendTimer > 0 ? "#aaa" : defaultColor,
              padding: 15,
              borderRadius: 5,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              {resendTimer > 0 ? `Gửi lại OTP sau ${resendTimer}s` : "Gửi lại OTP"}
            </Text>
          </TouchableOpacity>
        </>
        
      )}

      {!isOtpSent ? (
        <TouchableOpacity
          onPress={handleSendOtp}
          style={{ backgroundColor: defaultColor, padding: 15, borderRadius: 5 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Gửi OTP</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleVerifyOtp}
          style={{ backgroundColor: "green", padding: 15, borderRadius: 5 }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Xác minh OTP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: defaultColor, textAlign: "center" }}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LogInScreen