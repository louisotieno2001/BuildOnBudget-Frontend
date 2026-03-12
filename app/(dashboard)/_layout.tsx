import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/context/theme';

export default function DashboardTabsLayout() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            height: 62,
            paddingBottom: 8,
            paddingTop: 8,
            marginBottom: 0,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
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
