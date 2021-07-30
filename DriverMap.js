import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, {
  AnimatedRegion,
  MarkerAnimated,
  Marker,
} from "react-native-maps";
import * as Location from "expo-location";

const duration = 500;
let LATITUDE = null;
let LONGITUDE = null;
const delta = 0.005;

function App(props) {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  // const [coordinate, setCoordinate] = useState({
  //   coordinate: new AnimatedRegion({
  //     latitude: LATITUDE,
  //     longitude: LONGITUDE,
  //   }),
  // });
  const [errorMsg, setErrorMsg] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const marker = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        // latitudeDelta: 0.0125,
        // longitudeDelta: 0.0125,
        latitudeDelta: delta,
        longitudeDelta: delta,
      };
      // setCoordinate({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      // });
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setRegion(region);
      marker.current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      // console.log("marker", marker.current);
      // console.log("region", region);
    })();
  }, [location]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    // text = JSON.stringify(location);
    // text = `latitude: ${location.coords.latitude}, longitude: ${location.coords.longitude}`;
    text = `latitude: ${coordinates.latitude}, longitude: ${coordinates.longitude}`;
    // console.log("latitude", location.coords.latitude);
    // console.log("longatude", location.coords.longitude);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {text}
        {/* {coordinates.current.latitude} {coordinates.current.longitude} */}
      </Text>
      <MapView
        initialRegion={region}
        // showsUserLocation={true}
        showCompass={true}
        rotateEnabled={false}
        showsMyLocationButton={true}
        style={styles.map}
      >
        {marker.current ? (
          <Marker
            coordinate={marker.current}
            // coordinate={{
            //   latitude: location.coords.latitude,
            //   longitude: location.coords.longitude,
            // }}
            title={"My Made Up location"}
            description={"I made this up!!!!!"}
            image={require("./assets/cone2.png")}
            style={styles.cone}
          />
        ) : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
  },
  map: {
    flex: 1,
  },
  cone: {
    height: 10,
    width: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
  },
});
export default App;
