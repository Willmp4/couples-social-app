import { collection, addDoc, serverTimestamp, getFirestore } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../utils/Firebase";

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

export const addUpdateToFirestore = async (type, content) => {
  try{
  await addDoc(collection(db, "updates"), {
    type: type,
    content: content,
    timestamp: serverTimestamp(),
    user: auth.currentUser.displayName,
  });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const saveRelationshipStatus = async (userId, status) => {
  try {
    // Reference to the specific user's document
    const userRef = doc(db, "users", userId);

    // Update the relationship status for the user
    await updateDoc(userRef, {
      relationshipStatus: status,
    });
  } catch (error) {
    console.error("Error saving relationship status:", error);
  }
};

export const getRelationshipStatus = async (userId) => {
  try {
    // Reference to the specific user's document
    const userRef = doc(db, "users", userId);

    // Fetch the document
    const userDoc = await getDoc(userRef);

    // Retrieve and return the relationship status
    return userDoc.exists() ? userDoc.data().relationshipStatus : null;
  } catch (error) {
    console.error("Error fetching relationship status:", error);
    return null;
  }
};
