import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function ZoomOutIcon({ onZoomOut }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onZoomOut}>
        <MaterialIcons
          name="remove-circle"
          color="#000000"
          color={colors.green}
          size={35}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ZoomOutIcon;

// function CurrentLocationButton(props) {
//   const bottom = props.bottom ? props.bottom : 65;
//   //   const cb = props.cb
//   //     ? props.cb
//   //     : () =>
//   //         console.log("Callback function not passed to CurrentLocationButton.");

//   return (
//     <View style={[styles.container, { top: HEIGHT - bottom }]}>
//       <MaterialIcons
//         name="my-location"
//         color="#000000"
//         size={25}
//         onPress={props.onReCenter}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     zIndex: 9,
//     position: "absolute",
//     height: 45,
//     width: 45,
//     backgroundColor: "#fff",
//     left: WIDTH - 70,
//     borderRadius: 50,
//     shadowColor: "#000000",
//     elevation: 7,
//     shadowRadius: 5,
//     shadowOpacity: 1.0,
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
// });

// export default CurrentLocationButton;
