import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function LogoutButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1B8381",
    borderRadius: 25,
    padding: 7,
    elevation: 12,
  },
  text: {
    color: "#1B8381",
    color: "#ffffff",
    fontSize: 20,
    textTransform: "uppercase",
  },
});

export default LogoutButton;
