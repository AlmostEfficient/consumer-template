import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { magic } from "../config/magic";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { SplashScreen } from "../components/SplashScreen";

export default function RootLayout() {
	const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

	useEffect(() => {
		async function checkFirstLaunch() {
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
				setIsFirstLaunch(false);
			}
		}

		checkFirstLaunch();
	}, []);

	return (
		<SplashScreen>
			{isFirstLaunch !== null && (
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
			)}
		</SplashScreen>
	);
}