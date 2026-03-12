import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';
import { apiFetch } from '@/services/api';

export default function BudgetTab() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Array<{
    id: string | number;
    project_id?: { id?: string | number; name?: string } | string | number;
    totalBudget?: number | string;
    components?: string | Array<{ name: string; cost: number }>;
  }>>([]);
  const [projectNameMap, setProjectNameMap] = useState<Record<string, string>>({});
  const [openBudget, setOpenBudget] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBudgets = async () => {
      try {
        const data = await apiFetch<{ budgets: typeof budgets; projects?: Array<{ id: string | number; name: string }> }>(
          '/dashboard?format=json',
          {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        setBudgets(data.budgets || []);
        const map: Record<string, string> = {};
        (data.projects || []).forEach((project) => {
          map[String(project.id)] = project.name;
        });
        setProjectNameMap(map);
        setOpenBudget(data.budgets?.[0]?.id ? String(data.budgets[0].id) : null);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load budgets');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBudgets();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = (budgetId: string | number) => {
    Alert.alert('Delete budget?', 'Are you sure you want to delete this budget?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiFetch(`/budget/${budgetId}`, { method: 'DELETE' });
            setBudgets((current) => current.filter((budget) => budget.id !== budgetId));
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete budget');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Budget</Text>
      <View style={dashboardStyles.sectionHeaderRow}>
        <Text style={dashboardStyles.subtitle}>Allocate budgets per project.</Text>
        <Pressable style={dashboardStyles.primaryButton} onPress={() => router.push('/budget/new')}>
          <Text style={dashboardStyles.primaryButtonText}>+ New Budget</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color="#6d28d9" />
      ) : budgets.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No budgets found.</Text>
      ) : (
        budgets.map((budget) => {
          let components: Array<{ name: string; cost: number }> = [];
          if (Array.isArray(budget.components)) {
            components = budget.components;
          } else if (typeof budget.components === 'string') {
            try {
              components = JSON.parse(budget.components);
            } catch {
              components = [];
            }
          }
          const totalBudget = Number(budget.totalBudget || 0);
          const allocated = components.reduce((sum, item) => sum + Number(item.cost || 0), 0);
          const difference = allocated - totalBudget;
          const open = openBudget === String(budget.id);
          const projectName =
            typeof budget.project_id === 'object'
              ? budget.project_id?.name
              : projectNameMap[String(budget.project_id ?? '')] || 'Project';

          return (
            <View key={budget.id} style={dashboardStyles.card}>
              <Pressable
                style={dashboardStyles.row}
                onPress={() => setOpenBudget(open ? null : String(budget.id))}
              >
                <Text style={dashboardStyles.cardTitle}>{projectName}</Text>
                <Text style={dashboardStyles.actionText}>{open ? 'Hide' : 'Show'}</Text>
              </Pressable>
              <Text style={dashboardStyles.cardSubtitle}>Total budget: {totalBudget} /=</Text>
              <View style={dashboardStyles.taskActions}>
                <Pressable
                  style={[dashboardStyles.taskButton, dashboardStyles.taskButtonEdit]}
                  onPress={() => router.push(`/budget/edit/${budget.id}`)}
                >
                  <Text style={dashboardStyles.taskButtonText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[dashboardStyles.taskButton, dashboardStyles.taskButtonDelete]}
                  onPress={() => handleDelete(budget.id)}
                >
                  <Text style={dashboardStyles.taskButtonText}>Delete</Text>
                </Pressable>
              </View>
              {open && (
                <View style={{ marginTop: 12 }}>
                  {components.map((component) => (
                    <View key={component.name} style={dashboardStyles.listItem}>
                      <Text style={dashboardStyles.listItemTitle}>{component.name}</Text>
                      <Text style={dashboardStyles.listItemMeta}>Cost: {component.cost} /=</Text>
                    </View>
                  ))}
                  <Text style={dashboardStyles.cardSubtitle}>
                    Allocated: {allocated} /= of {totalBudget} /=
                  </Text>
                  <Text style={dashboardStyles.cardSubtitle}>
                    {difference === 0
                      ? 'Perfectly allocated'
                      : difference > 0
                      ? `Overallocated by ${difference} /=`
                      : `Underallocated by ${Math.abs(difference)} /=`}
                  </Text>
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
