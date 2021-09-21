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
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";

import apiURL from "../config/api";
import AuthContext from "../auth/context";
import colors from "../config/colors";
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
const DISTANCE_INTERVAL = 3;

function MapScreen({ navigation }) {
  const [address, setAddress] = useState([]);
  const [camera, setCamera] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [mapKey, setMapKey] = useState(true);
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState({
    style: standard,
    name: "Standard",
  });
  const prevAddress = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const toggleAnimation = useRef(false);
  const ws = useRef(null);
  const { user, setUser } = useContext(AuthContext);

  const coordinate = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: DELTA,
      longitudeDelta: DELTA,
    })
  );

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
    if (!isConnected) return;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied", errorMsg);
        alert(
          "Please turn on location services and grant permission-101.  Clear the Expo data and cache if issues persist."
        );
        let webSocket = new WebSocket(apiURL);
        ws.current = webSocket;
        setUser(null);
        return;
      }

      // current issue with getCurrentPositionAsync() not working so the
      // try/catch with getLastKnownPositionAsync() is a work around until
      // it is working..
      //Another solution is to add {accuracy:1} as option
      //https://github.com/expo/expo/issues/9377
      //https://github.com/expo/expo/issues/5504

      // let location;

      // try {
      //   location = await Location.getCurrentPositionAsync({
      //     accuracy: Location.Accuracy.BestForNavigation,
      //     LocationActivityType: Location.ActivityType.OtherNavigation,
      //     maximumAge: 5000,
      //     timeout: 15000,
      //   });
      // } catch {
      //   location = await Location.getLastKnownPositionAsync({
      //     accuracy: Location.Accuracy.BestForNavigation,
      //     LocationActivityType: Location.ActivityType.OtherNavigation,
      //     maxAge: 5000,
      //     timeout: 15000,
      //   });
      // }

      // let location = await Location.getCurrentPositionAsync({});
      let location;

      try {
        // console.log("try");
        // location = await Location.getLastKnownPositionAsync({
        //   //temp fix..
        //   accuracy: Location.Accuracy.BestForNavigation,
        //   LocationActivityType: Location.ActivityType.OtherNavigation,
        // });
        //location = await Location.getCurrentPositionAsync({ accuracy: 1 });
        location = await Location.getCurrentPositionAsync({ accuracy: 1 });
      } catch (error) {
        // console.log("error");
        if (
          error.message ==
          "Location provider is unavailable. Make sure that location services are enabled."
        ) {
          // console.log("if message");
          // call the function again function
          location = await Location.getLastKnownPositionAsync({});
        }

        // alert(
        //   "Please turn on location services and grant permission-102.  Clear the Expo data and cache if issues persist."
        // );
        // let webSocket = new WebSocket(apiURL);
        // ws.current = webSocket;
        // setUser(null);
        // return;
      }

      if (!location) {
        alert(
          "Please turn on location services and grant permission-103.  Clear the Expo data and cache if issues persist."
        );
        let webSocket = new WebSocket(apiURL);
        ws.current = webSocket;
        setUser(null);
        return;
      }

      setCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: ZOOM.zoomValue,
        // Only when using Google Maps.
        zoom: ZOOM.zoomValue,
      });

      coordinate.current
        .timing({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
        .start();

      let currentAddress = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setAddress(currentAddress);
      prevAddress.current = currentAddress;
      handleShakeLocationAnimation();

      let webSocket = new WebSocket(apiURL);
      ws.current = webSocket;

      ws.current.onopen = () => {
        ws.current.onmessage = (e) => {
          if (JSON.parse(e.data) === false) {
            alert(
              //if driver is already in, exit
              "Error: A driver is already logged in, or you have exceeded the 10 minute limit imposed on drivers. Thanks."
            );
            navigation.navigate("ChooseLoginType");
          }
        };

        ws.current.send(
          JSON.stringify({
            coords: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            addressName: currentAddress[0].name,
            addressStreet: currentAddress[0].street,
            addressCity: currentAddress[0].city,
            addressRegion: currentAddress[0].region,
          })
        );

        ws.current.onclose = (e) => {
          console.log("connection closed", e.code, e.reason);
        };
      };

      let currentPosition = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: DISTANCE_INTERVAL,
        },
        (loc) => handleUpdate(loc)
      );

      return currentPosition.remove;
    })();
    return () => ws.current.close();
  }, [isConnected]);

  const handleUpdate = async (loc) => {
    if (mapRef.current === null) return; //exits if logout or app put in background

    mapRef.current.animateCamera(
      {
        center: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: ZOOM.zoomValue,
        // Only when using Google Maps.
        zoom: ZOOM.zoomValue,
      },
      { duration: 1000 }
    );
    coordinate.current
      .timing({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      .start();

    setCamera({
      center: {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      },
      pitch: 0,
      heading: 0,
      // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
      altitude: ZOOM.zoomValue,
      // Only when using Google Maps.
      zoom: ZOOM.zoomValue,
    });

    let currentAddress = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (prevAddress.current[0].name !== currentAddress[0].name) {
      handleShakeLocationAnimation();
      prevAddress.current = currentAddress;
      setAddress(currentAddress);
    }

    ws.current.send(
      JSON.stringify({
        coords: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
        addressName: currentAddress[0].name,
        addressStreet: currentAddress[0].street,
        addressCity: currentAddress[0].city,
        addressRegion: currentAddress[0].region,
      })
    );
  };

  const animateZoomIn = () => {
    ZOOM.zoomValue += 0.5;
    mapRef.current.animateCamera(
      {
        center: {
          latitude: camera.center.latitude,
          longitude: camera.center.longitude,
        },

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
        center: {
          latitude: camera.center.latitude,
          longitude: camera.center.longitude,
        },

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
              {address.length
                ? `${address[0].name} ${address[0].street}
          ${address[0].city}, ${address[0].region}`
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
          initialCamera={camera}
          showCompass={true}
          rotateEnabled={false}
          showsMyLocationButton={true}
          style={styles.map}
          // onMapReady={() => mapRef}
          // onRegionChangeComplete={(e) => handleUserMoveMap(e)}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={mapStyle.style}
          key={mapKey}
        >
          {mapRef ? (
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
    backgroundColor: colors.white,
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
export default MapScreen;
