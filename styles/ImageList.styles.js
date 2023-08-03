import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    list: {
      width: "100%",
    },
    item: {
      marginVertical: 10,
      backgroundColor: "#f8f8f8", // Light background color
      borderRadius: 5, // Rounded corners
      shadowColor: "#000", // Shadow color
      shadowOffset: {
        // Shadow positioning
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.43, // Shadow opacity
      shadowRadius: 2.1, // Shadow blurriness
  
      elevation: 4, // This is for Android shadow
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    postImage: {
      width: "100%", // use full width
      height: undefined, // let the height adjust to maintain aspect ratio
      aspectRatio: 1, // adjust this value to match the aspect ratio of your images
      resizeMode: "contain", // 'cover' might also be a good option, depending on your needs
      padding: 10, // add some padding around the image
      borderWidth: 1, // add a border
      borderColor: "#000", // border color
    },
  
    captionContainer: {
      borderWidth: 1, // This will create a border around the view
      borderColor: "black", // This will make the border color black
      padding: 10, // This will give space between the border and the text
      marginBottom: 10, // Add some margin if you like
      borderRadius: 5, // This will round the corners of the border
      marginTop: 10,
    },
    caption: {
      color: "black",
      fontSize: 16,
    },
  });