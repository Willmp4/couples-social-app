import React, { useEffect } from "react";
import { Image, Button } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import useImagePicker from "../hooks/useImagePicker";

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
        buttonStyle={{ width: 200, marginTop: 20, backgroundColor: "#808080" }}
      />
      {profilePicture && <Image source={{ uri: profilePicture }} style={{ borderRadius: 100, width: 200, height: 200, marginTop: 20 }} />}
    </>
  );
};

export default ProfilePicture;
