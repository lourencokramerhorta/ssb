import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useMessage } from '@/contexts/message-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { resendConfirmationEmail } from '@/services/auth';
import { authStyles } from '@/styles/auth.styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

export default function EmailConfirmationScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || '';
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info' | 'warning'; text: string } | null>(null);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { showMessage } = useMessage();
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
            return null;
          }
          const newCountdown = prev - 1;
          // Update the message with new countdown
          if (message && (message.text.toLowerCase().includes('wait') || message.text.toLowerCase().includes('second'))) {
            showMessage(message.type, `${message.text.split('(')[0].trim()} (${newCountdown}s)`);
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

  const handleResendEmail = async () => {
    if (!email) {
      const errorMsg = 'Email address is required';
      setMessage({ type: 'error', text: errorMsg });
      showMessage('error', errorMsg);
      return;
    }

    setResending(true);
    setMessage(null);
    setRateLimitCountdown(null);
    try {
      const { error, rateLimitInfo } = await resendConfirmationEmail(email);

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
      } else {
        const successMsg = 'A new confirmation email has been sent to your inbox. Please check your email and click the confirmation link.';
        setMessage({ 
          type: 'success', 
          text: successMsg 
        });
        showMessage('success', successMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to resend confirmation email';
      setMessage({ type: 'error', text: errorMsg });
      showMessage('error', errorMsg);
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


      <ThemedView style={authStyles.buttonContainer}>
        {resending ? (
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
            onPress={handleResendEmail}
            disabled={rateLimitCountdown !== null && rateLimitCountdown > 0}>
            <ThemedText style={authStyles.buttonText}>
              {rateLimitCountdown !== null && rateLimitCountdown > 0
                ? `Please wait (${rateLimitCountdown}s)`
                : 'Resend Confirmation Email'}
            </ThemedText>
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

