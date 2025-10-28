// app/(tabs)/scan.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

// Gunakan komponen dan hook yang sesuai
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import CustomButton from '../../components/Button';
import { useWalletStore } from '../../store/useWalletStore';
import { useCustomTheme } from '../../context/ThemeContext';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { payWithQR } = useWalletStore();
  const { theme } = useCustomTheme();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    const parts = data.split(':');
    if (parts[0] === 'PAYMENT') {
      const merchantName = parts[2];
      const amount = 25000; // Simulasi jumlah pembayaran fixed
      Alert.alert(
        'Konfirmasi Pembayaran',
        `Bayar Rp ${amount.toLocaleString('id-ID')} di ${merchantName}?`,
        [
          { text: 'Batal', style: 'cancel', onPress: () => setScanned(false) },
          {
            text: 'Bayar',
            onPress: () => {
              payWithQR(amount, merchantName);
              Alert.alert('Sukses', 'Pembayaran berhasil!');
              setScanned(false);
            },
          },
        ]
      );
    } else {
      Alert.alert('QR Tidak Dikenal', 'QR Code ini bukan untuk pembayaran.');
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Meminta izin kamera...</ThemedText>
      </ThemedView>
    );
  }
  if (hasPermission === false) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Tidak ada akses ke kamera</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], 
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Overlay untuk memandu pengguna */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={[styles.focusedContainer, { borderColor: theme.colors.primary }]}>
            {/* Anda bisa menambahkan animasi di sudut-sudutnya jika mau */}
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      {/* Instruksi dan Tombol */}
      <View style={styles.bottomContainer}>
        <ThemedText style={styles.instructionText}>
          Arahkan kamera ke QR Code untuk melakukan pembayaran
        </ThemedText>
        {scanned && (
          <CustomButton
            title="Scan Lagi"
            onPress={() => setScanned(false)}
            style={styles.scanAgainButton}
          />
        )}
      </View>
    </ThemedView>
  );
}

// Gunakan Dimensions untuk membuat overlay responsif
const { width } = Dimensions.get('window');
const overlayHeight = (width * 0.7); // Buat area fokus berbentuk persegi

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: overlayHeight,
  },
  focusedContainer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    // Beri latar belakang semi-transparan agar teks terbaca
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  instructionText: {
    color: 'white', // Paksa putih agar kontras dengan latar gelap
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  scanAgainButton: {
    width: '60%',
  },
});