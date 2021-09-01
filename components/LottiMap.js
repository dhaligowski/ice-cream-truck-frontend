import React from "react";
import LottieView from "lottie-react-native";

function LottiMap(props) {
  return (
    <LottieView source={require("../animations/map.json")} autoPlay loop />
  );
}

export default LottiMap;
