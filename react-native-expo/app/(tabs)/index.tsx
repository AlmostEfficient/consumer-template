import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { magic } from '../../config/magic';
import {
  createSolanaRpc,
	createSolanaRpcSubscriptions,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  signTransactionMessageWithSigners,
  sendAndConfirmTransactionFactory,
	getSignatureFromTransaction,
	address,
  lamports,
	pipe
} from '@solana/web3.js';
import { getTransferSolInstruction } from "@solana-program/system";
import { Address } from '@solana/addresses';

import { useUser } from '../../contexts/UserContext';
import { getNetworkUrl, getBlockExplorer } from '../../utils/network';

const LAMPORTS_PER_SOL = BigInt(1_000_000_000);

export default function Index() {
	const { userMetadata } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const sendTransaction = async () => {
    setIsLoading(true);
    try {

			// set up connection 
			const httpProvider = "https://devnet.helius-rpc.com/?api-key=";
			const wssProvider = "wss://devnet.helius-rpc.com/?api-key=";
			
			const rpc = createSolanaRpc(httpProvider);
      const rpcSubscriptions = createSolanaRpcSubscriptions(wssProvider);

      // Test the RPC connection
      try {
        const block = await rpc.getBlockHeight().send();
        console.log('Connected to Solana network. block:', block);
			} catch (error) {
        console.error('Failed to connect to Solana network:', error);
        Alert.alert('Error', 'Failed to connect to Solana network. Please try again later.');
        setIsLoading(false);
        return;
      }

      const recipientAddress = address('3Rry5K1CnTR6jDBBLAeFwPahRRFGtPKkKNJZsE7yc41Q');
			const userAddress = address(userMetadata?.publicAddress);

			const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

			const txMessage = pipe(
				createTransactionMessage({ version: 0}),
				tx => setTransactionMessageFeePayer(userAddress, tx),
				tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
				tx => appendTransactionMessageInstruction(
					getTransferSolInstruction({
						amount: lamports(LAMPORTS_PER_SOL / BigInt(2)),
						destination: recipientAddress,
						source: userAddress
					}),
					tx
				)
			)
			
      const signedTransaction = await magic.solana.signTransaction(txMessage);
			const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });

			try {
				await sendAndConfirmTransaction(
					signedTransaction,
					{ commitment: 'confirmed', skipPreflight: true}
				)
				const signature = getSignatureFromTransaction(signedTransaction);
				console.log('Transaction sent with signature:', signature);
				const explorerUrl = getBlockExplorer(signature);
				console.log('View transaction on block explorer:', explorerUrl);
			} catch (error) {
				console.error('Error sending transaction:', error);
				Alert.alert('Error', 'Failed to send transaction. Please try again.');
			} finally {
				setIsLoading(false);
			}
    } catch (error) {
      console.error('Error sending transaction:', error);
      Alert.alert('Error', 'Failed to send transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solana Transaction test</Text>
      <Button
        title={isLoading ? 'Sending...' : 'Transfer SOL'}
        onPress={sendTransaction}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});