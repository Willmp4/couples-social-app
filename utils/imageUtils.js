// utils/imageUtils.js

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const reduceImageResolution = async (imageUri, maxWidth = 800, compressQuality = 0.7) => {
  const manipResult = await manipulateAsync(imageUri, [{ resize: { width: maxWidth } }], {
    compress: compressQuality,
    format: SaveFormat.JPEG,
  });

  return manipResult.uri;
};