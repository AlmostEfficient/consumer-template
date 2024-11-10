import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { getItem, setItem } from '@/utils/storage';

export default function Index() {
	const [currentPage, setCurrentPage] = useState(0);
	const [onboardingInitialized, setOnboardingInitialized] = useState(false);
	const router = useRouter();

	const initializeOnboarding = useCallback(async (): Promise<void> => {
		if (onboardingInitialized) return;

		try {
			const [notificationsPerms, notificationStatus, hasOnboarded, inviteStatus] = await Promise.all([
				Notifications.getPermissionsAsync(),
				getItem('notificationStatus'),
				getItem('hasOnboarded'),
				getItem('inviteStatus')
			]);

			if (hasOnboarded === 'true') {
				router.replace('/(auth)/login');
				return;
			}

			// TODO: fetch notificationsPerms during splash screen so there's no delay in page transition
			if (notificationsPerms.granted === true || notificationStatus !== null) {
				setCurrentPage(1);
			} else if (inviteStatus) {
				setCurrentPage(2);
			} else {
				setCurrentPage(0);
			}

			setOnboardingInitialized(true);
		} catch (error) {
			console.error('Initialization error:', error);
		}
	}, [router, onboardingInitialized]);

	useEffect(() => {
		initializeOnboarding();
	}, [initializeOnboarding]);

	const requestNotificationPermission = async () => {
		try {
			const { status } = await Notifications.requestPermissionsAsync();
			await setItem('notificationStatus', status);
			setCurrentPage(1);
		} catch (error) {
			console.error('Notification permission error:', error);
		}
	};

	const inviteFriends = async () => {
		try {
			await Share.share({
				message: 'Buy my bags! yourlinkhere.com/refer?=123456',
			});
			navigateNext();
		} catch (error) {
			console.error('Share error:', error);
		}
	};

	const createAccount = async () => {
		router.replace('/(auth)/login');
	};

	const navigateNext = async () => {
		try {
			if (currentPage === 0) {
				await setItem('notificationStatus', 'skipped');
				setCurrentPage(1);
			}
			else if (currentPage === 1) {
				// can't know if user has invited or not, we don't want to prompt invite again 
				await setItem('inviteStatus', 'prompted');
				setCurrentPage(2);
			}
			else if (currentPage === 2) {
				await setItem('hasOnboarded', 'true');
				router.replace('/(tabs)');
			}
		} catch (error) {
			console.error('Navigation error:', error);
		}
	};

	const renderContent = () => {
		switch (currentPage) {
			case 0:
				return (
					<>
						<Text style={styles.emoji}>📢</Text>
						<Text style={styles.title}>Enable Notifications</Text>
						<Text style={styles.description}>
							Stay updated with the latest news and alerts about your investments.
						</Text>
						<TouchableOpacity style={styles.button} onPress={requestNotificationPermission}>
							<Text style={styles.buttonText}>Allow Notifications</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.skipButton} onPress={navigateNext}>
							<Text style={styles.skipButtonText}>Skip</Text>
						</TouchableOpacity>
					</>
				);
			case 1:
				return (
					<>
						<Text style={styles.emoji}>🤝</Text>
						<Text style={styles.title}>Invite Friends</Text>
						<Text style={styles.description}>
							Invite your friends and earn rewards!
						</Text>
						<TouchableOpacity style={styles.button} onPress={inviteFriends}>
							<Text style={styles.buttonText}>Invite</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.skipButton} onPress={navigateNext}>
							<Text style={styles.skipButtonText}>Skip</Text>
						</TouchableOpacity>
					</>
				);
			case 2:
				return (
					<>
						<Text style={styles.emoji}>🔒</Text>
						<Text style={styles.title}>Your keys, your coins</Text>
						<Text style={styles.description}>
							Your email address controls your wallet. We can't access or freeze your holdings, ever.
						</Text>
						<TouchableOpacity style={styles.button} onPress={createAccount}>
							<Text style={styles.buttonText}>Create Account</Text>
						</TouchableOpacity>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="dark" />
			<View style={styles.content}>
				{renderContent()}
			</View>
			<View style={styles.footer}>
				<View style={styles.pagination}>
					{[0, 1, 2].map((page) => (
						<View
							key={page}
							style={[
								styles.dot,
								currentPage === page ? styles.activeDot : styles.inactiveDot,
							]}
						/>
					))}
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
	},
	emoji: {
		fontSize: 80,
		marginBottom: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	description: {
		fontSize: 16,
		textAlign: 'center',
		color: '#666',
		marginBottom: 30,
	},
	footer: {
		alignItems: 'center',
		paddingBottom: 40,
	},
	pagination: {
		flexDirection: 'row',
		marginBottom: 20,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginHorizontal: 5,
	},
	activeDot: {
		backgroundColor: '#000',
	},
	inactiveDot: {
		backgroundColor: '#D3D3D3',
	},
	button: {
		backgroundColor: '#E600E6',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 10,
		width: '90%',
		alignItems: 'center',
		marginBottom: 20,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	skipButton: {
		backgroundColor: 'transparent',
		padding: 0,
		margin: 0,
	},
	skipButtonText: {
		color: 'black',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
