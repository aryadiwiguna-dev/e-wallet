import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export type Transaction = {
  id: string;
  user_id: string;
  type: 'TOPUP' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'PAYMENT';
  amount: number;
  description: string;
  recipient_id?: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction;
        Insert: {
          id?: string;
          user_id: string;
          type: 'TOPUP' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'PAYMENT';
          amount: number;
          description?: string | null;
          recipient_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Transaction>;
      };
      wallets: {
        Row: {
          user_id: string;
          balance: number;
          updated_at?: string;
        };
        Insert: {
          user_id: string;
          balance: number;
          updated_at?: string;
        };
        Update: {
          balance?: number;
          updated_at?: string;
        };
      };
    };
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});