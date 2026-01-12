import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomButton from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { useWalletStore } from '../../store/useWalletStore';
import { useCustomTheme } from '../../context/ThemeContext';

export default function TransferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useCustomTheme();
  const { balance, transfer, fetchWalletData } = useWalletStore();
  
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  useEffect(() => { 
    const initData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        fetchWalletData();
       
        if (params.id) {
          const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
          setRecipientId(idStr);
          lookupRecipient(idStr);
        }
      } else {
        router.replace('/login');
      }
    };
    initData();
  }, [params.id]);

  const lookupRecipient = async (id: string) => {
    const cleanId = id.trim();
    if (cleanId.length < 32) return;

    setIsValidating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.id === cleanId) {
        setRecipientName('');
        Alert.alert("Perhatian", "Anda tidak bisa mentransfer ke diri sendiri.");
        return;
      }

      const { data, error } = await (supabase
        .from('profiles')
        .select('name')
        .eq('id', cleanId)
        .maybeSingle() as any);

      if (data) {
        setRecipientName(data.name);
      } else {
        setRecipientName('');
        if (cleanId.length >= 36) Alert.alert("Error", "Penerima tidak ditemukan");
      }
    } catch (e) {
      setRecipientName('');
    } finally {
      setIsValidating(false);
    }
  };

  const handleTransfer = async () => {
    const numAmount = Number(amount);
    if (!recipientId || !recipientName) return Alert.alert('Error', 'Penerima tidak valid');
    if (numAmount <= 0) return Alert.alert('Error', 'Masukkan nominal yang valid');
    if (numAmount > balance) return Alert.alert('Error', 'Saldo tidak mencukupi');

    Alert.alert(
      'Konfirmasi Transfer',
      `Kirim Rp ${numAmount.toLocaleString('id-ID')} ke ${recipientName}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Kirim Sekarang', 
          onPress: async () => {
            try {
              setIsSubmitting(true);
              await transfer(recipientId.trim(), numAmount, recipientName);
              Alert.alert('Sukses', 'Transfer berhasil dikirim!', [
                { text: 'Selesai', onPress: () => router.replace('/(tabs)') }
              ]);
            } catch (e: any) {
              Alert.alert('Gagal', e.message || 'Terjadi kesalahan sistem');
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const onScan = (event: { data: string }) => {
    let scannedData = event.data.trim();
    
  
    if (scannedData.includes('id=')) {
      scannedData = scannedData.split('id=')[1];
    }

    setRecipientId(scannedData);
    lookupRecipient(scannedData);
    setIsScannerVisible(false);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
          <ThemedText style={styles.title}>Transfer Saldo</ThemedText>
          
          <ThemedText style={styles.label}>Penerima</ThemedText>
          
          {!recipientName ? (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextInput 
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]} 
                  value={recipientId} 
                  onChangeText={(val) => {
                    setRecipientId(val);
                    if (val.length >= 36) lookupRecipient(val);
                  }}
                  placeholder="ID Tujuan atau Scan QR"
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                />
                {isValidating && <ActivityIndicator size="small" style={{marginTop: 10}} color={theme.colors.primary} />}
              </View>
              <TouchableOpacity 
                onPress={async () => {
                  const status = await requestPermission();
                  if (status.granted) setIsScannerVisible(true);
                  else Alert.alert("Izin Kamera", "Mohon aktifkan izin kamera di pengaturan HP Anda.");
                }}
                style={[styles.qrButton, { backgroundColor: theme.colors.primary }]}
              >
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.recipientCard, { backgroundColor: theme.colors.border + '30' }]}>
              <View style={styles.avatarCircle}>
                <MaterialCommunityIcons name="account" size={30} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <ThemedText style={styles.nameText}>{recipientName}</ThemedText>
                <ThemedText style={styles.verifiedText}>Penerima Terverifikasi</ThemedText>
              </View>
              <TouchableOpacity onPress={() => { setRecipientId(''); setRecipientName(''); }}>
                <MaterialCommunityIcons name="close-circle" size={26} color="#FF5252" />
              </TouchableOpacity>
            </View>
          )}

          <ThemedText style={styles.label}>Nominal Transfer (Rp)</ThemedText>
          <TextInput 
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, marginBottom: 10 }]} 
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Contoh: 50000"
            placeholderTextColor="#888"
          />

          <ThemedText style={[styles.balanceInfo, { color: theme.colors.textSecondary, marginBottom: 30 }]}>
            Saldo Anda: <ThemedText style={{fontWeight: 'bold'}}>Rp {balance.toLocaleString('id-ID')}</ThemedText>
          </ThemedText>

          {isSubmitting ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <CustomButton 
               title={recipientName ? `Kirim ke ${recipientName}` : "Lanjutkan"} 
               onPress={handleTransfer} 
               disabled={!recipientName || !amount || Number(amount) <= 0}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isScannerVisible} animationType="fade" transparent={false}>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <CameraView 
            style={StyleSheet.absoluteFillObject} 
            onBarcodeScanned={isScannerVisible ? onScan : undefined}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerCutout} />
            <ThemedText style={styles.scannerText}>Arahkan kamera ke QR Code teman</ThemedText>
            <TouchableOpacity onPress={() => setIsScannerVisible(false)} style={styles.closeScanner}>
              <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>BATALKAN</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  label: { marginBottom: 12, fontSize: 13, opacity: 0.6, fontWeight: '600', textTransform: 'uppercase' },
  row: { flexDirection: 'row', marginBottom: 25 },
  input: { borderWidth: 1.5, borderRadius: 14, padding: 16, fontSize: 18 },
  qrButton: { marginLeft: 10, height: 62, width: 62, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  recipientCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 25, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  nameText: { fontSize: 18, fontWeight: 'bold' },
  verifiedText: { fontSize: 12, color: '#4CAF50', fontWeight: '700' },
  balanceInfo: { textAlign: 'left', marginTop: 10, fontSize: 14 },
  scannerOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  scannerCutout: { width: 260, height: 260, borderWidth: 2, borderColor: '#fff', borderRadius: 24, backgroundColor: 'transparent' },
  scannerText: { color: 'white', marginTop: 30, fontSize: 16, textAlign: 'center', paddingHorizontal: 40 },
  closeScanner: { marginTop: 50, paddingHorizontal: 30, paddingVertical: 15, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }
});