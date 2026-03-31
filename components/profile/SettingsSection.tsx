import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function SettingsSection() {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const colorScheme = useColorScheme() ?? 'light';

  const { logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <View className="px-4 mb-6">
      <Text className="text-xs font-semibold mb-3 tracking-wider" style={{ color: iconColor }}>
        SETTINGS
      </Text>

      {/* Notification Settings */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 mb-2 rounded-xl"
        style={{ backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }}
      >
        <View className="flex-row items-center">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f3f4f6' }}
          >
            <Ionicons name="notifications-outline" size={20} color={textColor} />
          </View>
          <Text className="text-base" style={{ color: textColor }}>
            Notification Settings
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </TouchableOpacity>

      {/* Privacy & Security */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 mb-2 rounded-xl"
        style={{ backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }}
      >
        <View className="flex-row items-center">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f3f4f6' }}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={textColor} />
          </View>
          <Text className="text-base" style={{ color: textColor }}>
            Privacy & Security
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </TouchableOpacity>

      {/* Help & Support */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 mb-2 rounded-xl"
        style={{ backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }}
      >
        <View className="flex-row items-center">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f3f4f6' }}
          >
            <Ionicons name="help-circle-outline" size={20} color={textColor} />
          </View>
          <Text className="text-base" style={{ color: textColor }}>
            Help & Support
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={iconColor} />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 px-4 rounded-xl"
        style={{ backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }}
      >
        <Pressable onPress={handleLogout}>
          <View className="flex-row items-center">
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f3f4f6' }}
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </View>
            <Text className="text-base text-red-500">
              Logout
            </Text>
          </View>
        </Pressable>
      </TouchableOpacity>
    </View>
  );
}
