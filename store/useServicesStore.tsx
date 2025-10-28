import { create } from 'zustand';
import { ServiceScreenName } from '../constants/screen';


type ServiceIconName = 
  | 'call' 
  | 'flashlight' 
  | 'game-controller' 
  | 'card' 
  | 'play-circle' 
  | 'heart' 
  | 'shield-checkmark' 
  | 'ellipsis-horizontal';

// Tipe data untuk setiap layanan
export interface Service {
  id: string;
  name: string;
  icon: ServiceIconName;
  screen: ServiceScreenName; 
}

interface ServicesStore {
  services: Service[];
}

const staticServices: Service[] = [
  { id: '1', name: 'Pulsa', icon: 'call', screen: 'pulsa' },
  { id: '2', name: 'Listrik PLN', icon: 'flashlight', screen: 'pln' },
  { id: '3', name: 'Game Voucher', icon: 'game-controller', screen: 'game' },
  { id: '4', name: 'E-Wallet Lain', icon: 'card', screen: 'ewallet' },
  { id: '5', name: 'Streaming', icon: 'play-circle', screen: 'streaming' },
  { id: '6', name: 'Donasi', icon: 'heart', screen: 'donate' },
  { id: '7', name: 'Asuransi', icon: 'shield-checkmark', screen: 'insurance' },
  { id: '8', name: 'Lainnya', icon: 'ellipsis-horizontal', screen: 'more' },
];

export const useServicesStore = create<ServicesStore>(() => ({
  services: staticServices,
}));