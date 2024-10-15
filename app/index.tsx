import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getItem } from '../utils/storage';
import * as SplashScreen from "expo-splash-screen"
import { useAuth } from '../contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function AppEntry() {
	const router = useRouter();
	const [appIsReady, setAppIsReady] = useState(false);
	const { isAuthenticated, isLoading } = useAuth();

	useEffect(() => {
		const checkOnboardingAndAuth = async () => {
			const start = performance.now();
			
			console.log('Checking onboarding and auth status');
			const hasOnboarded = await getItem('hasOnboarded');

			if (hasOnboarded !== 'true') {
				console.log('No onboarding complete, redirecting to onboarding');
				router.replace('/onboarding');
			} else if (!isAuthenticated) {
				console.log('Not authenticated, redirecting to login');
				router.replace('/(auth)/login');
			} else {
				console.log('Authenticated, redirecting to tabs');
				router.replace('/(tabs)');
			}

			setAppIsReady(true);
			const end = performance.now();
			console.log(`Initial routing took ${end - start}ms`);
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
