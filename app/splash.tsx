import React, { useMemo, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@/context/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
      <ActivityIndicator size="large" color={colors.accent} style={styles.spinner} />
    </View>
  );
}

const createStyles = (colors: { background: string; primary: string; textMuted: string }) =>
  StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textMuted,
  },
  spinner: {
    marginTop: 24,
  },
});
