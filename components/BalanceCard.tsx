import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import ikon
import { ThemedText } from '@/components/themed-text';
import { useCustomTheme } from '../context/ThemeContext';
import { useWalletStore } from '../store/useWalletStore';
import { useRouter } from 'expo-router';

export default function BalanceCard() {
  const { theme } = useCustomTheme();
  const { balance, withdraw } = useWalletStore();
  const router = useRouter();

  // State untuk kontrol visibilitas saldo
  const [isVisible, setIsVisible] = useState(true);

  const handleWithdraw = () => {
    const amount = 50000; 
    if (balance < amount) {
      Alert.alert('Error', 'Saldo tidak mencukupi. Minimal Saldo Harus 50.000');
      return;
    }

    Alert.alert(
      'Konfirmasi Tarik Tunai',
      `Apakah Anda yakin ingin menarik tunai sebesar Rp ${amount.toLocaleString('id-ID')}?`,
      [
        {
          text: 'Batal',
          style: 'cancel', 
        },
        {
          text: 'Ya, Tarik',
          style: 'destructive', 
          onPress: () => {
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
      backgroundColor: theme.colors.primary,
      marginHorizontal: theme.spacing.m,
      borderRadius: 16,
      elevation: 4,
    },
    content: {
      paddingVertical: theme.spacing.l,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balanceLabel: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 14,
    },
    eyeIcon: {
      marginLeft: 8,
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
    outlineButton: {
      borderColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 20,
      flex: 1,
    }
  });

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Baris Label + Tombol Mata */}
        <View style={styles.labelRow}>
          <ThemedText style={styles.balanceLabel}>Saldo Anda</ThemedText>
          <TouchableOpacity 
            onPress={() => setIsVisible(!isVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons 
              name={isVisible ? 'eye-outline' : 'eye-off-outline'} 
              size={18} 
              color="rgba(255, 255, 255, 0.8)" 
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Logika Tampilan Saldo */}
        <ThemedText style={styles.balanceAmount}>
          {isVisible 
            ? `Rp ${balance.toLocaleString('id-ID')}` 
            : 'Rp ••••••••'}
        </ThemedText>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            textColor="white" 
            style={styles.outlineButton} 
            onPress={handleTopUp}
            labelStyle={{ fontSize: 13 }}
          >
            Top Up
          </Button>
          <Button 
            mode="outlined" 
            textColor="white" 
            style={styles.outlineButton} 
            onPress={handleWithdraw}
            labelStyle={{ fontSize: 13 }}
          >
            Tarik Tunai
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}