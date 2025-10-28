import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { useCustomTheme } from '../context/ThemeContext';
import { useWalletStore } from '../store/useWalletStore';
import { useRouter } from 'expo-router';

export default function BalanceCard() {
  const { theme } = useCustomTheme();
  const { balance, withdraw } = useWalletStore();
  const router = useRouter();

   const handleWithdraw = () => {
    // Untuk sementara, kita buat jumlah tetap. Nanti bisa dikembangkan dengan modal input.
    const amount = 50000; 
    if (balance < amount) {
      Alert.alert('Error', 'Saldo tidak mencukupi. Minimal Saldo Harus 50.000');
      return;
    }
    // withdraw(amount);
    // Alert.alert('Sukses', `Penarikan sebesar Rp ${amount.toLocaleString('id-ID')} berhasil!`);

    Alert.alert(
      'Konfirmasi Tarik Tunai',
      `Apakah Anda yakin ingin menarik tunai sebesar Rp ${amount.toLocaleString('id-ID')}?`,
      [
        {
          text: 'Batal',
          style: 'cancel', // Style 'cancel' akan membuat tombol ini sedikit lebih menonjol
          onPress: () => console.log('Tarik tunai dibatalkan.'),
        },
        {
          text: 'Ya, Tarik',
          style: 'destructive', // Style 'destructive' biasanya warna merah, cocok untuk aksi penting
          onPress: () => {
            // 3. Jika pengguna menekan "Ya", maka eksekusi fungsi withdraw
            withdraw(amount);
            Alert.alert('Sukses', `Penarikan sebesar Rp ${amount.toLocaleString('id-ID')} berhasil!`);
          },
        },
      ]
    );


  };

   const handleTopUp = () => {
    router.push('/(tabs)/topup');
  };

  const styles = StyleSheet.create({
    card: {
      marginTop: 50,
      backgroundColor: theme.colors.primary,
      marginHorizontal: theme.spacing.m,
      borderRadius: 16,
    },
    content: {
      paddingVertical: theme.spacing.l,
    },
    balanceLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14,
    },
    balanceAmount: {
      color: 'white',
      fontSize: 32,
      fontWeight: 'bold',
      marginTop: 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.m,
      gap: theme.spacing.m,
    },
  });

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <ThemedText style={styles.balanceLabel}>Saldo Anda</ThemedText>
        <ThemedText style={styles.balanceAmount}>
          Rp {balance.toLocaleString('id-ID')}
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" textColor="white" style={{ borderColor: 'white' }} onPress={handleTopUp}>
            Top Up
          </Button>
          <Button mode="outlined" textColor="white" style={{ borderColor: 'white' }} onPress={handleWithdraw}>
            Tarik Tunai
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}