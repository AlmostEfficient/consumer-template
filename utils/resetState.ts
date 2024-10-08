import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const resetState = async () => {
	await AsyncStorage.clear();
	
	await Notifications.dismissAllNotificationsAsync();

	console.log('❌ EVERYTHING RESET ❌');
}