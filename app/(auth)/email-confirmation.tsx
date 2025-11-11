import { Message } from '@/components/message';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
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

  const handleResendEmail = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Email address is required' });
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
        } else {
          setMessage({ type: 'error', text: error });
        }
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

