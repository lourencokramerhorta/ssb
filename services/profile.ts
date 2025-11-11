/**
 * Profile Service
 * 
 * This file contains all profile-related functions using Supabase.
 */

import type { Database } from '@/types/database';
import { supabase } from './supabase';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Get the current user's profile
 */
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to get profile' };
  }
}

/**
 * Create or update a user's profile
 */
export async function upsertProfile(userId: string, profileData: ProfileUpdate) {
  try {
    const insertData: ProfileInsert = {
      id: userId,
      ...profileData,
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(insertData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to update profile' };
  }
}

/**
 * Update a user's profile
 */
export async function updateProfile(userId: string, profileData: ProfileUpdate) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to update profile' };
  }
}

