import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/context/theme';

export default function TermsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.updated}>Last updated: March 12, 2026</Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.text}>
        By accessing or using BuildOnBudget, you agree to these Terms of Service. This is a basic template that you can
        replace with your final terms later.
      </Text>

      <Text style={styles.sectionTitle}>2. Use of the Service</Text>
      <Text style={styles.text}>
        You agree to use the service responsibly and comply with applicable laws. You are responsible for maintaining
        the confidentiality of your account and activities under your account.
      </Text>

      <Text style={styles.sectionTitle}>3. Accounts and Security</Text>
      <Text style={styles.text}>
        You must provide accurate information and keep your account secure. We may suspend or terminate accounts that
        violate these terms.
      </Text>

      <Text style={styles.sectionTitle}>4. Content and Ownership</Text>
      <Text style={styles.text}>
        You retain ownership of your content. By using the service, you grant us a license to host, store, and display
        your content solely for providing the service.
      </Text>

      <Text style={styles.sectionTitle}>5. Prohibited Activities</Text>
      <Text style={styles.text}>
        You may not misuse the service, attempt unauthorized access, or interfere with system integrity.
      </Text>

      <Text style={styles.sectionTitle}>6. Disclaimer</Text>
      <Text style={styles.text}>
        The service is provided on an "as is" basis without warranties of any kind. We do not guarantee that the
        service will be uninterrupted or error-free.
      </Text>

      <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
      <Text style={styles.text}>
        To the maximum extent permitted by law, BuildOnBudget is not liable for any indirect or consequential damages
        arising from your use of the service.
      </Text>

      <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
      <Text style={styles.text}>
        We may update these terms from time to time. Continued use of the service means you accept the updated terms.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact</Text>
      <Text style={styles.text}>
        If you have questions about these terms, contact us at support@buildonbudget.com.
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
