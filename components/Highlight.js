import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Highlight({ post }) {
  return (
    <View style={styles.item}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: post.imageURL }} style={styles.postImage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f8f8f8", // Light background color
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      // Shadow positioning
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 2.1, // Shadow blurriness
    elevation: 3, // This is for Android shadow
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  postImage: {
    width: "100%", // use full width
    height: undefined, // let the height adjust to maintain aspect ratio
    aspectRatio: 1, // adjust this value to match the aspect ratio of your images
    resizeMode: "cover", // cov
    padding: 10, // add some padding around the image
    borderWidth: 1, // add a border
    borderColor: "#000", // border color
  },
});
