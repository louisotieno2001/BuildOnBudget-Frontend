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

type TeamInvite = {
  id: string | number;
  project_id?: { id?: string | number; name?: string } | string | number;
  email?: string;
  role?: string;
  status?: string;
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

const statuses = ['pending', 'accepted', 'cancelled'] as const;

export default function EditInviteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<string>('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInvite = async () => {
      if (!id) {
        setError('Missing invite id');
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch<{
          projects: ProjectOption[];
          teamsByYou: TeamInvite[];
          teamsInvitedTo: TeamInvite[];
        }>('/dashboard?format=json', { headers: { Accept: 'application/json' } });
        if (!isMounted) return;
        setProjects(data.projects || []);
        const allInvites = [...(data.teamsByYou || []), ...(data.teamsInvitedTo || [])];
        const invite = allInvites.find((item) => String(item.id) === String(id));
        if (!invite) {
          setError('Invitation not found');
          return;
        }
        const inviteProjectId =
          typeof invite.project_id === 'object'
            ? invite.project_id?.id
            : invite.project_id;
        setProjectId(inviteProjectId ? String(inviteProjectId) : '');
        setEmail(invite.email ?? '');
        setRole(invite.role ?? '');
        setStatus(invite.status ?? 'pending');
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load invitation');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInvite();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async () => {
    if (!id) {
      Alert.alert('Missing invitation id');
      return;
    }
    if (!projectId || !email.trim() || !role) {
      Alert.alert('Missing fields', 'Please select a project, email, and role.');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch(`/team/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          project_id: projectId,
          email: email.trim(),
          role,
          status,
        }),
      });
      Alert.alert('Success', 'Invitation updated successfully.');
      router.replace('/(dashboard)/teams');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update invitation';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Edit Invitation</Text>
      <Text style={dashboardStyles.subtitle}>Update invitation details.</Text>

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

            <Text style={dashboardStyles.formLabel}>Status</Text>
            <View style={dashboardStyles.optionGroup}>
              {statuses.map((value) => (
                <Pressable
                  key={value}
                  style={[
                    dashboardStyles.optionItem,
                    status === value && dashboardStyles.optionItemSelected,
                  ]}
                  onPress={() => setStatus(value)}
                >
                  <Text style={dashboardStyles.optionText}>{value}</Text>
                </Pressable>
              ))}
            </View>

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
