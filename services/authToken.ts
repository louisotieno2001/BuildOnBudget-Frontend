import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { setAuthToken } from '@/services/api';

const STORAGE_KEY = 'auth_token';
let currentToken: string | null = null;

async function secureStoreAvailable() {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function saveAuthToken(token: string | null) {
  currentToken = token;
  setAuthToken(token);

  const canUseSecureStore = await secureStoreAvailable();
  if (token) {
    if (canUseSecureStore) {
      await SecureStore.setItemAsync(STORAGE_KEY, token);
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, token);
    }
  } else if (canUseSecureStore) {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export async function initAuthToken() {
  if (currentToken) {
    return currentToken;
  }

  const canUseSecureStore = await secureStoreAvailable();
  const stored = canUseSecureStore
    ? await SecureStore.getItemAsync(STORAGE_KEY)
    : await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    currentToken = stored;
    setAuthToken(stored);
  }
  return stored;
}

export function getAuthToken() {
  return currentToken;
}
