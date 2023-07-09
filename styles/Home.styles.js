import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 30,
      paddingHorizontal: 10,
      backgroundColor: "#f8f8f8",
    },
    welcomeText: {
      color: "#333",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    title: {
      fontWeight: "bold",
      fontSize: 30,
      marginBottom: 20,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    scrollView: {
      backgroundColor: "#f5f5f5",
      overflow: "hidden",
    },
    slide: {
      width,
      height: height * 0.3,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 2,
      backgroundColor: "#fff",
    },
  });
  
export default styles;
