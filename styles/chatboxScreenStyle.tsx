import { StyleSheet } from "react-native";
import defaultColor from "../assets/btn/btnColor";
const chatboxSCreenStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "flex-end",

 
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
export default chatboxSCreenStyle