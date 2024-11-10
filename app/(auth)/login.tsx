import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const inputRef = useRef<TextInput>(null);
	const { login, isLoading } = useAuth();

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

		await login(normalizedEmail);
		router.replace('/(tabs)');
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
