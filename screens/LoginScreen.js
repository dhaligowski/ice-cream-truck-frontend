import React, { useContext } from "react";
import { View, StyleSheet, TextInput, Platform, StatusBar } from "react-native";

import AnimatedCone from "../animations/AnimatedCone";
import AnimatedLogo from "../animations/AnimatedLogo";
import AppButton from "../components/AppButton";
import AuthContext from "../auth/context";
import colors from "../config/colors";
import EmailIcon from "../components/EmailIcon";
import PasswordIcon from "../components/PasswordIcon";

function LoginScreen({ onLogin, navigation }) {
  const authContext = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />

      <View style={styles.container2}>
        <View style={styles.textContainer}>
          <AnimatedLogo />
        </View>

        <View style={styles.lottiContainer}>
          <View style={styles.lotti}>
            <AnimatedCone />
          </View>
        </View>
      </View>
      <View style={styles.container3}>
        <View style={styles.formStyle}>
          <View style={styles.form}>
            <View style={styles.iconInput}>
              <EmailIcon />
              <TextInput
                placeholder="Email      "
                placeholderTextColor={colors.green}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="email"
                textContentType="emailAddress"
                style={styles.input}
                underlineColorAndroid="transparent"
              ></TextInput>
            </View>
            <View style={styles.iconInput}>
              <PasswordIcon />
              <TextInput
                placeholder="Password   "
                placeholderTextColor={colors.green}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                name="password"
                textContentType="password"
                style={styles.input}
              ></TextInput>
            </View>
          </View>
          <View style={styles.button}>
            <AppButton
              title="Login"
              onPress={() => authContext.setUser("LoggedIn")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container2: {
    flex: 0.4,
    backgroundColor: colors.green,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  container3: {
    flex: 0.6,
    justifyContent: "space-between",
  },
  textContainer: {
    alignItems: "center",
    marginTop: -60,
  },
  button: { width: "70%" },
  header: {
    color: colors.white,
    fontSize: 45,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
  },
  tagline: {
    color: colors.white,
    fontSize: 20,
    fontStyle: "italic",
  },
  lottiContainer: {
    height: "75%",
  },
  lotti: {
    height: "100%",
    width: "100%",
  },
  form: {
    width: "70%",
  },
  formStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "20%",
  },

  input: {
    color: colors.green,
    fontSize: 20,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    padding: 5,
    backgroundColor: colors.white,
  },
  iconInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.green,
    marginVertical: 8,
    backgroundColor: colors.white,
  },
});

export default LoginScreen;
