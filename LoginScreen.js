import React from "react";
import { View, StyleSheet, TextInput, Platform } from "react-native";
import AppButton from "./components/AppButton";

function LoginScreen({ onLogin }) {
  return (
    <View style={styles.container}>
      <View style={styles.form}></View>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        name="email"
        textContentType="emailAddress"
        style={styles.input}
      ></TextInput>
      <TextInput
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        name="password"
        textContentType="password"
        style={styles.input}
      ></TextInput>
      <AppButton title="Login" onPress={onLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131419",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    position: "relative",
    backgroundColor: "#808080",
    width: "85%",
    borderRadius: 40,
    opacity: 0.4,
  },
  input: {
    color: "#c7c7c7",
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
});

export default LoginScreen;
