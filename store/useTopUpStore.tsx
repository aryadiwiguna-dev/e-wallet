import { create } from 'zustand';


export interface TopUpItem {
  id: string;
  amount: number;
  description: string;
}

interface TopUpStore {
  items: TopUpItem[];
}

const staticTopUpItems: TopUpItem[] = [
  { id: '1', amount: 10000, description: 'Rp 10.000' },
  { id: '2', amount: 25000, description: 'Rp 25.000' },
  { id: '3', amount: 50000, description: 'Rp 50.000' },
  { id: '4', amount: 100000, description: 'Rp 100.000' },
  { id: '5', amount: 200000, description: 'Rp 200.000' },
  { id: '6', amount: 500000, description: 'Rp 500.000' },
];

export const useTopUpStore = create<TopUpStore>(() => ({
  items: staticTopUpItems,
}));    