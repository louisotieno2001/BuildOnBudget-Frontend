import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

const notifications = [
  {
    id: 'n1',
    project: 'Nairobi Office Fitout',
    role: 'Engineer',
    status: 'pending',
  },
  {
    id: 'n2',
    project: 'Riverfront Apartments',
    role: 'Foreman',
    status: 'accepted',
  },
];

export default function NotificationsTab() {
  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Notifications</Text>
      <Text style={dashboardStyles.subtitle}>Pending invites and updates.</Text>

      {notifications.map((note) => (
        <View
          key={note.id}
          style={[
            dashboardStyles.notificationCard,
            note.status === 'pending' && dashboardStyles.notificationPending,
          ]}
        >
          <Text style={dashboardStyles.notificationTitle}>{note.project}</Text>
          <Text style={dashboardStyles.notificationMeta}>Role: {note.role}</Text>
          <Text style={dashboardStyles.notificationMeta}>Status: {note.status}</Text>
          {note.status === 'pending' && (
            <View style={dashboardStyles.primaryButton}>
              <Text style={dashboardStyles.primaryButtonText}>Accept Invite</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
