import React, { useContext } from "react";
import { View, StyleSheet, TextInput, Platform, StatusBar } from "react-native";
import AppButton from "../components/AppButton";
import PasswordIcon from "../components/PasswordIcon";
import AnimatedCone from "../animations/AnimatedCone";
import EmailIcon from "../components/EmailIcon";
import AuthContext from "../auth/context";
import AnimatedLogo from "../animations/AnimatedLogo";

function LoginScreen({ onLogin, navigation }) {
  const authContext = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B8381" />

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
                placeholder="Email              "
                placeholderTextColor="#1B8381"
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
                placeholder="Password     "
                placeholderTextColor="#1B8381"
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
    backgroundColor: "#1B8381",
    backgroundColor: "#ffffff",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container2: {
    flex: 0.4,
    backgroundColor: "#ffffff",
    backgroundColor: "#1B8381",
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
    color: "#1B8381",
    color: "#ffffff",
    fontSize: 45,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
  },
  tagline: {
    color: "#ffffff",
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
    color: "#1B8381",
    fontSize: 20,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    padding: 5,
    backgroundColor: "#ffffff",
  },
  iconInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#1B8381",
    marginVertical: 8,
    backgroundColor: "#ffffff",
  },
});

export default LoginScreen;
