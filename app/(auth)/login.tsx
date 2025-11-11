import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useMessage } from '@/contexts/message-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { signIn } from '@/services/auth';
import { authStyles } from '@/styles/auth.styles';
import { validateEmail } from '@/utils/validation';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { showMessage } = useMessage();
  
  // Get theme colors for input fields
  const inputTextColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const inputBorderColor = useThemeColor({}, 'border');
  const placeholderTextColor = useThemeColor({}, 'placeholder');
  const colorScheme = useColorScheme() ?? 'light';
  const primaryColor = Colors[colorScheme].primary;
  const linkColor = Colors[colorScheme].primary;

  // Cleanup countdown interval on unmount
  useEffect(() => {
    return () => {
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
            // Clear rate limit error message when countdown finishes
            setErrorMessage((msg) => {
              // Only clear if it's a rate limit message (contains "wait" or "seconds")
              if (msg && (msg.toLowerCase().includes('wait') || msg.toLowerCase().includes('second'))) {
                return null;
              }
              return msg;
            });
            return null;
          }
          const newCountdown = prev - 1;
          // Update the message with new countdown
          if (errorMessage && (errorMessage.toLowerCase().includes('wait') || errorMessage.toLowerCase().includes('second'))) {
            showMessage('warning', `${errorMessage.split('(')[0].trim()} (${newCountdown}s)`);
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

  const handleLogin = async () => {
    // Clear previous error
    setErrorMessage(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.message);
      showMessage('error', emailValidation.message);
      return;
    }

    if (!password) {
      const errorMsg = 'Password is required';
      setErrorMessage(errorMsg);
      showMessage('error', errorMsg);
      return;
    }

    setLoading(true);
    try {
      const { data, error, requiresEmailConfirmation, rateLimitInfo } = await signIn(email.trim(), password);

      if (error) {
        // Check if error is due to unconfirmed email
        const isEmailNotConfirmed = 
          error === 'EMAIL_NOT_CONFIRMED' || 
          requiresEmailConfirmation ||
          error.toLowerCase().includes('email not confirmed') ||
          error.toLowerCase().includes('email_not_confirmed');

        if (isEmailNotConfirmed) {
          const errorMsg = 'Please confirm your email address before logging in. Check your inbox for the confirmation email.';
          setErrorMessage(errorMsg);
          showMessage('error', errorMsg);
          
          Alert.alert(
            'Email Not Confirmed',
            errorMsg,
            [
              {
                text: 'Resend Confirmation Email',
                onPress: () => {
                  router.push({
                    pathname: '/(auth)/email-confirmation',
                    params: { email: email.trim() },
                  });
                },
              },
              {
                text: 'OK',
                style: 'cancel',
              },
            ]
          );
        } else if (rateLimitInfo?.isRateLimit) {
          // Handle rate limit error
          setRateLimitCountdown(rateLimitInfo.waitTime);
          setErrorMessage(rateLimitInfo.userFriendlyMessage);
          showMessage('warning', `${rateLimitInfo.userFriendlyMessage} (${rateLimitInfo.waitTime}s)`);
        } else {
          setErrorMessage(error);
          showMessage('error', error);
        }
        return;
      }

      if (data?.session) {
        // Clear error and navigate
        setErrorMessage(null);
        // Navigation will be handled by auth state change
        router.replace('/(tabs)');
      } else {
        const errorMsg = 'Login failed. Please try again.';
        setErrorMessage(errorMsg);
        showMessage('error', errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setErrorMessage(errorMsg);
      showMessage('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={authStyles.container}>
      <ThemedText type="title" style={authStyles.title}>
        Login
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
          // Clear error when user starts typing
          if (errorMessage) {
            setErrorMessage(null);
          }
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
          // Clear error when user starts typing
          if (errorMessage) {
            setErrorMessage(null);
          }
        }}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />


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
            onPress={handleLogin}
            disabled={rateLimitCountdown !== null && rateLimitCountdown > 0}>
            <ThemedText style={authStyles.buttonText}>
              {rateLimitCountdown !== null && rateLimitCountdown > 0
                ? `Please wait (${rateLimitCountdown}s)`
                : 'Login'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedText
        style={[authStyles.link, { color: linkColor }]}
        onPress={() => router.push('/(auth)/register')}>
        Dont have an account? Register
      </ThemedText>
    </ThemedView>
  );
}

