import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function AppButtonDark({ title, onPress }) {
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
    justifyContent: "center",
    alignItems: "center",
    padding: 7,
  },
  text: {
    color: "#ffffff",
    fontSize: 20,
    textTransform: "uppercase",
  },
});

export default AppButtonDark;
