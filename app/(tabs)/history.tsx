import React, { useState, useEffect, useMemo } from 'react'; 
import { FlatList, StyleSheet, RefreshControl } from 'react-native'; 
import { List, SegmentedButtons } from 'react-native-paper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCustomTheme } from '../../context/ThemeContext';
import { useWalletStore} from '../../store/useWalletStore'; 
import { Transaction } from '../../lib/supabase';

export default function HistoryScreen() {
  const { transactions, fetchWalletData, isLoading } = useWalletStore();
  const [filter, setFilter] = useState<string>('ALL');
  const { theme } = useCustomTheme();

  useEffect(() => {
    fetchWalletData();
  }, []);

  const filters = [
    { value: 'ALL', label: 'Semua' },
    { value: 'TOPUP', label: 'Top Up' },
    { value: 'TRANSFER_OUT', label: 'Transfer' },
    { value: 'PAYMENT', label: 'Bayar' },
  ];

  const filteredTransactions = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

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

  const renderItem = ({ item }: { item: Transaction }) => {
    const transactionDate = new Date(item.created_at);
   
    const isPositive = item.type === 'TOPUP' || item.type === 'TRANSFER_IN';

    return (
      <List.Item
        title={item.description}
        description={transactionDate.toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
        titleStyle={{ color: theme.colors.text }}
        descriptionStyle={{ color: theme.colors.textSecondary }}
        style={{ backgroundColor: theme.colors.card, marginBottom: 1 }}
        left={(props) => (
          <List.Icon {...props} icon={getIcon(item.type)} color={isPositive ? '#4CAF50' : '#FF5252'} />
        )}
        right={() => (
          <ThemedText
            style={[
              styles.amount,
              { color: isPositive ? '#4CAF50' : '#FF5252' },
            ]}
          >
            {isPositive ? '+' : '-'}Rp {Math.abs(item.amount).toLocaleString('id-ID')}
          </ThemedText>
        )}
      />
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={filters}
        style={styles.segmentedButton}
      />
      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchWalletData} 
            tintColor={theme.colors.primary} 
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <ThemedText style={styles.emptyText}>Belum ada transaksi.</ThemedText>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  segmentedButton: { marginHorizontal: 15, marginBottom: 15 },
  amount: { fontSize: 16, fontWeight: 'bold', alignSelf: 'center', marginRight: 10 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, opacity: 0.5 },
});