import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { magic } from "../config/magic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        const value = await AsyncStorage.getItem('hasLaunchedBefore');
        if (value === null) {
          await AsyncStorage.setItem('hasLaunchedBefore', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // This will keep the splash screen visible
  }

  return (
    <SafeAreaProvider>
      <magic.Relayer />
      <Stack>
        {isFirstLaunch ? (
          <Stack.Screen name="(onboarding)/index" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaProvider>
  );
}