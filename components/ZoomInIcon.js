import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function ZoomInIcon({ onZoomIn }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onZoomIn}>
        <MaterialIcons name="add-circle" color={colors.green} size={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ZoomInIcon;
