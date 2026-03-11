import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { getUserSession } from '@/services/userSession';
import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

export default function DashboardHome() {
  const user = getUserSession();

  // Hardcoded stats
  const stats = [
    { label: 'Active Projects', value: 2 },
    { label: 'Tasks Due', value: 5 },
    { label: 'Budget Spent', value: '450,000 /=' },
    { label: 'Team Members', value: 4 },
  ];

  // Hardcoded project completion (leave blank if no data)
  const projects = [
    { id: '1', name: 'Kitchen Renovation', completion: 75 },
    { id: '2', name: 'Office Build', completion: 30 },
  ];

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Welcome back{user?.name ? `, ${user.name}` : ''}!</Text>
      <Text style={dashboardStyles.subtitle}>Here is your BuildOnBudget overview.</Text>

      {/* Stats Grid */}
      <View style={dashboardStyles.statGrid}>
        {stats.map((item) => (
          <View key={item.label} style={dashboardStyles.statCard}>
            <Text style={dashboardStyles.statLabel}>{item.label}</Text>
            <Text style={dashboardStyles.statValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Project Completion */}
      <Text style={[dashboardStyles.sectionTitle, { marginTop: 24 }]}>Project Completion</Text>
      {projects.map((project) => (
        <View key={project.id} style={dashboardStyles.card}>
          <View style={dashboardStyles.row}>
            <Text style={dashboardStyles.cardTitle}>{project.name}</Text>
            <Text style={dashboardStyles.actionText}>{project.completion}%</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

