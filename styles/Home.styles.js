import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const primaryColor = "#000"; // Black
const backgroundColor = "#FFF"; // White
const subtleBorder = "#E0E0E0"; // Very light gray

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 15,
    backgroundColor: backgroundColor,
  },
  highlightsContainer: {
    borderColor: subtleBorder,
    borderRadius: 15, // Rounded edges
    overflow: "hidden",
  },
  welcomeTextContainer: {
    borderBottomWidth: 1, // subtle border at the bottom
    borderRadius: 15, // Rounded edges
    paddingVertical: 10,
    marginBottom: 15,
    alignItems: "left",
  },
  welcomeText: {
    color: primaryColor,
    fontSize: 18,
    fontWeight: "600",
  },
  titleContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 15, // Rounded edges
    alignItems: "left",
    borderBottomWidth: 1, // subtle border at the bottom
  },
  title: {
    color: primaryColor,
    fontWeight: "bold",
    fontSize: 26,
    letterSpacing: 1,
  },
  scrollView: {
    backgroundColor: backgroundColor,
  },
  slide: {
    width,
    height: height * 0.45,
    backgroundColor: backgroundColor,
    borderBottomWidth: 1, // subtle border at the bottom
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default styles;
