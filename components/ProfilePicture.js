import React, { useEffect } from "react";
import { Image, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import useImagePicker from "../hooks/BlogHooks/useImagePicker";

const ProfilePicture = ({ profilePicture, setProfilePicture }) => {
  const { image, pickImage } = useImagePicker();

  useEffect(() => {
    setProfilePicture(image);
  }, [image, setProfilePicture]);

  return (
    <>
      <Button
        icon={<Icon name="camera" size={20} color="white" />}
        title="Pick an Image"
        onPress={pickImage}
        buttonStyle={{ width: 200, marginTop: 20, backgroundColor: "#000", borderRadius: 10}}
      />
      {profilePicture && <Image source={{ uri: profilePicture }} style={{ borderRadius: 100, width: 200, height: 200, marginTop: 20 }} />}
    </>
  );
};

export default ProfilePicture;
