/**
 * Authentication Screen Styles
 * 
 * Shared styles for login and register screens
 */

import { StyleSheet } from 'react-native';

// Note: Colors that need theme awareness should be set dynamically in components
// using useThemeColor hook or Colors from theme.ts. Static colors here are for non-theme-aware elements.
export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    // Note: backgroundColor, borderColor, and color should be set dynamically based on theme
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    // backgroundColor should be set dynamically using Colors.light.primary or Colors.dark.primary
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text on colored button - consistent across themes
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    // color should be set dynamically using Colors.light.primary or Colors.dark.primary
    marginTop: 16,
    fontSize: 14,
  },
});

