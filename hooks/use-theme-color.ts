/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

// import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { lightTheme, darkTheme, AppTheme } from '../constants/theme';

export const useTheme = (): AppTheme => {
  // useColorScheme akan mengembalikan 'light', 'dark', atau null
  const colorScheme = useColorScheme();

  // Jika tema perangkat adalah 'dark', gunakan darkTheme, selain itu gunakan lightTheme
  if (colorScheme === 'dark') {
    return darkTheme;
  }

  return lightTheme;
};
