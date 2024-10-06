import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ScrollView } from 'react-native';
import { Link } from "expo-router";
import { magic } from '../../config/magic';
import { MagicUserMetadata } from '@magic-sdk/types';

export default function WalletScreen() {
	const [userInfo, setUserInfo] = useState<MagicUserMetadata | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// useEffect(() => {
	// 	checkLoginStatus();
	// }, []);

	const checkLoginStatus = async () => {
		const loggedIn = await magic.user.isLoggedIn();
		setIsLoggedIn(loggedIn);
		if (loggedIn) {
			fetchUserInfo();
		}
	};

	const showAddress = async () => {
		const address = await magic.wallet.showAddress();
		console.log('Address:', address);
	};
	
	const fetchUserInfo = async () => {
		try {
			const info = await magic.user.getInfo();
			setUserInfo(info);
			console.log('User info:', info);
		} catch (error) {
			console.error('Error fetching user info:', error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{isLoggedIn ? (
				<>
					<Text style={styles.title}>User Information</Text>
					{userInfo && (
						<View style={styles.infoContainer}>
							<Text style={styles.text}>Issuer: {userInfo.issuer}</Text>
							<Text style={styles.text}>Email: {userInfo.email}</Text>
							<Text style={styles.text}>Phone Number: {userInfo.phoneNumber || 'N/A'}</Text>
							<Text style={styles.text}>Public Address: {userInfo.publicAddress}</Text>
							<Text style={styles.text}>MFA Enabled: {userInfo.isMfaEnabled ? 'Yes' : 'No'}</Text>
							<Text style={styles.text}>Recovery Factors: {userInfo.recoveryFactors ? JSON.stringify(userInfo.recoveryFactors) : 'None'}</Text>
						</View>
					)}
					<Button
						title="Show address"
						onPress={showAddress}
					/>
				</>
			) : (
				<>
					<Text style={styles.text}>Please log in to view your wallet information</Text>
					<Link href="../(auth)/login" style={styles.button}>
						<Text style={styles.buttonText}>Go to Login Page</Text>
					</Link>
				</>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: '#25292e',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 20,
	},
	text: {
		color: '#fff',
		marginBottom: 10,
	},
	infoContainer: {
		backgroundColor: '#333',
		padding: 20,
		borderRadius: 10,
		marginBottom: 20,
	},
	button: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
	},
});
