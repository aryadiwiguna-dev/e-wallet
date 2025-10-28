import { create } from 'zustand';


export interface PulsaItem {
  id: string;
  amount: number;
  price: number; 
  description: string;
}

interface PulsaStore {
  items: PulsaItem[];
}

// Data pulsa statis
const staticPulsaItems: PulsaItem[] = [
  { id: '1', amount: 10000, price: 11000, description: 'Rp 10.000' },
  { id: '2', amount: 25000, price: 26000, description: 'Rp 25.000' },
  { id: '3', amount: 50000, price: 51000, description: 'Rp 50.000' },
  { id: '4', amount: 100000, price: 101000, description: 'Rp 100.000' },
];

export const usePulsaStore = create<PulsaStore>(() => ({
  items: staticPulsaItems,
}));