import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 50,
    },
    logo: {
      width: 100,
      height: 100,
    },
    container: {
      // flex: 1,
      // justifyContent:"center",
      paddingHorizontal: 30,
    },
    forgotPasswordContainer: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 30,
    },
    input: {
      height: 50,
      backgroundColor: "#fff",
      borderColor: "#000",
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 20,
      paddingHorizontal: 15,
      fontSize: 16,
    },
    errorText: {
      color: "red",
      marginBottom: 20,
      fontWeight: "bold",
    },
    button: {
      backgroundColor: "#000",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 20,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    footerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    linkText: {
      color: "blue",
    },
    forgotPassword: {
      color: "blue",
      fontStyle: "italic",
    },
  });
  
export default styles;