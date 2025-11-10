import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Message } from '@/components/message';
import { resendConfirmationEmail } from '@/services/auth';
import { authStyles } from '@/styles/auth.styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function EmailConfirmationScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || '';
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info' | 'warning'; text: string } | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const primaryColor = Colors[colorScheme].primary;
  const linkColor = Colors[colorScheme].primary;

  const handleResendEmail = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Email address is required' });
      return;
    }

    setResending(true);
    setMessage(null);
    try {
      const { error } = await resendConfirmationEmail(email);

      if (error) {
        setMessage({ type: 'error', text: error });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'A new confirmation email has been sent to your inbox. Please check your email and click the confirmation link.' 
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to resend confirmation email' });
    } finally {
      setResending(false);
    }
  };

  return (
    <ThemedView style={authStyles.container}>
      <ThemedText type="title" style={authStyles.title}>
        Confirm Your Email
      </ThemedText>

      <ThemedView style={{ marginTop: 20, marginBottom: 30 }}>
        <ThemedText style={{ marginBottom: 15, textAlign: 'center', fontSize: 16 }}>
          We've sent a confirmation email to:
        </ThemedText>
        <ThemedText style={{ marginBottom: 15, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
          {email}
        </ThemedText>
        <ThemedText style={{ marginBottom: 15, textAlign: 'center', fontSize: 16 }}>
          Please check your inbox and click the confirmation link to verify your email address.
        </ThemedText>
        <ThemedText style={{ marginTop: 15, textAlign: 'center', fontSize: 14, opacity: 0.7 }}>
          Once you've confirmed your email, you can log in to your account.
        </ThemedText>
      </ThemedView>

      {message && (
        <Message 
          type={message.type} 
          message={message.text}
          onDismiss={() => setMessage(null)}
        />
      )}

      <ThemedView style={authStyles.buttonContainer}>
        {resending ? (
          <ActivityIndicator size="large" color={primaryColor} />
        ) : (
          <TouchableOpacity 
            style={[authStyles.button, { backgroundColor: primaryColor }]} 
            onPress={handleResendEmail}>
            <ThemedText style={authStyles.buttonText}>Resend Confirmation Email</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedText
        style={[authStyles.link, { color: linkColor }]}
        onPress={() => router.replace('/(auth)/login')}>
        Already confirmed? Go to Login
      </ThemedText>
    </ThemedView>
  );
}

