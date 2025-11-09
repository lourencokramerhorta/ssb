# Setup Guide

## Quick Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

1. **Create a Supabase project** (if you haven't already):
   - Go to https://app.supabase.com
   - Create a new project or select an existing one

2. **Get your credentials**:
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key

3. **Set up `.env` file**:
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Then edit .env and add your credentials:
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   
   **That's it!** The app will automatically read from `.env` via `app.config.js`.
   No need to update `app.json` or `config.ts` - they read from `.env` automatically.

### 3. Configure Supabase Authentication

1. **Enable Email/Password authentication**:
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email settings as needed

2. **Set up email templates** (optional):
   - Go to Authentication → Email Templates
   - Customize confirmation and password reset emails

### 4. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Testing Authentication

1. **Register a new user**:
   - Open the app
   - You'll be redirected to the login screen
   - Tap "Don't have an account? Register"
   - Enter email and password
   - Submit the form

2. **Verify email** (if email confirmation is enabled):
   - Check your email for a confirmation link
   - Click the link to verify your account

3. **Login**:
   - Enter your email and password
   - You'll be redirected to the Home screen showing "Hello World"

4. **Logout**:
   - Tap the "Logout" button on the Home screen
   - You'll be redirected back to the login screen

## Project Structure

- `config.ts` - App configuration (Supabase credentials)
- `services/supabase.ts` - Supabase client setup
- `services/auth.ts` - Authentication functions
- `hooks/use-auth.ts` - Authentication hook
- `app/(auth)/` - Authentication screens (login, register)
- `app/(tabs)/` - Main app screens (home, explore)
- `types/` - TypeScript type definitions

## Troubleshooting

### "Supabase credentials not configured" warning
- Make sure you've updated `config.ts` with your Supabase credentials
- Restart the development server after updating config

### Authentication not working
- Verify your Supabase project is active
- Check that Email/Password authentication is enabled in Supabase dashboard
- Check the console for error messages

### Navigation issues
- Make sure you're using the correct route paths
- Protected routes will redirect to login if not authenticated

## Next Steps

- Set up database tables (if needed)
- Configure Row Level Security (RLS) policies
- Add user profile management
- Implement additional features

---

**Last Updated**: 2024-12-19

