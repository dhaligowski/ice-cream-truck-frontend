import React, { useContext } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";

import AppButtonLight from "../components/AppButtonLight";
import AppButtonDark from "../components/AppButtonDark";
import AuthContext from "../auth/context";
import colors from "../config/colors";
import Logo from "../components/Logo";
import LottiIceCream from "../components/LottiIceCream";
import LottiType from "../components/LottiType";
import TruckLocation from "../components/TruckLocation";

function ChooseLoginType({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />
      <View style={styles.header}>
        <View style={styles.logo}>
          <Logo />
        </View>
      </View>
      <View style={styles.container3}>
        <View style={styles.row}>
          <LottiType>
            <TruckLocation />
          </LottiType>
          <View style={styles.driverButton}>
            <AppButtonLight
              title="Driver"
              onPress={() => navigation.navigate("MapScreen")}
            />
          </View>
        </View>
        <View style={styles.row}>
          <LottiType>
            <LottiIceCream />
          </LottiType>

          <View style={styles.driverButton}>
            <AppButtonLight
              title="Customer"
              onPress={() => navigation.navigate("CustomerScreen")}
            />
          </View>
        </View>

        <View style={styles.driverButtonLg}>
          <AppButtonDark
            title="View Demo"
            onPress={() => navigation.navigate("DemoScreen")}
          />
        </View>
        <View style={styles.driverButtonLg}>
          <AppButtonDark title="Logout" onPress={() => setUser(null)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flex: 0.4,
    backgroundColor: colors.green,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logo: { alignItems: "center", marginTop: -60 },
  headerText: {
    color: colors.white,
    fontSize: 30,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
  },
  bodytext: {
    color: colors.green,
    fontSize: 30,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
  },
  container3: {
    flex: 0.6,
    justifyContent: "space-around",
    alignItems: "center",
  },
  driverButton: {
    width: "40%",
    marginVertical: 20,
    borderWidth: 3,
    borderColor: colors.green,
    borderRadius: 25,
  },
  driverButtonLg: {
    width: "75%",
    marginVertical: 20,
  },
  customer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ChooseLoginType;
