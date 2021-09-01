import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function PasswordIcon({ onZoomIn }) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="https" color="#1B8381" size={25} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 5,
    marginLeft: 5,
  },
});

export default PasswordIcon;
