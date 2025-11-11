import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { MessageProvider } from '@/contexts/message-context';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle email confirmation deep links
  useEffect(() => {
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleEmailConfirmation(initialUrl);
      }
    };

    const handleURL = (event: { url: string }) => {
      handleEmailConfirmation(event.url);
    };

    const handleEmailConfirmation = async (url: string) => {
      // Check if this is an email confirmation link
      if (url.includes('email-confirmed') || url.includes('type=signup') || url.includes('token=') || url.includes('confirmation_token=')) {
        // Supabase will handle the token verification automatically
        // We just need to extract the URL and let Supabase process it
        try {
          // Parse the URL to extract query parameters
          const urlObj = Linking.parse(url);
          
          // If there's a token in the URL, Supabase's auth state change listener will handle it
          // We can navigate to a confirmation success screen or login
          if (url.includes('email-confirmed') || urlObj.queryParams?.token || urlObj.queryParams?.confirmation_token) {
            // Wait a moment for Supabase to process the token
            setTimeout(() => {
              router.replace('/(auth)/login');
            }, 1000);
          }
        } catch (error) {
          console.error('Error handling email confirmation URL:', error);
        }
      }
    };

    handleInitialURL();
    const subscription = Linking.addEventListener('url', handleURL);

    return () => {
      subscription.remove();
    };
  }, [router]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments, router]);

  return (
    <MessageProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </MessageProvider>
  );
}
