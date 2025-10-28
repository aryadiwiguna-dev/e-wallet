import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCustomTheme } from '../context/ThemeContext';

// Tipe untuk props komponen kita
interface CustomIconProps {
  name: string;
  size?: number;
  color?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({ name, size = 24, color }) => {
  const { theme } = useCustomTheme();
  const iconColor = color || theme.colors.primary;

  return <Ionicons name={name as any} size={size} color={iconColor} />;
};

export default CustomIcon;