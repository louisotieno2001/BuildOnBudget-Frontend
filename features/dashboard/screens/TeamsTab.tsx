import React, { useEffect, useState } from 'react';

import { useTheme } from '@/context/theme';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useDashboardStyles } from '@/features/dashboard/styles/dashboardStyles';
import { apiFetch } from '@/services/api';

export default function TeamsTab() {
  const dashboardStyles = useDashboardStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const [teamsByYou, setTeamsByYou] = useState<{
    id: string | number;
    project_id?: { id?: string | number; name?: string } | string | number;
    email?: string;
    role?: string;
    status?: string;
  }[]>([]);
  const [teamsInvitedTo, setTeamsInvitedTo] = useState<{
    id: string | number;
    project_id?: { id?: string | number; name?: string } | string | number;
    role?: string;
    status?: string;
  }[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTeams = async () => {
      try {
        const data = await apiFetch<{
          teamsByYou: typeof teamsByYou;
          teamsInvitedTo: typeof teamsInvitedTo;
        }>('/dashboard?format=json', { headers: { Accept: 'application/json' } });
        if (!isMounted) return;
        setTeamsByYou(data.teamsByYou || []);
        setTeamsInvitedTo(data.teamsInvitedTo || []);
        setOpen(data.teamsByYou?.[0]?.project_id ? String(data.teamsByYou[0].project_id) : null);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load teams');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAcceptInvite = async (inviteId: string | number) => {
    try {
      await apiFetch(`/team/${inviteId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'accepted' }),
      });
      setTeamsInvitedTo((current) =>
        current.map((invite) =>
          invite.id === inviteId ? { ...invite, status: 'accepted' } : invite
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invite');
    }
  };

  const handleCancelInvite = async (inviteId: string | number) => {
    try {
      await apiFetch(`/team/${inviteId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
      });
      setTeamsByYou((current) =>
        current.map((team) => (team.id === inviteId ? { ...team, status: 'cancelled' } : team))
      );
      setTeamsInvitedTo((current) =>
        current.map((team) => (team.id === inviteId ? { ...team, status: 'cancelled' } : team))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel invitation');
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Teams</Text>
      <View style={dashboardStyles.sectionHeaderRow}>
        <Text style={dashboardStyles.subtitle}>Manage teams.</Text>
        <Pressable style={dashboardStyles.primaryButton} onPress={() => router.push('/teams/invite')}>
          <Text style={dashboardStyles.primaryButtonText}>+ Invite Member</Text>
        </Pressable>
      </View>

      <Text style={dashboardStyles.sectionTitle}>Teams by You</Text>
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : teamsByYou.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No team members yet.</Text>
      ) : (
        teamsByYou.map((team) => {
          const projectName =
            typeof team.project_id === 'object' ? team.project_id?.name : 'Project';
          const openKey = String(team.project_id ?? team.id);
          const isOpen = open === openKey;
          return (
            <View key={`${team.id}`} style={dashboardStyles.card}>
              <Pressable
                style={dashboardStyles.row}
                onPress={() => setOpen(isOpen ? null : openKey)}
              >
                <Text style={dashboardStyles.cardTitle}>{projectName}</Text>
                <Text style={dashboardStyles.actionText}>{isOpen ? 'Hide' : 'Show'}</Text>
              </Pressable>
              {isOpen && (
                <View style={{ marginTop: 12 }}>
                  <View style={dashboardStyles.listItem}>
                    <Text style={dashboardStyles.listItemTitle}>{team.email}</Text>
                    <Text style={dashboardStyles.listItemMeta}>Role: {team.role}</Text>
                    <Text style={dashboardStyles.listItemMeta}>Status: {team.status}</Text>
                    <View style={dashboardStyles.taskActions}>
                      <Pressable
                        style={[dashboardStyles.taskButton, dashboardStyles.taskButtonEdit]}
                        onPress={() => router.push(`/teams/edit/${team.id}`)}
                      >
                        <Text style={dashboardStyles.taskButtonText}>Edit</Text>
                      </Pressable>
                      <Pressable
                        style={[dashboardStyles.taskButton, dashboardStyles.taskButtonDelete]}
                        onPress={() => handleCancelInvite(team.id)}
                      >
                        <Text style={dashboardStyles.taskButtonText}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })
      )}

      <Text style={dashboardStyles.sectionTitle}>Teams Invited To</Text>
      {loading ? null : teamsInvitedTo.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No invitations yet.</Text>
      ) : (
        teamsInvitedTo.map((invite) => {
          const projectName =
            typeof invite.project_id === 'object' ? invite.project_id?.name : 'Project';
          return (
            <View key={invite.id} style={dashboardStyles.notificationCard}>
              <Text style={dashboardStyles.notificationTitle}>{projectName}</Text>
              <Text style={dashboardStyles.notificationMeta}>Role: {invite.role}</Text>
              <Text style={dashboardStyles.notificationMeta}>Status: {invite.status}</Text>
              {invite.status === 'pending' && (
                <View style={dashboardStyles.taskActions}>
                  <Pressable
                    style={dashboardStyles.primaryButton}
                    onPress={() => handleAcceptInvite(invite.id)}
                  >
                    <Text style={dashboardStyles.primaryButtonText}>Accept Invite</Text>
                  </Pressable>
                  <Pressable
                    style={[dashboardStyles.taskButton, dashboardStyles.taskButtonDelete]}
                    onPress={() => handleCancelInvite(invite.id)}
                  >
                    <Text style={dashboardStyles.taskButtonText}>Cancel</Text>
                  </Pressable>
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
