import React, { useEffect, useState } from 'react';

import { useTheme } from '@/context/theme';
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import { useDashboardStyles } from '@/features/dashboard/styles/dashboardStyles';
import { apiFetch } from '@/services/api';

export default function ProjectsTab() {
  const dashboardStyles = useDashboardStyles();
  const { colors } = useTheme();
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
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [materials, setMaterials] = useState('');
  const [contractors, setContractors] = useState('');
  const [permits, setPermits] = useState('');
  const [safety, setSafety] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [attachmentType, setAttachmentType] = useState<string | null>(null);
  const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
  const [attachmentSize, setAttachmentSize] = useState<number | null>(null);

  const projectTypes = [
    'residential',
    'commercial',
    'infrastructure',
    'renovation',
    'industrial',
  ];

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

  const resetForm = () => {
    setName('');
    setType('');
    setClientName('');
    setClientContact('');
    setLocation('');
    setDescription('');
    setBudget('');
    setStartDate('');
    setEndDate('');
    setMaterials('');
    setContractors('');
    setPermits('');
    setSafety('');
    setAttachmentName(null);
    setAttachmentType(null);
    setAttachmentBase64(null);
    setAttachmentSize(null);
  };

  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setAttachmentName(asset.name ?? 'attachment.pdf');
      setAttachmentType(asset.mimeType ?? 'application/pdf');
      setAttachmentBase64(base64);
      setAttachmentSize(typeof asset.size === 'number' ? asset.size : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read attachment');
    }
  };

  const handleCreateProject = async () => {
    if (!name.trim() || !type || !location.trim() || !budget.trim() || !startDate.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (attachmentName && !attachmentBase64) {
      setError('The PDF could not be loaded. Please re-select the file.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        client_name: clientName.trim() || null,
        client_contact: clientContact.trim() || null,
        location: location.trim(),
        description: description.trim() || null,
        budget: budget.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim() || null,
        materials: materials.trim() || null,
        contractors: contractors.trim() || null,
        permits: permits.trim() || null,
        safety: safety.trim() || null,
        attachment_name: attachmentName,
        attachment_type: attachmentType,
        attachment_base64: attachmentBase64,
      };

      const response = await apiFetch<{ message?: string }>('/new-project', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setNotice(response.message || 'Project created successfully.');
      setError(null);
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <View style={dashboardStyles.sectionHeaderRow}>
        <View>
          <Text style={dashboardStyles.title}>Projects</Text>
          <Text style={dashboardStyles.subtitle}>Track ongoing and invited projects.</Text>
        </View>
        <Pressable
          style={dashboardStyles.primaryButton}
          onPress={() => setShowForm((current) => !current)}
        >
          <Text style={dashboardStyles.primaryButtonText}>
            {showForm ? 'Hide Form' : '+ New Project'}
          </Text>
        </Pressable>
      </View>

      {showForm && (
        <View style={dashboardStyles.formCard}>
          <Text style={dashboardStyles.sectionTitle}>Create New Construction Project</Text>

          <Text style={dashboardStyles.formLabel}>Project Name *</Text>
          <TextInput
            style={dashboardStyles.formInput}
            placeholder="e.g., GreenVille Apartments"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={dashboardStyles.formLabel}>Project Type *</Text>
          <View style={dashboardStyles.optionGroup}>
            {projectTypes.map((value) => (
              <Pressable
                key={value}
                style={[
                  dashboardStyles.optionItem,
                  type === value && dashboardStyles.optionItemSelected,
                ]}
                onPress={() => setType(value)}
              >
                <Text style={dashboardStyles.optionText}>{value}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={dashboardStyles.formLabel}>Client Name</Text>
          <TextInput
            style={dashboardStyles.formInput}
            placeholder="Enter client full name"
            placeholderTextColor={colors.textMuted}
            value={clientName}
            onChangeText={setClientName}
          />

          <Text style={dashboardStyles.formLabel}>Client Contact</Text>
          <TextInput
            style={dashboardStyles.formInput}
            placeholder="Phone or Email"
            placeholderTextColor={colors.textMuted}
            value={clientContact}
            onChangeText={setClientContact}
          />

          <Text style={dashboardStyles.formLabel}>Project Location *</Text>
          <TextInput
            style={dashboardStyles.formInput}
            placeholder="City, Address, Plot No."
            placeholderTextColor={colors.textMuted}
            value={location}
            onChangeText={setLocation}
          />

          <Text style={dashboardStyles.formLabel}>Scope of Work</Text>
          <TextInput
            style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
            placeholder="E.g., 10-floor apartment with parking, landscaping, and amenities..."
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={dashboardStyles.formLabel}>Estimated Budget (KES) *</Text>
          <TextInput
            style={dashboardStyles.formInput}
            placeholder="Enter budget amount"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />

          <Text style={dashboardStyles.formLabel}>Start Date *</Text>
          <TextInput
            style={dashboardStyles.formInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text style={dashboardStyles.formLabel}>Expected Completion Date</Text>
          <TextInput
            style={dashboardStyles.formInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
            value={endDate}
            onChangeText={setEndDate}
          />

          <Text style={dashboardStyles.formLabel}>Key Materials</Text>
          <TextInput
            style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
            placeholder="Cement, Steel, Sand, Bricks, Glass, Roofing..."
            placeholderTextColor={colors.textMuted}
            value={materials}
            onChangeText={setMaterials}
            multiline
          />

          <Text style={dashboardStyles.formLabel}>Subcontractors / Teams Involved</Text>
          <TextInput
            style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
            placeholder="Electrical, Plumbing, Masonry, Painting..."
            placeholderTextColor={colors.textMuted}
            value={contractors}
            onChangeText={setContractors}
            multiline
          />

          <Text style={dashboardStyles.formLabel}>Approvals & Permits</Text>
          <TextInput
            style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
            placeholder="NEMA Approval, County Permit, Safety Compliance..."
            placeholderTextColor={colors.textMuted}
            value={permits}
            onChangeText={setPermits}
            multiline
          />

          <Text style={dashboardStyles.formLabel}>Safety Measures</Text>
          <TextInput
            style={[dashboardStyles.formInput, dashboardStyles.formTextArea]}
            placeholder="Safety gear, site fencing, emergency contacts..."
            placeholderTextColor={colors.textMuted}
            value={safety}
            onChangeText={setSafety}
            multiline
          />

          <Text style={dashboardStyles.formLabel}>Attachment</Text>
          <Text style={dashboardStyles.cardSubtitle}>
            Merge/convert all files into a single pdf and upload (Drawings, Plans, BOQ, etc.).
          </Text>
          <Pressable
            style={[dashboardStyles.listItem, { marginTop: 8 }]}
            onPress={() => Linking.openURL('https://www.ilovepdf.com')}
          >
            <Text style={dashboardStyles.actionText}>Open iLovePDF to merge files</Text>
          </Pressable>
          <Pressable
            style={[dashboardStyles.primaryButton, { alignSelf: 'flex-start' }]}
            onPress={handlePickPdf}
          >
            <Text style={dashboardStyles.primaryButtonText}>
              {attachmentName ? 'Replace PDF' : 'Select PDF'}
            </Text>
          </Pressable>
          {!!attachmentName && (
            <Text style={dashboardStyles.cardSubtitle}>
              Selected: {attachmentName}
              {attachmentSize ? ` • ${(attachmentSize / 1024 / 1024).toFixed(2)} MB` : ''}
            </Text>
          )}

          <Pressable
            style={[dashboardStyles.primaryButton, submitting && dashboardStyles.buttonDisabled]}
            onPress={handleCreateProject}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={dashboardStyles.primaryButtonText}>Create Project</Text>
            )}
          </Pressable>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={colors.accent} />
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
      {!!notice && <Text style={dashboardStyles.noticeText}>{notice}</Text>}
    </ScrollView>
  );
}
