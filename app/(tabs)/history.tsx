import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
import { FlatList, StyleSheet, RefreshControl } from 'react-native'; // Tambahkan RefreshControl
import { List, SegmentedButtons } from 'react-native-paper';

import { useCustomTheme } from '../../context/ThemeContext';
import { Transaction, useWalletStore } from '../../store/useWalletStore';

export default function HistoryScreen() {
  // Ambil fetchWalletData dan isLoading dari store
  const { transactions, getFilteredTransactions, fetchWalletData, isLoading } = useWalletStore();
  const [filter, setFilter] = useState<string>('ALL');
  const { theme } = useCustomTheme();

  // Ambil data saat screen dibuka
  useEffect(() => {
    fetchWalletData();
  }, []);

  const filters = [
    { value: 'ALL', label: 'Semua' },
    { value: 'TOPUP', label: 'Top Up' },
    { value: 'TRANSFER_OUT', label: 'Transfer' },
    { value: 'PAYMENT', label: 'Pembayaran' },
  ];

  const filteredTransactions = filter === 'ALL' ? transactions : getFilteredTransactions(filter);

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 50, // Gunakan paddingTop agar lebih rapi
    },
    segmentedButton: {
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.s,
    },
    itemStyle: {
      backgroundColor: theme.colors.card,
      marginBottom: 1,
    },
    amount: {
      fontSize: 16,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: theme.spacing.xl,
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
  });

  const renderItem = ({ item }: { item: Transaction }) => {
    // Supabase menyimpan date sebagai string (ISO), pastikan dikonversi ke Date object
    const transactionDate = new Date(item.created_at || new Date());

    return (
      <List.Item
        title={item.description}
        description={transactionDate.toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
        titleStyle={{ color: theme.colors.text }}
        descriptionStyle={{ color: theme.colors.textSecondary }}
        style={dynamicStyles.itemStyle}
        left={(props) => (
          <List.Icon {...props} icon={getIcon(item.type)} color={theme.colors.primary} />
        )}
        right={() => (
          <ThemedText
            style={[
              dynamicStyles.amount,
              { color: item.amount > 0 ? theme.colors.success : theme.colors.error },
            ]}
          >
            {item.amount > 0 ? '+' : ''}Rp {Math.abs(item.amount).toLocaleString('id-ID')}
          </ThemedText>
        )}
      />
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'TOPUP':
      case 'TRANSFER_IN':
        return 'arrow-down-bold';
      case 'WITHDRAW':
      case 'TRANSFER_OUT':
      case 'PAYMENT':
        return 'arrow-up-bold';
      default:
        return 'help-circle';
    }
  };

  return (
    <ThemedView style={dynamicStyles.container}>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={filters}
        style={dynamicStyles.segmentedButton}
      />
      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        // Tambahkan fitur pull-to-refresh
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchWalletData} 
            colors={[theme.colors.primary]} // Untuk Android
            tintColor={theme.colors.primary} // Untuk iOS
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <ThemedText style={dynamicStyles.emptyText}>Belum ada transaksi.</ThemedText>
          ) : null
        }
      />
    </ThemedView>
  );
}