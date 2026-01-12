import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MaterialIcons } from '@expo/vector-icons';
import { useCustomTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { theme } = useCustomTheme();

  return (
    <Tabs
      screenOptions={{
        
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card, 
          borderTopColor: theme.colors.border, 
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name="home" />;
          }
        }}
      />
      <Tabs.Screen
        name="transfer"
        options={{
          title: 'Transfer',
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name="money" />;
          }
          
          
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name="history" />;
          }
        }}
      />

      <Tabs.Screen
        name="topup"
        options={{
          title: 'Top Up',
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name="arrow-upward" />;
          }
        }}
      />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => {
              return <MaterialIcons color={color} size={28} name="person" />;
            }
          }}
        />
    </Tabs>
    
  );
}