/**
 * Authentication Service
 * 
 * This file contains all authentication-related functions using Supabase Auth.
 */

import { supabase } from './supabase';

/**
 * Sign up a new user with email and password
 * Returns information about whether email confirmation is required
 */
export async function signUp(email: string, password: string) {
  try {
    if (__DEV__) {
      console.log('🔵 Supabase signUp called with email:', email);
    }

    // Get the redirect URL based on platform
    const redirectUrl = __DEV__ 
      ? 'exp://localhost:8081/--/email-confirmed'
      : 'ssb://email-confirmed';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (__DEV__) {
      console.log('🔵 Supabase signUp response:', {
        hasData: !!data,
        hasError: !!error,
        error: error ? error.message : null,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        emailConfirmed: !!data?.user?.email_confirmed_at,
      });
    }

    if (error) {
      if (__DEV__) {
        console.error('❌ Supabase signUp error:', error);
      }
      throw error;
    }

    // Check if email confirmation is required
    const requiresEmailConfirmation = data?.user && !data?.user.email_confirmed_at && !data?.session;

    return { 
      data: {
        ...data,
        requiresEmailConfirmation,
      }, 
      error: null 
    };
  } catch (error: any) {
    if (__DEV__) {
      console.error('❌ signUp catch block:', error);
    }
    return { data: null, error: error.message || 'Failed to sign up' };
  }
}

/**
 * Sign in an existing user with email and password
 * Checks if email confirmation is required
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if error is due to unconfirmed email
      if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
        return { 
          data: null, 
          error: 'EMAIL_NOT_CONFIRMED',
          requiresEmailConfirmation: true 
        };
      }
      throw error;
    }

    // Double-check if user's email is confirmed (even if session exists)
    if (data?.user && !data.user.email_confirmed_at) {
      return { 
        data: null, 
        error: 'EMAIL_NOT_CONFIRMED',
        requiresEmailConfirmation: true 
      };
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to sign in' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to sign out' };
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get session' };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get user' };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Reset password for a user
 */
export async function resetPassword(email: string) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'exp://localhost:8081/--/reset-password',
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to reset password' };
  }
}

/**
 * Resend email confirmation
 */
export async function resendConfirmationEmail(email: string) {
  try {
    // Get the redirect URL based on platform
    const redirectUrl = __DEV__ 
      ? 'exp://localhost:8081/--/email-confirmed'
      : 'ssb://email-confirmed';

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to resend confirmation email' };
  }
}

