import { Magic } from '@magic-sdk/react-native-expo';
import { SolanaExtension } from '@magic-ext/solana';
import { getNetworkUrl } from '../utils/network';

export const magic = new Magic(process.env.EXPO_PUBLIC_MAGIC_API_KEY as string,
	{
		// useStorageCache: true,
		extensions: [
			new SolanaExtension({
				rpcUrl: getNetworkUrl(),
			}),
		],
	}
);