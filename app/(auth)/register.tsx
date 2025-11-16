import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMessage } from '@/contexts/message-context';
import { useColors } from '@/hooks/use-colors';
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
  const { showMessage } = useMessage();
  
  // Get theme colors for input fields
  const inputTextColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const inputBorderColor = useThemeColor({}, 'border');
  const placeholderTextColor = useThemeColor({}, 'placeholder');
  const colors = useColors();

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
            return null;
          }
          const newCountdown = prev - 1;
          // Update the message with new countdown
          if (message && message.type === 'warning') {
            showMessage('warning', `${message.text.split('(')[0].trim()} (${newCountdown}s)`);
          }
          return newCountdown;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rateLimitCountdown]);

  const handleRegister = async () => {
    // Clear previous message
    setMessage(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setMessage({ type: 'error', text: emailValidation.message });
      showMessage('error', emailValidation.message);
      return;
    }

    if (!password || !confirmPassword) {
      const errorMsg = 'Please fill in all fields';
      setMessage({ type: 'error', text: errorMsg });
      showMessage('error', errorMsg);
      return;
    }

    if (password !== confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setMessage({ type: 'error', text: errorMsg });
      showMessage('error', errorMsg);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setMessage({ type: 'error', text: passwordValidation.message });
      showMessage('error', passwordValidation.message);
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
          showMessage('warning', `${rateLimitInfo.userFriendlyMessage} (${rateLimitInfo.waitTime}s)`);
        } else {
          setMessage({ type: 'error', text: error });
          showMessage('error', error);
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
          showMessage('success', 'Account created successfully! Redirecting to login...');
          
          // Navigate after showing success message
          navigationTimeoutRef.current = setTimeout(() => {
            router.replace('/(auth)/login');
          }, 2000);
        }
      } else {
        setMessage({ type: 'warning', text: 'Registration completed but no user data received.' });
        showMessage('warning', 'Registration completed but no user data received.');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setMessage({ type: 'error', text: errorMsg });
      showMessage('error', errorMsg);
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


      <ThemedView style={authStyles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <TouchableOpacity 
            style={[
              authStyles.button, 
              { 
                backgroundColor: colors.primary,
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
        style={[authStyles.link, { color: colors.primary }]}
        onPress={() => router.push('/(auth)/login')}>
        Already have an account? Login
      </ThemedText>
    </ThemedView>
  );
}

