import { Magic } from '@magic-sdk/react-native-expo';
import { SolanaExtension } from '@magic-ext/solana';
import { getNetworkUrl } from '../utils/network';

export const magic = new Magic('pk_live_8D60742D1796CE10' as string,
	{
		// useStorageCache: true,
		extensions: [
			new SolanaExtension({
				rpcUrl: getNetworkUrl(),
			}),
		],
	}
);