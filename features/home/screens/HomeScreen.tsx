import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { homeStyles } from '@/features/home/styles/homeStyles';

export default function HomeScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <View style={homeStyles.screen}>
      {drawerOpen && (
        <Pressable style={homeStyles.drawerBackdrop} onPress={() => setDrawerOpen(false)}>
          <View style={homeStyles.drawer}>
            <Text style={homeStyles.drawerTitle}>Menu</Text>
            <Link href="/about" asChild>
              <Pressable style={homeStyles.drawerItem} onPress={() => setDrawerOpen(false)}>
                <View style={homeStyles.drawerIcon}>
                  <Text style={homeStyles.drawerIconText}>AB</Text>
                </View>
                <Text style={homeStyles.drawerItemText}>About</Text>
              </Pressable>
            </Link>
            <Link href="/settings" asChild>
              <Pressable style={homeStyles.drawerItem} onPress={() => setDrawerOpen(false)}>
                <View style={homeStyles.drawerIcon}>
                  <Text style={homeStyles.drawerIconText}>ST</Text>
                </View>
                <Text style={homeStyles.drawerItemText}>Settings</Text>
              </Pressable>
            </Link>
            <Link href="/privacy" asChild>
              <Pressable style={homeStyles.drawerItem} onPress={() => setDrawerOpen(false)}>
                <View style={homeStyles.drawerIcon}>
                  <Text style={homeStyles.drawerIconText}>PP</Text>
                </View>
                <Text style={homeStyles.drawerItemText}>Privacy Policy</Text>
              </Pressable>
            </Link>
            <Link href="/terms" asChild>
              <Pressable style={homeStyles.drawerItem} onPress={() => setDrawerOpen(false)}>
                <View style={homeStyles.drawerIcon}>
                  <Text style={homeStyles.drawerIconText}>TS</Text>
                </View>
                <Text style={homeStyles.drawerItemText}>Terms of Service</Text>
              </Pressable>
            </Link>
            <View style={homeStyles.drawerFooter}>
              <Pressable
                style={homeStyles.drawerItem}
                onPress={() => {
                  setDrawerOpen(false);
                  Linking.openURL('https://buildonbudget.hustlerati.com');
                }}
              >
                <View style={homeStyles.drawerIcon}>
                  <Text style={homeStyles.drawerIconText}>WA</Text>
                </View>
                <Text style={homeStyles.drawerItemText}>Visit Web App</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>
        <View style={homeStyles.header}>
          <Pressable style={homeStyles.menuButton} onPress={() => setDrawerOpen(true)}>
            <Text style={homeStyles.menuButtonText}>☰</Text>
          </Pressable>
          <Text style={homeStyles.headerTitle}>BuildOnBudget</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={homeStyles.hero}>
          <Text style={homeStyles.heroTitle}>
            Build Smarter,{"\n"}Stay on Budget
          </Text>
          <Text style={homeStyles.heroSubtitle}>
            Plan, track, and collaborate on your dream projects without worrying about overspending or fraud.
            Manage your budget seamlessly and work with your team like never before.
          </Text>
          <View style={homeStyles.heroActions}>
            <Link href="/signup" asChild>
              <Pressable style={homeStyles.primaryButton}>
                <Text style={homeStyles.primaryButtonText}>Start Free</Text>
              </Pressable>
            </Link>
            <Pressable
              style={homeStyles.secondaryButton}
              onPress={() => Linking.openURL('https://buildonbudget.hustlerati.com/demo')}
            >
              <Text style={homeStyles.secondaryButtonText}>Watch Demo</Text>
            </Pressable>
          </View>
        </View>

        <View style={homeStyles.features}>
          <Text style={homeStyles.sectionTitle}>Why Choose BuildOnBudget?</Text>

          <View style={homeStyles.featureCard}>
            <View style={homeStyles.featureIcon}>
              <Text style={homeStyles.featureIconText}>▣</Text>
            </View>
            <Text style={homeStyles.featureTitle}>Budget Protection</Text>
            <Text style={homeStyles.featureText}>
              Your money stays safe. We ensure contractors don’t overcharge and every expense is transparent.
            </Text>
          </View>

          <View style={homeStyles.featureCard}>
            <View style={homeStyles.featureIcon}>
              <Text style={homeStyles.featureIconText}>▥</Text>
            </View>
            <Text style={homeStyles.featureTitle}>Team Collaboration</Text>
            <Text style={homeStyles.featureText}>
              Invite teammates, assign tasks, upload images, and collaborate in real time on your projects.
            </Text>
          </View>

          <View style={homeStyles.featureCard}>
            <View style={homeStyles.featureIcon}>
              <Text style={homeStyles.featureIconText}>▤</Text>
            </View>
            <Text style={homeStyles.featureTitle}>Project Tracking</Text>
            <Text style={homeStyles.featureText}>
              Track progress visually with real-time updates and analytics that keep your project on schedule.
            </Text>
          </View>
        </View>

        <View style={homeStyles.cta}>
          <Text style={homeStyles.ctaTitle}>Ready to Build Smarter?</Text>
          <Text style={homeStyles.ctaText}>
            Join thousands of users who are building their dreams without breaking the bank.
          </Text>
          <Link href="/signup" asChild>
            <Pressable style={homeStyles.ctaButton}>
              <Text style={homeStyles.ctaButtonText}>Get Started Today</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
