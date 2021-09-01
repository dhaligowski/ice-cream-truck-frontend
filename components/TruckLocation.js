import React from "react";
import LottieView from "lottie-react-native";

function TruckLocation(props) {
  return (
    <LottieView
      source={require("../animations/truck-location.json")}
      autoPlay
      loop
    />
  );
}

export default TruckLocation;
