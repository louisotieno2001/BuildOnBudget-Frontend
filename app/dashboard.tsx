import React from 'react';
import { Text, View } from 'react-native';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

export default function DashboardScreen() {
  return (
    <View style={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Dashboard</Text>
      <Text style={dashboardStyles.subtitle}>You are logged in.</Text>
    </View>
  );
}
