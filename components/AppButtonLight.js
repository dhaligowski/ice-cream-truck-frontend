import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function AppButtonLight({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    borderColor: "#1B8381",
  },
  text: {
    color: "#1B8381",
    fontSize: 20,
    textTransform: "uppercase",
  },
});

export default AppButtonLight;
