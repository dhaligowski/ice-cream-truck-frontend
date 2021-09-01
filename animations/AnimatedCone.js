import React, { useState, useEffect } from "react";
import { StyleSheet, Keyboard, Animated, Dimensions, View } from "react-native";

import LottiIceCream from "../components/LottiIceCream";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ICE_CREAM_HEIGHT_LARGE = windowHeight * 0.75;
const ICE_CREAM_HEIGHT_SMALL = 0;
const ICE_CREAM_WIDTH_LARGE = windowWidth * 0.75;
const ICE_CREAM_WIDTH_SMALL = 0;
const animationDuration = 500;

function AnimatedCone() {
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [iceCreamHeight] = useState(new Animated.Value(ICE_CREAM_HEIGHT_LARGE));
  const [iceCreamWidth] = useState(new Animated.Value(ICE_CREAM_WIDTH_LARGE));

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeAllListeners("keyboardDidShow", keyboardDidShow);
      Keyboard.removeAllListeners("keyboardDidHide", keyboardDidHide);
    };
  }, []);

  const keyboardDidShow = (event) => {
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: animationDuration, //event.duration
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }),
      Animated.timing(iceCreamHeight, {
        duration: animationDuration,
        toValue: ICE_CREAM_HEIGHT_SMALL,
        useNativeDriver: false,
      }),
      Animated.timing(iceCreamWidth, {
        duration: animationDuration,
        toValue: ICE_CREAM_WIDTH_SMALL,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const keyboardDidHide = () => {
    Animated.parallel([
      Animated.timing(keyboardHeight, {
        duration: animationDuration, //keep inline, not event.duration
        toValue: 0,
        useNativeDriver: false,
      }),
      Animated.timing(iceCreamHeight, {
        duration: animationDuration,
        toValue: ICE_CREAM_HEIGHT_LARGE,
        useNativeDriver: false,
      }),
      Animated.timing(iceCreamWidth, {
        duration: animationDuration,
        toValue: ICE_CREAM_WIDTH_LARGE,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={styles.animatedLotti}
        style={[
          {
            height: iceCreamHeight,
            width: iceCreamWidth,
          },
        ]}
      >
        <LottiIceCream />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AnimatedCone;
