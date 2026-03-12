import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { useTheme } from '@/context/theme';

export default function SettingsScreen() {
  const { colors, isDark, setTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [allowPhoneCalls, setAllowPhoneCalls] = useState(true);
  const [allowMessaging, setAllowMessaging] = useState(true);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Theme</Text>
            <Text style={styles.helper}>Toggle dark mode for the app.</Text>
          </View>
          <Switch value={isDark} onValueChange={(value) => setTheme(value ? 'dark' : 'light')} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communications</Text>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Allow Notifications</Text>
            <Text style={styles.helper}>Receive alerts, reminders, and updates.</Text>
          </View>
          <Switch value={allowNotifications} onValueChange={setAllowNotifications} />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Allow Phone Calls</Text>
            <Text style={styles.helper}>Let team members call you when needed.</Text>
          </View>
          <Switch value={allowPhoneCalls} onValueChange={setAllowPhoneCalls} />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Allow Messaging</Text>
            <Text style={styles.helper}>Enable in-app messaging and chat updates.</Text>
          </View>
          <Switch value={allowMessaging} onValueChange={setAllowMessaging} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </Pressable>
        <Text style={styles.dangerHelper}>
          This will permanently remove your account and data.
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  text: string;
  textMuted: string;
  border: string;
  dangerBg: string;
  dangerText: string;
}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: 24,
      paddingBottom: 36,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 12,
    },
    section: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: '#0f172a',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.surfaceAlt,
    },
    rowText: {
      flex: 1,
      paddingRight: 12,
    },
    label: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    helper: {
      fontSize: 13,
      color: colors.textMuted,
      lineHeight: 18,
    },
    dangerButton: {
      backgroundColor: colors.dangerBg,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    dangerButtonText: {
      color: colors.dangerText,
      fontWeight: '800',
      fontSize: 15,
    },
    dangerHelper: {
      marginTop: 8,
      fontSize: 12,
      color: colors.textMuted,
    },
  });
