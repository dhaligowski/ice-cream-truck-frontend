import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import AuthNaviator from "./navigation/AuthNavigator";
import AppNaviator from "./navigation/AppNavigator";
import AuthContext from "./auth/context";

function App(props) {
  const [user, setUser] = useState();
  const [driver, setDriver] = useState(false);

  return (
    <View style={styles.container}>
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer>
          {user ? <AppNaviator /> : <AuthNaviator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
