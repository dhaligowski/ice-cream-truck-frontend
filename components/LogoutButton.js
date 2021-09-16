import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function LogoutButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    borderRadius: 25,
    padding: 7,
    elevation: 12,
    width: 125,
  },
  text: {
    color: colors.green,
    color: colors.white,
    fontSize: 20,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default LogoutButton;
