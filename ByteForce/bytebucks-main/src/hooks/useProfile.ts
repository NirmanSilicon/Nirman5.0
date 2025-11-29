import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  wallet_address: string | null;
  user_type: 'creator' | 'collector' | null;
  is_verified: boolean | null;
  total_volume: number | null;
  phone_number: string | null;
  phone_verified: boolean | null;
  notification_preferences: {
    bid_received: boolean;
    bid_outbid: boolean;
    sale: boolean;
    price_alert: boolean;
    wishlist_update: boolean;
    follow: boolean;
    like: boolean;
  } | null;
  created_at: string;
  updated_at: string;
}

const defaultNotificationPrefs = {
  bid_received: true,
  bid_outbid: true,
  sale: true,
  price_alert: true,
  wishlist_update: true,
  follow: true,
  like: true,
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile({
        ...data,
        notification_preferences: (data.notification_preferences as Profile['notification_preferences']) || defaultNotificationPrefs,
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Pick<Profile, 'display_name' | 'username' | 'bio' | 'avatar_url'>>) => {
    if (!user || !profile) {
      toast.error('Please sign in to update your profile');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }

    setProfile(prev => prev ? { ...prev, ...updates } : null);
    toast.success('Profile updated successfully');
    return true;
  };

  const updateNotificationPreferences = async (preferences: Profile['notification_preferences']) => {
    if (!user || !profile) {
      toast.error('Please sign in to update preferences');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        notification_preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
      return false;
    }

    setProfile(prev => prev ? { ...prev, notification_preferences: preferences } : null);
    toast.success('Notification preferences updated');
    return true;
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to upload an avatar');
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      toast.error('Failed to upload avatar');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update profile with new avatar URL
    const updated = await updateProfile({ avatar_url: publicUrl });
    if (updated) {
      return publicUrl;
    }
    return null;
  };

  return {
    profile,
    loading,
    updateProfile,
    updateNotificationPreferences,
    uploadAvatar,
    refetch: fetchProfile,
  };
}
