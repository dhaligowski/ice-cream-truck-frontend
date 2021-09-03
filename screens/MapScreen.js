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
import ZoomInIcon from "../components/ZoomInIcon";
import ZoomOutIcon from "../components/ZoomOutIcon";
import LottiLocation from "../components/LottiLocation";
import LogoutButton from "../components/LogoutButton";
import AuthContext from "../auth/context";
import apiURL from "../config/api";

const delta = 0.005;
let ZOOM = { zoomValue: 16 };

function MapScreen({ navigation }) {
  const [address, setAddress] = useState([]);
  const [camera, setCamera] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const prevAddress = useRef(null);
  const progress = useRef(new Animated.Value(0)).current;
  const toggleAnimation = useRef(false);
  const ws = useRef(null);
  const { user, setUser } = useContext(AuthContext);

  const coordinate = useRef(
    new AnimatedRegion({
      latitude: 42.884632,
      longitude: -83.6061515,
      latitudeDelta: delta,
      longitudeDelta: delta,
    })
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied", errorMsg);
        alert("Please allow user-location permissions1.");
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
        location = await Location.getCurrentPositionAsync({ accuracy: 1 });
      } catch (error) {
        alert("Please allow user-location permissions2.");
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

      setMarkerCoords({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      });

      coordinate.current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta,
      };

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
          console.log("parseEdata", JSON.parse(e.data));
          if (JSON.parse(e.data) === false) {
            alert(
              //if driver is already in, exit
              "A driver is already signed in, or you have been logged out as a driver after 10 minutes."
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
          distanceInterval: 1,
        },
        (loc) => handleUpdate(loc)
      );

      return currentPosition.remove;
    })();
    // if (ws.current !== null)
    return () => ws.current.close();
  }, []);

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

    setMarkerCoords({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    let currentAddress = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (prevAddress.current[0].name === currentAddress[0].name) return; //Address not new
    handleShakeLocationAnimation();
    prevAddress.current = currentAddress;
    setAddress(currentAddress);

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

  // const animateMarker = (coords) => {
  //   const newCoordinate = {
  //     latitude: coords.latitude,
  //     longitude: coords.longitude,
  //   };
  //   console.log("newCoord", newCoordinate);
  //   console.log("coord.current", coordinate.current);
  //   coordinate.current.timing(newCoordinate).start();
  //   // markerRef.current.animateMarkerToCoordinate(newCoordinate, 200);//Android only
  // };

  const animateZoomIn = () => {
    ZOOM.zoomValue += 0.5;
    mapRef.current.animateCamera(
      {
        center: {
          latitude: markerCoords.latitude,
          longitude: markerCoords.longitude,
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
          latitude: markerCoords.latitude,
          longitude: markerCoords.longitude,
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B8381" />

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
          scrollEnabled={false}
          loadingEnabled={false}
          zoomEnabled={false}
          ref={mapRef}
          camera={camera}
          showCompass={true}
          rotateEnabled={false}
          showsMyLocationButton={true}
          style={styles.map}
          // onMapReady={() => mapRef}
          // onRegionChangeComplete={(e) => handleUserMoveMap(e)}
          provider={MapView.PROVIDER_GOOGLE}
        >
          {markerCoords ? (
            <Marker
              coordinate={markerCoords}
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
    backgroundColor: "#1B8381",
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
  addressText: { color: "#ffffff", fontSize: 24, fontWeight: "bold" },
  header: {
    height: "15%",
    width: "100%",
    backgroundColor: "#1B8381",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    top: 25,
    zIndex: 100,
  },
  container3: {
    backgroundColor: "#1B8381",
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
    borderColor: "#1B8381",
  },
  zoomOut: {
    position: "absolute",
    top: "75%",
    right: "10%",
    elevation: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#1B8381",
  },
});
export default MapScreen;
