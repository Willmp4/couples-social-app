import React, { useState, useEffect } from "react";
import { Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input } from "react-native-elements";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/Firebase";
import Login from "./LogIn";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-elements";
import {uploadImageToFirebase } from "../utils/firebaseUtil";
import Logout from "../components/Logout";
import ProfilePicture from "../components/ProfilePicture";
import useAuth from "../hooks/useAuth";


const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [username, setUsername] = useState("");
  const [partner, setPartner] = useState("");
  const { user, loading } = useAuth()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserDetails(userData);
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setUsername(userData.username);
            setPartner(userData.partner);
            setProfilePicture(userData.profilePicture);
            setIsNewUser(false);
          } else {
            setIsNewUser(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [user]);

  if (loading) {
    return <ActivityIndicator animating={true} color="#00f0ff" />;
  }

  if (!user) {
    return <Login />;
  }

  // Submit the image to Firebase Storage with lots of error handling
  const Submit = async () => {
    try {
      const userId = auth.currentUser.uid;
      const profilePictureUrl = await uploadImageToFirebase(profilePicture, `profile_pictures/${userId}`);

      const userData = {
        firstName,
        lastName,
        profilePicture: profilePictureUrl,
        username,
        partner,
      };

      const docRef = doc(db, "users", userId);

      if (isNewUser) {
        await setDoc(docRef, userData);
      } else {
        await updateDoc(docRef, userData);
      }
    } catch (error) {
      console.error("Error in Submit function:", error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Profile</Text>
        <Input label="First Name" placeholder="John" value={firstName} onChangeText={setFirstName} inputContainerStyle={styles.input} />
        <Input label="Last Name" placeholder="Doe" value={lastName} onChangeText={setLastName} inputContainerStyle={styles.input} />
        <Input label="Username" placeholder="Username" value={username} onChangeText={setUsername} inputContainerStyle={styles.input} />
        <Input label="Partner" placeholder="Partner" value={partner} onChangeText={setPartner} inputContainerStyle={styles.input} />
        <ProfilePicture profilePicture={profilePicture} setProfilePicture={setProfilePicture} />
        <Button icon={<Icon name="upload" size={20} color="white" />} title="Update" onPress={Submit} buttonStyle={styles.button} />
        <Logout />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    width: 200,
    marginTop: 20,
    //Grey
    backgroundColor: "#808080",
  },
  image: {
    //Make the image a circle
    borderRadius: 100,
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default ProfileScreen;
