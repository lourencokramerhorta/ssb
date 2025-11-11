/**
 * Storage Service
 * 
 * This file contains functions for uploading and managing files in Supabase Storage.
 */

import { supabase } from './supabase';

const AVATAR_BUCKET = 'avatars';

/**
 * Upload an avatar image to Supabase Storage
 * @param userId - The user's ID
 * @param fileUri - The local file URI (from image picker)
 * @param mimeType - The MIME type of the image (e.g., 'image/jpeg', 'image/png')
 * @returns The public URL of the uploaded image
 */
export async function uploadAvatar(userId: string, fileUri: string, mimeType: string) {
  try {
    // Generate a unique filename
    const fileExt = mimeType.split('/')[1];
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Read the file as a blob
    // In React Native, fetch works with file URIs and converts them to blobs
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    // Supabase JS client handles blob uploads in React Native
    const { data, error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, blob, {
        contentType: mimeType,
        upsert: true, // Replace if exists
      });

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    return { 
      data: { url: urlData.publicUrl, path: filePath }, 
      error: null 
    };
  } catch (error: any) {
    return { 
      data: null, 
      error: error.message || 'Failed to upload avatar' 
    };
  }
}

/**
 * Delete an avatar image from Supabase Storage
 * @param filePath - The path of the file to delete
 */
export async function deleteAvatar(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove([filePath]);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete avatar' };
  }
}

