import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { signIn } from '@/services/auth';
import { validateEmail } from '@/utils/validation';
import { authStyles } from '@/styles/auth.styles';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      Alert.alert('Error', emailValidation.message);
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Password is required');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signIn(email.trim(), password);

      if (error) {
        Alert.alert('Login Failed', error);
        return;
      }

      if (data?.session) {
        // Navigation will be handled by auth state change
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
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
        Login
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

      <ThemedView style={authStyles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
            <ThemedText style={authStyles.buttonText}>Login</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedText
        style={authStyles.link}
        onPress={() => router.push('/(auth)/register')}>
        Dont have an account? Register
      </ThemedText>
    </ThemedView>
  );
}

