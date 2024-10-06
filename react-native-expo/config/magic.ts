import { Magic } from '@magic-sdk/react-native-expo';
import { SolanaExtension } from '@magic-ext/solana';
import { getNetworkUrl } from '../utils/network';

export const magic = new Magic('pk_live_8D60742D1796CE10' as string,
	{
		extensions: [
			new SolanaExtension({
				rpcUrl: getNetworkUrl(),
			}),
		],
	}
);

// export const magic = new Magic("YOUR_API_KEY", {
// 	extensions: [
// 		new SolanaExtension({
// 			rpcUrl: 'SOLANA_RPC_NODE_URL'
// 		})
// 	]
// });

/*
if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
	const magic = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
		extensions: [
			new OAuthExtension(),
			new SolanaExtension({
				rpcUrl: getNetworkUrl(),
			}),
		],
	});

*/