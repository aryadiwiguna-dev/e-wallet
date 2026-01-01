import { create } from 'zustand';
import { supabase, Database } from '../lib/supabase';

// 1. KITA EXPORT INTERFACE INI AGAR BISA DIPAKAI DI HISTORY.TSX
export interface Transaction {
  id: string;
  user_id: string;
  type: 'TOPUP' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'PAYMENT';
  amount: number;
  description: string;
  recipient_id?: string | null;
  created_at: string;
}

// Helper untuk tipe Insert agar kode lebih bersih
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  fetchWalletData: () => Promise<void>;
  topUp: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  payWithQR: (amount: number, merchantName: string) => Promise<void>;
  getFilteredTransactions: (filter?: string) => Transaction[];
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,

  fetchWalletData: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Casting ke Transaction yang sudah kita export di atas
        const txs = data as Transaction[];
        
        const totalBalance = txs.reduce((acc, curr) => {
          return acc + Number(curr.amount);
        }, 0);

        set({ transactions: txs, balance: totalBalance });
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  topUp: async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    const payload: TransactionInsert = {
      user_id: user.id,
      type: 'TOPUP',
      amount: amount,
      description: `Top Up Saldo sebesar Rp ${amount.toLocaleString('id-ID')}`,
    };

    const { error } = await supabase
      .from('transactions')
      .insert(payload as any); 

    if (error) {
      alert(error.message);
    } else {
      await get().fetchWalletData();
    }
  },

  withdraw: async (amount: number) => {
    const { balance } = get();
    if (amount > balance) {
      alert('Saldo tidak mencukupi!');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload: TransactionInsert = {
      user_id: user.id,
      type: 'WITHDRAW',
      amount: -amount,
      description: `Tarik Tunai sebesar Rp ${amount.toLocaleString('id-ID')}`,
    };

    const { error } = await supabase
      .from('transactions')
      .insert(payload as any);

    if (error) {
      alert(error.message);
    } else {
      await get().fetchWalletData();
    }
  },

  payWithQR: async (amount: number, merchantName: string) => {
    const { balance } = get();
    if (amount > balance) {
      alert('Saldo tidak mencukupi!');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload: TransactionInsert = {
      user_id: user.id,
      type: 'PAYMENT',
      amount: -amount,
      description: `Pembayaran di ${merchantName}`,
    };

    const { error } = await supabase
      .from('transactions')
      .insert(payload as any);

    if (error) {
      alert(error.message);
    } else {
      await get().fetchWalletData();
    }
  },

  getFilteredTransactions: (filter?: string) => {
    const { transactions } = get();
    if (!filter) return transactions;
    return transactions.filter((trx) => trx.type === filter);
  },
}));