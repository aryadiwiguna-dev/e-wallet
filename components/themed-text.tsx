// components/themed-text.tsx
import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle, TextProps } from 'react-native';
import { useCustomTheme } from '../context/ThemeContext';

// Tipe props mewarisi dari TextProps
type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { theme } = useCustomTheme();

  // === SOLUSI UTAMA ===
  // 1. Gunakan StyleSheet.flatten untuk mendapatkan objek style yang valid.
  // Ini akan mengubah array style atau style yang tidak valid menjadi objek TextStyle yang konsisten.
  const flattenedStyle = StyleSheet.flatten(style);

  // 2. Akses properti 'color' dari objek yang sudah "digerakkan" (flattened).
  // Gunakan optional chaining (?.) untuk keamanan ekstra.
  const styleColor = flattenedStyle?.color;

  // 3. Tentukan warna akhir: gunakan warna dari style jika ada, jika tidak gunakan warna dari tema.
  const color = styleColor ?? theme.colors.text;

  // 4. Tentukan gaya teks berdasarkan 'type'
  let textStyle: TextStyle = theme.textStyles.body;
  if (type === 'title') textStyle = theme.textStyles.header;
  if (type === 'defaultSemiBold') textStyle = { ...theme.textStyles.body, fontWeight: '600' };
  if (type === 'subtitle') textStyle = { ...theme.textStyles.body, fontSize: 18 };
  if (type === 'link') textStyle = { ...theme.textStyles.body, color: theme.colors.primary };

  return (
    <Text style={[{ color }, textStyle, style]} {...rest} />
  );
}