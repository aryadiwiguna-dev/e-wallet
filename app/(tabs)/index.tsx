import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BalanceCard from '../../components/BalanceCard';
import ServiceGrid from '../../components/ServiceGrid';
import { useCustomTheme } from '../../context/ThemeContext';
import { useWalletStore } from '../../store/useWalletStore';

export default function HomeScreen() {
  const { theme } = useCustomTheme();
  const { transactions } = useWalletStore();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: theme.spacing.m,
      marginBottom: theme.spacing.m,
      color: theme.colors.text,
      marginTop: 50
    },
    recentTransactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
  });

  const recentTransactions = transactions.slice(0, 3);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <BalanceCard />

        <ThemedText style={styles.sectionTitle}>Semua Layanan</ThemedText>
        <ServiceGrid />

        <ThemedText style={styles.sectionTitle}>Transaksi Terkini</ThemedText>
        <View style={{ backgroundColor: theme.colors.card, marginHorizontal: theme.spacing.m, borderRadius: 8,  }}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((trx) => (
              <View key={trx.id} style={styles.recentTransactionItem}>
                <View>
                  <ThemedText>{trx.description}{" "}</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: theme.colors.text }}>
                    {trx.date.toLocaleDateString('id-ID')}
                  </ThemedText>
                </View>
              </View>
            ))
          ) : (
            <ThemedText style={{ textAlign: 'center', padding: theme.spacing.m, color: theme.colors.textSecondary }}>
              Belum ada transaksi.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}