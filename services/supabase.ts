/**
 * Supabase Client Configuration
 * 
 * This file sets up the Supabase client for use throughout the app.
 * Make sure to configure your Supabase credentials in config.ts
 */

import { config } from '@/config';
import type { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Validate config before creating client
if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error(
    'Supabase credentials are missing. Please check your app.json extra config. ' +
    `URL: ${config.supabase.url ? '✅' : '❌'}, Key: ${config.supabase.anonKey ? '✅' : '❌'}`
  );
}

// Create Supabase client
export const supabase = createClient<Database>(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      // Configure auth options
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Export types for use in other files
export type { Database } from '@/types/database';

