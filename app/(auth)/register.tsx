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
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get theme colors for input fields
  const inputTextColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const inputBorderColor = useThemeColor({}, 'border');
  const placeholderTextColor = useThemeColor({}, 'placeholder');
  const colorScheme = useColorScheme() ?? 'light';
  const primaryColor = Colors[colorScheme].primary;
  const linkColor = Colors[colorScheme].primary;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

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
      const { data, error } = await signUp(email.trim(), password);

      if (error) {
        setMessage({ type: 'error', text: error });
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
          message={message.text}
          onDismiss={() => setMessage(null)}
        />
      )}

      <ThemedView style={authStyles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={primaryColor} />
        ) : (
          <TouchableOpacity 
            style={[authStyles.button, { backgroundColor: primaryColor }]} 
            onPress={handleRegister}>
            <ThemedText style={authStyles.buttonText}>Register</ThemedText>
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

