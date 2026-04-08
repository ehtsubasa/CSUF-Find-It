import CategoryButtons from "@/components/map/CategoryButtons";
import Header from "@/components/map/Header";
import ItemBottomSheet from "@/components/map/ItemBottomSheet";
import MapControls from "@/components/map/MapControl";
import RecentlyFoundItems from "@/components/map/RecentlyFoundItems";
import { useAuth } from "@/context/AuthContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useConversations } from "@/hooks/useConversations";
import { useItemsActions } from "@/hooks/useItemsActions";
import { useMapLocation } from "@/hooks/useMapLocations";
import { useNotifications } from "@/hooks/useNotifications";
import { useUserProfile } from "@/hooks/useUserProfile";
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
  photos: string[];
  posterId: string;
  posterName: string;
  posterAvatar: string;
  category: string;
  location: number[];
  buildingName: string;
  createdAt: Date;
}

export default function CampusMapScreen() {
  const { mapRef, handleUserLocation, handleInitialLocation } =
    useMapLocation();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const backgroundColor = useThemeColor({}, "background");
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const initialPosition = {
    latitude: 33.8808,
    longitude: -117.885,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);
  const { getAllItems, getBookmarkedItems } = useItemsActions();
  const { chatUsers } = useConversations(user);
  const {
    lastSeenAt,
    newItemsCount,
    claimedPostsCount,
    hasNotifications,
    markAllSeen,
  } = useNotifications(user);

  const unreadMessagesCount = chatUsers.reduce(
    (total, u) => total + u.unreadCount,
    0,
  );

  const filteredItems =
    selectedCategory === null
      ? lostItems
      : lostItems.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
    getAllItems().then(setLostItems);
  }, []);

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
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={hasNotifications}
        newItemsCount={newItemsCount}
        claimedPostsCount={claimedPostsCount}
        newMessagesCount={unreadMessagesCount}
        onNotificationDismiss={markAllSeen}
      />

      <CategoryButtons
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View className="flex-1">
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

        <RecentlyFoundItems
          lastSeenAt={lastSeenAt}
          currentUserId={user?.uid ?? ""}
          selectedCategory={selectedCategory}
          onSelectItem={(item) => {
            setSelectedItem({
              ...item,
              category: "",
              location: [0, 0],
            });
            bottomSheetRef.current?.expand();
          }}
        />

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
            isSaved={
              userProfile?.savedItems?.includes(selectedItem.id) ?? false
            }
          />
        )}
      </View>
    </View>
  );
}
