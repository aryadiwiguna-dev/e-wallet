import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  type: 'TOPUP' | 'WITHDRAW' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'PAYMENT';
  amount: number;
  description: string;
  date: Date;
  recipient?: string;
}

interface WalletStore {
  balance: number;
  transactions: Transaction[];
  
  // Actions 
  topUp: (amount: number) => void;
  withdraw: (amount: number) => void;
  transfer: (amount: number, recipientUserId: string) => void;
  payWithQR: (amount: number, merchantName: string) => void;
  getFilteredTransactions: (filter?: string) => Transaction[];
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      balance: 100000,
      transactions: [
        { id: '1', type: 'TOPUP', amount: 50000, description: 'Top Up Saldo Awal', date: new Date() },
      ],

      // Fungsi-fungsi aksi 
      topUp: (amount: number) => {
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'TOPUP',
          amount,
          description: `Top Up Saldo sebesar Rp ${amount.toLocaleString('id-ID')}`,
          date: new Date(),
        };
        set((state) => ({
          balance: state.balance + amount,
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      withdraw: (amount: number) => {
        const currentBalance = get().balance;
        if (amount > currentBalance) {
          alert('Saldo tidak mencukupi!');
          return;
        }
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'WITHDRAW',
          amount: -amount,
          description: `Tarik Tunai sebesar Rp ${amount.toLocaleString('id-ID')}`,
          date: new Date(),
        };
        set((state) => ({
          balance: state.balance - amount,
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      transfer: (amount: number, recipientUserId: string) => {
        const currentBalance = get().balance;
        if (amount > currentBalance) {
          alert('Saldo tidak mencukupi!');
          return;
        }
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'TRANSFER_OUT',
          amount: -amount,
          description: `Transfer ke ${recipientUserId}`,
          date: new Date(),
          recipient: recipientUserId,
        };
        set((state) => ({
          balance: state.balance - amount,
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      payWithQR: (amount: number, merchantName: string) => {
        const currentBalance = get().balance;
        if (amount > currentBalance) {
          alert('Saldo tidak mencukupi!');
          return;
        }
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: 'PAYMENT',
          amount: -amount,
          description: `Pembayaran di ${merchantName}`,
          date: new Date(),
        };
        set((state) => ({
          balance: state.balance - amount,
          transactions: [newTransaction, ...state.transactions],
        }));
      },

      getFilteredTransactions: (filter?: string) => {
        const { transactions } = get();
        if (!filter) return transactions;
        return transactions.filter((trx) => trx.type === filter);
      },
    }),
    {
      name: 'wallet-storage', // AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), //  AsyncStorage

      onRehydrateStorage: () => (state) => {
        console.log('Hydrating store from AsyncStorage...');
        
        
        if (state) {
          
          state.transactions = state.transactions.map((trx) => ({
            ...trx,
            date: new Date(trx.date), 
          }));
        }
        
        console.log('Store has been hydrated.');
      },
    
      },
  )
);