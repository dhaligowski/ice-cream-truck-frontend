import React from "react";
import { View, StyleSheet } from "react-native";

function LottiTypeLarge({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.lotti}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: 250,
  },

  lotti: { height: "100%", width: "100%" },
});

export default LottiTypeLarge;
