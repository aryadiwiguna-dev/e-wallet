import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/Button';
import { useCustomTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase'; 
import { useWalletStore } from '../../store/useWalletStore';

export default function TransferScreen() {
  const { balance, fetchWalletData, isLoading} = useWalletStore();
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState(''); // Kosongkan agar user input
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { theme } = useCustomTheme();
  const router = useRouter();

  const handleTransfer = async () => {
    const numAmount = Number(amount);
    
    // 1. Validasi Input
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Masukkan jumlah yang valid');
      return;
    }

    if (!recipientId.trim()) {
      Alert.alert('Error', 'Masukkan ID Penerima');
      return;
    }

    // 2. Validasi Saldo
    if (numAmount > balance) {
      Alert.alert('Error', 'Saldo Anda tidak mencukupi');
      return;
    }

    Alert.alert(
      'Konfirmasi Transfer',
      `Kirim Rp ${numAmount.toLocaleString('id-ID')} ke ${recipientId}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Kirim',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) throw new Error("User tidak ditemukan");

              // Simpan transaksi TRANSFER_OUT ke Supabase
              const { error } = await supabase
                .from('transactions')
                .insert({
                  user_id: user.id,
                  type: 'TRANSFER_OUT',
                  amount: -numAmount, // Negatif karena uang keluar
                  description: `Transfer ke ${recipientId}`,
                  recipient_id: recipientId
                } as any);

              if (error) throw error;

              await fetchWalletData(); // Refresh saldo & history
              
              Alert.alert('Sukses', 'Transfer berhasil!', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error: any) {
              Alert.alert('Gagal', error.message || 'Terjadi kesalahan');
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.l,
      backgroundColor: theme.colors.background,
      paddingTop: 50,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xl,
      color: theme.colors.text,
    },
    label: {
      fontSize: 16,
      marginBottom: theme.spacing.s,
      color: theme.colors.text,
      fontWeight: '600',
    },
    input: {
      height: 50,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: theme.spacing.m,
      marginBottom: theme.spacing.l,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
    },
  });

  return (
    <ThemedView style={dynamicStyles.container}>
      <ThemedText type="title" style={dynamicStyles.title}>
        Transfer Saldo
      </ThemedText>

      <ThemedText style={dynamicStyles.label}>ID Penerima</ThemedText>
      <TextInput
        style={dynamicStyles.input}
        value={recipientId}
        onChangeText={setRecipientId}
        placeholder="Masukkan ID User Penerima"
        placeholderTextColor={theme.colors.textSecondary}
        autoCapitalize="none"
      />

      <ThemedText style={dynamicStyles.label}>Jumlah Transfer</ThemedText>
      <TextInput
        style={dynamicStyles.input}
        placeholder="Contoh: 50000"
        placeholderTextColor={theme.colors.textSecondary}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {isSubmitting || isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <CustomButton 
          title="Kirim Transfer" 
          style={{ backgroundColor: theme.colors.primary }} 
          onPress={handleTransfer} 
        />
      )}
      
      <ThemedText style={{ 
        textAlign: 'center', 
        marginTop: theme.spacing.m, 
        color: theme.colors.textSecondary,
        fontSize: 14 
      }}>
        Saldo Anda: Rp {balance.toLocaleString('id-ID')}
      </ThemedText>
    </ThemedView>
  );
}