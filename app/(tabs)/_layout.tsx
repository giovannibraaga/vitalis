import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/haptic-tab';
import { VitalisColors } from '@/constants/vitalis-theme';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: VitalisColors.primary,
        tabBarInactiveTintColor: VitalisColors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: VitalisColors.surface,
          borderTopColor: VitalisColors.border,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="home-filled" size={size} />,
        }}
      />
      <Tabs.Screen
        name="monitoring"
        options={{
          title: 'Monitorar',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="bar-chart" size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historico',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="history" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="person" size={size} />,
        }}
      />
    </Tabs>
  );
}
