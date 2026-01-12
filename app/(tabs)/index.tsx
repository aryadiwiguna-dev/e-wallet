import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import BalanceCard from '../../components/BalanceCard';
import ServiceGrid from '../../components/ServiceGrid';
import { useCustomTheme } from '../../context/ThemeContext';
import { useWalletStore } from '../../store/useWalletStore';

export default function HomeScreen() {
  const { theme } = useCustomTheme();
  
  
  const { 
    transactions, 
    fetchWalletData, 
    subscribeToWallet, 
    isLoading 
  } = useWalletStore();

  useEffect(() => {
    
    fetchWalletData();


    const unsubscribe = subscribeToWallet();


    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.m, 
      marginTop: 25,
      marginBottom: theme.spacing.m,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    listContainer: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.m,
      borderRadius: 12, 
      overflow: 'hidden',
      elevation: 2, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 20,
    },
    recentTransactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
  });

 
  const recentTransactions = transactions.slice(0, 5);

  const getTransactionIcon = (description: string, amount: number) => {
    if (amount > 0) return 'arrow-bottom-left'; 
    if (description.includes('Transfer')) return 'send'; 
    if (description.includes('Top Up')) return 'wallet-plus';
    return 'cart-outline'; 
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchWalletData} 
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={{ marginTop: 60 }}>
          <BalanceCard />
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Semua Layanan</ThemedText>
        </View>
        <ServiceGrid />

        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Transaksi Terkini</ThemedText>
          <ThemedText style={{ color: theme.colors.primary, fontSize: 14, fontWeight: '600' }}>
            Lihat Semua
          </ThemedText>
        </View>

        <View style={styles.listContainer}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((trx) => {
              const trxDate = new Date(trx.created_at);
              const isIncome = trx.amount > 0;
              
              return (
                <View key={trx.id} style={styles.recentTransactionItem}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons 
                      name={getTransactionIcon(trx.description, trx.amount)} 
                      size={22} 
                      color={isIncome ? theme.colors.success : theme.colors.primary} 
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: '600', fontSize: 15 }} numberOfLines={1}>
                      {trx.description.replace('Saldo sebesar ', '')}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                      {trxDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {trxDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </ThemedText>
                  </View>
                  
                  <ThemedText style={{ 
                    fontWeight: 'bold', 
                    fontSize: 15,
                    color: isIncome ? theme.colors.success : theme.colors.text 
                  }}>
                    {isIncome ? '+' : '-'}Rp {Math.abs(trx.amount).toLocaleString('id-ID')}
                  </ThemedText>
                </View>
              );
            })
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
               <MaterialCommunityIcons name="history" size={48} color={theme.colors.border} />
               <ThemedText style={{ textAlign: 'center', marginTop: 10, color: theme.colors.textSecondary }}>
                {isLoading ? "Memuat data..." : "Belum ada transaksi."}
              </ThemedText>
            </View>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}