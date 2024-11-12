import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitle: 'Deposit',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <Ionicons 
              name="close" 
              size={28} 
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        ),
      }}
    />
  );
}