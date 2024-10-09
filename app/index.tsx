import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getItem } from '../utils/storage';
import * as SplashScreen from "expo-splash-screen"
import { useUser } from '../contexts/UserContext';

SplashScreen.preventAutoHideAsync();

export default function AppEntry() {
	const router = useRouter();
	const [appIsReady, setAppIsReady] = useState(false);
	const { userMetadata, fetchUserMetadata } = useUser();

	useEffect(() => {
		const checkOnboardingAndAuth = async () => {
			const hasOnboarded = await getItem('hasOnboarded');
			
			if (hasOnboarded !== 'true') {
				router.replace('/onboarding');
			} else if (!userMetadata) {
				await fetchUserMetadata();
				if (userMetadata) {
					router.replace('/(tabs)');
				} else {
					router.replace('/(auth)/login');
				}
			} else {
				router.replace('/(tabs)');
			}
			
			setAppIsReady(true);
		};

		checkOnboardingAndAuth();
	}, [fetchUserMetadata, userMetadata, router]);

	useEffect(() => {
		if (appIsReady) {
			SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	return null;
}