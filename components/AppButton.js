import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function AppButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffffff",
    backgroundColor: "#1B8381",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    marginTop: 10,
  },
  text: {
    color: "#1B8381",
    color: "#ffffff",
    fontSize: 20,
    textTransform: "uppercase",
  },
});

export default AppButton;
