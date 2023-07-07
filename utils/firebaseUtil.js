import { collection, addDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "./Firebase";

export const uploadImageToFirebase = async (imageUri, folder) => {
  // Generate a unique filename based on timestamp
  const uniqueFileName = new Date().getTime().toString();

  // Create a reference to the file
  const storageRef = ref(storage, `${folder}/${uniqueFileName}`);

  const response = await fetch(imageUri);
  const blob = await response.blob();

  await uploadBytesResumable(storageRef, blob);

  return getDownloadURL(storageRef);
};

export const addPostToFirestore = async (title, content, imageURL) => {
  const user = auth.currentUser;

  if (user !== null) {
    await addDoc(collection(db, "blogPosts"), {
      title: title,
      content: content,
      imageURL: imageURL,
      created_at: serverTimestamp(),
      uid: user.uid,
      username: user.displayName,
    });
  }
};
