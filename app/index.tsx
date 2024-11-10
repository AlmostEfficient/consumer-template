import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen"
import { getItem } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function AppEntry() {
	const router = useRouter();
	const [appIsReady, setAppIsReady] = useState(false);
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		const checkOnboardingAndAuth = async () => {
			
			const hasOnboarded = await getItem('hasOnboarded');

			if (hasOnboarded !== 'true') {
				router.replace('/onboarding');
			} else if (!isAuthenticated) {
				router.replace('/(auth)/login');
			} else {
				router.replace('/(tabs)');
			}

			setAppIsReady(true);
		};

		if (!isLoading) {
			checkOnboardingAndAuth();
		}
	}, [isLoading, isAuthenticated, router]);

	useEffect(() => {
		if (appIsReady) {
			SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	return null;
}
