import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store';
import type { UserProfile } from '../types';

/**
 * ViewModel for user profile data and updates.
 */
export const useProfileViewModel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const user = useStore(s => s.user);
  const profile = useStore(s => s.profile);
  const setProfile = useStore(s => s.setProfile);

  const fetchProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (fetchErr && fetchErr.code !== 'PGRST116') {
        throw fetchErr;
      }
      if (data) setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const payload = profile ? { ...profile, ...updates } : { id: user.id, ...updates };
      const { data, error: updateErr } = await supabase
        .from('profiles')
        .upsert(payload)
        .select()
        .single();
        
      if (updateErr) throw updateErr;
      if (data) setProfile(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error updating profile';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user]);

  return { 
    user,
    profile, 
    isLoading, 
    error,
    updateProfile, 
    fetchProfile 
  };
};
