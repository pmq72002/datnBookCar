import { StyleSheet } from "react-native";
import defaultColor from "../assets/btn/btnColor";

const deliveryScreenStyle = StyleSheet.create({
container: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 50
       
      },
      headScreen:{
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center'
      },
    btnBackIndex:{
    position: "absolute",
    zIndex: 1,
    left: 20,
    marginTop: 20,
    
    
      },
      backBtnImg:{
        height:30,
        width: 30,
        
      },
      closeBtnImg:{
        height:20,
        width: 20,
        
      },
      endLocationContainer:{
        alignItems: 'center',
        borderColor: defaultColor,
        borderWidth: 2,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
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
        endLocation:{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        width: '100%',
        backgroundColor: 'white', 
      },
      icon:{
        marginRight: 10,
        marginLeft: 10
      },
      locationContainer:{
        backgroundColor: "white",
    
      },
      locationContainerDetails:{
        backgroundColor:"white",
        height: 180,
        marginTop: 2,
      },
      myLocationContainer:{
            alignItems: 'center',
            marginTop: 20, 
            marginLeft:10,
            marginRight: 10,
            borderRadius:10,
            maxHeight: 120,
      },
       myLocationInput:{
        flex: 1,
        height: 50,
        fontSize: 16,
        textAlignVertical:"center",
        alignItems:"center",
      },
      submitContainer:{
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center'
      },
      modalOverlay: {
        flex: 0.5, 
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', 
        position: 'absolute', 
        width: '100%',
        height: '100%',
        bottom: 0,
        marginBottom: 0, 
    },
     modalContainer: {
      width: '100%',
      backgroundColor: '#F3F3F3',
      flex:1
    },
    headScreenDetails:{
        justifyContent:'center',
        alignItems:'center',
        width: '100%',
        backgroundColor: 'white',
        height: 50
    },
    myLocationRideDContainer:{
      alignItems: 'flex-start',
      marginTop: 5, 
      marginLeft:10,
      marginRight: 5,
      height: 80,
    },
    myLocationRideD:{
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      backgroundColor: 'white', 
    },
    endLocationRideDContainer:{
      alignItems: 'flex-start',
      marginTop: 5,
      marginLeft: 10,
      marginRight: 5,
      height: 80
    },
    endRideDLocation:{
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      backgroundColor: 'white', 
    },
    detailGoods:{
        flexDirection:'row',
        marginTop: 8,
        width: '100%',
        height: 50,
        paddingLeft: 25,
        alignItems:'center',
        backgroundColor:'white',
    
    },
    extendedService:{
        width:'100%',
        backgroundColor:'white',
        marginTop: 8,
        paddingTop: 15,
        paddingBottom:15,
        paddingLeft: 25,
        height: 160,
        justifyContent:'space-between'
    },
    priceContainer:{
        width: '100%',
        backgroundColor:'white',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8
    },
    priceDeliveryContainer:{
        width: '90%',
        height: 80,
        borderColor: defaultColor,
        borderWidth: 1,
        borderRadius: 20,
        flexDirection: 'row',
        
        alignItems:'center'
    },
    priceDelivery:{
        marginLeft: 20
    },
    btnContinue:{
   
      width: "100%",

      alignItems:"center"
      
    },
    submitBtn:{
        backgroundColor: defaultColor,  
      padding: 10,
      borderRadius: 15,
      marginTop: 20,
      width: '80%',
      height: 50,  
      alignItems: 'center',
      justifyContent:'center'
    },
    sizeBtn:{
        backgroundColor:'#F1F1F1',
        borderRadius: 10,
        width: 70,
        height: 30,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent:'center'
    },
    sizeTypeBtn:{
        backgroundColor:'#F1F1F1',
        borderRadius: 10,
        width: 110,
        height: 30,
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection: 'row',
        
    },
    saveAndContinueContainer:{
        backgroundColor: 'white',
        width: '100%',
        height: 90,
        marginTop: 8,
        alignItems: 'center',
        justifyContent:'center'
    },
    saveAndContinueBtn:{
        backgroundColor:defaultColor,
        width: '90%',
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15

    },
    modalRecipeContainer: {
      width: '100%',
      backgroundColor: 'white',
      flex:1
    },
    locationRecipeContainerDetails:{
        backgroundColor:"white",
        height: 120,
        marginTop: 2,
      },
    myLocationRideRecipeContainer:{
      height: 60,
      backgroundColor: '#F3F3F3',
      marginLeft: 15,
      marginRight: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent:'center',
      marginTop: 10
    },
    myRecipeLocationRide:{
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      backgroundColor: '#F3F3F3', 
      justifyContent:"center"
    },
    textInput:{
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#F3F3F3', 
      justifyContent:"center"
    }
})
export default deliveryScreenStyle