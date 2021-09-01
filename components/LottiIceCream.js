import React from "react";
import LottieView from "lottie-react-native";

function LottiIceCream(props) {
  return (
    <LottieView
      source={require("../animations/ice-cream1.json")}
      autoPlay
      loop
    />
  );
}

export default LottiIceCream;
