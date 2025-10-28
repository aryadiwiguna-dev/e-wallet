import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useCustomTheme } from '../context/ThemeContext';
import { useServicesStore } from '../store/useServicesStore';
import { useRouter } from 'expo-router';
import CustomIcon from './CostumIcon';
import { SERVICE_PATHS } from '@/constants/screen';

export default function ServiceGrid() {
  const { theme } = useCustomTheme();
  const { services } = useServicesStore();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.m,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    item: {
      width: '22%',
      alignItems: 'center',
      marginVertical: theme.spacing.m,
    },
    icon: {
      marginBottom: theme.spacing.s,
    },
    label: {
      fontSize: 12,
      textAlign: 'center',
      color: theme.colors.text,
    },
  });

  const handlePress = (screen: string) => {
    const path = SERVICE_PATHS[screen as keyof typeof SERVICE_PATHS];
    if (path) {
      router.push(path as any);
    } else {
      console.error(`Path for screen "${screen}" not found.`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {services.map((service) => (
          <Pressable key={service.id} style={styles.item} onPress={() => handlePress(service.screen)}>
            <CustomIcon name={service.icon} size={28} />
            <ThemedText style={styles.label}>{service.name}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}