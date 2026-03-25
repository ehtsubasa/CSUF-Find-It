import { useThemeColor } from "@/hooks/use-theme-color";
import { timeAgo } from "@/hooks/useTime";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

export default function ItemBottomSheet({
  bottomSheetRef,
  renderBackdrop,
  selectedItem,
  currentUser,
  router,
  createdAt,
}: any) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const buttonBackgroundColor = useThemeColor({}, "buttonBackground");

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["53%"]}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor }}
    >
      <BottomSheetView className="flex-1 mx-4 gap-7">
        <View className="flex-row items-center gap-4">
          <Image
            source="https://picsum.photos/seed/696/3000/2000"
            contentFit="cover"
            transition={1000}
            style={{ width: 64, height: 64, borderRadius: 8 }}
          />
          <View className="flex-1">
            <Text className="text-blue-600 font-semibold">
              FOUND{" "}
              {timeAgo(selectedItem.createdAt, {
                upperCase: true,
                recentLabel: "recently",
              })}
            </Text>
            <Text className="font-bold text-3xl" style={{ color: textColor }}>
              {selectedItem.name}
            </Text>
            <Text className="text-gray-600" style={{ color: textColor }}>
              {selectedItem.buildingName || "Unknown"}
            </Text>
          </View>
          <Ionicons name="bookmark-outline" size={22} color={iconColor} />
        </View>
        <View
          className="flex-row rounded-lg p-5 items-center gap-4"
          style={{
            backgroundColor: backgroundColor === "#fff" ? "#f3f4f6" : "#2a2a2a",
          }}
        >
          <Image
            source={{ uri: selectedItem.posterAvatar }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <View>
            <Text className="text-gray-600" style={{ color: textColor }}>
              Posted by
            </Text>
            <Text className="font-semibold" style={{ color: textColor }}>
              {selectedItem.posterId === currentUser.uid
                ? "You"
                : selectedItem.posterName}
            </Text>
          </View>
        </View>

        {selectedItem.posterId &&
          selectedItem.posterId !== currentUser?.uid && (
            <TouchableOpacity
              className="flex-row rounded-2xl p-5 items-center gap-2 justify-center"
              style={{ backgroundColor: buttonBackgroundColor }}
              onPress={() => {
                const chatId = [currentUser.uid, selectedItem.posterId]
                  .sort()
                  .join("_");

                router.push({
                  pathname: "/chat/[id]",
                  params: {
                    id: chatId,
                    otherUserId: selectedItem.posterId,
                    posterName: selectedItem.posterName,
                    posterAvatar: encodeURIComponent(selectedItem.posterAvatar),
                  },
                });
              }}
            >
              <Ionicons name="chatbox" size={24} color={iconColor} />
              <Text className="font-bold text-lg" style={{ color: textColor }}>
                Message Finder
              </Text>
            </TouchableOpacity>
          )}
      </BottomSheetView>
    </BottomSheet>
  );
}
