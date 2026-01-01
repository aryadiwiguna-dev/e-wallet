import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper'; // Tambahkan MD3 themes
import { CustomThemeProvider, useCustomTheme } from '../context/ThemeContext';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '../lib/supabase';

// Komponen internal untuk menangani logika Auth dan Navigasi
function AuthGuard() {
  const { session, setSession, isLoading } = useAuthStore();
  const { fetchProfile } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Cek session awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile();
    });

    // Pantau perubahan auth
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile();
      else useUserStore.getState().clearProfile();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    // Logika redirect sederhana
    if (!session && inAuthGroup) {
      router.replace('/login');
    } else if (session && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [session, segments, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// Komponen Root Utama
export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <InnerLayout />
    </CustomThemeProvider>
  );
}

// Kita buat satu level lagi agar bisa menggunakan hook 'useCustomTheme'
function InnerLayout() {
  const { theme, isDark } = useCustomTheme();

  // SOLUSI ERROR: Gabungkan tema dasar MD3 Paper dengan tema kustom kamu
  const basePaperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  const paperTheme = {
    ...basePaperTheme, // Ini memastikan varian bodySmall, bodyMedium, dll ada
    colors: {
      ...basePaperTheme.colors,
      ...theme.colors, // Overwrite dengan warna kustom kamu
      primary: theme.colors.primary,
      background: theme.colors.background,
      surface: theme.colors.card,
    },
    // Tetap gunakan font kustom kamu untuk varian standar
    fonts: {
      ...basePaperTheme.fonts, // Ambil semua varian default MD3
      regular: theme.fonts.regular,
      medium: theme.fonts.medium,
      bold: theme.fonts.bold,
    }
  };

  return (
    <PaperProvider theme={paperTheme}>
      <AuthGuard />
    </PaperProvider>
  );
}