import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, Linking, Alert } from 'react-native';
import { magic } from '../../config/magic';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmailInputForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus the email input when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (email) {
      try {
        // const result = await new Promise((resolve, reject) => {
        //   magic.auth.loginWithEmailOTP({ email })
        //     .on('done', (result) => resolve(result))
        //     .on('error', (error) => reject(error))
        //     .on('closed-by-user', () => reject(new Error('Login cancelled by user')));
        // });
  
				// math random for result
				const result = Math.random() > 0.5;
        if (result) {
          // Login successful, navigate to the next page
          router.replace('/(tabs)');
					AsyncStorage.setItem('hasLaunchedBefore', 'true');
        } else {
          // Login failed
          console.error('Login failed');
          // Handle the failed login (e.g., show an error message to the user)
					Alert.alert('Login failed', 'Please check your email and try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        // Handle the error (e.g., show an error message to the user)
				Alert.alert('Login failed', 'Please input a valid email and try again.');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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