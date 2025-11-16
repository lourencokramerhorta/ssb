/**
 * Hook to get the current theme's color object
 * 
 * Returns the color object for the current color scheme (light/dark),
 * eliminating the need for repetitive `Colors[colorScheme]` patterns.
 * 
 * @example
 * ```tsx
 * const colors = useColors();
 * const primaryColor = colors.primary;
 * const errorColor = colors.error;
 * ```
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useColors() {
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme];
}

