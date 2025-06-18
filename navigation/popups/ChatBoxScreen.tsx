import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import io from "socket.io-client";
import { useRoute, RouteProp } from "@react-navigation/native";
import defaultIPV4 from "../../assets/ipv4/ipv4Address";
import { useNavigation } from '@react-navigation/native';
// 🔌 Kết nối socket
const socket = io(`http://${defaultIPV4}:3000`, {
  transports: ["websocket"],
});

// 🔠 Kiểu tin nhắn
type IMessage = {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
};

// 📦 Kiểu dữ liệu truyền vào route
type ChatBoxRouteProp = RouteProp<{
  ChatBoxScreen: {
    currentUserId: string;
    receiverId: string;
    rideId: string;
    currentUserName: string;

  };
}, "ChatBoxScreen">;

const ChatBoxScreen = (props: any) => {
   const {navigation} = props;
   
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const route = useRoute<ChatBoxRouteProp>();

  const {
    currentUserId = "",
    receiverId = "",
    rideId = "",
    currentUserName = "",
  } = route.params || {};

  const formatMessage = (msg: any): IMessage => ({
    _id: msg._id || Math.random().toString(),
    text: msg.message,
    createdAt: new Date(msg.timestamp),
    user: {
      _id: msg.senderId,
      name: msg.senderName || "User",
    },
  });

  useEffect(() => {
    console.log("Joining room with currentUserId:", currentUserId);
    socket.emit("join", currentUserId);

    socket.on("chatMessage", (msg: any) => {
      if (msg.rideId === rideId) {
        setMessages((prev) => [formatMessage(msg), ...prev]);
      }
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [rideId, currentUserId]);

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
          styles.messageContainer,
          isCurrentUser ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.sender}>{item.user.name}</Text>
        <Text style={styles.message}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.createdAt.toLocaleTimeString()}
        </Text>
      </View>
    );
  };
useEffect(() => {
    if (!rideId) return;
  const fetchMessages = async () => {
    const res = await fetch(`http://${defaultIPV4}:3000/messages/${rideId}`);
    const data = await res.json();
    const formatted = data.map(formatMessage);
    setMessages(formatted);
  };
  fetchMessages();
}, [rideId]);
  return (

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
        <TouchableOpacity
      onPress={() => 
        navigation.navigate("Main", {
  screen: "Trang chủ",  
  params: {
    screen: "MapCarScreen",
    params: { reopenModal: true }
  }})}
      style={{
        padding: 10,
        backgroundColor: "#007AFF",
        alignSelf: "flex-start",
        marginTop: 50,
        borderRadius: 5,
      }}
    ></TouchableOpacity>
      <FlatList
        inverted
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Gửi tin nhắn cho tài xế"
          style={styles.input}
        />
        <TouchableOpacity onPress={onSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBoxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    paddingHorizontal: 15,
  },
  sendButton: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  sendText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  sender: {
    fontSize: 12,
    color: "#555",
  },
  message: {
    fontSize: 16,
    color: "#000",
  },
  timestamp: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
    alignSelf: "flex-end",
  },
});
