import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

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
  
  // Store onDismiss in a ref to avoid re-running the effect when it changes
  // This prevents the timeout from being reset on every render
  const onDismissRef = useRef(onDismiss);
  
  // Update the ref when onDismiss changes
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

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
        onDismissRef.current?.();
      });
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [slideAnim, opacityAnim, duration]);
  // Get theme colors for each message type
  const errorColor = useThemeColor({}, 'error');
  const successColor = useThemeColor({}, 'success');
  const infoColor = useThemeColor({}, 'info');
  const warningColor = useThemeColor({}, 'warning');

  // Get background color for each message type
  const errorBackgroundColor = useThemeColor({}, 'errorBg');
  const successBackgroundColor = useThemeColor({}, 'successBg');
  const infoBackgroundColor = useThemeColor({}, 'infoBg');
  const warningBackgroundColor = useThemeColor({}, 'warningBg');

  // Get border color for each message type
  const errorBorderColor = useThemeColor({}, 'errorBorder');
  const successBorderColor = useThemeColor({}, 'successBorder');
  const infoBorderColor = useThemeColor({}, 'infoBorder');
  const warningBorderColor = useThemeColor({}, 'warningBorder');

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

