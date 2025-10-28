import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import CustomButton from '../../../components/Button';
import { useCustomTheme } from '../../../context/ThemeContext';
import { PulsaItem, usePulsaStore } from '../../../store/usePulsaStore';
import { useWalletStore } from '../../../store/useWalletStore';

export default function PulsaScreen() {
  const { theme } = useCustomTheme();
  const { items } = usePulsaStore();
  const { balance, payWithQR } = useWalletStore();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedItem, setSelectedItem] = useState<PulsaItem | null>(null);

  const handleBuy = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Nomor telepon harus diisi.');
      return;
    }
    if (!selectedItem) {
      Alert.alert('Error', 'Pilih nominal pulsa terlebih dahulu.');
      return;
    }
    if (balance < selectedItem.price) {
      Alert.alert('Error', 'Saldo tidak mencukupi.');
      return;
    }

    // Konfirmasi
    Alert.alert(
      'Konfirmasi Pembelian',
      `Beli ${selectedItem.description} untuk nomor ${phoneNumber} seharga Rp ${selectedItem.price.toLocaleString('id-ID')}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Beli',
          onPress: () => {
            payWithQR(selectedItem.price, `Pulsa ${phoneNumber}`);
            Alert.alert('Sukses', 'Pembelian pulsa berhasil!');
            setPhoneNumber('');
            setSelectedItem(null);
          },
        },
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    inputContainer: {
      padding: theme.spacing.m,
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

        <View style={dynamicStyles.inputContainer}>
          <TextInput
            style={dynamicStyles.input}
            placeholder="Masukkan Nomor Telepon"
            placeholderTextColor={theme.colors.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={13}
          />
        </View>

        {/* Daftar Nominal */}
        <ThemedText style={dynamicStyles.listTitle}>Pilih Nominal</ThemedText>
        <View style={dynamicStyles.listContainer}>
          <RadioButton.Group onValueChange={(value) => setSelectedItem(items.find(item => item.id === value) || null)} value={selectedItem?.id || ''}>
            {items.map((item) => (
              <RadioButton.Item
                key={item.id}
                label={`${item.description} - Harga: Rp ${item.price.toLocaleString('id-ID')}`}
                value={item.id}
                color={theme.colors.primary}
                labelStyle={{ color: theme.colors.text }}
              />
            ))}
          </RadioButton.Group>
        </View>

        {/* Tombol Beli */}
        <View style={dynamicStyles.buttonContainer}>
          <CustomButton title="Beli Sekarang" onPress={handleBuy} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}