/**
 * Common Styles
 * 
 * Reusable styles used across the app
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
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Text
  linkText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
});

