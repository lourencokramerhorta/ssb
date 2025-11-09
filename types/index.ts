/**
 * Type Definitions
 * 
 * Re-export all types from this file for easier imports
 */

export type { Database } from './database';

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: AuthUser;
}

