/**
 * Theme Colors
 * 
 * Centralized color system for the app with light and dark mode support.
 * All colors used throughout the app should reference this file.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    // Base colors
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // Semantic colors
    primary: '#007AFF',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF',
    
    // UI elements
    border: '#ddd',
    borderLight: '#E5E7EB',
    placeholder: '#999',
    headerBg: '#D0D0D0',
    
    // Message backgrounds (subtle tints)
    errorBg: '#FFEBEE',
    successBg: '#E8F5E9',
    warningBg: '#FFF3E0',
    infoBg: '#E3F2FD',
    
    // Message borders
    errorBorder: '#FFCDD2',
    successBorder: '#C8E6C9',
    warningBorder: '#FFE0B2',
    infoBorder: '#BBDEFB',
  },
  dark: {
    // Base colors
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // Semantic colors
    primary: '#0A84FF',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#0A84FF',
    
    // UI elements
    border: '#444',
    borderLight: '#333',
    placeholder: '#666',
    headerBg: '#353636',
    
    // Message backgrounds (subtle tints)
    errorBg: '#2D1B1E',
    successBg: '#1B2D1E',
    warningBg: '#2D241B',
    infoBg: '#1B1D2D',
    
    // Message borders
    errorBorder: '#4A2A2E',
    successBorder: '#2D4A2E',
    warningBorder: '#4A3A2A',
    infoBorder: '#2A2D4A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
