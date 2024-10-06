import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { magic } from '../../config/magic';

export default function Index() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = async () => {
		if (!email) {
			Alert.alert('Error', 'Please enter your email address');
			return;
		}

		setIsLoading(true);
		try {
			await magic.auth.loginWithEmailOTP({ email });
			console.log('Logged in');
		} catch (error) {
			console.error('Login error:', error);
			Alert.alert('Error', 'An error occurred during login. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const fetchUser = async () => {
		const isLoggedIn = await magic.user.isLoggedIn();
		setIsLoggedIn(isLoggedIn);
		console.log('User:', isLoggedIn);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Login with magic link</Text>
			<TextInput
				style={styles.input}
				placeholder="bob@gmail.com"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
				editable={!isLoading}
			/>
			<Button
				title={isLoading ? 'Logging in...' : 'Login with Magic Link'}
				onPress={handleLogin}
				disabled={isLoading}
			/>

			{/* Display user info */}
			<Button
				title="Fetch User"
				onPress={fetchUser}
			/>
			<Text>{isLoggedIn ? 'Logged in' : 'Not logged in'}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "#fff",
	},
	button: {
		fontSize: 20,
		textDecorationLine: "underline",
		color: "#fff",
		borderRadius: 5,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		width: "80%",
		padding: 10,
		marginBottom: 20,
	},
});
