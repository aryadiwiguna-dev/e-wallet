import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, AppTheme } from '../constants/theme';
import { DefaultTheme } from '@react-navigation/native';
import { NavigationTheme } from 'react-native-paper/lib/typescript/types';
// Hapus import useWalletStore jika tidak digunakan lagi di sini

type ThemeContextType = {
  theme: AppTheme;
  navigationTheme: NavigationTheme;
  isDark: boolean;
  // Kita tetap simpan properti ini di type agar tidak merusak file lain, 
  // tapi default-nya selalu true karena kita tidak pakai persist lagi
  hasHydrated: boolean; 
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
  const theme = isDark ? darkTheme : lightTheme;
  const navigationTheme = createNavigationTheme(theme, isDark);

  // PERBAIKAN: Karena tidak pakai persist, kita set true saja 
  // atau hapus jika di file lain tidak mengecek ini.
  const hasHydrated = true; 

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