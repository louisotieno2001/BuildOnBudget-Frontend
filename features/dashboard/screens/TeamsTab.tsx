import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

const teamsByYou = [
  {
    id: 'p1',
    project: 'Riverfront Apartments',
    members: [
      { email: 'jane@example.com', role: 'Foreman', status: 'accepted' },
      { email: 'sam@example.com', role: 'Designer', status: 'pending' },
    ],
  },
];

const teamsInvitedTo = [
  {
    id: 'p2',
    project: 'Nairobi Office Fitout',
    role: 'Engineer',
    status: 'pending',
  },
];

export default function TeamsTab() {
  const [open, setOpen] = useState<string | null>(teamsByYou[0]?.id ?? null);

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Teams</Text>
      <Text style={dashboardStyles.subtitle}>Manage team invitations and roles.</Text>

      <Text style={dashboardStyles.sectionTitle}>Teams by You</Text>
      {teamsByYou.map((group) => (
        <View key={group.id} style={dashboardStyles.card}>
          <Pressable style={dashboardStyles.row} onPress={() => setOpen(open === group.id ? null : group.id)}>
            <Text style={dashboardStyles.cardTitle}>{group.project}</Text>
            <Text style={dashboardStyles.actionText}>{open === group.id ? 'Hide' : 'Show'}</Text>
          </Pressable>
          {open === group.id && (
            <View style={{ marginTop: 12 }}>
              {group.members.map((member) => (
                <View key={member.email} style={dashboardStyles.listItem}>
                  <Text style={dashboardStyles.listItemTitle}>{member.email}</Text>
                  <Text style={dashboardStyles.listItemMeta}>Role: {member.role}</Text>
                  <Text style={dashboardStyles.listItemMeta}>Status: {member.status}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <Text style={dashboardStyles.sectionTitle}>Teams Invited To</Text>
      {teamsInvitedTo.map((invite) => (
        <View key={invite.id} style={dashboardStyles.notificationCard}>
          <Text style={dashboardStyles.notificationTitle}>{invite.project}</Text>
          <Text style={dashboardStyles.notificationMeta}>Role: {invite.role}</Text>
          <Text style={dashboardStyles.notificationMeta}>Status: {invite.status}</Text>
          {invite.status === 'pending' && (
            <View style={dashboardStyles.primaryButton}>
              <Text style={dashboardStyles.primaryButtonText}>Accept Invite</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
