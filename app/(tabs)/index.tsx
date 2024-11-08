import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { signAndSendTransaction, createTransferInstruction } from '../../utils/signAndSendTx';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Index() {
	const { userMetadata } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	const sendTransaction = async () => {
		setIsLoading(true);

		try {
			const fromPubkey = new PublicKey(userMetadata?.publicAddress || '');
			const toPubkey = new PublicKey('3Rry5K1CnTR6jDBBLAeFwPahRRFGtPKkKNJZsE7yc41Q');
			const transferInstruction = createTransferInstruction(
				fromPubkey,
				toPubkey,
				0.005 * LAMPORTS_PER_SOL
			);
	
			const result = await signAndSendTransaction(
				userMetadata?.publicAddress || '',
				[transferInstruction]
			);
			console.log('Transaction sent with signature:', result.signature);
			console.log('View transaction on block explorer:', result.explorerUrl);
		} catch (error) {
			console.error('Error in transaction process:', error);
			Alert.alert('Error', 'An error occurred during the transaction process. Please try again.');
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