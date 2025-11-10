import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type MessageType = 'error' | 'success' | 'info' | 'warning';

export type MessageProps = {
  type?: MessageType;
  message: string;
  style?: View['props']['style'];
  duration?: number;
  onDismiss?: () => void;
};

/**
 * Message Component
 * 
 * A reusable toast-like component for displaying temporary messages with different types (error, success, info, warning).
 * Automatically slides in from the top, stays for 3 seconds (configurable), then slides out.
 * Automatically adapts colors based on the theme (light/dark mode).
 * 
 * @example
 * <Message type="error" message="Something went wrong" />
 * <Message type="success" message="Operation completed successfully" />
 * <Message type="info" message="Please check your email" />
 * <Message type="warning" message="This action cannot be undone" />
 * <Message type="error" message="Error" duration={5000} onDismiss={() => console.log('dismissed')} />
 */
export function Message({ 
  type = 'error', 
  message, 
  style,
  duration = 3000,
  onDismiss,
}: MessageProps) {
  const slideAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -200,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [slideAnim, opacityAnim, duration, onDismiss]);
  // Get theme colors for each message type
  const errorColor = useThemeColor(
    { light: '#FF3B30', dark: '#FF453A' },
    'text'
  );
  const successColor = useThemeColor(
    { light: '#34C759', dark: '#30D158' },
    'text'
  );
  const infoColor = useThemeColor(
    { light: '#007AFF', dark: '#0A84FF' },
    'text'
  );
  const warningColor = useThemeColor(
    { light: '#FF9500', dark: '#FF9F0A' },
    'text'
  );

  // Get background color for each message type
  const errorBackgroundColor = useThemeColor(
    { light: '#FFEBEE', dark: '#2D1B1E' },
    'background'
  );
  const successBackgroundColor = useThemeColor(
    { light: '#E8F5E9', dark: '#1B2D1E' },
    'background'
  );
  const infoBackgroundColor = useThemeColor(
    { light: '#E3F2FD', dark: '#1B1D2D' },
    'background'
  );
  const warningBackgroundColor = useThemeColor(
    { light: '#FFF3E0', dark: '#2D241B' },
    'background'
  );

  // Get border color for each message type
  const errorBorderColor = useThemeColor(
    { light: '#FFCDD2', dark: '#4A2A2E' },
    'icon'
  );
  const successBorderColor = useThemeColor(
    { light: '#C8E6C9', dark: '#2D4A2E' },
    'icon'
  );
  const infoBorderColor = useThemeColor(
    { light: '#BBDEFB', dark: '#2A2D4A' },
    'icon'
  );
  const warningBorderColor = useThemeColor(
    { light: '#FFE0B2', dark: '#4A3A2A' },
    'icon'
  );

  // Map type to colors
  const colorMap = {
    error: errorColor,
    success: successColor,
    info: infoColor,
    warning: warningColor,
  };

  const backgroundColorMap = {
    error: errorBackgroundColor,
    success: successBackgroundColor,
    info: infoBackgroundColor,
    warning: warningBackgroundColor,
  };

  const borderColorMap = {
    error: errorBorderColor,
    success: successBorderColor,
    info: infoBorderColor,
    warning: warningBorderColor,
  };

  const textColor = colorMap[type];
  const backgroundColor = backgroundColorMap[type];
  const borderColor = borderColorMap[type];

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          top: insets.top + 10,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}>
      <ThemedView
        style={[
          styles.container,
          {
            backgroundColor,
            borderColor,
          },
          style,
        ]}>
        <ThemedText style={[styles.text, { color: textColor }]}>
          {message}
        </ThemedText>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

