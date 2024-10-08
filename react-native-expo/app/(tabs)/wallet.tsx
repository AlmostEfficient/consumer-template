import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { magic } from '../../config/magic';
import { MagicUserMetadata } from '@magic-sdk/types';
import { useRouter } from 'expo-router';
import { getItem, setItem, removeItem } from '../../utils/storage';
import * as Clipboard from 'expo-clipboard';

const Wallet = () => {
	const router = useRouter();
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | null>(null);

  useEffect(() => {
    fetchUserMetadata();
  }, []);

  const fetchUserMetadata = async () => {
    try {
      // Try to get cached metadata
      const cachedMetadata = await getItem('userMetadata');
      if (cachedMetadata) {
        setUserMetadata(JSON.parse(cachedMetadata));
      } else {
        // If no cached data, fetch from Magic
        const metadata = await magic.user.getInfo();
        setUserMetadata(metadata);
        // Cache the fetched metadata
        await setItem('userMetadata', JSON.stringify(metadata));
      }
    } catch (error) {
      console.error('Error fetching user metadata:', error);
    }
  };

  const handleCopyAddress = async () => {
    if (userMetadata?.publicAddress) {
      await Clipboard.setStringAsync(userMetadata.publicAddress);
      // You might want to show a toast or alert here to confirm the copy action
			alert('Address copied to clipboard');
    }
  };

	const handleUpdateSettings = async () => {
		try {
			const result = await magic.user.showSettings();
			if (result) {
				console.log('Settings updated successfully');
			} else {
				console.log('Settings update was not successful');
			}
		} catch (error) {
			console.error('Error updating settings:', error);
		}
	};

	const handleExportPrivateKey = async () => {
		try {
			const result = await magic.user.revealPrivateKey();
			if (result) {
				console.log('Private key revealed successfully');
			} else {
				console.log('Private key revelation was not successful');
			}
		} catch (error) {
			console.error('Error revealing private key:', error);
		}
	};

  const handleLogout = async () => {
    try {
      await magic.user.logout();
      // Clear the cached metadata on logout
      await removeItem('userMetadata');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!userMetadata) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>User Information</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userMetadata.email || 'Not provided'}</Text>
					{userMetadata.email && (
						<TouchableOpacity style={styles.copyButton} onPress={handleUpdateSettings}>
							<Text style={styles.copyButtonText}>Update Settings</Text>
						</TouchableOpacity>
					)}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{userMetadata.phoneNumber || 'Not provided'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Public Address:</Text>
          <Text style={styles.value}>{userMetadata.publicAddress || 'Not available'}</Text>
          {userMetadata.publicAddress && (
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyAddress}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>MFA Enabled:</Text>
          <Text style={styles.value}>{userMetadata.isMfaEnabled ? 'Yes' : 'No'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Recovery Factors:</Text>
          <Text style={styles.value}>
            {userMetadata.recoveryFactors?.length || 'None'}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
				<TouchableOpacity style={styles.logoutButton} onPress={handleExportPrivateKey}>
					<Text style={styles.logoutButtonText}>Export Private Key</Text>
				</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
		marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  copyButton: {
    backgroundColor: '#E600E6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E600E6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Wallet;