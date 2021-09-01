import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const bottom = 400;

function ZoomInIcon({ onZoomIn }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onZoomIn}>
        <MaterialIcons name="add-circle" color="#1B8381" size={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ZoomInIcon;
