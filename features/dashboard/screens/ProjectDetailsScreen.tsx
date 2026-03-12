import React, { useEffect, useState } from 'react';

import { useTheme } from '@/context/theme';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { apiFetch, getApiUrl } from '@/services/api';
import { useDashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

type ProjectDetails = {
  id: string | number;
  name: string;
  description?: string;
  budget?: number;
  start_date?: string;
  deadline?: string;
  status?: boolean | string;
  client_name?: string;
  client_contact?: string;
  location?: string;
  materials?: string;
  contractors?: string;
  permits?: string;
  safety?: string;
  attachment_name?: string | null;
  attachment_type?: string | null;
  tasks?: {
    id: string | number;
    name: string;
    status?: string;
  }[];
  budgets?: {
    id: string | number;
    totalBudget?: number | string;
    total_budget?: number | string;
    components?: string | { name: string; cost: number }[];
    project_id?: { id?: string | number } | string | number;
  }[];
};

export default function ProjectDetailsScreen() {
  const dashboardStyles = useDashboardStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const normalizeProject = (payload: unknown, projectId: string) => {
      const targetId = String(projectId);
      const pickIfMatch = (value: unknown) => {
        if (!value || typeof value !== 'object') return null;
        const candidate = value as ProjectDetails;
        if (candidate.id !== undefined && String(candidate.id) === targetId) {
          return candidate;
        }
        return null;
      };

      if (!payload) return null;

      if (typeof payload === 'object') {
        const asRecord = payload as {
          data?: unknown;
          project?: unknown;
          projects?: unknown;
          invitedProjects?: unknown;
        };

        const direct = pickIfMatch(payload);
        if (direct) return direct;

        const dataMatch = pickIfMatch(asRecord.data);
        if (dataMatch) return dataMatch;

        const projectMatch = pickIfMatch(asRecord.project);
        if (projectMatch) return projectMatch;

        if (Array.isArray(asRecord.projects)) {
          const fromProjects = asRecord.projects.map(pickIfMatch).find(Boolean);
          if (fromProjects) return fromProjects;
        }

        if (Array.isArray(asRecord.invitedProjects)) {
          for (const item of asRecord.invitedProjects) {
            if (item && typeof item === 'object') {
              const project = (item as { project?: unknown }).project;
              const match = pickIfMatch(project);
              if (match) return match;
            }
          }
        }
      }

      return null;
    };

    const attachBudgets = (project: ProjectDetails | null, source: unknown, projectId: string) => {
      if (!project || project.budgets?.length) return project;
      if (!source || typeof source !== 'object') return project;
      const sourceBudgets = (source as { budgets?: ProjectDetails['budgets'] }).budgets;
      if (!Array.isArray(sourceBudgets)) return project;
      const targetId = String(projectId);
      const matched = sourceBudgets.filter((budget) => {
        const projectRef = budget?.project_id;
        const projectValue = typeof projectRef === 'object' ? projectRef?.id : projectRef;
        return projectValue !== undefined && String(projectValue) === targetId;
      }).map((budget) => ({
        ...budget,
        totalBudget: budget?.totalBudget ?? budget?.total_budget,
      }));
      return { ...project, budgets: matched };
    };

    const loadProject = async () => {
      if (!id) {
        setError('Missing project id');
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch<ProjectDetails>(`/dashboard/${id}?format=json`, {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        const normalized = attachBudgets(normalizeProject(data, id), data, id);
        if (normalized) {
          setProject(normalized);
          setError(null);
          return;
        }

        const fallback = await apiFetch<{
          projects?: ProjectDetails[];
          invitedProjects?: { project?: ProjectDetails }[];
          budgets?: ProjectDetails['budgets'];
        }>('/dashboard?format=json', {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        const fallbackProject = attachBudgets(normalizeProject(fallback, id), fallback, id);
        if (fallbackProject) {
          setProject(fallbackProject);
          setError(null);
          return;
        }

        setProject(null);
        setError('Project not found');
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOpenAttachment = async () => {
    if (!project?.id) return;
    const url = `${getApiUrl()}/projects/${project.id}/attachment`;
    await WebBrowser.openBrowserAsync(url);
  };

  const budgetValue = project?.budget ? Number(project.budget) : null;
  const budgetLabel = budgetValue && !Number.isNaN(budgetValue)
    ? `KES ${budgetValue.toLocaleString()}`
    : 'Not set';
  const hasAttachment = Boolean(project?.attachment_name || project?.attachment_type);
  const tasks = project?.tasks || [];
  const budgets = project?.budgets || [];

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Pressable style={dashboardStyles.primaryButton} onPress={() => router.back()}>
        <Text style={dashboardStyles.primaryButtonText}>Back</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : !project ? (
        <Text style={dashboardStyles.chartEmptyText}>Project not found.</Text>
      ) : (
        <>
          <Text style={[dashboardStyles.title, { marginTop: 8 }]}>{project.name}</Text>
          {!!project.description && (
            <Text style={dashboardStyles.subtitle}>{project.description}</Text>
          )}

          <View style={[dashboardStyles.card, { marginTop: 8 }]}>
            <View style={dashboardStyles.detailRow}>
              <Text style={dashboardStyles.detailLabel}>Budget</Text>
              <Text style={dashboardStyles.detailValue}>{budgetLabel}</Text>
            </View>
            {project.start_date && (
              <View style={dashboardStyles.detailRow}>
                <Text style={dashboardStyles.detailLabel}>Start Date</Text>
                <Text style={dashboardStyles.detailValue}>
                  {new Date(project.start_date).toLocaleDateString()}
                </Text>
              </View>
            )}
            {project.deadline && (
              <View style={dashboardStyles.detailRow}>
                <Text style={dashboardStyles.detailLabel}>End Date</Text>
                <Text style={dashboardStyles.detailValue}>
                  {new Date(project.deadline).toLocaleDateString()}
                </Text>
              </View>
            )}
            {project.location && (
              <View style={dashboardStyles.detailRow}>
                <Text style={dashboardStyles.detailLabel}>Location</Text>
                <Text style={dashboardStyles.detailValue}>{project.location}</Text>
              </View>
            )}
            {project.client_name && (
              <View style={dashboardStyles.detailRow}>
                <Text style={dashboardStyles.detailLabel}>Client</Text>
                <Text style={dashboardStyles.detailValue}>{project.client_name}</Text>
              </View>
            )}
            {project.client_contact && (
              <View style={dashboardStyles.detailRow}>
                <Text style={dashboardStyles.detailLabel}>Contact</Text>
                <Text style={dashboardStyles.detailValue}>{project.client_contact}</Text>
              </View>
            )}
          </View>

          {(project.materials || project.contractors || project.permits || project.safety) && (
            <View style={dashboardStyles.card}>
              {project.materials && (
                <View style={dashboardStyles.detailBlock}>
                  <Text style={dashboardStyles.detailLabel}>Materials</Text>
                  <Text style={dashboardStyles.detailValueBlock}>{project.materials}</Text>
                </View>
              )}
              {project.contractors && (
                <View style={dashboardStyles.detailBlock}>
                  <Text style={dashboardStyles.detailLabel}>Contractors</Text>
                  <Text style={dashboardStyles.detailValueBlock}>{project.contractors}</Text>
                </View>
              )}
              {project.permits && (
                <View style={dashboardStyles.detailBlock}>
                  <Text style={dashboardStyles.detailLabel}>Permits</Text>
                  <Text style={dashboardStyles.detailValueBlock}>{project.permits}</Text>
                </View>
              )}
              {project.safety && (
                <View style={dashboardStyles.detailBlock}>
                  <Text style={dashboardStyles.detailLabel}>Safety</Text>
                  <Text style={dashboardStyles.detailValueBlock}>{project.safety}</Text>
                </View>
              )}
            </View>
          )}

          <View style={dashboardStyles.card}>
            <Text style={dashboardStyles.sectionTitle}>Project Document</Text>
            {hasAttachment ? (
              <>
                <Text style={dashboardStyles.cardSubtitle}>
                  {project.attachment_name || 'Attachment available'}
                </Text>
                <Pressable style={dashboardStyles.primaryButton} onPress={handleOpenAttachment}>
                  <Text style={dashboardStyles.primaryButtonText}>View / Download</Text>
                </Pressable>
              </>
            ) : (
              <Text style={dashboardStyles.cardSubtitle}>No attachment uploaded.</Text>
            )}
          </View>

          <View style={dashboardStyles.card}>
            <Text style={dashboardStyles.sectionTitle}>Tasks</Text>
            {tasks.length === 0 ? (
              <Text style={dashboardStyles.cardSubtitle}>No tasks yet.</Text>
            ) : (
              tasks.map((task) => (
                <View key={task.id} style={dashboardStyles.listItem}>
                  <Text style={dashboardStyles.listItemTitle}>{task.name}</Text>
                  <Text style={dashboardStyles.listItemMeta}>Status: {task.status}</Text>
                </View>
              ))
            )}
          </View>

          <View style={dashboardStyles.card}>
            <Text style={dashboardStyles.sectionTitle}>Budget Breakdown</Text>
            {budgets.length === 0 ? (
              <Text style={dashboardStyles.cardSubtitle}>No budgets set.</Text>
            ) : (
              budgets.map((budget) => {
                let components: { name: string; cost: number }[] = [];
                if (Array.isArray(budget.components)) {
                  components = budget.components;
                } else if (typeof budget.components === 'string') {
                  try {
                    components = JSON.parse(budget.components);
                  } catch {
                    components = [];
                  }
                }
                const totalBudget = budget.totalBudget ?? budget.total_budget ?? '—';
                return (
                  <View key={budget.id} style={{ marginBottom: 12 }}>
                    <Text style={dashboardStyles.cardSubtitle}>
                      Total Budget: {totalBudget} /=
                    </Text>
                    {components.map((component) => (
                      <View key={component.name} style={dashboardStyles.listItem}>
                        <Text style={dashboardStyles.listItemTitle}>{component.name}</Text>
                        <Text style={dashboardStyles.listItemMeta}>Cost: {component.cost} /=</Text>
                      </View>
                    ))}
                  </View>
                );
              })
            )}
          </View>
        </>
      )}
      {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
    </ScrollView>
  );
}
