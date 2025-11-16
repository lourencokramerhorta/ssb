import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { useColors } from '@/hooks/use-colors';
import { commonStyles } from '@/styles/common.styles';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { user, isAuthenticated, signOut } = useAuth();
  const colors = useColors();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
        // Still navigate even if there's an error
      }
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Unexpected logout error:', err);
      router.replace('/(auth)/login');
    }
  };

  return (
    <ThemedView style={commonStyles.centeredContainer}>
      <ThemedText type="title" style={styles.title}>
        Hello World
      </ThemedText>
      {isAuthenticated && user && (
        <>
          <ThemedText style={[commonStyles.subtitle, commonStyles.spacingLarge]}>
            Welcome, {user.email || 'User'}!
          </ThemedText>
          <TouchableOpacity 
            style={[commonStyles.dangerButton, { backgroundColor: colors.error }]} 
            onPress={handleLogout}>
            <ThemedText style={commonStyles.dangerButtonText}>Logout</ThemedText>
          </TouchableOpacity>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
});
