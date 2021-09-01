import React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import LottieView from "lottie-react-native";

function LottiLocation({ progress }) {
  return (
    <LottieView
      source={require("../animations/location.json")}
      autoPlay={false}
      loop={false}
      progress={progress}
    />
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", height: "100%", flexDirection: "column" },
});

export default LottiLocation;
