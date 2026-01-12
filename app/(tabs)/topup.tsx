import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View, ActivityIndicator } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useRouter } from 'expo-router'; 
import CustomButton from '../../components/Button';
import { useCustomTheme } from '../../context/ThemeContext';
import { TopUpItem, useTopUpStore } from '../../store/useTopUpStore';
import { useWalletStore } from '../../store/useWalletStore';

export default function TopUpScreen() {
  const { theme } = useCustomTheme();
  const { items } = useTopUpStore();
  const { topUp, isLoading } = useWalletStore(); 
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState<TopUpItem | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleTopUp = async () => {
    let finalAmount = 0;
    
    const trimmed = customAmount.trim();
    if (trimmed !== '') {
      const parsed = Number(trimmed);
      if (isNaN(parsed) || parsed <= 0) {
        Alert.alert('Error', 'Masukkan nominal yang valid.');
        return;
      }
      finalAmount = parsed;
    } else if (selectedItem) {
      finalAmount = selectedItem.amount;
    } else {
      Alert.alert('Error', 'Pilih nominal atau masukkan jumlah yang valid.');
      return;
    }

    Alert.alert(
      'Konfirmasi Top Up',
      `Top Up sebesar Rp ${finalAmount.toLocaleString('id-ID')}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Top Up',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              await topUp(finalAmount);
              
              Alert.alert('Sukses', 'Top Up berhasil!', [
                { 
                  text: 'OK', 
                  onPress: () => router.back() 
                }
              ]);
              
              setSelectedItem(null);
              setCustomAmount('');
            } catch (error) {
              Alert.alert('Error', 'Gagal memproses Top Up. Silakan coba lagi.');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 50, 
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
      borderWidth: 1,
      borderColor: theme.colors.border,
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
      overflow: 'hidden', 
    },
    buttonContainer: {
      padding: theme.spacing.m,
      marginTop: theme.spacing.m,
    },
  });

  return (
    <ThemedView style={dynamicStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <ThemedText style={dynamicStyles.title}>Pilih Nominal Top Up</ThemedText>

        <View style={dynamicStyles.inputContainer}>
          <TextInput
            style={dynamicStyles.input}
            placeholder="Masukkan nominal lainnya"
            placeholderTextColor={theme.colors.textSecondary}
            value={customAmount}
            onChangeText={(text) => {
              setCustomAmount(text);
              setSelectedItem(null); 
            }}
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
          {isSubmitting || isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <CustomButton 
              style={{ backgroundColor: theme.colors.primary }} 
              title="Top Up Sekarang" 
              onPress={handleTopUp} 
            />
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}