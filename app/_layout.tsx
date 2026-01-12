import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper'; 
import { CustomThemeProvider, useCustomTheme } from '../context/ThemeContext';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { supabase } from '../lib/supabase';
import * as Linking from 'expo-linking';

function AuthGuard() {
  const { session, setSession, isLoading } = useAuthStore();
  const { fetchProfile } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (url: string | null) => {
      if (!url) return;
      
      const parsed = Linking.parse(url);
      const { path, queryParams } = parsed;
      
      // Tunggu hingga loading selesai dan session dipastikan ada
      if (session && !isLoading) {
        if (path === 'transfer' && queryParams) {
          router.push({
            pathname: '/(tabs)/transfer',
            params: { 
              to: queryParams.to, 
              amount: queryParams.amount 
            }
          });
        } else if (path) {
          router.push(`/${path}` as any);
        }
      }
    };

    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // Jalankan pengecekan URL awal hanya jika data sudah siap
    if (!isLoading && session) {
      Linking.getInitialURL().then((url) => {
        handleDeepLink(url);
      });
    }

    return () => subscription.remove();
  }, [session, isLoading]); // Menambahkan isLoading sebagai dependency

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile();
    });

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

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <InnerLayout />
    </CustomThemeProvider>
  );
}

function InnerLayout() {
  const { theme, isDark } = useCustomTheme();

  const basePaperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  const paperTheme = {
    ...basePaperTheme, 
    colors: {
      ...basePaperTheme.colors,
      ...theme.colors, 
      primary: theme.colors.primary,
      background: theme.colors.background,
      surface: theme.colors.card,
    },
    fonts: {
      ...basePaperTheme.fonts, 
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