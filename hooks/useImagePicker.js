import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { reduceImageResolution } from "../utils/imageUtils";

export default function useImagePicker() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const reducedImageUri = await reduceImageResolution(result.uri);
      setImage(reducedImageUri);
    }
  };

  return { image, pickImage };
}
