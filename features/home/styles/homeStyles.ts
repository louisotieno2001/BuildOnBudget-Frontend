import { StyleSheet } from 'react-native';

type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primaryStrong: string;
  accent: string;
  text: string;
  textMuted: string;
  border: string;
  icon: string;
};

export const createHomeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primaryStrong,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#ffffff',
    },
    menuButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
    },
    menuButtonText: {
      fontSize: 20,
      color: '#ffffff',
      fontWeight: '800',
    },
    hero: {
      paddingHorizontal: 24,
      paddingTop: 36,
      paddingBottom: 48,
    },
    heroTitle: {
      fontSize: 34,
      fontWeight: '800',
      color: colors.primary,
      lineHeight: 40,
    },
    heroSubtitle: {
      marginTop: 12,
      fontSize: 16,
      color: colors.textMuted,
      lineHeight: 22,
    },
    heroActions: {
      marginTop: 20,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    primaryButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 12,
    },
    primaryButtonText: {
      color: '#ffffff',
      fontWeight: '700',
      fontSize: 15,
    },
    secondaryButton: {
      borderWidth: 2,
      borderColor: colors.accent,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 12,
    },
    secondaryButtonText: {
      color: colors.accent,
      fontWeight: '700',
      fontSize: 15,
    },
    features: {
      paddingHorizontal: 24,
      paddingVertical: 48,
      backgroundColor: colors.surface,
    },
    sectionTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 24,
    },
    featureCard: {
      backgroundColor: colors.surfaceAlt,
      padding: 20,
      borderRadius: 18,
      marginBottom: 16,
      shadowColor: '#0f172a',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    featureIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    featureIconText: {
      fontSize: 22,
      color: colors.text,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    featureText: {
      fontSize: 14,
      color: colors.textMuted,
      lineHeight: 20,
    },
    cta: {
      paddingHorizontal: 24,
      paddingVertical: 56,
      alignItems: 'center',
      backgroundColor: colors.primaryStrong,
    },
    ctaTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: 12,
    },
    ctaText: {
      fontSize: 15,
      color: '#ede9fe',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 22,
    },
    ctaButton: {
      backgroundColor: '#ffffff',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    ctaButtonText: {
      color: colors.primaryStrong,
      fontWeight: '800',
      fontSize: 15,
    },
    drawerBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      zIndex: 10,
    },
    drawer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 260,
      backgroundColor: colors.surface,
      paddingTop: 56,
      paddingHorizontal: 20,
      shadowColor: '#0f172a',
      shadowOpacity: 0.2,
      shadowRadius: 18,
      shadowOffset: { width: 6, height: 0 },
      elevation: 8,
    },
    drawerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 16,
    },
    drawerItem: {
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    drawerIcon: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
    },
    drawerItemText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.primary,
    },
    drawerFooter: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
