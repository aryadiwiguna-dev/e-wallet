// app/(tabs)/topup.tsx
import React, { useState } from 'react';
import { View, TextInput, Alert, ScrollView, StyleSheet } from 'react-native';
import { List, RadioButton } from 'react-native-paper';

// Gunakan komponen dan hook yang sesuai
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomButton from '../../components/Button'
import { useCustomTheme } from '../../context/ThemeContext';
import { TopUpItem, useTopUpStore } from '../../store/useTopUpStore';
import { useWalletStore } from '../../store/useWalletStore';

export default function TopUpScreen() {
  const { theme } = useCustomTheme();
  const { items } = useTopUpStore();
  const { topUp } = useWalletStore();

  const [selectedItem, setSelectedItem] = useState<TopUpItem | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const handleTopUp = () => {
    let finalAmount = selectedItem?.amount || 0;
    
    if (!selectedItem) {
      finalAmount = Number(customAmount);
      if (isNaN(finalAmount) || finalAmount <= 0) {
        Alert.alert('Error', 'Pilih nominal atau masukkan jumlah yang valid.');
        return;
      }
    }

    Alert.alert(
      'Konfirmasi Top Up',
      `Top Up sebesar Rp ${finalAmount.toLocaleString('id-ID')}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Top Up',
          onPress: () => {
            // Proses top up
            topUp(finalAmount);
            Alert.alert('Sukses', 'Top Up berhasil!');
            setSelectedItem(null);
            setCustomAmount('');
          },
        },
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      marginTop: 50,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      padding: theme.spacing.m,
      paddingBottom: 0,
      color: theme.colors.text,
    },
    inputContainer: {
      padding: 10,
      marginTop: 10,
      marginHorizontal: theme.spacing.m,
      borderRadius: 8,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    input: {
      height: 50,
      fontSize: 18,
      color: theme.colors.text,
      backgroundColor: 'transparent',
    },
    listTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      padding: theme.spacing.m,
      paddingBottom: 0,
      color: theme.colors.text,
    },
    listContainer: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      marginTop: theme.spacing.m,
      borderRadius: 8,
    },
    buttonContainer: {
      padding: theme.spacing.m,
    },
  });

  return (
    <ThemedView style={dynamicStyles.container}>
      <ScrollView>
        <ThemedText style={dynamicStyles.title}>Pilih Nominal Top Up</ThemedText>

        <View style={dynamicStyles.inputContainer}>
          <TextInput
            style={dynamicStyles.input}
            placeholder="Masukkan nominal lainnya"
            placeholderTextColor={theme.colors.textSecondary}
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="numeric"
          />
        </View>

        <ThemedText style={dynamicStyles.listTitle}>Nominal Populer</ThemedText>
        <View style={dynamicStyles.listContainer}>
          <RadioButton.Group
            onValueChange={(value) => {
              setSelectedItem(items.find(item => item.id === value) || null);
              setCustomAmount(''); 
            }}
            value={selectedItem?.id || ''}
          >
            {items.map((item) => (
              <RadioButton.Item
                key={item.id}
                label={item.description}
                value={item.id}
                color={theme.colors.primary}
                labelStyle={{ color: theme.colors.text }}
              />
            ))}
          </RadioButton.Group>
        </View>

        <View style={dynamicStyles.buttonContainer}>
          <CustomButton title="Top Up Sekarang" onPress={handleTopUp} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}