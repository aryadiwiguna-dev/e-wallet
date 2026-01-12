import React from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Share, TouchableOpacity } from 'react-native';
import { List, Avatar } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCustomTheme } from '../../context/ThemeContext';
import { useUserStore } from '../../store/useUserStore';
import { useWalletStore } from '@/store/useWalletStore';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const { theme } = useCustomTheme();
  const { profile } = useUserStore();
  const { balance } = useWalletStore();

  
  const deepLinkUrl = `ewalletproject://transfer?id=${profile?.id}`;

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await supabase.auth.signOut();
          } 
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Kirim saldo ke saya menggunakan e-Wallet! Klik link ini: ${deepLinkUrl}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: 50,
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
      marginBottom: theme.spacing.m,
    },
    userName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    userEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.l,
    },
    qrContainer: {
      padding: 15,
      backgroundColor: 'white',
      borderRadius: 12,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    listSection: {
      marginTop: theme.spacing.l,
      backgroundColor: theme.colors.card,
    },
    shareAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: theme.colors.primary + '20',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20
    }
  });

  return (
    <ThemedView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Avatar.Text
          size={70}
          label={profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          style={dynamicStyles.avatar}
        />
        <ThemedText style={dynamicStyles.userName}>{profile?.name || 'User'}</ThemedText>
        <ThemedText style={dynamicStyles.userEmail}>{profile?.email}</ThemedText>

        <View style={dynamicStyles.qrContainer}>
          {profile?.id ? (
            <QRCode
              value={deepLinkUrl} // SEKARANG MENGGUNAKAN DEEP LINK SCHEME
              size={160}
              color="black"
              backgroundColor="white"
            />
          ) : (
            <ActivityIndicator color={theme.colors.primary} />
          )}
        </View>

        <TouchableOpacity style={dynamicStyles.shareAction} onPress={handleShare}>
            <MaterialCommunityIcons name="share-variant" size={18} color={theme.colors.primary} />
            <ThemedText style={{ color: theme.colors.primary, marginLeft: 8, fontWeight: '600' }}>
                Bagikan ID Saya
            </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.listSection}>
        <List.Section>
          <List.Item
            title="Saldo Saat Ini"
            titleStyle={{ color: theme.colors.text }}
            left={(props) => <List.Icon {...props} icon="wallet" color={theme.colors.primary} />}
            right={() => (
              <ThemedText style={{ alignSelf: 'center', fontWeight: 'bold', marginRight: 10 }}>
                Rp {(balance || 0).toLocaleString('id-ID')}
              </ThemedText>
            )} 
          />
          <List.Item
            title="Pengaturan Akun"
            titleStyle={{ color: theme.colors.text }}
            left={(props) => <List.Icon {...props} icon="cog" color={theme.colors.primary} />}
          />
          <List.Item
            title="Keluar"
            titleStyle={{ color: '#ff4444' }}
            left={(props) => <List.Icon {...props} icon="logout" color="#ff4444" />}
            onPress={handleLogout}
          />
        </List.Section>
      </View>
    </ThemedView>
  );
}