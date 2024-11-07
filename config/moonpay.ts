import { generateSignature } from '../utils/signUrl';

export const moonpayApiKey = process.env.EXPO_PUBLIC_MOONPAY_API_KEY || '';

export type MoonPayCoreSdkConfig = {
	environment: 'production' | 'sandbox';
	flow: 'buy';
	debug?: boolean;
	params: {
		apiKey: string;
		currencyCode?: string;
		defaultCurrencyCode?: string;
		baseCurrencyCode?: string;
		walletAddress?: string;
		language?: string;
		redirectURL?: string;
		baseCurrencyAmount?: string;
		quoteCurrencyAmount?: string;
		lockAmount?: string;
		email?: string;
		externalCustomerId?: string;
		externalTransactionId?: string;
		showWalletAddressForm?: string;
	};
};

export const createMoonPaySdkConfig = (publicAddress: string): MoonPayCoreSdkConfig => ({
	debug: true,
	environment: 'sandbox',
	flow: 'buy',
	params: {
		apiKey: moonpayApiKey,
		currencyCode: 'sol',
		baseCurrencyCode: 'usd',
		walletAddress: publicAddress,
		language: 'en',
	},
});

type UrlGenOptions = {
  variant: 'webview' | 'inapp-browser';
};


export const generateAndSignUrl = async (generateUrlForSigning: (options: UrlGenOptions) => string | undefined) => {
	try {
		const unsignedUrl = generateUrlForSigning({ variant: "webview" });
		const newSignature = await generateSignature(unsignedUrl || '');
		return newSignature;
	} catch (error) {
		console.error('Error generating signature:', error);
		return null;
	}
};

