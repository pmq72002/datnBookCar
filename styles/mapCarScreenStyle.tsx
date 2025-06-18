import { StyleSheet } from "react-native";
import defaultColor from "../assets/btn/btnColor";

const mapCarScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 50
       
      },
      locationMarker:{
        width: 10,
        height: 10
      },
      headScreen:{
    position: "absolute",
    zIndex: 1,
    left: 20,
    marginTop: 20,
    
    
      },
      showLocation:{
        position: "absolute",
        right: 20,
        bottom: 20,
      
        borderRadius: 200/2
      },
      backBtnImg:{
        height:30,
        width: 30,
        
      },
      currentLocationBtnImg:{
        height: 30,
        width: 30,
        backgroundColor: "white",
        borderRadius: 200/2
        
        
      },
      map: {
        width: '100%',
        height: 400,
      },
      headerLocation:{
        justifyContent: "center",
        alignItems:"center",
        borderColor: "grey",
        borderWidth: 0.5,
        height: 60,
        width: "100%",
        borderTopEndRadius: 10,
        borderTopStartRadius:10
      },
      locationContainer:{
        backgroundColor: "white",
    
      },
      myLocationContainer:{
            alignItems: 'center',
            marginTop: 20, 
            marginLeft:10,
            marginRight: 10,
            borderRadius:10,
            maxHeight: 120,
      },
      myLocation:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:"center",
        borderRadius:10,
        width: '100%',
        backgroundColor: '#D6D5DA', 
      },
      myLocationInput:{
        flex: 1,
        height: 50,
        fontSize: 16,
        textAlignVertical:"center",
        alignItems:"center",
      },
      icon:{
        marginRight: 10,
        marginLeft: 10
      },
      endLocationContainer:{
        position: "absolute",
        zIndex:1,
        right: 10,
        alignItems: 'center',
        borderColor: defaultColor,
        borderWidth: 2,
        marginTop: 5,
        marginLeft:10,
        marginRight: 10,
        borderRadius: 10,
        maxHeight: 120,
        width: '80%'
      },
      endLocation:{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        width: '100%',
        backgroundColor: 'white', 
      },
      endLocationInput:{
        flex: 1,
        height: 50,
        fontSize: 16,
      },
      addTogo: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "center",
        alignItems:"center"
        
    },
    addToGoBtn: {
        width: 120,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent:"center",
        height: 40,
        flexDirection: "row",
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 10,
       
    },
    addTogoBtnText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
        
    },
    submitContainer:{
      borderColor: "black",
      borderWidth: 1,
      borderRadius: 10,
      justifyContent:"center",
      alignItems:"center",
      marginTop: 20,
      marginLeft: 80,
      marginRight: 80,
      backgroundColor: defaultColor,
      height: 60
    },
    submitBtn:{
      justifyContent:"center",
      alignItems:"center",
      flex:1,
      width: "100%",
      borderRadius: 10
    },
    submitText:{
      fontSize: 18,
      fontWeight: "bold",
      
    },
    carTransContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOverlay: {
        flex: 0.5, 
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', 
        position: 'absolute', 
        width: '100%',
        height: '52%',
        bottom: 0,
        marginBottom: 0,
        borderTopEndRadius: 10,
      borderTopStartRadius:10, 
    },
    modalContainer: {
      width: '100%',
      backgroundColor: 'white',
      padding: 20,
      borderTopEndRadius: 10,
      borderTopStartRadius:10,
      flex:1
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: "center",
    
    },
    vehicleOption: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#f1f1f1',
      borderRadius: 5,
      borderWidth: 1,
      width: '100%',
      height:80,
      flex: 1
    },
    submitCBtn: {
      backgroundColor: defaultColor,  
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      width: 100,  
      alignItems: 'center',
    },
    cancelBtn: {
      backgroundColor: "#EE4958",  
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      width: 100,  
      alignItems: 'center',
    },
    modalSearchOverlay: {
      flex: 0.5, 
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', 
      position: 'absolute', 
      width: '100%',
      height: '54%',
      bottom: 0,
      marginBottom: 0, 
      borderTopEndRadius: 10,
      borderTopStartRadius:10,
    },
    modalSearchContainer: {
    width: '100%',
    backgroundColor: '#D6D5DA',
    borderTopEndRadius: 10,
    borderTopStartRadius:10,
    flex:1,
    },
    cancelSearchBtn:{
      backgroundColor: "white",  
      padding: 10,
      borderColor: "black",
      borderWidth: 1,
      borderRadius: 10,
      marginTop: 5,
      width: "90%",  
      alignItems:'center'
    },
    
    searchHeader:{
      paddingTop: 10,
      paddingLeft: 15,
      paddingRight: 15,
      width: "100%",
      borderTopEndRadius: 10,
      borderTopStartRadius:10,
      height: 70,
      backgroundColor:"white",
    
    },
    
    submitBtnText: {
      color: 'white',
      fontSize: 18,
    },
    selectedVehicle: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#ddd',
      borderRadius: 10,
    },
    btnVehicle:{
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems:"center"
    },
    imageContainer:{
      flexDirection: "row", 
      alignItems:'center',
      height: 60,
      width: 160
      
    },
     vehicleImage: {
      width: 60, 
      height: "100%", 
      marginRight: 10,
      marginLeft: 5, 
    
    },
    optionContainer:{
      flexDirection: "row",
      alignItems:"center",
      justifyContent: "space-between"
    },
    
    infoRide:{
      marginTop:5,
      paddingLeft: 15,
      paddingRight: 15,
      width: "100%",
      height: 160,
      backgroundColor:"white",
    },
    myLocationRideContainer:{
      alignItems: 'flex-start',
      marginTop: 5, 
      marginLeft:5,
      marginRight: 5,
      height: 40,
    },
    myLocationRide:{
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      backgroundColor: 'white', 
    },
    endLocationRideContainer:{
      alignItems: 'flex-start',
      marginTop: 5,
      marginLeft: 5,
      marginRight: 5,
      height: 40
    },
    endRideLocation:{
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      backgroundColor: 'white', 
    },
    distanceShowRide:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: "center",
      backgroundColor: 'white',
      borderTopColor: "grey",
      borderTopWidth:0.5
    },
    infoPayment:{
      marginTop:10,
      paddingLeft: 15,
      paddingRight: 15,
      width: "100%",
      height: 190,
      backgroundColor:"white",
    },
    infoPaymentItems:{
      marginLeft: 10,
      marginRight:5,
      marginTop:5,
      flexDirection:"row",
      justifyContent:"space-between",
      borderBottomColor: "grey",
      borderBottomWidth: 0.5,
      height: 30
    },
    infoPaymentTotal:{
      marginLeft: 15,
      marginRight:5,
      marginTop:10,
      flexDirection:"row",
      justifyContent:"space-between",
      height: 40,
      alignItems: "center"
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 20, 
      width: '100%',
    },
    modalOnDriveOverlay:{
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', 
      position: 'absolute', 
      width: '100%',
      height: '50%',
      bottom: 0,
      marginBottom: 0, 
      borderTopEndRadius: 10,
      borderTopStartRadius:10,
    },
    modalOnDriveContainer:{
    width: '100%',
    backgroundColor: '#F1F1F1',
    borderTopEndRadius: 10,
    borderTopStartRadius:10,
    flex:1,
    
    },
     onDriveHeader:{
      backgroundColor:"white",
      height: 80,
      width: '100%',
      paddingTop: 15,
      borderTopEndRadius: 10,
      borderTopStartRadius:10,
      paddingLeft: 15,
      justifyContent:'center'
    },
    onDriveVehicle: {
      backgroundColor:'white',
      width: '100%',
      height: 165,
      marginTop: 7,
    },
    callAndText:{
      backgroundColor:'white',
      width:'100%',
      height: 100,
      marginTop: 2,
      flexDirection: 'row',
      justifyContent:'space-evenly'
    },
    detailsRide:{
      marginTop: 7,
      width: '100%',
      backgroundColor:'white',
      height: 300
    },
})

export default mapCarScreenStyles