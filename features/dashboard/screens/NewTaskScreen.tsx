import React, { useEffect, useState } from 'react';

import { useTheme } from '@/context/theme';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { apiFetch } from '@/services/api';
import { useDashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

type ProjectOption = {
  id: string | number;
  name: string;
};

export default function NewTaskScreen() {
  const dashboardStyles = useDashboardStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectId, setProjectId] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const data = await apiFetch<{ projects: ProjectOption[] }>('/dashboard?format=json', {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        setProjects(data.projects || []);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        if (isMounted) setLoadingProjects(false);
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (!projectId || !name.trim()) {
      Alert.alert('Missing fields', 'Please select a project and enter a task name.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/new-task', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          name: name.trim(),
          description: description.trim(),
          assigned_to: assignedTo.trim(),
          start_date: startDate.trim(),
          end_date: endDate.trim(),
          priority,
          status,
        }),
      });
      Alert.alert('Success', 'Task created successfully.');
      router.replace('/(dashboard)/tasks');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Create New Task</Text>
      <Text style={dashboardStyles.subtitle}>Fill in the details to add a task.</Text>

      <View style={dashboardStyles.formCard}>
        <Text style={dashboardStyles.formLabel}>Select Project</Text>
        {loadingProjects ? (
          <ActivityIndicator color={colors.accent} />
        ) : projects.length === 0 ? (
          <Text style={dashboardStyles.chartEmptyText}>No projects available.</Text>
        ) : (
          <View style={dashboardStyles.optionGroup}>
            {projects.map((project) => (
              <Pressable
                key={project.id}
                style={[
                  dashboardStyles.optionItem,
                  projectId === String(project.id) && dashboardStyles.optionItemSelected,
                ]}
                onPress={() => setProjectId(String(project.id))}
              >
                <Text style={dashboardStyles.optionText}>{project.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={dashboardStyles.formLabel}>Task Name</Text>
        <TextInput
          style={dashboardStyles.formInput}
          placeholder="e.g., Foundation Excavation"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        <Text style={dashboardStyles.formLabel}>Task Description</Text>
        <TextInput
          style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
          placeholder="Detailed description of the task..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={dashboardStyles.formLabel}>Assigned To</Text>
        <TextInput
          style={dashboardStyles.formInput}
          placeholder="Name or team member"
          placeholderTextColor={colors.textMuted}
          value={assignedTo}
          onChangeText={setAssignedTo}
        />

        <Text style={dashboardStyles.formLabel}>Priority</Text>
        <View style={dashboardStyles.optionGroup}>
          {(['low', 'medium', 'high'] as const).map((value) => (
            <Pressable
              key={value}
              style={[
                dashboardStyles.optionItem,
                priority === value && dashboardStyles.optionItemSelected,
              ]}
              onPress={() => setPriority(value)}
            >
              <Text style={dashboardStyles.optionText}>{value}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={dashboardStyles.formLabel}>Status</Text>
        <View style={dashboardStyles.optionGroup}>
          {(['pending', 'in_progress', 'completed'] as const).map((value) => (
            <Pressable
              key={value}
              style={[
                dashboardStyles.optionItem,
                status === value && dashboardStyles.optionItemSelected,
              ]}
              onPress={() => setStatus(value)}
            >
              <Text style={dashboardStyles.optionText}>{value.replace('_', ' ')}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={dashboardStyles.formLabel}>Start Date (YYYY-MM-DD)</Text>
        <TextInput
          style={dashboardStyles.formInput}
          placeholder="2026-03-11"
          placeholderTextColor={colors.textMuted}
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={dashboardStyles.formLabel}>End Date (YYYY-MM-DD)</Text>
        <TextInput
          style={dashboardStyles.formInput}
          placeholder="2026-04-15"
          placeholderTextColor={colors.textMuted}
          value={endDate}
          onChangeText={setEndDate}
        />

        <Pressable
          style={[dashboardStyles.primaryButton, submitting && dashboardStyles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={dashboardStyles.primaryButtonText}>
            {submitting ? 'Saving...' : 'Add Task'}
          </Text>
        </Pressable>

        {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
