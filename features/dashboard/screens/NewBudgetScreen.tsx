import React, { useEffect, useMemo, useState } from 'react';
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

type BudgetComponent = {
  name: string;
  cost: string;
};

export default function NewBudgetScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectId, setProjectId] = useState<string>('');
  const [totalBudget, setTotalBudget] = useState('');
  const [components, setComponents] = useState<BudgetComponent[]>([]);
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

  const allocatedTotal = useMemo(() => {
    return components.reduce((sum, component) => sum + (parseFloat(component.cost) || 0), 0);
  }, [components]);

  const remaining = useMemo(() => {
    const total = parseFloat(totalBudget) || 0;
    return total - allocatedTotal;
  }, [totalBudget, allocatedTotal]);

  const addComponent = () => {
    setComponents((current) => [...current, { name: '', cost: '' }]);
  };

  const updateComponent = (index: number, field: keyof BudgetComponent, value: string) => {
    setComponents((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const removeComponent = (index: number) => {
    setComponents((current) => current.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    const total = parseFloat(totalBudget);
    if (!projectId || !Number.isFinite(total)) {
      Alert.alert('Missing fields', 'Please select a project and enter a total budget.');
      return;
    }
    const parsedComponents = components
      .map((component) => ({
        name: component.name.trim(),
        cost: parseFloat(component.cost),
      }))
      .filter((component) => component.name && Number.isFinite(component.cost));

    const allocated = parsedComponents.reduce((sum, component) => sum + component.cost, 0);
    if (Math.abs(allocated - total) > 0.01) {
      Alert.alert('Budget mismatch', 'Component costs must equal the total budget.');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/budget', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          totalBudget: total,
          components: parsedComponents,
        }),
      });
      Alert.alert('Success', 'Budget saved successfully.');
      router.replace('/(dashboard)/budget');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save budget';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Setup Project Budget</Text>
      <Text style={dashboardStyles.subtitle}>Break down the budget into components.</Text>

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

        <Text style={dashboardStyles.formLabel}>Total Budget</Text>
        <TextInput
          style={dashboardStyles.formInput}
          placeholder="Enter total budget"
          keyboardType="numeric"
          value={totalBudget}
          onChangeText={setTotalBudget}
        />

        <Text style={dashboardStyles.formLabel}>Budget Breakdown</Text>
        {components.map((component, index) => (
          <View key={`component-${index}`} style={dashboardStyles.componentRow}>
            <TextInput
              style={[dashboardStyles.formInput, dashboardStyles.componentInput]}
              placeholder="Component name"
              value={component.name}
              onChangeText={(value) => updateComponent(index, 'name', value)}
            />
            <TextInput
              style={[dashboardStyles.formInput, dashboardStyles.componentInput]}
              placeholder="Cost"
              keyboardType="numeric"
              value={component.cost}
              onChangeText={(value) => updateComponent(index, 'cost', value)}
            />
            <Pressable
              style={[dashboardStyles.taskButton, dashboardStyles.taskButtonDelete]}
              onPress={() => removeComponent(index)}
            >
              <Text style={dashboardStyles.taskButtonText}>Remove</Text>
            </Pressable>
          </View>
        ))}
        <Pressable style={dashboardStyles.primaryButton} onPress={addComponent}>
          <Text style={dashboardStyles.primaryButtonText}>+ Add Component</Text>
        </Pressable>

        <View style={dashboardStyles.budgetTotalsCard}>
          <Text style={dashboardStyles.listItemMeta}>
            Total Allocated: {allocatedTotal.toFixed(2)} /=
          </Text>
          <Text style={dashboardStyles.listItemMeta}>Remaining: {remaining.toFixed(2)} /=</Text>
          <Text
            style={[
              dashboardStyles.listItemMeta,
              remaining === 0
                ? dashboardStyles.balanceGood
                : remaining > 0
                ? dashboardStyles.balanceWarn
                : dashboardStyles.balanceBad,
            ]}
          >
            {remaining === 0
              ? 'Budget perfectly allocated!'
              : remaining > 0
              ? `${remaining.toFixed(2)} /= remaining to allocate.`
              : `Overallocated by ${Math.abs(remaining).toFixed(2)} /=.`}
          </Text>
        </View>

        <Pressable
          style={[dashboardStyles.primaryButton, submitting && dashboardStyles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={dashboardStyles.primaryButtonText}>
            {submitting ? 'Saving...' : 'Save Budget'}
          </Text>
        </Pressable>

        {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
