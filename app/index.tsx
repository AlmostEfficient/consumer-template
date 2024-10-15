import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getItem, removeItem } from '../utils/storage';
import * as SplashScreen from "expo-splash-screen"
import { useUser } from '../contexts/UserContext';
import { magic } from '../config/magic';

SplashScreen.preventAutoHideAsync();

export default function AppEntry() {
	const router = useRouter();
	const [appIsReady, setAppIsReady] = useState(false);
	const { userMetadata, setUserMetadata, isLoading } = useUser();

	useEffect(() => {
		const checkOnboardingAndAuth = async () => {
			const start = performance.now();
			
			console.log('')
			const hasOnboarded = await getItem('hasOnboarded');
			const cachedMetadata = await getItem('userMetadata');

			if (hasOnboarded !== 'true') {
				console.log('No onboarding complete, redirecting to onboarding');
				router.replace('/onboarding');
			} else if (!cachedMetadata) {
				console.log('No cached metadata, redirecting to login');
				router.replace('/(auth)/login');
			} else {
				console.log('Cached metadata found, setting in context');
				setUserMetadata(JSON.parse(cachedMetadata));
				router.replace('/(tabs)');

				// Verify login status in the background cuz it takes ~4s
				// This is an edge case where the login session is expired
				verifyLoginStatus();
			}

			setAppIsReady(true);
			const end = performance.now();
			console.log(`Initial routing took ${end - start}ms`);
		};

		if (!isLoading) {
			checkOnboardingAndAuth();
		}
	}, [isLoading, router, setUserMetadata]);

	const verifyLoginStatus = async () => {
		try {
			const start = performance.now();
			const isLoggedIn = await magic.user.isLoggedIn();
			const end = performance.now();
			console.log(`magic.user.isLoggedIn() took ${end - start}ms`);

			if (!isLoggedIn) {
				console.log('User session invalid, redirecting to login');
				setUserMetadata(null);
				await removeItem('userMetadata');
				router.replace('/(auth)/login');
			} else {
				console.log('User session valid');
				// Optionally refresh metadata here if needed
			}
		} catch (error) {
			console.error('Error verifying login status:', error);
		}
	};

	useEffect(() => {
		if (appIsReady) {
			SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	return null;
}
