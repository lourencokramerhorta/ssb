import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { signUp } from '@/services/auth';
import { authStyles } from '@/styles/auth.styles';
import { validateEmail, validatePassword } from '@/utils/validation';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const handleRegister = async () => {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      Alert.alert('Error', emailValidation.message);
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert('Error', passwordValidation.message);
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await signUp(email.trim(), password);

      if (error) {
        Alert.alert('Registration Failed', error);
        return;
      }

      if (data?.user) {
        // Show alert and navigate
        Alert.alert(
          'Success!',
          'Account created successfully! You can now log in.',
          [
            {
              text: 'Go to Login',
              onPress: () => {
                router.replace('/(auth)/login');
              },
            },
          ],
          { cancelable: false }
        );
        
        // Also navigate after a short delay (in case Alert doesn't show on web)
        navigationTimeoutRef.current = setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2000);
      } else {
        Alert.alert('Warning', 'Registration completed but no user data received.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'An unexpected error occurred');
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
        style={authStyles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        style={authStyles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />

      <TextInput
        style={authStyles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />

      <ThemedView style={authStyles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={authStyles.button} onPress={handleRegister}>
            <ThemedText style={authStyles.buttonText}>Register</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedText
        style={authStyles.link}
        onPress={() => router.push('/(auth)/login')}>
        Already have an account? Login
      </ThemedText>
    </ThemedView>
  );
}

