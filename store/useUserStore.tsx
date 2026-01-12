import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}


interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>; 
  clearProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: false,

  // Fungsi untuk mengambil data user dari Supabase Auth
  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      if (user) {
        set({
          profile: {
            id: user.id,
            email: user.email || '',
            // Mengambil nama dari metadata atau memotong email sebagai nama sementara
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            avatarUrl: user.user_metadata?.avatar_url,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fungsi untuk menghapus data saat logout
  clearProfile: () => set({ profile: null }),
}));