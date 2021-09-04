import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    backgroundColor: colors.green,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    marginTop: 10,
  },
  text: {
    color: colors.green,
    color: colors.white,
    fontSize: 20,
    textTransform: "uppercase",
  },
});

export default AppButton;
