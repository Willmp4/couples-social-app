import React, { useState } from "react";
import { ImageBackground, Image, StyleSheet, View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
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
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/favicon.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor="#000" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#000"
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity> */}
        <View style={styles.footerContainer}>
          <Text>Haven't got an account? <Text style={styles.linkText} onPress={() => navigation.navigate("SignUp")}>SignUp</Text></Text>
          <Text style={styles.forgotPassword} onPress={() => navigation.navigate("ForgotPassword")}>Forgot password?</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
  },
  container: {
    paddingHorizontal: 30,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    color: "blue",
  },
  forgotPassword: {
    color: "blue",
    fontStyle: "italic",
  },
});
