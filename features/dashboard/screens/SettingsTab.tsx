import React, { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { getUserSession } from '@/services/userSession';
import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

export default function SettingsTab() {
  const user = getUserSession();
  const [darkMode, setDarkMode] = useState(false);
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
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
        <View style={dashboardStyles.switchRow}>
          <Text style={dashboardStyles.cardTitle}>Email alerts</Text>
          <Switch value={emailAlerts} onValueChange={setEmailAlerts} />
        </View>
      </View>
    </ScrollView>
  );
}
