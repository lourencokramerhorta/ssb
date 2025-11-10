/**
 * Common Styles
 * 
 * Reusable styles used across the app
 * Note: Colors that need theme awareness should be set dynamically in components
 */

import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  // Layout
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Spacing
  spacingSmall: {
    marginBottom: 8,
  },
  spacingMedium: {
    marginBottom: 16,
  },
  spacingLarge: {
    marginBottom: 32,
  },
  
  // Buttons
  // Note: backgroundColor should be set dynamically using Colors.light.primary or Colors.dark.primary
  primaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff', // White text on colored button - consistent across themes
    fontSize: 16,
    fontWeight: '600',
  },
  // Note: backgroundColor should be set dynamically using Colors.light.error or Colors.dark.error
  dangerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dangerButtonText: {
    color: '#fff', // White text on colored button - consistent across themes
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Text
  // Note: color should be set dynamically using Colors.light.primary or Colors.dark.primary
  linkText: {
    textAlign: 'center',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
});

