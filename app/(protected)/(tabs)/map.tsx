import CategoryButtons from "@/components/map/CategoryButtons";
import Header from "@/components/map/Header";
import ItemBottomSheet from "@/components/map/ItemBottomSheet";
import MapControls from "@/components/map/MapControl";
import RecentlyFoundItems from "@/components/map/RecentlyFoundItems";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useItemsActions } from "@/hooks/useItemsActions";
import { useMapLocation } from "@/hooks/useMapLocations";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LostItem {
  id: string;
  name: string;
  posterId: string;
  posterName: string;
  category: string;
  location: number[];
  buildingName: string;
  createdAt: Date;
}

export default function CampusMapScreen() {
  const { mapRef, handleUserLocation, handleInitialLocation, getBuildingName } =
    useMapLocation();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const backgroundColor = useThemeColor({}, "background");
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [initialPosition, setInitialPosition] = useState({
    latitude: 33.8808,
    longitude: -117.885,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const { user } = useAuth();

  const { getAllItems } = useItemsActions();

  const filteredItems =
    selectedCategory === null
      ? lostItems
      : lostItems.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();

    const loadItems = async () => {
      const items = await getAllItems();
      setLostItems(items);
    };

    loadItems();
  }, []);

  let text = "Waiting...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    [],
  );

  return (
    <View
      className="flex-1"
      style={{ backgroundColor, paddingTop: inset.top - 40 }}
    >
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <CategoryButtons
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View className="flex-1">
        {/* Map View */}
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={initialPosition}
          showsMyLocationButton={false}
          showsUserLocation={true}
          showsCompass={false}
          provider="google"
          showsIndoors={true}
          showsBuildings={true}
          mapType="hybrid"
        >
          {filteredItems.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.location[0],
                longitude: item.location[1],
              }}
              onPress={async () => {
                setSelectedItem(item);
                bottomSheetRef.current?.expand();
              }}
            />
          ))}
        </MapView>
        {/* Placeholder for recently found items*/}
        <RecentlyFoundItems />
        {/* User Location & Initial Location Buttons */}
        <MapControls
          onUserLocation={handleUserLocation}
          onInititalLocation={handleInitialLocation}
        />
        {selectedItem && (
          <ItemBottomSheet
            bottomSheetRef={bottomSheetRef}
            renderBackdrop={renderBackdrop}
            selectedItem={selectedItem}
            currentUser={user}
            router={router}
          />
        )}
      </View>
    </View>
  );
}
