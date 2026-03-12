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
import { useRouter } from 'expo-router';

import { apiFetch } from '@/services/api';
import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

type ProjectOption = {
  id: string | number;
  name: string;
};

const roles = [
  'plumber',
  'electrician',
  'carpenter',
  'painter',
  'mason',
  'architect',
  'engineer',
  'project_manager',
  'laborer',
  'other',
] as const;

export default function InviteMemberScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectId, setProjectId] = useState<string>('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('');
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
    if (!projectId || !email.trim() || !role) {
      Alert.alert('Missing fields', 'Please select a project, email, and role.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/invite-member', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          email: email.trim(),
          role,
        }),
      });
      Alert.alert('Success', 'Invitation sent successfully.');
      router.replace('/(dashboard)/teams');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invite';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Invite Team Member</Text>
      <Text style={dashboardStyles.subtitle}>Invite a user to join a project.</Text>

      <View style={dashboardStyles.formCard}>
        <Text style={dashboardStyles.formLabel}>Select Project</Text>
        {loadingProjects ? (
          <ActivityIndicator color="#6d28d9" />
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

        <Text style={dashboardStyles.formLabel}>Email Address</Text>
        <TextInput
          style={dashboardStyles.formInput}
          placeholder="user@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={dashboardStyles.formLabel}>Role</Text>
        <View style={dashboardStyles.optionGroup}>
          {roles.map((value) => (
            <Pressable
              key={value}
              style={[
                dashboardStyles.optionItem,
                role === value && dashboardStyles.optionItemSelected,
              ]}
              onPress={() => setRole(value)}
            >
              <Text style={dashboardStyles.optionText}>{value.replace('_', ' ')}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[dashboardStyles.primaryButton, submitting && dashboardStyles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={dashboardStyles.primaryButtonText}>
            {submitting ? 'Sending...' : 'Send Invitation'}
          </Text>
        </Pressable>

        {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
