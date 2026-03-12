import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { getUserSession } from '@/services/userSession';
import { apiFetch } from '@/services/api';
import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

type ProjectSummary = {
  id: string | number;
  name: string;
  budget?: number;
  start_date?: string;
  deadline?: string;
  status?: boolean | string;
  tasks?: { status?: string }[];
};

type BudgetSummary = {
  id: string | number;
  project_id?: { id?: string | number } | string | number;
  totalBudget?: number | string;
  total_budget?: number | string;
};

type DashboardStats = {
  activeProjects: number;
  tasksDue: number;
  budgetSpent?: number;
  teamMembers?: number;
};

type DashboardHomeResponse = {
  projects: ProjectSummary[];
  invitedProjects?: Array<{ project: ProjectSummary }>;
  budgets?: BudgetSummary[];
  taskStatusCounts: {
    pending: number;
    in_progress: number;
    completed: number;
  };
  activeProjects: number;
  tasksDue: number;
  budgetSpent?: number;
  teamMembers?: number;
};

export default function DashboardHome() {
  const user = getUserSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [taskCounts, setTaskCounts] = useState<DashboardHomeResponse['taskStatusCounts']>({
    pending: 0,
    in_progress: 0,
    completed: 0,
  });
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    tasksDue: 0,
    budgetSpent: 0,
    teamMembers: 0,
  });
  const [invitedProjects, setInvitedProjects] = useState<Array<{ project: ProjectSummary }>>([]);
  const [projectBudgetMap, setProjectBudgetMap] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const data = await apiFetch<DashboardHomeResponse>('/dashboard?format=json', {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        setProjects(data.projects || []);
        setInvitedProjects(data.invitedProjects || []);
        setTaskCounts(data.taskStatusCounts || { pending: 0, in_progress: 0, completed: 0 });
        setStats({
          activeProjects: data.activeProjects ?? 0,
          tasksDue: data.tasksDue ?? 0,
          budgetSpent: data.budgetSpent ?? 0,
          teamMembers: data.teamMembers ?? 0,
        });
        const budgetMap: Record<string, number> = {};
        (data.budgets || []).forEach((budget) => {
          const projectRef = budget.project_id;
          const projectId = typeof projectRef === 'object' ? projectRef?.id : projectRef;
          if (projectId === undefined) return;
          const value = budget.totalBudget ?? budget.total_budget;
          const numeric = Number(value ?? 0);
          budgetMap[String(projectId)] = Number.isNaN(numeric) ? 0 : numeric;
        });
        setProjectBudgetMap(budgetMap);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    { label: 'Active Projects', value: stats.activeProjects },
    { label: 'Tasks Due', value: stats.tasksDue },
  ];

  const totalTasks = taskCounts.pending + taskCounts.in_progress + taskCounts.completed;
  const allProjectsForProgress = [
    ...projects.map((project) => ({ project })),
    ...(invitedProjects || []),
  ].slice(0, 5);

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Welcome back{user?.name ? `, ${user.name}` : ''}!</Text>
      <Text style={dashboardStyles.subtitle}>Here is your BuildOnBudget overview.</Text>

      {/* Stats Grid */}
      <View style={dashboardStyles.statGrid}>
        {statCards.map((item) => (
          <View key={item.label} style={dashboardStyles.statCard}>
            <Text style={dashboardStyles.statLabel}>{item.label}</Text>
            <Text style={dashboardStyles.statValue}>{item.value}</Text>
          </View>
        ))}
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statLabel}>Budget Spent</Text>
          <Text style={dashboardStyles.statValue}>{stats.budgetSpent ?? 0}</Text>
        </View>
        <View style={dashboardStyles.statCard}>
          <Text style={dashboardStyles.statLabel}>Team Members</Text>
          <Text style={dashboardStyles.statValue}>{stats.teamMembers ?? 0}</Text>
        </View>
      </View>

      {/* Task Status Graph */}
      <Text style={[dashboardStyles.sectionTitle, { marginTop: 24 }]}>Task Progress</Text>
      <View style={dashboardStyles.chartCard}>
        {loading ? (
          <ActivityIndicator color="#6d28d9" />
        ) : totalTasks === 0 ? (
          <Text style={dashboardStyles.chartEmptyText}>No tasks yet.</Text>
        ) : (
          <>
            <View style={dashboardStyles.chartBar}>
              {taskCounts.completed > 0 && (
                <View style={[dashboardStyles.chartSegment, dashboardStyles.chartCompleted, { flex: taskCounts.completed }]} />
              )}
              {taskCounts.in_progress > 0 && (
                <View style={[dashboardStyles.chartSegment, dashboardStyles.chartInProgress, { flex: taskCounts.in_progress }]} />
              )}
              {taskCounts.pending > 0 && (
                <View style={[dashboardStyles.chartSegment, dashboardStyles.chartPending, { flex: taskCounts.pending }]} />
              )}
            </View>
            <View style={dashboardStyles.legendRow}>
              <View style={dashboardStyles.legendItem}>
                <View style={[dashboardStyles.legendDot, dashboardStyles.chartCompleted]} />
                <Text style={dashboardStyles.legendText}>Completed ({taskCounts.completed})</Text>
              </View>
              <View style={dashboardStyles.legendItem}>
                <View style={[dashboardStyles.legendDot, dashboardStyles.chartInProgress]} />
                <Text style={dashboardStyles.legendText}>In progress ({taskCounts.in_progress})</Text>
              </View>
              <View style={dashboardStyles.legendItem}>
                <View style={[dashboardStyles.legendDot, dashboardStyles.chartPending]} />
                <Text style={dashboardStyles.legendText}>Pending ({taskCounts.pending})</Text>
              </View>
            </View>
          </>
        )}
        {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
      </View>

      {/* Projects */}
      <Text style={[dashboardStyles.sectionTitle, { marginTop: 24 }]}>Your Projects</Text>
      {loading ? (
        <ActivityIndicator color="#6d28d9" />
      ) : projects.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No projects found.</Text>
      ) : (
        projects.map((project) => {
          const mappedBudget = projectBudgetMap[String(project.id)];
          const budgetValue = mappedBudget ?? (project.budget ? Number(project.budget) : null);
          const budgetLabel = budgetValue && !Number.isNaN(budgetValue)
            ? `KES ${budgetValue.toLocaleString()}`
            : 'Not set';
          return (
            <View key={project.id} style={dashboardStyles.card}>
              <Text style={dashboardStyles.cardTitle}>{project.name}</Text>
              <Text style={dashboardStyles.cardSubtitle}>Budget: {budgetLabel}</Text>
            </View>
          );
        })
      )}

      {/* Project Completion */}
      <Text style={[dashboardStyles.sectionTitle, { marginTop: 24 }]}>Project Completion</Text>
      {loading ? (
        <ActivityIndicator color="#6d28d9" />
      ) : allProjectsForProgress.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No projects yet.</Text>
      ) : (
        allProjectsForProgress.map((item) => {
          const project = item.project;
          const tasks = Array.isArray((project as { tasks?: unknown }).tasks)
            ? ((project as { tasks: Array<{ status?: string }> }).tasks)
            : [];
          const completed = tasks.filter((task) => task.status === 'completed').length;
          const total = tasks.length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          return (
            <View key={project.id} style={dashboardStyles.card}>
              <View style={dashboardStyles.row}>
                <Text style={dashboardStyles.cardTitle}>{project.name}</Text>
                <Text style={dashboardStyles.cardSubtitle}>{progress}%</Text>
              </View>
              <View style={dashboardStyles.progressTrack}>
                <View style={[dashboardStyles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
