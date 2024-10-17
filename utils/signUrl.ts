import * as Crypto from 'expo-crypto';

const secretKey = process.env.EXPO_PUBLIC_MOONPAY_SECRET

export async function generateSignature(url: string): Promise<string> {
  try {
    const searchParams = new URL(url).search.slice(1); // Remove the leading '?'
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      searchParams,
      {
        key: secretKey,
        encoding: Crypto.CryptoEncoding.BASE64
      }
    );
    console.log('Signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error generating signature:', error);
    throw error;
  }
}