import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DashboardTabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderTopColor: isDark ? '#1f2937' : '#e2e8f0',
            height: 62,
            paddingBottom: 8,
            paddingTop: 8,
            marginBottom: 0,
          },
          tabBarActiveTintColor: isDark ? '#c4b5fd' : '#6d28d9',
          tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
          tabBarIcon: ({ color, size }) => {
            const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
              index: 'home',
              projects: 'folder',
              tasks: 'list',
              budget: 'wallet',
              teams: 'people',
              shop: 'cart',
            };
            const iconName = iconMap[route.name] ?? 'grid';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="projects" options={{ title: 'Projects' }} />
        <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
        <Tabs.Screen name="budget" options={{ title: 'Budget' }} />
        <Tabs.Screen name="teams" options={{ title: 'Teams' }} />
        <Tabs.Screen name="shop" options={{ title: 'Shop' }} />
      </Tabs>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}
