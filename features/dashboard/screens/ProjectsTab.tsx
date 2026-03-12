import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';
import { apiFetch } from '@/services/api';

export default function ProjectsTab() {
  const router = useRouter();
  const [projects, setProjects] = useState<{
    id: string | number;
    name: string;
    budget?: number;
    status?: boolean | string;
    description?: string;
    invited?: boolean;
    role?: string | null;
    is_active?: boolean;
    tasks?: { status?: string }[];
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const data = await apiFetch<{
          projects: {
            id: string | number;
            name: string;
            budget?: number;
            status?: boolean | string;
            description?: string;
            is_active?: boolean;
            tasks?: { status?: string }[];
          }[];
          invitedProjects?: { project: typeof projects[number]; role?: string | null }[];
        }>('/dashboard?format=json', {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        const invited = (data.invitedProjects || [])
          .filter((item) => item.project)
          .map((item) => ({ ...item.project, invited: true, role: item.role ?? null }));
        setProjects([...(data.projects || []), ...invited]);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Projects</Text>
      <Text style={dashboardStyles.subtitle}>Track ongoing and invited projects.</Text>

      {loading ? (
        <ActivityIndicator color="#6d28d9" />
      ) : projects.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No projects found.</Text>
      ) : (
        projects.map((project) => {
          const budgetValue = project.budget ? Number(project.budget) : null;
          const budgetLabel = budgetValue && !Number.isNaN(budgetValue)
            ? `KES ${budgetValue.toLocaleString()}`
            : 'Not set';
          return (
            <View key={project.id} style={dashboardStyles.card}>
              <Text style={dashboardStyles.cardTitle}>{project.name}</Text>
              {!!project.description && (
                <Text style={dashboardStyles.cardSubtitle} numberOfLines={2}>
                  {project.description}
                </Text>
              )}
              <Text style={dashboardStyles.cardSubtitle}>Budget: {budgetLabel}</Text>
              <View style={dashboardStyles.row}>
                <View style={dashboardStyles.pill}>
                  <Text style={dashboardStyles.pillText}>
                    {project.invited
                      ? `Invited${project.role ? ` • ${project.role}` : ''}`
                      : (() => {
                          const tasks = Array.isArray(project.tasks) ? project.tasks : [];
                          const total = tasks.length;
                          const completed = tasks.filter((task) => task.status === 'completed').length;
                          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                          return progress < 100 ? 'Active' : 'Inactive';
                        })()}
                  </Text>
                </View>
                <Pressable
                  style={dashboardStyles.primaryButton}
                  onPress={() => router.push(`/projects/${project.id}`)}
                >
                  <Text style={dashboardStyles.primaryButtonText}>View Project</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
      {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
    </ScrollView>
  );
}
