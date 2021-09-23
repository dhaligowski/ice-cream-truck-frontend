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
import NetInfo from "@react-native-community/netinfo";

import AuthContext from "../auth/context";
import colors from "../config/colors";
import demoRoute from "../data/demoRoute";
import LogoutButton from "../components/LogoutButton";
import LottiLocation from "../components/LottiLocation";
import ZoomInIcon from "../components/ZoomInIcon";
import ZoomOutIcon from "../components/ZoomOutIcon";

import standard from "../mapstyles/standard.json";
import aubergine from "../mapstyles/aubergine.json";
import dark from "../mapstyles/dark.json";
import retro from "../mapstyles/retro.json";
import night from "../mapstyles/night.json";

const DELTA = 0.005;
let ZOOM = { zoomValue: 16 };
Route_Speed = 1500;

function MapScreen(props) {
  const index = useRef(0);
  const [mapKey, setMapKey] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null);

  const [mapStyle, setMapStyle] = useState({
    style: standard,
    name: "Standard",
  });

  const progress = useRef(new Animated.Value(0)).current;
  const toggleAnimation = useRef(false);

  const coordinate = useRef(
    new AnimatedRegion({
      latitude: demoRoute[0].latitude,
      longitude: demoRoute[0].longitude,
      latitudeDelta: DELTA,
      longitudeDelta: DELTA,
    })
  );
  const { setUser } = useContext(AuthContext);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        alert(
          "No internet connection detected. Please reconnect and try again."
        );
        setUser(null);
      } else setIsConnected(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded || !isConnected) return;
    let i = 0;
    let interval;

    let timer = setTimeout(() => {
      interval = setInterval(() => {
        cameraAnimate(index.current);
        animateMarker(demoRoute[index.current]);
        setAddress(demoRoute[index.current]);
        handleShakeLocationAnimation();
        index.current++;
        if (index.current >= demoRoute.length) {
          index.current = 0;
        }
      }, Route_Speed);
    }, 2000);
    return () => (clearInterval(interval), clearTimeout(timer));
  }, [isLoaded, isConnected]);

  const animateMarker = (coords) => {
    const newCoordinate = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    coordinate.current.timing(newCoordinate).start();
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
        // center: { latitude: address.latitude, longitude: address.longitude },
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
        // center: { latitude: address.latitude, longitude: address.longitude },
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

  const handleMode = () => {
    if (mapStyle.style === standard) {
      setMapStyle({ style: night, name: "Night" });
    }
    if (mapStyle.style === night) {
      setMapStyle({ style: dark, name: "Dark" });
    }
    if (mapStyle.style === dark) {
      setMapStyle({ style: retro, name: "Retro" });
    }
    if (mapStyle.style === retro) {
      setMapStyle({ style: aubergine, name: "Aubergine" });
    }
    if (mapStyle.style === aubergine) {
      setMapStyle({ style: standard, name: "Standard" });
    }

    setMapKey(!mapKey);
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
      <View style={styles.mapstyleButton}>
        <LogoutButton title={mapStyle.name} onPress={handleMode} />
      </View>
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
          scrollEnabled={true}
          loadingEnabled={false}
          zoomEnabled={true}
          ref={mapRef}
          initialCamera={{
            center: {
              latitude: demoRoute[index.current].latitude,
              longitude: demoRoute[index.current].longitude,
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
          // onMapReady={() => mapRef.current}
          onMapReady={() => setIsLoaded(true)}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={mapStyle.style}
          key={mapKey}
        >
          {coordinate.current ? (
            <Marker.Animated
              coordinate={coordinate.current}
              title={"NorthSide Ice Cream"}
              description={"Ice Cream and Treats!"}
              image={require("../assets/north-side.png")}
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
    backgroundColor: "#ffffff",
    borderRadius: 25,
    elevation: 20,
  },
  logoutButton: {
    position: "absolute",
    top: "90%",
    left: "65%",
  },
  mapstyleButton: {
    position: "absolute",
    top: "25%",
    left: "65%",
    zIndex: 1,
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
export default MapScreen;
