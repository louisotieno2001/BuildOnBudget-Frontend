import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

export default function ProjectsTab() {
  // Placeholder project data
  const [projects] = useState([
    {
      id: '1',
      name: 'Kitchen Renovation',
      budget: 250000,
      status: true,
    },
    {
      id: '2',
      name: 'Office Build',
      budget: 1500000,
      status: true,
    },
    {
      id: '3',
      name: 'Bathroom Remodel',
      budget: 120000,
      status: false,
    },
  ]);

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Projects</Text>
      <Text style={dashboardStyles.subtitle}>Track ongoing and invited projects.</Text>

      {projects.map((project) => (
        <View key={project.id} style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>{project.name}</Text>
          <Text style={dashboardStyles.cardSubtitle}>
            Budget: {project.budget ? `${project.budget} /=` : 'Not set'}
          </Text>
          <View style={dashboardStyles.pill}>
            <Text style={dashboardStyles.pillText}>
              {project.status ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

