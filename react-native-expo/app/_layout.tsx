import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { magic } from "../config/magic";
import { UserProvider } from "../contexts/UserContext";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<UserProvider>
				<magic.Relayer />
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="onboarding" />
					<Stack.Screen name="(auth)/login" />
					<Stack.Screen name="+not-found" />
				</Stack>
			</UserProvider>
		</SafeAreaProvider>
	);
}