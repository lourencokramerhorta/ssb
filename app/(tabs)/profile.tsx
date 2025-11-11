import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useMessage } from '@/contexts/message-context';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getProfile, upsertProfile } from '@/services/profile';
import { uploadAvatar } from '@/services/storage';
import { commonStyles } from '@/styles/common.styles';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default function ProfileScreen() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { showMessage } = useMessage();

  const colorScheme = useColorScheme() ?? 'light';
  const primaryColor = Colors[colorScheme].primary;
  const inputTextColor = useThemeColor({}, 'text');
  const inputBackgroundColor = useThemeColor({}, 'background');
  const inputBorderColor = useThemeColor({}, 'border');
  const placeholderTextColor = useThemeColor({}, 'placeholder');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await getProfile(user.id);
      if (error) {
        console.error('Error loading profile:', error);
        // If profile doesn't exist, initialize with empty values
        setProfile({
          full_name: null,
          bio: null,
          avatar_url: null,
        });
        setFullName('');
        setBio('');
        setAvatarUrl(null);
      } else if (data) {
        const profileData = data as {
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
        };
        setProfile({
          full_name: profileData.full_name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
        });
        setFullName(profileData.full_name || '');
        setBio(profileData.bio || '');
        setAvatarUrl(profileData.avatar_url || null);
      }
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    if (!user?.id) return;

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to set your avatar.'
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setUploadingAvatar(true);

      try {
        const { data, error } = await uploadAvatar(
          user.id,
          asset.uri,
          asset.mimeType || 'image/jpeg'
        );

        if (error) {
          showMessage('error', 'Failed to upload avatar. Please try again.');
          return;
        }

        if (data?.url) {
          setAvatarUrl(data.url);
          // Auto-save the avatar URL
          await saveProfile({ avatar_url: data.url });
        }
      } catch (err) {
        console.error('Error uploading avatar:', err);
        showMessage('error', 'Failed to upload avatar. Please try again.');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const saveProfile = async (additionalData?: { avatar_url?: string }) => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const updateData = {
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        email: user.email || null,
        ...additionalData,
      };

      // Use upsert to create profile if it doesn't exist, or update if it does
      const { data, error } = await upsertProfile(user.id, updateData);

      if (error) {
        showMessage('error', 'Failed to save profile. Please try again.');
        return;
      }

      setProfile(data);
      setIsEditing(false);
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      showMessage('error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    saveProfile();
  };

  const handleCancel = () => {
    // Reset to original values
    setFullName(profile?.full_name || '');
    setBio(profile?.bio || '');
    setAvatarUrl(profile?.avatar_url || null);
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <ThemedView style={commonStyles.centeredContainer}>
        <ThemedText>Please log in to view your profile.</ThemedText>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={commonStyles.centeredContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>

        {/* Avatar Section */}
        <ThemedView style={styles.avatarSection}>
          <TouchableOpacity
            onPress={isEditing ? handlePickImage : undefined}
            disabled={!isEditing || uploadingAvatar}
            style={styles.avatarContainer}>
            {uploadingAvatar ? (
              <ActivityIndicator size="large" color={primaryColor} />
            ) : avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <ThemedView style={[styles.avatar, styles.avatarPlaceholder]}>
                <ThemedText style={styles.avatarPlaceholderText}>
                  {fullName
                    ? fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : user.email?.[0].toUpperCase() || 'U'}
                </ThemedText>
              </ThemedView>
            )}
            {isEditing && (
              <ThemedView style={styles.avatarEditOverlay}>
                <ThemedText style={styles.avatarEditText}>Tap to change</ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>
        </ThemedView>

        {/* Email (read-only) */}
        <ThemedView style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedView style={[styles.readOnlyField, { borderColor: inputBorderColor }]}>
            <ThemedText style={styles.readOnlyText}>{user.email}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Full Name */}
        <ThemedView style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                {
                  color: inputTextColor,
                  backgroundColor: inputBackgroundColor,
                  borderColor: inputBorderColor,
                },
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={placeholderTextColor}
              value={fullName}
              onChangeText={setFullName}
            />
          ) : (
            <ThemedView style={[styles.readOnlyField, { borderColor: inputBorderColor }]}>
              <ThemedText style={styles.readOnlyText}>
                {fullName || 'Not set'}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Bio */}
        <ThemedView style={styles.fieldContainer}>
          <ThemedText style={styles.label}>Bio</ThemedText>
          {isEditing ? (
            <TextInput
              style={[
                styles.textArea,
                {
                  color: inputTextColor,
                  backgroundColor: inputBackgroundColor,
                  borderColor: inputBorderColor,
                },
              ]}
              placeholder="Tell us about yourself"
              placeholderTextColor={placeholderTextColor}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          ) : (
            <ThemedView style={[styles.readOnlyField, { borderColor: inputBorderColor }]}>
              <ThemedText style={styles.readOnlyText}>
                {bio || 'Not set'}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Action Buttons */}
        <ThemedView style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { borderColor: inputBorderColor },
                ]}
                onPress={handleCancel}
                disabled={saving}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: primaryColor }]}
                onPress={handleSave}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ThemedText style={commonStyles.primaryButtonText}>Save</ThemedText>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: primaryColor }]}
              onPress={() => setIsEditing(true)}>
              <ThemedText style={commonStyles.primaryButtonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  avatarEditText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  readOnlyField: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    opacity: 0.6,
  },
  readOnlyText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

