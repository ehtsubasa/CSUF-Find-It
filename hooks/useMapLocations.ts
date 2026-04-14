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

  const BAD_KEYWORDS = ["department", "office", "program", "division", "unit"];

  const getBuildingName = async (lat: number, lng: number) => {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || "",
          "X-Goog-FieldMask":
            "places.displayName,places.types,places.primaryType",
        },
        body: JSON.stringify({
          locationRestriction: {
            circle: {
              center: {
                latitude: lat,
                longitude: lng,
              },
              radius: 50,
            },
          },
        }),
      },
    );

    const data = await res.json();

    if (!data.places || data.places.length === 0) return "Unknown Location";

    const filtered = data.places.filter((place: any) => {
      const name = place.displayName?.text?.toLowerCase() || "";

      // return false if it doesn't contain any of the good types
      return !BAD_KEYWORDS.some((word) => name.includes(word));
    });

    if (filtered.length > 0) {
      return filtered[0].displayName?.text;
    }

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
