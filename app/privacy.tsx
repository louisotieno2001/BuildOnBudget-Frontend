import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/context/theme';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: March 12, 2026</Text>

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.text}>
        This Privacy Policy explains how BuildOnBudget collects, uses, and protects your information when you use our
        services. This is a basic template that you can replace with your final policy later.
      </Text>

      <Text style={styles.sectionTitle}>Information We Collect</Text>
      <Text style={styles.text}>
        We may collect information you provide directly, such as your name, email address, phone number, and project
        details. We also collect usage data like device information, app interactions, and log data.
      </Text>

      <Text style={styles.sectionTitle}>How We Use Your Information</Text>
      <Text style={styles.text}>
        We use your information to provide and improve our services, communicate with you, support collaboration, and
        keep your account secure. We may also use aggregated data for analytics and product improvements.
      </Text>

      <Text style={styles.sectionTitle}>Sharing of Information</Text>
      <Text style={styles.text}>
        We do not sell your personal information. We may share information with trusted service providers who help us
        operate the platform, or when required by law.
      </Text>

      <Text style={styles.sectionTitle}>Data Security</Text>
      <Text style={styles.text}>
        We take reasonable steps to protect your information. However, no system is completely secure, and we cannot
        guarantee absolute security.
      </Text>

      <Text style={styles.sectionTitle}>Your Choices</Text>
      <Text style={styles.text}>
        You can access, update, or delete your information by contacting us. You can also control certain preferences
        in the app settings.
      </Text>

      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.text}>
        If you have questions about this Privacy Policy, contact us at support@buildonbudget.com.
      </Text>
    </ScrollView>
  );
}

const createStyles = (colors: {
  background: string;
  primary: string;
  textMuted: string;
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
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
  },
  updated: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 10,
  },
});
