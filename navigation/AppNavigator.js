import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChooseLoginType from "../screens/ChooseLoginType";
import CustomerScreen from "../screens/CustomerScreen";
import DemoScreen from "../screens/DemoScreen";
import MapScreen from "../screens/MapScreen";

const Stack = createNativeStackNavigator();
const AppNaviator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ChooseLoginType"
      component={ChooseLoginType}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MapScreen"
      component={MapScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CustomerScreen"
      component={CustomerScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="DemoScreen"
      component={DemoScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AppNaviator;
