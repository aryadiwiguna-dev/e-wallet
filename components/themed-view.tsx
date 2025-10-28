import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useCustomTheme } from '../context/ThemeContext';

type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const { theme } = useCustomTheme();

  const flattenedStyle = StyleSheet.flatten(style);
  const styleBackgroundColor = flattenedStyle?.backgroundColor;
  const backgroundColor = styleBackgroundColor ?? theme.colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}