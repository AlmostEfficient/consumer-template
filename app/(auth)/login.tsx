import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Linking, Alert, InteractionManager } from 'react-native';
import { magic } from '../../config/magic';
import { useRouter } from 'expo-router';
import { setItem } from '../../utils/storage';
import { useUser } from '../../contexts/UserContext';

export default function EmailInputForm() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<TextInput>(null);
	const { setUserMetadata } = useUser();

	useEffect(() => {
		// Auto-focus the email input when the component mounts
		inputRef.current?.focus();
	}, []);

	const handleLogin = async () => {
		const normalizedEmail = email.trim().toLowerCase();
		if (!isValidEmail(normalizedEmail)) {
			Alert.alert('Invalid Email', 'Please enter a valid email address.');
			return;
		}

		if (isLoading) return; // Prevent multiple submissions

		setIsLoading(true);
		try {
			const result = await Promise.race([
				magic.auth.loginWithEmailOTP({ email: normalizedEmail }),
				new Promise((_, reject) => setTimeout(() => reject(new Error('Login timed out')), 60000))
			]);

			if (result) {
				router.replace('/(tabs)');

				// Perform non-critical operations after navigation
				InteractionManager.runAfterInteractions(async () => {
					const metadata = await magic.user.getInfo();
					setUserMetadata(metadata);
					await setItem('userMetadata', JSON.stringify(metadata));
					await setItem('hasOnboarded', 'true');
				});
			} else {
				Alert.alert('Login Failed', 'Unexpected response from the server.');
			}
		} catch (error: any) {
			console.error('Login error:', error);
			if (error.message === 'Login cancelled by user') {
				Alert.alert('Login Cancelled', 'You have cancelled the login process.');
			} else if (error.message === 'Login timed out') {
				Alert.alert('Login Timeout', 'The login process took too long. Please try again.');
			} else if (error.code === 'rate_limit_exceeded') {
				Alert.alert('Too Many Attempts', 'Please wait a moment before trying again.');
			} else {
				Alert.alert('Login Error', 'An error occurred during login. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={styles.container}>
				<Text style={styles.logo}>👋</Text>
				<Text style={styles.title}>What's your email address?</Text>
				<Text style={styles.subtitle}>
					We only need your email to log you in. We keep your email private and won't send spam.
				</Text>
				<TextInput
					ref={inputRef}
					style={styles.input}
					placeholder="toly@gmail.com"
					placeholderTextColor="#999"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
					onSubmitEditing={handleLogin}
					returnKeyType="done"
					editable={!isLoading}
				/>
				<Text style={styles.terms}>
					By continuing you're agreeing to our{' '}
					<Text style={styles.link} onPress={() => Linking.openURL('https://example.com/privacy-policy')}>
						Privacy Policy
					</Text>{' '}
					and{' '}
					<Text style={styles.link} onPress={() => Linking.openURL('https://example.com/terms-of-service')}>
						Terms of Service
					</Text>
					.
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

const isValidEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
	},
	logo: {
		fontSize: 48,
		marginBottom: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginBottom: 30,
		textAlign: 'center',
	},
	input: {
		width: '100%',
		height: 50,
		borderBottomWidth: 2,
		borderBottomColor: '#e535ab',
		fontSize: 18,
		paddingHorizontal: 10,
		marginBottom: 30,
	},
	terms: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
	},
	link: {
		color: '#e535ab',
	},
});