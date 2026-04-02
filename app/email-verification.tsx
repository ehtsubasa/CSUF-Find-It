import * as Linking from 'expo-linking';
import { ToastAndroid } from 'react-native';

export default function EmailVerification() {
    const url = Linking.useLinkingURL();
    ToastAndroid.show(`Deep link URL: ${url}`, ToastAndroid.LONG);
}