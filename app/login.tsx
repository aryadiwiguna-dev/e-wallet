import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useCustomTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useCustomTheme();
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Login Gagal', error.message);
    } else {
      router.replace('/(tabs)'); 
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Registrasi Gagal', error.message);
    else Alert.alert('Sukses', 'Silakan cek email Anda untuk verifikasi!');
    setLoading(false);
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>E-Wallet App</Text>
        <Text style={styles.subtitle}>Kelola keuanganmu dengan mudah</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={signInWithEmail} 
          loading={loading} 
          style={styles.button}
        >
          Masuk
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={signUpWithEmail} 
          disabled={loading}
          style={styles.button}
        >
          Daftar Akun Baru
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  content: { padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: 30, opacity: 0.6 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 5 },
});