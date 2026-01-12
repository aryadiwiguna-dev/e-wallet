import { create } from 'zustand';
import { supabase, Transaction } from '../lib/supabase';

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  fetchWalletData: () => Promise<void>;
  subscribeToWallet: () => () => void;
  topUp: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  payWithQR: (amount: number, merchantName: string) => Promise<void>;
  transfer: (recipientId: string, amount: number, recipientName: string) => Promise<void>;

}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,

  // Mengambil data saldo dan riwayat transaksi
  fetchWalletData: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (get().transactions.length === 0) set({ isLoading: true });

      const [walletRes, txRes] = await Promise.all([
        supabase
          .from('wallets' as any)
          .select('balance')
          .eq('user_id', session.user.id)
          .maybeSingle() as any,
        supabase
          .from('transactions' as any)
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }) as any
      ]);

      if (walletRes.error) throw walletRes.error;
      if (txRes.error) throw txRes.error;

      set({ 
        balance: Number(walletRes.data?.balance || 0), 
        transactions: (txRes.data as Transaction[]) || [] 
      });
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  
  subscribeToWallet: () => {
    let channel: any;
    const setup = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      channel = supabase.channel(`wallet-${session.user.id}`)
       
        .on('postgres_changes' as any, 
          { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `user_id=eq.${session.user.id}` },
          (p) => set({ balance: Number(p.new.balance) }))
        
        .on('postgres_changes' as any,
          { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${session.user.id}` },
          () => get().fetchWalletData())
        .subscribe();
    };
    setup();
    return () => { if (channel) supabase.removeChannel(channel); };
  },

  // Fungsi Top Up
  topUp: async (amount: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Login diperlukan");

    const { error } = await (supabase.from('transactions' as any).insert({
      user_id: session.user.id,
      type: 'TOPUP',
      amount: amount,
      description: `Top Up Saldo Rp ${amount.toLocaleString('id-ID')}`,
    } as any) as any);

    if (error) throw error;
  },

  // Fungsi Tarik Tunai
  withdraw: async (amount: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Login diperlukan");

    const { balance } = get();
    if (amount > balance) throw new Error('Saldo tidak mencukupi!');

    const { error } = await (supabase.from('transactions' as any).insert({
      user_id: session.user.id,
      type: 'WITHDRAW',
      amount: -amount, 
      description: `Tarik Tunai Rp ${amount.toLocaleString('id-ID')}`,
    } as any) as any);

    if (error) throw error;
  },

  payWithQR: async (amount: number, merchantName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Login diperlukan");

    const { balance } = get();
    if (amount > balance) throw new Error('Saldo tidak mencukupi!');

    const { error } = await (supabase.from('transactions' as any).insert({
      user_id: session.user.id,
      type: 'PAYMENT',
      amount: -amount,
      description: `Pembayaran di ${merchantName}`,
    } as any) as any);

    if (error) throw error;
  },

  
  transfer: async (recipientId: string, amount: number, recipientName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Sesi berakhir, silakan login ulang.");
    
    const user = session.user;
    if (user.id === recipientId) throw new Error("Tidak bisa transfer ke diri sendiri!");

    const { balance } = get();
    if (amount > balance) throw new Error('Saldo tidak mencukupi!');

    
    const { error } = await (supabase.from('transactions' as any).insert([
      {
        user_id: user.id, 
        type: 'TRANSFER_OUT',
        amount: -amount,
        description: `Transfer ke ${recipientName}`,
        recipient_id: recipientId,
      },
      {
        user_id: recipientId, 
        type: 'TRANSFER_IN',
        amount: amount,
        description: `Transfer dari ${user.email || 'Pengguna Lain'}`,
        recipient_id: user.id,
      }
    ] as any) as any);

    if (error) {
      console.error("Insert error:", error);
      throw new Error(error.message);
    }
    
    // Refresh data setelah transaksi berhasil
    await get().fetchWalletData();
  },

  
}));