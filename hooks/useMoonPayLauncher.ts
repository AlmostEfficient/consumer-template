import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';
import { useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { createMoonPaySdkConfig } from '../config/moonpay';
import { useUser } from '../contexts/UserContext';

export function useMoonPayLauncher() {
	const { userMetadata } = useUser();
	const sdkConfig = createMoonPaySdkConfig(userMetadata?.publicAddress || '');

	const handleOpenBrowser = async (url: string) => {
		await WebBrowser.openBrowserAsync(url);
	};

	const { ready, openWithInAppBrowser } = useMoonPaySdk({
		sdkConfig,
		browserOpener: {
			open: handleOpenBrowser,
		},
	});

	const launchMoonPay = useCallback(() => {
		if (ready) {
			openWithInAppBrowser();
		} else {
			console.warn('MoonPay SDK is not ready');
		}
	}, [ready, openWithInAppBrowser]);

	return { launchMoonPay, ready };
}