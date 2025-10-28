import { create } from 'zustand';

// Tipe data pengguna
export interface User {
  name: string;
  email: string;
  avatarUrl?: string; // Opsional, untuk foto profil
}

interface UserStore {
  user: User | null;
}

// Data pengguna statis untuk saat ini
const staticUser: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
};

export const useUserStore = create<UserStore>(() => ({
  user: staticUser,
}));