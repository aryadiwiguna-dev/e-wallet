import { useCustomTheme } from '../context/ThemeContext';
import { AppTheme } from '../constants/theme';

export const useTheme = (): AppTheme => {
  return useCustomTheme().theme;
};