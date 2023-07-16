// SignUp.js
import React, { useState } from "react";
import { Button, TextInput, View, Alert, Text, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../utils/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  // Validate the user's input using regex and return true if the input is valid
  const validateInput = () => {
    setError("");
    if (email.trim() === "" || password.trim() === "" || username.trim() === "" || firstName.trim() === "" || lastName.trim() === "") {
      setError("All fields should not be empty.");
      return false;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return false;
    }
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setError("Username can only contain letters and numbers.");
      return false;
    }
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError("Names can only contain letters.");
      return false;
    }
    return true;
  };


  // Create a new user account using the email and password provided by the user
  //Username must be unique
  //If the user is successfully created, add the user's details to the database
  const signUp = async () => {
    if (!validateInput()) {
      return;
    }

    const docRef = doc(db, "usernames", username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      Alert.alert("Error!", "Username is already taken.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        firstName,
        lastName,
        username,
        partner: "",
      };

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, userData);

      await setDoc(docRef, { uid: user.uid });

      await updateProfile(user, { displayName: username });

      Alert.alert("Signed up!");
    } catch (error) {
      Alert.alert("Error!", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} placeholderTextColor="black" />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} placeholderTextColor="black" />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} placeholderTextColor="black" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="black" />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="black"
      />
      <Text style={styles.errorText}>{error}</Text>
      <Button title="Sign Up" onPress={signUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    color: "black",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
