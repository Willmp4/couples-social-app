import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { reduceImageResolution } from "../../utils/imageUtils";

export default function useImagePicker() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Request both camera and media library permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== "granted" || mediaLibraryPermission.status !== "granted") {
      alert("Sorry, we need camera and media library permissions to make this work!");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const reducedImageUri = await reduceImageResolution(result.assets[0].uri);
        setImage(reducedImageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error picking image. Please try again.");
    }
  };

  return { image, pickImage };
}
