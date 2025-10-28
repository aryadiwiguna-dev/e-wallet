import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';
import CustomButton from '../../components/Button';
import { useCustomTheme } from '../../context/ThemeContext';
import { useWalletStore } from '../../store/useWalletStore';

export default function TransferScreen() {
  const { transfer } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('USER-123'); // Simulasi ID user
  const { theme } = useCustomTheme();

  const handleTransfer = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Masukkan jumlah yang valid');
      return;
    }
    transfer(numAmount, recipientId);
    setAmount('');
    Alert.alert(
      'Sukses',
      `Transfer Rp ${numAmount.toLocaleString('id-ID')} ke ${recipientId} berhasil!`
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.l,
      backgroundColor: theme.colors.background,
      marginTop: 50,
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

      <ThemedText style={dynamicStyles.label}>ID Penerima (Simulasi)</ThemedText>
      <TextInput
        style={dynamicStyles.input}
        value={recipientId}
        onChangeText={setRecipientId}
        placeholderTextColor={theme.colors.textSecondary}
      />

      <ThemedText style={dynamicStyles.label}>Jumlah Transfer</ThemedText>
      <TextInput
        style={dynamicStyles.input}
        placeholder="Masukkan Jumlah"
        placeholderTextColor={theme.colors.textSecondary}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <CustomButton title="Kirim Transfer" 
     style={{ backgroundColor: theme.colors.primary }} 
      onPress={handleTransfer} />
    </ThemedView>
  );
}