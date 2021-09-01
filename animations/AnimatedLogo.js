import React, { useState, useEffect } from "react";
import { Animated, Keyboard, StyleSheet, View } from "react-native";

const LOGO_HEIGHT_LARGE = 350;
const LOGO_HEIGHT_SMALL = 200;
const LOGO_WIDTH_LARGE = 350;
const LOGO_WIDTH_SMALL = 200;
const LOGO_MARGIN_TOP_LARGE = 0;
const LOGO_MARGIN_TOP_SMALL = 50;

const animationDuration = 500;

function AnimatedLogo() {
  const [keyboardHeight] = useState(new Animated.Value(0));
  const [logoHeight] = useState(new Animated.Value(LOGO_HEIGHT_LARGE));
  const [logoWidth] = useState(new Animated.Value(LOGO_WIDTH_LARGE));
  const [logoMarginTop] = useState(new Animated.Value(LOGO_MARGIN_TOP_LARGE));

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
      Animated.timing(logoHeight, {
        duration: animationDuration,
        toValue: LOGO_HEIGHT_SMALL,
        useNativeDriver: false,
      }),
      Animated.timing(logoWidth, {
        duration: animationDuration,
        toValue: LOGO_WIDTH_SMALL,
        useNativeDriver: false,
      }),
      Animated.timing(logoMarginTop, {
        duration: animationDuration,
        toValue: LOGO_MARGIN_TOP_SMALL,
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
      Animated.timing(logoHeight, {
        duration: animationDuration,
        toValue: LOGO_HEIGHT_LARGE,
        useNativeDriver: false,
      }),
      Animated.timing(logoWidth, {
        duration: animationDuration,
        toValue: LOGO_WIDTH_LARGE,
        useNativeDriver: false,
      }),
      Animated.timing(logoMarginTop, {
        duration: animationDuration,
        toValue: LOGO_MARGIN_TOP_LARGE,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[
          {
            height: logoHeight,
            width: logoWidth,
            marginTop: logoMarginTop,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AnimatedLogo;
