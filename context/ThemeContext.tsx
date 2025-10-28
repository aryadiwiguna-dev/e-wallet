// context/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, AppTheme } from '../constants/theme';
import { DefaultTheme } from '@react-navigation/native';
import { NavigationTheme } from 'react-native-paper/lib/typescript/types';
import { useWalletStore } from '../store/useWalletStore';

type ThemeContextType = {
  theme: AppTheme; // Tema lengkap untuk UI komponen
  navigationTheme: NavigationTheme; // Tema khusus untuk navigator
  isDark: boolean;
  hasHydrated: boolean
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const createNavigationTheme = (appTheme: AppTheme, isDark: boolean): NavigationTheme => {
  return {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.card,
      text: appTheme.colors.text,
      border: appTheme.colors.border,
      notification: appTheme.colors.error,
    },
  };
};

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme; // Pilih AppTheme yang aktif
  const navigationTheme = createNavigationTheme(theme, isDark); // Buat NavigationTheme darinya

  const hasHydrated = useWalletStore.persist.hasHydrated();

  return (
    <ThemeContext.Provider value={{ theme, navigationTheme, isDark, hasHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};