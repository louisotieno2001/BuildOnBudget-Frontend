import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/context/theme';

export default function AboutScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>About BuildOnBudget</Text>

      <Text style={styles.sectionTitle}>Building the Future of Construction Collaboration</Text>
      <Text style={styles.text}>
        Construction projects are complex. Teams are often spread across multiple locations, timelines shift,
        budgets change, and communication gaps can lead to costly delays.
      </Text>
      <Text style={styles.textEmphasis}>BuildOnBudget was created to solve this.</Text>
      <Text style={styles.text}>
        BuildOnBudget is a digital collaboration platform designed to help contractors, developers, project managers,
        and stakeholders work together seamlessly from anywhere in the world. Our platform provides the tools needed
        to track progress, manage budgets, visualize project milestones, and ensure everyone involved stays aligned.
      </Text>
      <Text style={styles.text}>
        We believe construction should be transparent, collaborative, and efficient, not chaotic.
      </Text>

      <Text style={styles.sectionTitle}>Our Vision</Text>
      <Text style={styles.text}>
        Our vision is to redefine how construction teams collaborate globally. We aim to build a future where every
        construction project, whether a small home or a large commercial development, can be planned, monitored, and
        delivered efficiently through real-time digital collaboration.
      </Text>
      <Text style={styles.text}>
        BuildOnBudget seeks to become the operating system for modern construction management, empowering teams to
        make better decisions with real-time insights and visual project tracking.
      </Text>

      <Text style={styles.sectionTitle}>Our Mission</Text>
      <Text style={styles.text}>
        To help construction teams deliver projects on time, on budget, and with complete transparency.
      </Text>
      <Text style={styles.text}>
        We do this by providing tools that allow teams to:
      </Text>
      <Text style={styles.list}>
        {'- Collaborate remotely without communication breakdowns\n'}
        {'- Track project budgets and resource allocation\n'}
        {'- Visualize project progress in real time\n'}
        {'- Document milestones and updates from the field\n'}
        {'- Keep every stakeholder informed and accountable'}
      </Text>

      <Text style={styles.sectionTitle}>Why BuildOnBudget Matters</Text>
      <Text style={styles.text}>
        In many construction projects today, communication happens across scattered tools, project updates are delayed
        or inaccurate, budget overruns are common, and stakeholders lack clear visibility into progress.
      </Text>
      <Text style={styles.text}>
        BuildOnBudget brings everything into one unified platform, giving teams the clarity and coordination they need
        to build smarter.
      </Text>

      <Text style={styles.sectionTitle}>Built for the People Who Build</Text>
      <Text style={styles.text}>BuildOnBudget is designed for:</Text>
      <Text style={styles.list}>
        {'- Contractors managing daily site activities\n'}
        {'- Developers overseeing multiple projects\n'}
        {'- Project managers coordinating teams and resources\n'}
        {'- Architects and engineers collaborating on project execution\n'}
        {'- Investors and stakeholders who need transparent progress insights'}
      </Text>
      <Text style={styles.text}>
        Our goal is to empower the people who turn ideas into real structures.
      </Text>

      <Text style={styles.sectionTitle}>Looking Ahead</Text>
      <Text style={styles.text}>
        We are building more than just a project tracking tool. BuildOnBudget is evolving into a smart construction
        management ecosystem, integrating progress visualization, budgeting intelligence, team collaboration, and
        data-driven insights to transform how projects are delivered.
      </Text>
      <Text style={styles.text}>
        The future of construction is connected, transparent, and collaborative, and BuildOnBudget is helping build it.
      </Text>
    </ScrollView>
  );
}

const createStyles = (colors: {
  background: string;
  text: string;
  textMuted: string;
  primary: string;
}) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 10,
  },
  textEmphasis: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  list: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 12,
  },
});
