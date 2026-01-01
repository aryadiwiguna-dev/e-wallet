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

// 2. Definisi skema Database yang lengkap
export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction; // Tipe saat kita SELECT data
        Insert: {        // Tipe saat kita INSERT data (id & created_at biasanya opsional)
          id?: string;
          user_id: string;
          type: 'TOPUP' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'PAYMENT';
          amount: number;
          description?: string | null;
          recipient_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Transaction>; // Tipe saat kita UPDATE data
      };
    };
  };
};

// 3. Inisialisasi client dengan Generic <Database>
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});