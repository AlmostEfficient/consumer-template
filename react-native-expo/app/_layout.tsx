import { Stack } from "expo-router";
import { Animated, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { magic } from "../config/magic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen"
import { Redirect } from "expo-router";

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false);
	const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

	useEffect(() => {

		async function prepare() {
			// run any preload logic here: load fonts, make any API calls, etc.
			try {
				AsyncStorage.getItem('hasLaunchedBefore')
					.then((value) => {
						if (value === null) {
							AsyncStorage.setItem('hasLaunchedBefore', 'true');
							setIsFirstLaunch(true);
						} else {
							setIsFirstLaunch(false);
						}
					});
				// artifical slow to test splash screen
				await new Promise(resolve => setTimeout(resolve, 4000));

			} catch (error) {
				console.error('Error checking first launch:', error);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return <Text style={{ fontSize: 34, fontWeight: 'bold', textAlign: 'center', marginTop: 100 }}>Loading...</Text>;
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