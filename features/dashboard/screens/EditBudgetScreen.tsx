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

type BudgetRecord = {
  id: string | number;
  project_id?: { id?: string | number; name?: string } | string | number;
  totalBudget?: number | string;
  components?: string | Array<{ name: string; cost: number }>;
};

export default function EditBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<string>('');
  const [totalBudget, setTotalBudget] = useState('');
  const [componentsJson, setComponentsJson] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBudget = async () => {
      if (!id) {
        setError('Missing budget id');
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch<{
          projects: ProjectOption[];
          budgets: BudgetRecord[];
        }>('/dashboard?format=json', { headers: { Accept: 'application/json' } });
        if (!isMounted) return;
        setProjects(data.projects || []);
        const budget = (data.budgets || []).find((item) => String(item.id) === String(id));
        if (!budget) {
          setError('Budget not found');
          return;
        }
        const budgetProjectId =
          typeof budget.project_id === 'object'
            ? budget.project_id?.id
            : budget.project_id;
        setProjectId(budgetProjectId ? String(budgetProjectId) : '');
        setTotalBudget(String(budget.totalBudget ?? ''));
        if (Array.isArray(budget.components)) {
          setComponentsJson(JSON.stringify(budget.components, null, 2));
        } else if (typeof budget.components === 'string') {
          setComponentsJson(budget.components);
        } else {
          setComponentsJson('[]');
        }
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load budget');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBudget();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async () => {
    if (!id) {
      Alert.alert('Missing budget id');
      return;
    }
    if (!projectId || !totalBudget.trim()) {
      Alert.alert('Missing fields', 'Please select a project and enter a total budget.');
      return;
    }
    let parsedComponents: unknown = null;
    try {
      parsedComponents = componentsJson.trim() ? JSON.parse(componentsJson) : [];
    } catch (err) {
      Alert.alert('Invalid JSON', 'Please enter valid JSON for components.');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch(`/edit-budget/${id}`, {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          totalBudget,
          components: typeof parsedComponents === 'string' ? parsedComponents : JSON.stringify(parsedComponents),
        }),
      });
      Alert.alert('Success', 'Budget updated successfully.');
      router.replace('/(dashboard)/budget');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update budget';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert('Delete budget?', 'Are you sure you want to delete this budget?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiFetch(`/budget/${id}`, { method: 'DELETE' });
            Alert.alert('Deleted', 'Budget deleted successfully.');
            router.replace('/(dashboard)/budget');
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete budget';
            setError(message);
            Alert.alert('Error', message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Edit Budget</Text>
      <Text style={dashboardStyles.subtitle}>Update budget details below.</Text>

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

            <Text style={dashboardStyles.formLabel}>Total Budget</Text>
            <TextInput
              style={dashboardStyles.formInput}
              placeholder="Enter total budget"
              keyboardType="numeric"
              value={totalBudget}
              onChangeText={setTotalBudget}
            />

            <Text style={dashboardStyles.formLabel}>Components (JSON format)</Text>
            <TextInput
              style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
              placeholder='[{"name":"Materials","cost":2000},{"name":"Labor","cost":3000}]'
              value={componentsJson}
              onChangeText={setComponentsJson}
              multiline
            />

            <Pressable
              style={[dashboardStyles.primaryButton, submitting && dashboardStyles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={dashboardStyles.primaryButtonText}>
                {submitting ? 'Updating...' : 'Update Budget'}
              </Text>
            </Pressable>

            <Pressable
              style={[dashboardStyles.taskButton, dashboardStyles.taskButtonDelete, { marginTop: 12 }]}
              onPress={handleDelete}
            >
              <Text style={dashboardStyles.taskButtonText}>Delete Budget</Text>
            </Pressable>
          </>
        )}

        {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
