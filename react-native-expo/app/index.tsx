import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getItem } from '../utils/storage';
import * as SplashScreen from "expo-splash-screen"

SplashScreen.preventAutoHideAsync();

export default function AppEntry() {
  const router = useRouter();
	const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasOnboarded = await getItem('hasOnboarded');
      if (hasOnboarded === 'true') {
				router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
			setAppIsReady(true);
    };

    checkOnboarding();
  }, []);

	useEffect(() => {
		if (appIsReady) {
			SplashScreen.hideAsync();
		}
	}, [appIsReady]);

  return null;
}