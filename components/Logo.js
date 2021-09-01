import React from "react";
import { View, StyleSheet, Image } from "react-native";

function Logo(props) {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  logo: {
    height: 350,
    width: 350,
  },
});

export default Logo;
