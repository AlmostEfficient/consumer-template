export enum Network {
  SOLANA_DEVNET = 'solana-devnet',
  SOLANA_MAINNET_BETA = 'solana-mainnet',
}

export const getNetworkUrl = () => {
  switch (process.env.EXPO_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.SOLANA_DEVNET:
      return process.env.EXPO_PUBLIC_DEVNET_RPC_URL;
    case Network.SOLANA_MAINNET_BETA:
      return process.env.EXPO_PUBLIC_MAINNET_RPC_URL;
    default:
      throw new Error('Network not supported');
  }
};

export const getNetworkName = () => {
  switch (process.env.EXPO_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.SOLANA_DEVNET:
      return 'Solana (Devnet)';
    case Network.SOLANA_MAINNET_BETA:
      return 'Solana (Mainnet Beta)';
  }
};

export const getBlockExplorer = (address: string) => {
	switch (process.env.EXPO_PUBLIC_BLOCKCHAIN_NETWORK) {
    case Network.SOLANA_DEVNET:
      return `https://solana.fm/address/${address}?cluster=devnet`;
    case Network.SOLANA_MAINNET_BETA:
      return `https://solana.fm/address/${address}`;
  }
};
