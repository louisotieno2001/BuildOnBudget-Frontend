import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { apiFetch } from '@/services/api';
import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

type ProjectOption = {
  id: string | number;
  name: string;
};

type TaskRecord = {
  id: string | number;
  project_id?: string | number;
  name?: string;
  description?: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
  priority?: 'low' | 'medium' | 'high' | string;
  status?: 'pending' | 'in_progress' | 'completed' | string;
};

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
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

    const loadTask = async () => {
      if (!id) {
        setError('Missing task id');
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch<{ projects: Array<{ id: string | number; name: string; tasks: TaskRecord[] }> }>(
          '/dashboard?format=json',
          { headers: { Accept: 'application/json' } }
        );
        if (!isMounted) return;
        const allProjects = data.projects || [];
        setProjects(allProjects.map((project) => ({ id: project.id, name: project.name })));

        let foundTask: TaskRecord | undefined;
        let foundProjectId: string | number | undefined;
        allProjects.forEach((project) => {
          project.tasks?.forEach((task) => {
            if (String(task.id) === String(id)) {
              foundTask = task;
              foundProjectId = project.id;
            }
          });
        });

        if (!foundTask) {
          setError('Task not found');
          return;
        }

        setProjectId(String(foundTask.project_id ?? foundProjectId ?? ''));
        setName(foundTask.name ?? '');
        setDescription(foundTask.description ?? '');
        setAssignedTo(foundTask.assigned_to ?? '');
        setPriority((foundTask.priority as 'low' | 'medium' | 'high') ?? 'medium');
        setStatus((foundTask.status as 'pending' | 'in_progress' | 'completed') ?? 'pending');
        setStartDate(foundTask.start_date ?? '');
        setEndDate(foundTask.end_date ?? '');
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTask();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async () => {
    if (!id) {
      Alert.alert('Missing task id');
      return;
    }
    if (!projectId || !name.trim()) {
      Alert.alert('Missing fields', 'Please select a project and enter a task name.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch(`/task/${id}`, {
        method: 'PATCH',
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
      Alert.alert('Success', 'Task updated successfully.');
      router.replace('/(dashboard)/tasks');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Edit Task</Text>
      <Text style={dashboardStyles.subtitle}>Update the task details below.</Text>

      <View style={dashboardStyles.formCard}>
        {loading ? (
          <ActivityIndicator color="#6d28d9" />
        ) : (
          <>
            <Text style={dashboardStyles.formLabel}>Select Project</Text>
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

            <Text style={dashboardStyles.formLabel}>Task Name</Text>
            <TextInput
              style={dashboardStyles.formInput}
              placeholder="e.g., Foundation Excavation"
              value={name}
              onChangeText={setName}
            />

            <Text style={dashboardStyles.formLabel}>Task Description</Text>
            <TextInput
              style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
              placeholder="Detailed description of the task..."
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={dashboardStyles.formLabel}>Assigned To</Text>
            <TextInput
              style={dashboardStyles.formInput}
              placeholder="Name or team member"
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
              value={startDate}
              onChangeText={setStartDate}
            />

            <Text style={dashboardStyles.formLabel}>End Date (YYYY-MM-DD)</Text>
            <TextInput
              style={dashboardStyles.formInput}
              placeholder="2026-04-15"
              value={endDate}
              onChangeText={setEndDate}
            />

            <Pressable
              style={[dashboardStyles.primaryButton, submitting && dashboardStyles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={dashboardStyles.primaryButtonText}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </Text>
            </Pressable>
          </>
        )}

        {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
