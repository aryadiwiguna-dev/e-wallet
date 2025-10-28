import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { List, SegmentedButtons } from 'react-native-paper';

import { useCustomTheme } from '../../context/ThemeContext';
import { Transaction, useWalletStore } from '../../store/useWalletStore';

export default function HistoryScreen() {
  const { transactions, getFilteredTransactions } = useWalletStore();
  const [filter, setFilter] = useState<string>('ALL');
  const { theme } = useCustomTheme();

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
      marginTop: 50,
    },
    segmentedButton: {
      marginHorizontal: theme.spacing.m,
      marginVertical: theme.spacing.s,
      backgroundColor: '#fff',
      borderRadius: 20,
    },
    itemStyle: {
      backgroundColor: theme.colors.card,
      marginBottom: 1,
      color: theme.colors.text,
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
    },
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <List.Item
      title={item.description}
      description={item.date.toLocaleString('id-ID')}
      titleStyle={{ color: theme.colors.text }}
      descriptionStyle={{ color: theme.colors.textSecondary }}
      style={dynamicStyles.itemStyle}
      left={(props) => <List.Icon {...props} icon={getIcon(item.type)} color={theme.colors.primary} />}
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'TOPUP': return 'arrow-down-bold';
      case 'WITHDRAW':
      case 'TRANSFER_OUT':
      case 'PAYMENT': return 'arrow-up-bold';
      default: return 'help-circle';
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
        ListEmptyComponent={
          <ThemedText style={dynamicStyles.emptyText}>Belum ada transaksi.</ThemedText>
        }
      />
    </ThemedView>
  );
}