import { Message } from '@/components/message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { signUp } from '@/services/auth';
import { authStyles } from '@/styles/auth.styles';
import { validateEmail, validatePassword } from '@/utils/validation';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info' | 'warning'; text: string } | null>(null);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get theme colors for input fields
  const inputTextColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const inputBorderColor = useThemeColor({}, 'border');
  const placeholderTextColor = useThemeColor({}, 'placeholder');
  const colorScheme = useColorScheme() ?? 'light';
  const primaryColor = Colors[colorScheme].primary;
  const linkColor = Colors[colorScheme].primary;

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Handle countdown timer
  useEffect(() => {
    // Clear any existing interval first
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Only start a new interval if countdown is set and greater than 0
    if (rateLimitCountdown !== null && rateLimitCountdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setRateLimitCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            // Clear rate limit message when countdown finishes
            setMessage((msg) => {
              if (msg?.type === 'warning') {
                return null;
              }
              return msg;
            });
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [rateLimitCountdown]);

  const handleRegister = async () => {
    // Clear previous message
    setMessage(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setMessage({ type: 'error', text: emailValidation.message });
      return;
    }

    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setMessage({ type: 'error', text: passwordValidation.message });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error, rateLimitInfo } = await signUp(email.trim(), password);

      if (error) {
        // Check if this is a rate limit error
        if (rateLimitInfo?.isRateLimit) {
          setRateLimitCountdown(rateLimitInfo.waitTime);
          setMessage({ 
            type: 'warning', 
            text: rateLimitInfo.userFriendlyMessage 
          });
        } else {
          setMessage({ type: 'error', text: error });
        }
        return;
      }

      if (data?.user) {
        // Check if email confirmation is required
        if (data.requiresEmailConfirmation) {
          // Navigate to email confirmation screen
          router.replace({
            pathname: '/(auth)/email-confirmation',
            params: { email: email.trim() },
          });
        } else {
          // Email confirmation not required, show success and navigate
          setMessage({ type: 'success', text: 'Account created successfully! Redirecting to login...' });
          
          // Navigate after showing success message
          navigationTimeoutRef.current = setTimeout(() => {
            router.replace('/(auth)/login');
          }, 2000);
        }
      } else {
        setMessage({ type: 'warning', text: 'Registration completed but no user data received.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={authStyles.container}>
      <ThemedText type="title" style={authStyles.title}>
        Register
      </ThemedText>

      <TextInput
        style={[
          authStyles.input,
          {
            color: inputTextColor,
            backgroundColor: inputBackgroundColor,
            borderColor: inputBorderColor,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={placeholderTextColor}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (message) setMessage(null);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        style={[
          authStyles.input,
          {
            color: inputTextColor,
            backgroundColor: inputBackgroundColor,
            borderColor: inputBorderColor,
          },
        ]}
        placeholder="Password"
        placeholderTextColor={placeholderTextColor}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (message) setMessage(null);
        }}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />

      <TextInput
        style={[
          authStyles.input,
          {
            color: inputTextColor,
            backgroundColor: inputBackgroundColor,
            borderColor: inputBorderColor,
          },
        ]}
        placeholder="Confirm Password"
        placeholderTextColor={placeholderTextColor}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (message) setMessage(null);
        }}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />

      {message && (
        <Message 
          type={message.type} 
          message={
            rateLimitCountdown !== null && rateLimitCountdown > 0
              ? `${message.text} (${rateLimitCountdown}s)`
              : message.text
          }
          duration={3000}
          onDismiss={() => {
            // Only clear message, but keep countdown running if it's still active
            // The countdown will clear itself when it reaches 0
            setMessage(null);
            // Don't clear countdown here - let it run until it reaches 0
          }}
        />
      )}

      <ThemedView style={authStyles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={primaryColor} />
        ) : (
          <TouchableOpacity 
            style={[
              authStyles.button, 
              { 
                backgroundColor: primaryColor,
                opacity: rateLimitCountdown !== null && rateLimitCountdown > 0 ? 0.5 : 1,
              }
            ]} 
            onPress={handleRegister}
            disabled={rateLimitCountdown !== null && rateLimitCountdown > 0}>
            <ThemedText style={authStyles.buttonText}>
              {rateLimitCountdown !== null && rateLimitCountdown > 0
                ? `Please wait (${rateLimitCountdown}s)`
                : 'Register'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedText
        style={[authStyles.link, { color: linkColor }]}
        onPress={() => router.push('/(auth)/login')}>
        Already have an account? Login
      </ThemedText>
    </ThemedView>
  );
}

