import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/context/theme';
import { getUserSession } from '@/services/userSession';
import { useDashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

export default function SettingsTab() {
  const dashboardStyles = useDashboardStyles();
  const { isDark, setTheme } = useTheme();
  const user = getUserSession();
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Settings</Text>
      <Text style={dashboardStyles.subtitle}>Update your profile details and preferences.</Text>

      <Text style={dashboardStyles.sectionTitle}>Profile</Text>
      <View style={dashboardStyles.card}>
        <Text style={dashboardStyles.cardSubtitle}>Name</Text>
        <TextInput
          style={[dashboardStyles.listItem, { marginTop: 8 }]}
          value={user?.name ?? ''}
          editable={false}
        />
        <Text style={dashboardStyles.cardSubtitle}>Email</Text>
        <TextInput
          style={[dashboardStyles.listItem, { marginTop: 8 }]}
          value={user?.email ?? ''}
          editable={false}
        />
        <Text style={dashboardStyles.cardSubtitle}>Phone</Text>
        <TextInput
          style={[dashboardStyles.listItem, { marginTop: 8 }]}
          value={user?.phone ?? ''}
          editable={false}
        />
      </View>

      <Text style={dashboardStyles.sectionTitle}>Preferences</Text>
      <View style={dashboardStyles.card}>
        <View style={dashboardStyles.switchRow}>
          <Text style={dashboardStyles.cardTitle}>Dark theme</Text>
          <Switch value={isDark} onValueChange={(value) => setTheme(value ? 'dark' : 'light')} />
        </View>
        <View style={dashboardStyles.switchRow}>
          <Text style={dashboardStyles.cardTitle}>Email alerts</Text>
          <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
        </View>
      </View>
    </ScrollView>
  );
}
