import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Animated,
  Image,
} from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";

import AuthContext from "../auth/context";
import colors from "../config/colors";
import demoRoute from "../data/demoRoute";
import LogoutButton from "../components/LogoutButton";
import LottiLocation from "../components/LottiLocation";
// import ZoomInIcon from "../components/ZoomInIcon";
// import ZoomOutIcon from "../components/ZoomOutIcon";

const delta = 0.005;
let ZOOM = { zoomValue: 16 };
Route_Speed = 1500;

function MapScreen(props) {
  const mapRef = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);
  const toggleAnimation = useRef(false);

  const coordinate = useRef(
    new AnimatedRegion({
      latitude: 37.7896963150624,
      longitude: -122.39012774080038,
      latitudeDelta: delta,
      longitudeDelta: delta,
    })
  );
  const { setUser } = useContext(AuthContext);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    let i = 0;

    if (mapRef.current !== null) {
      let interval = setInterval(() => {
        cameraAnimate(i);
        animateMarker(demoRoute[i]);
        setAddress(demoRoute[i]);
        handleShakeLocationAnimation();
        i++;
        if (i >= demoRoute.length) i = 0;
      }, Route_Speed);
      return () => clearInterval(interval);
    }
  }, [mapRef.current]);

  const animateMarker = (coords) => {
    const newCoordinate = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    coordinate.current.timing(newCoordinate, 3000).start();
  };

  const cameraAnimate = (i) => {
    mapRef.current.animateCamera(
      {
        center: {
          latitude: demoRoute[i].latitude,
          longitude: demoRoute[i].longitude,
        },
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: ZOOM.zoomValue,
        // Only when using Google Maps.
        zoom: ZOOM.zoomValue,
      },
      { duration: 1500 }
    );
  };

  const animateZoomIn = () => {
    ZOOM.zoomValue += 0.5;
    mapRef.current.animateCamera(
      {
        center: { latitude: address.latitude, longitude: address.longitude },
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: ZOOM.zoomValue,
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
        center: { latitude: address.latitude, longitude: address.longitude },
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: 25,
        // Only when using Google Maps.
        zoom: ZOOM.zoomValue,
      },
      { duration: 500 }
    );
  };

  // const handleUserMoveMap = (e) => {
  //   console.log("e", e);
  // };

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
              {address
                ? `${address.addressName} ${address.addressStreet}
          ${address.addressCity}, ${address.addressRegion}`
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
          //   scrollEnabled={false}
          loadingEnabled={false}
          //   zoomEnabled={false}
          ref={mapRef}
          camera={{
            center: {
              latitude: demoRoute[0].latitude,
              longitude: demoRoute[0].longitude,
            },
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
          onMapReady={() => mapRef.current}
          provider={MapView.PROVIDER_GOOGLE}
        >
          {coordinate.current ? (
            <Marker.Animated
              coordinate={coordinate.current}
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
    backgroundColor: "#ffffff",
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
  road: {
    justifyContent: "flex-start",
    top: "-10%",
    right: "37.5%",
  },
  // zoomIn: {
  //   position: "absolute",
  //   top: "65%",
  //   right: "10%",
  //   elevation: 12,
  //   borderRadius: 25,
  //   borderWidth: 1, colors.green
  //   borderColor: ,
  // },
  // zoomOut: {
  //   position: "absolute",
  //   top: "75%",
  //   right: "10%",
  //   elevation: 12,
  //   borderRadius: 25,
  //   borderWidth: 1,
  //   borderColor:  colors.green,
  // },
});
export default MapScreen;
