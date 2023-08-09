import React, { useState } from "react";
import { Button, View } from "react-native";
import Dialog from "react-native-dialog";
import { addPostToFirestore, uploadImageToFirebase, addUpdateToFirestore } from "../../services/firebaseFunctions";
import useImagePicker from "../../hooks/BlogHooks/useImagePicker";
import useAuth from "../../hooks/AuthHooks/useAuth";

export default function BlogPostImage() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [postContent, setPostContent] = useState("");
  const { user } = useAuth();
  const { image, pickImage } = useImagePicker();

  //display name from user
  const displayName = user.displayName;
  const addPost = async (imageUri, title, content) => {
    if (!imageUri) {
      alert("Please select an image before posting.");
      return;
    }

    try {
      const downloadURL = await uploadImageToFirebase(imageUri, "blogPosts");
      await addPostToFirestore(title, content, downloadURL);

      //Call addUpdateToFirestore function
      await addUpdateToFirestore("new_post", `${displayName} made a new post`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handlePickImage = async () => {
    await pickImage();
    setDialogVisible(true);
  };

  return (
    <View style={{ paddingTop: 50 }}>
      <Button title="Pick an image from camera roll" onPress={handlePickImage} />
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Enter post description</Dialog.Title>
        <Dialog.Input onChangeText={(text) => setPostContent(text)} />
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button
          label="Post"
          onPress={() => {
            addPost(image, "New Post", postContent);
            setDialogVisible(false);
          }}
        />
      </Dialog.Container>
    </View>
  );
}
