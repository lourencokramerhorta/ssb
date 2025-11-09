# Testing Guide

## Quick Test Steps

### 1. Start the Development Server

```bash
npm start
```

### 2. Check Console for Configuration

When the app starts, check the console/logs:
- If you see a warning about Supabase credentials not configured, the `.env` file might not be loading correctly
- If no warning appears, the credentials are loaded successfully

### 3. Test Authentication Flow

1. **App should redirect to Login screen** (if not authenticated)
2. **Register a new user**:
   - Tap "Don't have an account? Register"
   - Enter email and password
   - Submit the form
   - You should see a success message
3. **Login**:
   - Enter your email and password
   - You should be redirected to the Home screen
   - You should see "Hello World" and your email
4. **Logout**:
   - Tap the "Logout" button
   - You should be redirected back to the login screen

## Troubleshooting

### If `.env` file is not loading:

For Expo, `dotenv` might not work directly. Here are alternative solutions:

#### Option 1: Use app.json extra config (Recommended for Expo)

1. Update `app.json`:
```json
{
  "expo": {
    "extra": {
      "SUPABASE_URL": "your_supabase_url",
      "SUPABASE_ANON_KEY": "your_supabase_anon_key"
    }
  }
}
```

2. The `config.ts` already checks `expo-constants` first, so this will work.

#### Option 2: Use babel-plugin-inline-dotenv

1. Install: `npm install --save-dev babel-plugin-inline-dotenv`
2. Update `babel.config.js` to include the plugin

#### Option 3: Set environment variables directly in config.ts (for development)

Temporarily set values directly in `config.ts` for testing:

```typescript
export const config = {
  supabase: {
    url: 'your_supabase_url_here',
    anonKey: 'your_supabase_anon_key_here',
  },
};
```

## Expected Behavior

✅ **Working correctly if:**
- No warning about missing credentials in console
- Login/Register screens appear
- Can create account and login
- Home screen shows "Hello World" and user email
- Logout redirects back to login

❌ **Issues if:**
- Warning about missing credentials
- Authentication errors
- Cannot connect to Supabase

## Next Steps After Testing

1. If authentication works → You're ready to build features!
2. If credentials not loading → Use Option 1 (app.json) or Option 3 (direct config)
3. If Supabase connection fails → Check your Supabase project is active and credentials are correct

---

**Last Updated**: 2024-12-19

