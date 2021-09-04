import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function EmailIcon(props) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="mail" color={colors.green} size={25} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 5,
    marginLeft: 5,
  },
});

export default EmailIcon;
