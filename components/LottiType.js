import React, { Children } from "react";
import { View, StyleSheet } from "react-native";

function LottiType({ children }) {
  return (
    <View style={styles.container}>
      <View style={styles.lotti}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
  },

  lotti: { height: "100%", width: "100%" },
});

export default LottiType;
