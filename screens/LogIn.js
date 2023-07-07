import React, { useState } from "react";
import { Button, TextInput, View, Alert, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/Firebase";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateInput = () => {
    setError("");
    if (email.trim() === "" || password.trim() === "") {
      setError("Email or Password should not be empty.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return false;
    }
    return true;
  };

  const login = async () => {
    if (!validateInput()) {
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().isNewUser) {
          navigation.navigate("SignUp");
        } else {
          navigation.navigate("Home");
        }
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error!", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="black" />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // hide the password
        placeholderTextColor="black"
      />
      <Text style={styles.errorText}>{error}</Text>
      <Button title="Login" onPress={login} />
      <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
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
