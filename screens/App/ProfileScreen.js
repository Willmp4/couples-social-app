import React, { useState, useEffect } from "react";
import { Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Input } from "react-native-elements";
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../utils/Firebase";
import Login from "../Auth/LogInScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-elements";
import { uploadImageToFirebase } from "../../services/firebaseFunctions";
import Logout from "../../components/Logout";
import ProfilePicture from "../../components/ProfilePicture";
import useAuth from "../../hooks/AuthHooks/useAuth";

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [username, setUsername] = useState("");
  const [partner, setPartner] = useState("");
  const { user, loading } = useAuth();
  const [relationshipStatus, setRelationshipStatus] = useState("");
  useEffect(() => {
    let unsubscribe;

    const fetchUserDetails = async () => {
      try {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          unsubscribe = onSnapshot(docRef, (docSnap) => {
            // Additional check if the user is still logged in
            if (docSnap.exists() && user && auth.currentUser) {
              const userData = docSnap.data();
              setUserDetails(userData);
              setFirstName(userData.firstName);
              setLastName(userData.lastName);
              setUsername(userData.username);
              setPartner(userData.partner);
              setProfilePicture(userData.profilePicture);
              setRelationshipStatus(userData.relationshipStatus);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();

    return () => {
      if (unsubscribe) {
        console.log("Unsubscribing from user details");
        unsubscribe();
      }
    };
  }, [user]);

  if (loading) {
    return <ActivityIndicator animating={true} color="#00f0ff" />;
  }

  if (!user) {
    return <Login />;
  }

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
        relationshipStatus,
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

  const relationshipStatusItems = [
    { label: "Long Distance", value: "LongDistance" },
    { label: "Living Together", value: "LivingTogether" },
    { label: "Married", value: "Married" },
  ];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Profile</Text>
        <Input label="First Name" placeholder="John" value={firstName} onChangeText={setFirstName} inputContainerStyle={styles.input} />
        <Input label="Last Name" placeholder="Doe" value={lastName} onChangeText={setLastName} inputContainerStyle={styles.input} />
        <Input label="Username" placeholder="Username" value={username} onChangeText={setUsername} inputContainerStyle={styles.input} />
        <Input label="Partner" placeholder="Partner" value={partner} onChangeText={setPartner} inputContainerStyle={styles.input} />
        <Input
          label="Relationship Status"
          containerStyle={{ paddingHorizontal: 0 }} // Remove default padding
          inputContainerStyle={{ borderBottomWidth: 0, paddingBottom: 0 }} // Remove the default underline and padding
          inputStyle={{ display: "none" }} // Hide the default text input
          labelStyle={{ color: "grey" }}
        />
        <RNPickerSelect
          onValueChange={(value) => setRelationshipStatus(value)}
          items={relationshipStatusItems}
          style={pickerStyles}
          value={relationshipStatus}
          useNativeAndroidPickerStyle={false}
          placeholder={{ label: relationshipStatus || "Select...", value: null }}
        />
        <ProfilePicture profilePicture={profilePicture} setProfilePicture={setProfilePicture} />
        <Button icon={<Icon name="upload" size={20} color="white" />} title="Update" onPress={Submit} buttonStyle={styles.button} />
        <Logout />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
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
    borderRadius: 10,
    backgroundColor: "#000",
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
