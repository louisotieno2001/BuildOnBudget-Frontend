import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

const data = [
  {
    id: 'p1',
    name: 'Riverfront Apartments',
    tasks: [
      { id: 't1', name: 'Foundation inspection', status: 'pending' },
      { id: 't2', name: 'Electrical rough-in', status: 'in_progress' },
    ],
  },
  {
    id: 'p2',
    name: 'Nairobi Office Fitout',
    tasks: [
      { id: 't3', name: 'Paint main hall', status: 'completed' },
    ],
  },
];

export default function TasksTab() {
  const [openProject, setOpenProject] = useState<string | null>(data[0]?.id ?? null);

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Tasks</Text>
      <Text style={dashboardStyles.subtitle}>Tasks grouped by project.</Text>

      {data.map((project) => {
        const open = openProject === project.id;
        return (
          <View key={project.id} style={dashboardStyles.card}>
            <Pressable
              style={dashboardStyles.row}
              onPress={() => setOpenProject(open ? null : project.id)}
            >
              <Text style={dashboardStyles.cardTitle}>{project.name}</Text>
              <Text style={dashboardStyles.actionText}>{open ? 'Hide' : 'Show'}</Text>
            </Pressable>
            {open && (
              <View style={{ marginTop: 12 }}>
                {project.tasks.map((task) => (
                  <View key={task.id} style={dashboardStyles.listItem}>
                    <Text style={dashboardStyles.listItemTitle}>{task.name}</Text>
                    <Text style={dashboardStyles.listItemMeta}>Status: {task.status}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
