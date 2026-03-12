import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { apiFetch } from '@/services/api';
import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

type ProjectTasks = {
  id: string | number;
  name: string;
  tasks: Array<{ id: string | number; name: string; status: string }>;
};

export default function TasksTab() {
  const router = useRouter();
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      try {
        const data = await apiFetch<{ projects: ProjectTasks[] }>('/dashboard?format=json', {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        const normalized = (data.projects || []).map((project) => ({
          ...project,
          tasks: Array.isArray(project.tasks) ? project.tasks : [],
        }));
        setProjects(normalized);
        setOpenProject(normalized[0]?.id ? String(normalized[0].id) : null);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkDone = async (taskId: string | number) => {
    try {
      await apiFetch(`/task/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed' }),
      });
      setProjects((current) =>
        current.map((project) => ({
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId ? { ...task, status: 'completed' } : task
          ),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDelete = (taskId: string | number) => {
    Alert.alert('Delete task?', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiFetch(`/task/${taskId}`, { method: 'DELETE' });
            setProjects((current) =>
              current.map((project) => ({
                ...project,
                tasks: project.tasks.filter((task) => task.id !== taskId),
              }))
            );
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete task');
          }
        },
      },
    ]);
  };

  const handleEdit = (taskId: string | number) => {
    router.push(`/tasks/edit/${taskId}`);
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Tasks</Text>
      <View style={dashboardStyles.sectionHeaderRow}>
        <Text style={dashboardStyles.subtitle}>Tasks grouped by project.</Text>
        <Pressable style={dashboardStyles.primaryButton} onPress={() => router.push('/tasks/new')}>
          <Text style={dashboardStyles.primaryButtonText}>+ New Task</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color="#6d28d9" />
      ) : projects.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No tasks yet.</Text>
      ) : (
        projects.map((project) => {
          const open = openProject === String(project.id);
          return (
            <View key={project.id} style={dashboardStyles.card}>
              <Pressable
                style={dashboardStyles.row}
                onPress={() => setOpenProject(open ? null : String(project.id))}
              >
                <Text style={dashboardStyles.cardTitle}>{project.name}</Text>
                <Text style={dashboardStyles.actionText}>{open ? 'Hide' : 'Show'}</Text>
              </Pressable>
              {open && (
                <View style={{ marginTop: 12 }}>
                  {project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <View key={task.id} style={dashboardStyles.listItem}>
                        <Text style={dashboardStyles.listItemTitle}>{task.name}</Text>
                        <Text style={dashboardStyles.listItemMeta}>Status: {task.status}</Text>
                        <View style={dashboardStyles.taskActions}>
                          <Pressable
                            style={[dashboardStyles.taskButton, dashboardStyles.taskButtonEdit]}
                            onPress={() => handleEdit(task.id)}
                          >
                            <Text style={dashboardStyles.taskButtonText}>Edit</Text>
                          </Pressable>
                          <Pressable
                            style={[dashboardStyles.taskButton, dashboardStyles.taskButtonDone]}
                            onPress={() => handleMarkDone(task.id)}
                          >
                            <Text style={dashboardStyles.taskButtonText}>Done</Text>
                          </Pressable>
                          <Pressable
                            style={[dashboardStyles.taskButton, dashboardStyles.taskButtonDelete]}
                            onPress={() => handleDelete(task.id)}
                          >
                            <Text style={dashboardStyles.taskButtonText}>Delete</Text>
                          </Pressable>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={dashboardStyles.listItemMeta}>No tasks yet.</Text>
                  )}
                </View>
              )}
            </View>
          );
        })
      )}
      {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
    </ScrollView>
  );
}
