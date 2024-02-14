import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../utils/Firebase";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import styles from "../../styles/Login.styles";

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [animationFinished, setAnimationFinished] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSecondAnimation, setShowSecondAnimation] = useState(false); // New state for second animation

  const onAnimationFinish = () => {
    setAnimationFinished(true);
    setShowLoginForm(true);
    // Trigger the second animation
    setShowSecondAnimation(true);
  };
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
          navigation.navigate("MyTabs", { screen: "Home" });
        }
      })
      .catch((error) => {
        console.log(error.message);
        Alert.alert("Error!", error.message);
      });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <LottieView
        source={require("../../assets/heart.json")}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
        style={{ flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {showSecondAnimation && (
        <LottieView
          source={require("../../assets/i_love_you.json")} // Path to your second animation JSON
          autoPlay
          loop={true}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 450,
            zIndex: 0, // Ensure it's above other content
          }}
          onAnimationFinish={() => setShowSecondAnimation(false)} // Optionally hide after playing
        />
      )}
      {showLoginForm && (
        <View style={{ flex: 1 }}>
          <ImageBackground style={styles.backgroundImage}>
            <View style={styles.logoContainer}>
              {/* <Image source={require("../../assets/favicon.png")} style={styles.logo} /> */}
            </View>
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#000"
              />
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
              <View style={styles.footerContainer}>
                <Text>
                  Haven't got an account?{" "}
                  <Text style={styles.linkText} onPress={() => navigation.navigate("SignUp")}>
                    SignUp
                  </Text>
                </Text>
                <Text style={styles.forgotPassword} onPress={() => navigation.navigate("ForgotPassword")}>
                  Forgot password?
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
