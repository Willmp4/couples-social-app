import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 15, // Increased the horizontal padding
    backgroundColor: "#f8f8f8",
  },
  highlightsContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 15,  // Increase the border radius value for a more rounded appearance
    // marginVertical: 10,
    overflow: 'hidden',  // Ensures the content inside respects the rounded border
  },
  welcomeText: {
    color: "#333",
    fontSize: 18,  // Slightly reduced the font size
    fontWeight: "500", // Adjusted the weight
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,  // Slightly reduced the font size
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
    height: height * 0.45,
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
  imageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // or "contain" based on your design requirements
  },
});

export default styles;
