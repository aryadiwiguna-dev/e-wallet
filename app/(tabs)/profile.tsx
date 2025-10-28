import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Avatar } from 'react-native-paper';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCustomTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store/useUserStore';
import { useWalletStore } from '@/store/useWalletStore';

export default function ProfileScreen() {
  const { theme } = useCustomTheme();
  const { user } = useUserStore();
  const { balance } = useWalletStore();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      marginTop: 50,
    },
    header: {
      padding: theme.spacing.l,
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    avatar: {
      backgroundColor: theme.colors.primary,
    },
    userName: {
      marginTop: theme.spacing.m,
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    listSection: {
      marginTop: theme.spacing.l,
      backgroundColor: theme.colors.card,
    },
  });

  return (
    <ThemedView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Avatar.Text
          size={80}
          label={user ? user.name.charAt(0).toUpperCase() : 'U'}
          style={dynamicStyles.avatar}
        />
        <ThemedText style={dynamicStyles.userName}>{user?.name}</ThemedText>
        <ThemedText style={dynamicStyles.userEmail}>{user?.email}</ThemedText>
      </View>

      <View style={dynamicStyles.listSection}>
        <List.Section>
          <List.Item
            title="Saldo Saat Ini"
            description="Lihat sisa saldo Anda"
            titleStyle={{ color: theme.colors.text }}
            descriptionStyle={{ color: theme.colors.textSecondary }}
            left={(props) => <List.Icon {...props} icon="wallet" color={theme.colors.primary} />}
            right={() => <ThemedText>Rp {(balance || 0).toLocaleString('id-ID')}</ThemedText>} 
          />
          <List.Item
            title="Pengaturan Tema" 
            description="Ubah tampilan aplikasi"
            titleStyle={{ color: theme.colors.text }}
            descriptionStyle={{ color: theme.colors.textSecondary }}
            left={(props) => <List.Icon {...props} icon="palette" color={theme.colors.primary} />}
          />
          <List.Item
            title="Bantuan"
            description="Pusat bantuan dan FAQ"
            titleStyle={{ color: theme.colors.text }}
            descriptionStyle={{ color: theme.colors.textSecondary }}
            left={(props) => <List.Icon {...props} icon="help-circle" color={theme.colors.primary} />}
          />
        </List.Section>
      </View>
    </ThemedView>
  );
}