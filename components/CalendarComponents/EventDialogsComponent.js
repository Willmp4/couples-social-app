import React from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { Dialog } from "react-native-simple-dialogs";

export default function EventDialog({ visible, onClose, title, value, placeholder, onChange, onSave }) {
  return (
    <Dialog visible={visible} onTouchOutside={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TextInput style={styles.input} placeholder={placeholder} value={value} onChangeText={onChange} />
        <Button title="Save Event" onPress={onSave} />
      </View>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    padding: 10,
  },
});
