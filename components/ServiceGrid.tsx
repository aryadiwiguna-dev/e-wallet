import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useCustomTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32) / 4; // Menyesuaikan dengan padding luar (16 * 2)

const SERVICES = [
  { id: '1', name: 'Pulsa', icon: 'phone' },
  { id: '2', name: 'Listrik PLN', icon: 'flashlight' },
  { id: '3', name: 'Game Voucher', icon: 'controller-classic' },
  { id: '4', name: 'E-Wallet Lain', icon: 'credit-card-outline' },
  { id: '5', name: 'Streaming', icon: 'play-circle' },
  { id: '6', name: 'Donasi', icon: 'heart' },
  { id: '7', name: 'Asuransi', icon: 'shield-check' },
  { id: '8', name: 'Lainnya', icon: 'dots-horizontal' },
];

export default function ServiceGrid() {
  const { theme } = useCustomTheme();

  return (
    <View style={styles.grid}>
      {SERVICES.map((service) => (
        <TouchableOpacity key={service.id} style={styles.item}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.card }]}>
            <MaterialCommunityIcons 
              name={service.icon as any} 
              size={28} // Ukuran ikon ditingkatkan
              color={theme.colors.primary} 
            />
          </View>
          <ThemedText style={styles.label} numberOfLines={1}>
            {service.name}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  item: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 52, // Area kotak ikon diperluas
    height: 52,
    borderRadius: 14, // Corner radius yang lebih modern
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // Tambahkan sedikit shadow halus
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});