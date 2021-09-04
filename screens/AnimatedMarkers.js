//Helper screen to test markers and map and get GPS coords for demo routes
import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import MapView, { Marker, AnimatedRegion } from "react-native-maps";

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function AnimatedMarkers(props) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const coordinate = useRef(
    new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
  );
  const coordinate2 = {
    latitude: LATITUDE - 0.005,
    longitude: LONGITUDE - 0.005,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const animateToCoordinate = (lat, long) => {
    mapRef.current.animateCamera(
      {
        center: {
          latitude: lat,
          longitude: long,
        },
        pitch: 0,
        heading: 0,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: 13,
        // Only when using Google Maps.
        zoom: 13,
      },

      { duration: 1000 }
    );
  };

  const animateMarker = () => {
    const newCoordinate = {
      latitude: LATITUDE + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
      longitude: LONGITUDE + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
    };
    console.log("coord.current", coordinate.current);
    coordinate.current.timing(newCoordinate).start();
    // markerRef.current.animateMarkerToCoordinate(newCoordinate, 200);//Android Only
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        camera={{
          center: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
          },
          pitch: 0,
          heading: 0,
          // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
          altitude: 13,
          // Only when using Google Maps.
          zoom: 13,
        }}
      >
        <Marker.Animated coordinate={coordinate.current} />
        <Marker
          coordinate={coordinate2}
          draggable
          onDragEnd={(e) => console.log("e", e.nativeEvent.coordinate)}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            animateToCoordinate(LATITUDE + 0.005, LONGITUDE + 0.005)
          }
          style={[styles.bubble, styles.button]}
        >
          <Text>Animate Camera</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={animateMarker}
          style={[styles.bubble, styles.button]}
        >
          <Text>Animate Marker</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});

export default AnimatedMarkers;
