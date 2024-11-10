import './polyfills'; 
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { magic } from "@/config/magic";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<UserProvider>
				<AuthProvider>
					<magic.Relayer />
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="onboarding" />
						<Stack.Screen name="(auth)/login" />
						<Stack.Screen name="+not-found" />
					</Stack>
				</AuthProvider>
			</UserProvider>
		</SafeAreaProvider>
	);
}