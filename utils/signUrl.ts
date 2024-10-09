import * as crypto from 'expo-crypto';

interface SignedUrlParams {
  apiKey: string;
  currencyCode: string;
  walletAddress: string;
  expiresAt?: number;
  baseCurrencyCode?: string;
  baseCurrencyAmount?: number;
  email?: string;
  externalCustomerId?: string;
  externalTransactionId?: string;
  // Add any other optional parameters you might need
}

export const generateSignedUrl = async (
  baseUrl: string,
  params: SignedUrlParams
): Promise<string> => {
  // Current timestamp in seconds
  const timestamp = Math.floor(Date.now() / 1000);
  
  // URL parameters
  const urlParams = new URLSearchParams({
    ...params,
    expiresAt: (params.expiresAt || timestamp + 3600).toString(),
  });

  // Construct the URL to be signed
  const urlToSign = `${baseUrl}?${urlParams.toString()}`;

  // Generate the signature
  const signature = await crypto.digestStringAsync(
    crypto.CryptoDigestAlgorithm.SHA256,
    urlToSign + process.env.EXPO_PUBLIC_MOONPAY_SECRET_KEY
  );

  // Append the signature to the URL
  const signedUrl = `${urlToSign}&signature=${signature}`;

  return signedUrl;
};