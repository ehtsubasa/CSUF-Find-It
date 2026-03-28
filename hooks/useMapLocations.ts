import * as Location from "expo-location";
import { useRef, useState } from "react";
import MapView from "react-native-maps";

export function useMapLocation() {
  const mapRef = useRef<MapView>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const initialPosition = {
    latitude: 33.8808,
    longitude: -117.885,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const handleUserLocation = async () => {
    try {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // move the map to user location
      if (mapRef.current && location) {
        mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      }
    } catch (error) {
      setErrorMsg("Error fetching location");
    }
  };

  // Move map to initial location on mount
  const handleInitialLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialPosition, 1000);
    }
  };

  const getBuildingName = async (lat: number, lng: number) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) return null;

    const result = data.results.find(
      (r: any) =>
        r.types.includes("premise") ||
        r.types.includes("establishment") ||
        r.types.includes("point_of_interest"),
    );

    if (result) return result.formatted_address;
    if (result.types.includes("plus_code")) return null;

    // fallback
    return data.results[0]?.formatted_address || null;
  };

  return {
    mapRef,
    errorMsg,
    location,
    handleUserLocation,
    handleInitialLocation,
    getBuildingName,
  };
}
