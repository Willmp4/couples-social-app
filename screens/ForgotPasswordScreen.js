import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/Firebase";
import styles from "../styles/Login.styles";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const resetPassword = () => {
    if (email === "") {
      Alert.alert("Input Error!", "Please enter your email address to reset your password.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Success!", "Please check your email (including your spam folder) for password reset instructions.");
      })
      .catch((error) => {
        Alert.alert("Error!", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#000"
      />
      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

