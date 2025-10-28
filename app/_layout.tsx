import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

// Import yang dibutuhkan
import AppLoading from '@/components/AppLoading';
import { CustomThemeProvider, useCustomTheme } from '../context/ThemeContext';

function AppContent() {
  const { hasHydrated, navigationTheme } = useCustomTheme();

  if (!hasHydrated) {
    return <AppLoading />;
  }

  return (
    <ThemeProvider value={navigationTheme as any}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}


export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}