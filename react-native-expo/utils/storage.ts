import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Retrieves an item from AsyncStorage.
 * @param key The key of the item to retrieve.
 * @returns The value associated with the key, or null if not found.
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item [${key}]:`, error);
    return null;
  }
};

/**
 * Sets an item in AsyncStorage.
 * @param key The key of the item to set.
 * @param value The value to associate with the key.
 */
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item [${key}]:`, error);
  }
};