import { Message } from '@/components/message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { signIn } from '@/services/auth';
import { authStyles } from '@/styles/auth.styles';
import { validateEmail } from '@/utils/validation';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get theme colors for input fields
  const inputTextColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const inputBorderColor = useThemeColor({}, 'border');
  const placeholderTextColor = useThemeColor({}, 'placeholder');
  const colorScheme = useColorScheme() ?? 'light';
  const primaryColor = Colors[colorScheme].primary;
  const linkColor = Colors[colorScheme].primary;

  const handleLogin = async () => {
    // Clear previous error
    setErrorMessage(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.message);
      return;
    }

    if (!password) {
      const errorMsg = 'Password is required';
      setErrorMessage(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const { data, error, requiresEmailConfirmation } = await signIn(email.trim(), password);

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
        } else {
          setErrorMessage(error);
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
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setErrorMessage(errorMsg);
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
          if (errorMessage) setErrorMessage(null);
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
          if (errorMessage) setErrorMessage(null);
        }}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />

      {errorMessage && (
        <Message 
          type="error" 
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      <ThemedView style={authStyles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={primaryColor} />
        ) : (
          <TouchableOpacity 
            style={[authStyles.button, { backgroundColor: primaryColor }]} 
            onPress={handleLogin}>
            <ThemedText style={authStyles.buttonText}>Login</ThemedText>
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

