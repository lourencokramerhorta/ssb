/**
 * App Configuration
 * 
 * This file reads configuration from app.json extra config.
 * 
 * Get your Supabase credentials from:
 * https://app.supabase.com/project/YOUR_PROJECT/settings/api
 * 
 * Add your credentials to app.json under expo.extra:
 * {
 *   "expo": {
 *     "extra": {
 *       "SUPABASE_URL": "your_supabase_project_url",
 *       "SUPABASE_ANON_KEY": "your_supabase_anon_key"
 *     }
 *   }
 * }
 */

import Constants from 'expo-constants';

/**
 * Get environment variable from expo-constants
 */
const getEnvVar = (key: string, fallback: string = ''): string => {
  // Try multiple ways to access expo-constants
  // 1. Check Constants.expoConfig?.extra (newer Expo versions)
  if (Constants.expoConfig?.extra?.[key]) {
    return String(Constants.expoConfig.extra[key]);
  }

  // 2. Check Constants.manifest?.extra (older Expo versions)
  if (Constants.manifest?.extra?.[key]) {
    return String(Constants.manifest.extra[key]);
  }

  // 3. Check Constants.manifest2?.extra (Expo SDK 49+)
  if (Constants.manifest2?.extra?.expoClient?.extra?.[key]) {
    return String(Constants.manifest2.extra.expoClient.extra[key]);
  }

  // Fallback: Check process.env (for development/testing)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]);
  }

  // Final fallback
  return fallback;
};

// TODO: Configure your Supabase credentials in app.json under expo.extra
// The anon key is safe to be public (it's meant for client-side use),
// but for best practices, configure it via app.json or environment variables
export const config = {
  supabase: {
    url: getEnvVar('SUPABASE_URL', ''),
    anonKey: getEnvVar('SUPABASE_ANON_KEY', ''),
  },
};

// Debug: Log what we're getting from Constants
if (__DEV__) {
  console.log('🔍 Config Debug - Constants:', {
    hasExpoConfig: !!Constants.expoConfig,
    hasManifest: !!Constants.manifest,
    hasManifest2: !!Constants.manifest2,
    expoConfigExtra: Constants.expoConfig?.extra,
    manifestExtra: Constants.manifest?.extra,
    manifest2Extra: Constants.manifest2?.extra,
    allConstants: Object.keys(Constants),
  });
  console.log('🔍 Config Debug - Values:', {
    supabaseUrl: config.supabase.url || 'MISSING',
    supabaseKey: config.supabase.anonKey ? 'SET (hidden)' : 'MISSING',
    urlLength: config.supabase.url?.length || 0,
    keyLength: config.supabase.anonKey?.length || 0,
  });
}

// Validate configuration
if (!config.supabase.url || !config.supabase.anonKey) {
  console.error(
    '❌ Supabase credentials not configured. Please add SUPABASE_URL and SUPABASE_ANON_KEY to app.json under expo.extra'
  );
  console.error(
    '   Current values:',
    {
      url: config.supabase.url || 'MISSING',
      anonKey: config.supabase.anonKey ? 'SET (hidden)' : 'MISSING',
    }
  );
  console.error(
    '   After updating app.json, restart the Expo server with: npm start'
  );
}

