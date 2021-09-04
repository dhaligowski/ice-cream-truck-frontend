import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Animated,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import apiURL from "../config/api";
import AuthContext from "../auth/context";
import colors from "../config/colors";
import LogoutButton from "../components/LogoutButton";
import LottiLocation from "../components/LottiLocation";
import ZoomInIcon from "../components/ZoomInIcon";
import ZoomOutIcon from "../components/ZoomOutIcon";

let ZOOM = { zoomValue: 16 };

function CustomerScreen({ onLogin, navigation }) {
  const mapRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const toggleAnimation = useRef(false);
  const ws = useRef(null);
  const { user, setUser } = useContext(AuthContext);
  const [location, setLocation] = useState({
    coords: { latitude: 0, longitude: 0 },
  });

  useEffect(() => {
    let webSocket = new WebSocket(apiURL);
    ws.current = webSocket;

    ws.current.onopen = () => {
      ws.current.onmessage = (e) => {
        if (JSON.parse(e.data) === false) {
          alert(
            "No driver currently logged in, please log in as a driver or select demo."
          ); //alert and exit if no dirver exists
          navigation.navigate("ChooseLoginType");
        }
        if (JSON.parse(e.data) !== true && JSON.parse(e.data) !== false) {
          let updatedLocation = JSON.parse(e.data);
          setLocation(updatedLocation);
          handleShakeLocationAnimation();
        }
      };
    };

    ws.current.onclose = (e) => {
      console.log("connection closed", e.code, e.reason);
    };
    return () => ws.current.close();
  }, []);

  const animateZoomIn = () => {
    ZOOM.zoomValue += 0.5;
    mapRef.current.animateCamera(
      {
        center: location.coords,
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: 13,
        // Only when using Google Maps.
        zoom: ZOOM.zoomValue,
      },
      { duration: 500 }
    );
  };

  const animateZoomOut = () => {
    ZOOM.zoomValue -= 0.5;
    mapRef.current.animateCamera(
      {
        center: location.coords,
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: 13,
        // Only when using Google Maps.
        zoom: ZOOM.zoomValue,
      },
      { duration: 500 }
    );
  };

  const handleShakeLocationAnimation = () => {
    const animationValue = toggleAnimation.current ? 0 : 1;
    Animated.timing(progress, {
      toValue: animationValue,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    toggleAnimation.current = !toggleAnimation.current;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />
      <View style={styles.header}>
        <View style={styles.lottiContainer}>
          <View style={styles.lotti}>
            <LottiLocation progress={progress} />
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {location.coords.latitude !== 0
                ? `${location.addressName} ${location.addressStreet}
          ${location.addressCity}, ${location.addressRegion}`
                : `acquiring location...`}
            </Text>
          </View>
        </View>
        <View style={styles.road}>
          <Image source={require("../assets/road-variant48.png")} />
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          scrollEnabled={false}
          loadingEnabled
          zoomEnabled={false}
          ref={mapRef}
          camera={{
            center: location.coords,
            pitch: 0,
            heading: 0,
            // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
            altitude: ZOOM.zoomValue,
            // Only when using Google Maps.
            zoom: ZOOM.zoomValue,
          }}
          showCompass={true}
          rotateEnabled={false}
          showsMyLocationButton={true}
          style={styles.map}
          // onRegionChangeComplete={(e) => handleUserMoveMap(e)}
          provider={MapView.PROVIDER_GOOGLE}
          // onMapReady={() => mapRef}
        >
          {location ? (
            <Marker
              coordinate={location.coords}
              title={"NorthSide Ice Cream"}
              description={"Ice Cream and Treats!"}
              image={require("../assets/north-side.png")}
              style={styles.cone}
            />
          ) : null}
        </MapView>
      </View>

      <View style={styles.logoutButton}>
        <LogoutButton title="Logout" onPress={() => setUser(null)} />
      </View>
      <View style={styles.zoomIn}>
        <ZoomInIcon onZoomIn={animateZoomIn} />
      </View>
      <View style={styles.zoomOut}>
        <ZoomOutIcon onZoomOut={animateZoomOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.green,
  },
  addressContainer: { width: "75%" },
  lottiContainer: {
    flexDirection: "row",
    height: "40%",
  },
  lotti: {
    height: "100%",
    width: "20%",
  },
  addressText: { color: colors.white, fontSize: 24, fontWeight: "bold" },
  header: {
    height: "15%",
    width: "100%",
    backgroundColor: colors.green,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    top: 25,
    zIndex: 100,
  },
  container3: {
    backgroundColor: colors.green,
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  mapContainer: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  body: {
    height: "50%",
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 25,
    elevation: 20,
  },
  logoutButton: {
    position: "absolute",
    top: "90%",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
  },
  button: { width: "70%" },
  road: {
    justifyContent: "flex-start",
    top: "-10%",
    right: "37.5%",
  },
  zoomIn: {
    position: "absolute",
    top: "65%",
    right: "10%",
    elevation: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.green,
  },
  zoomOut: {
    position: "absolute",
    top: "75%",
    right: "10%",
    elevation: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.green,
  },
});
export default CustomerScreen;
