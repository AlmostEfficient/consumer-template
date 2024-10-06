import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { magic } from "../config/magic";

export default function RootLayout() {
  return (
		<SafeAreaProvider>
			<magic.Relayer />
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="(auth)/login" options={ { title: 'Login' } } />
				<Stack.Screen name="+not-found"/>
			</Stack>
		</SafeAreaProvider>
  );
}