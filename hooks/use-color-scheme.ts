import { useTheme } from '@/context/theme';

export function useColorScheme() {
  const { theme } = useTheme();
  return theme;
}
