# Profile Management Setup Guide

This guide explains how to set up the database and storage for the user profile management feature.

## Database Setup

### 1. Run the SQL Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `migrations/create_profiles_table.sql`
4. Run the migration

This will:
- Create the `profiles` table with fields: `id`, `email`, `full_name`, `bio`, `avatar_url`, `created_at`, `updated_at`
- Set up Row Level Security (RLS) policies
- Create triggers to automatically:
  - Create a profile when a user signs up
  - Update the `updated_at` timestamp on profile updates

### 2. Verify the Table

After running the migration, verify the table was created:
- Go to **Table Editor** in Supabase
- You should see the `profiles` table
- Check that RLS is enabled (should show a lock icon)

## Storage Setup

### 1. Create the Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Yes (so avatars can be accessed via public URLs)
   - **File size limit**: 5 MB (recommended)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp` (optional, for extra security)

### 2. Set Up Storage Policies

After creating the bucket, set up the storage policies. Go to **Storage** → **Policies** → **avatars** and create the following policies:

#### Policy 1: Users can upload their own avatars
- **Policy name**: "Users can upload own avatar"
- **Allowed operation**: INSERT
- **Policy definition**:
```sql
(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 2: Users can update their own avatars
- **Policy name**: "Users can update own avatar"
- **Allowed operation**: UPDATE
- **Policy definition**:
```sql
(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 3: Users can delete their own avatars
- **Policy name**: "Users can delete own avatar"
- **Allowed operation**: DELETE
- **Policy definition**:
```sql
(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 4: Avatars are publicly readable
- **Policy name**: "Avatars are publicly readable"
- **Allowed operation**: SELECT
- **Policy definition**:
```sql
(bucket_id = 'avatars')
```

## Testing

After setup, test the profile feature:

1. **Create/Update Profile**:
   - Log in to the app
   - Navigate to the Profile tab
   - Click "Edit Profile"
   - Fill in your name and bio
   - Save

2. **Upload Avatar**:
   - While editing your profile, tap on the avatar
   - Select an image from your device
   - The avatar should upload and display

3. **Verify in Supabase**:
   - Check the `profiles` table to see your profile data
   - Check the `avatars` bucket to see uploaded images

## Troubleshooting

### Profile not created automatically
- Check that the trigger `on_auth_user_created` exists
- Verify the trigger function `handle_new_user()` is working
- For existing users, profiles will be created when they first save their profile

### Avatar upload fails
- Verify the `avatars` bucket exists and is public
- Check that storage policies are set up correctly
- Ensure the user is authenticated
- Check file size (should be under 5MB)

### Permission errors
- Verify RLS policies are enabled on the `profiles` table
- Check that storage policies allow the user to upload to their own folder

## Notes

- Profiles are automatically created when users sign up (via database trigger)
- Avatars are stored in user-specific folders: `{userId}/{filename}`
- The `updated_at` timestamp is automatically updated on profile changes
- Email is synced from the auth user but can be overridden in the profile

