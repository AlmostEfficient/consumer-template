import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Share } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { magic } from '../../config/magic';
export default function Index() {
	const [currentPage, setCurrentPage] = useState(0);
	const router = useRouter();

	// check if app has notifications permission
	useEffect(() => {
		async function checkNotifications() {
			const hasPermission = await Notifications.getPermissionsAsync();
			console.log("Notification status", hasPermission);
			if (hasPermission.status == 'granted') {
				setCurrentPage(1);
			}
		}

		async function checkFirstLaunch() {
			const hasLaunchedBefore = await AsyncStorage.getItem('hasLaunchedBefore');
			if (hasLaunchedBefore) {
				setCurrentPage(2);
			}
		}

		async function checkLogin() {
			const isLoggedIn = await magic.user.isLoggedIn();
			if (isLoggedIn) {
				router.replace('/(tabs)');
			}
		}
		checkNotifications();
		checkFirstLaunch();
		checkLogin();
	}, []);

	
	const handleNotificationRequest = async () => {
		const { status } = await Notifications.getPermissionsAsync();
		if (status !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== 'granted') {
				alert('Permission for notification was denied');
			}
		}
		handleNextPage();
	};
	
	const handleInvite = async () => {
		await Share.share({
			message: 'Buy my bags! yourlinkhere.com/refer?=' + '123456',
		});
		handleNextPage();
	};
	
	async function handleCreateAccount() {
		router.replace('/(auth)/login');
	};
	
	const handleNextPage = () => {
		if (currentPage < 2) {
			setCurrentPage(currentPage + 1);
		} else {
			router.replace('/(tabs)');
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
						<TouchableOpacity style={styles.button} onPress={handleNotificationRequest}>
							<Text style={styles.buttonText}>Allow Notifications</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.skipButton} onPress={handleNextPage}>
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
							Share your referral code with friends and earn rewards!
						</Text>
						<TouchableOpacity style={styles.button} onPress={handleInvite}>
							<Text style={styles.buttonText}>Share Referral Code</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.skipButton} onPress={handleNextPage}>
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
						<TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
							<Text style={styles.buttonText}>Create Account</Text>
						</TouchableOpacity>
					</>
				);
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
          <View style={[styles.dot, currentPage === 0 ? styles.activeDot : styles.inactiveDot]} />
          <View style={[styles.dot, currentPage === 1 ? styles.activeDot : styles.inactiveDot]} />
          <View style={[styles.dot, currentPage === 2 ? styles.activeDot : styles.inactiveDot]} />
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