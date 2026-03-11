import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserSession = {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
};

const STORAGE_KEY = 'user_session';
let currentSession: UserSession | null = null;

export async function saveUserSession(session: UserSession | null) {
  currentSession = session;
  if (session) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export async function initUserSession() {
  if (currentSession) {
    return currentSession;
  }
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      currentSession = JSON.parse(stored) as UserSession;
    } catch {
      currentSession = null;
    }
  }
  return currentSession;
}

export function getUserSession() {
  return currentSession;
}
