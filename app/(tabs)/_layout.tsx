import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
	return (
		<>
			<StatusBar style="dark" />
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: '#fff',
					tabBarStyle: {
						backgroundColor: '#25292e',
					},
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Home',
						tabBarIcon: ({ color, focused }) => (
							<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
						),
					}}
				/>
				<Tabs.Screen
					name="wallet"
					options={{
						title: 'Wallet',
						tabBarIcon: ({ color, focused }) => (
							<Ionicons name={focused ? 'wallet' : 'wallet-outline'} color={color} size={24} />
						),
					}}
				/>
			</Tabs>
		</>
	);
}
