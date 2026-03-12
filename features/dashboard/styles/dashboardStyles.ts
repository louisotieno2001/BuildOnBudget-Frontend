import { StyleSheet } from 'react-native';
import { useMemo } from 'react';

import { useTheme } from '@/context/theme';

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
  dangerBg: string;
  dangerText: string;
};

export const createDashboardStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textMuted,
  },
  pill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  shopHeaderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    backgroundColor: colors.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.primaryStrong,
    fontWeight: '700',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#facc15',
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  listItem: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 10,
  },
  listItemTitle: {
    fontWeight: '600',
    color: colors.text,
  },
  listItemMeta: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  notificationCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  notificationPending: {
    borderColor: '#facc15',
    backgroundColor: '#fef9c3',
  },
  notificationTitle: {
    fontWeight: '700',
    color: colors.text,
  },
  notificationMeta: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12,
  },
  primaryButton: {
    marginTop: 10,
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  chartBar: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  chartSegment: {
    height: '100%',
  },
  chartCompleted: {
    backgroundColor: '#16a34a',
  },
  chartInProgress: {
    backgroundColor: '#f59e0b',
  },
  chartPending: {
    backgroundColor: '#94a3b8',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  legendText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chartEmptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  errorText: {
    marginTop: 10,
    color: colors.dangerText,
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  detailBlock: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    color: colors.text,
  },
  detailValueBlock: {
    fontSize: 14,
    color: colors.text,
  },
  taskActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  taskButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  taskButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  taskButtonEdit: {
    backgroundColor: '#2563eb',
  },
  taskButtonDone: {
    backgroundColor: '#16a34a',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  chipRow: {
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: colors.surfaceAlt,
  },
  productImageFallback: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    backgroundColor: colors.border,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImageFallbackText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  productPrice: {
    marginTop: 8,
    fontWeight: '700',
    color: colors.primary,
  },
  productButton: {
    marginTop: 8,
    backgroundColor: colors.primaryStrong,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  productButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartItemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  cartItemImageFallback: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemDetails: {
    flex: 1,
  },
  cartActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  qtyValue: {
    fontWeight: '700',
    color: colors.text,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.dangerBg,
  },
  removeButtonText: {
    color: colors.dangerText,
    fontWeight: '700',
    fontSize: 12,
  },
  noticeText: {
    marginTop: 10,
    color: '#16a34a',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalSectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  modalChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalActions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalActionButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalActionPrimary: {
    backgroundColor: colors.primaryStrong,
    borderColor: colors.primaryStrong,
  },
  modalActionText: {
    fontWeight: '700',
    color: colors.text,
  },
  modalActionPrimaryText: {
    fontWeight: '700',
    color: '#ffffff',
  },
  taskButtonDelete: {
    backgroundColor: '#dc2626',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    fontSize: 14,
    color: colors.text,
  },
  formTextArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceAlt,
  },
  optionItemSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceAlt,
  },
  optionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  componentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  componentInput: {
    flex: 1,
    minWidth: 140,
  },
  budgetTotalsCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceGood: {
    color: '#16a34a',
  },
  balanceWarn: {
    color: '#d97706',
  },
  balanceBad: {
    color: '#dc2626',
  },
  progressTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ec4899',
  },
});

export function useDashboardStyles() {
  const { colors } = useTheme();
  return useMemo(() => createDashboardStyles(colors), [colors]);
}
