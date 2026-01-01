import { TextStyle } from 'react-native';

export type AppTheme = {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
  };
  
  spacing: {
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  
  textStyles: {
    header: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  
  fonts: {
    regular: { fontFamily: string; fontWeight: string };
    medium: { fontFamily: string; fontWeight: string };
    bold: { fontFamily: string; fontWeight: string };
    heavy: { fontFamily: string; fontWeight: string };
    // Tambahkan varian MD3 untuk React Native Paper
    bodySmall: { fontFamily: string; fontWeight: string };
    bodyMedium: { fontFamily: string; fontWeight: string };
    bodyLarge: { fontFamily: string; fontWeight: string };
    labelSmall: { fontFamily: string; fontWeight: string };
    labelMedium: { fontFamily: string; fontWeight: string };
    labelLarge: { fontFamily: string; fontWeight: string };
  };
};

export const lightTheme: AppTheme = {
  colors: {
    primary: '#0d0dd6ff',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#121212',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  textStyles: {
    header: { fontSize: 32, fontWeight: 'bold' },
    body: { fontSize: 16 },
    caption: { fontSize: 14, color: '#757575' },
  },
  
  fonts: {
    // Varian Custom kamu
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: 'bold' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
    
    // Penyesuaian MD3 (Mapping ke varian yang kamu punya)
    bodySmall: { fontFamily: 'System', fontWeight: '400' },
    bodyMedium: { fontFamily: 'System', fontWeight: '400' },
    bodyLarge: { fontFamily: 'System', fontWeight: '400' },
    labelSmall: { fontFamily: 'System', fontWeight: '500' },
    labelMedium: { fontFamily: 'System', fontWeight: '500' },
    labelLarge: { fontFamily: 'System', fontWeight: '500' },
  },
};

export const darkTheme: AppTheme = {
  ...lightTheme, 
  colors: {
    ...lightTheme.colors, 
    primary: '#6272d1ff',
    background: '#121212',
    card: '#1E1E1E',
    text: '#E1E1E1',
    textSecondary: '#A0A0A0',
    border: '#333333',
    success: '#66BB6A',
    error: '#EF5350',
  },
  // Font diwarisi dari lightTheme, jadi otomatis sudah punya bodySmall dll.
};