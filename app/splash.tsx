import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/');
    }, 1200);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BuildOnBudget</Text>
      <Text style={styles.subtitle}>Plan smarter. Spend better.</Text>
      <ActivityIndicator size="large" color="#7c3aed" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f5f0',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5b21b6',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#52606d',
  },
  spinner: {
    marginTop: 24,
  },
});
