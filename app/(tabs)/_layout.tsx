import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assigments"
        options={{
          title: 'assigments',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: 'SettingsScreen',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'options' : 'options-outline'} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="lessons"
        options={{
          tabBarButton: ()=>null
        }}
      />
      <Tabs.Screen
        name="ShowLesson"
        options={{
          tabBarButton: ()=>null
        }}
      />
      <Tabs.Screen
        name="CheckView"
        options={{
          tabBarButton: ()=>null
        }}
      />
      <Tabs.Screen
        name="Videos"
        options={{
          tabBarButton: ()=>null
        }}
      />
      <Tabs.Screen
        name="showassigment"
        options={{
          tabBarButton: ()=>null
        }}
      />
    </Tabs>
  );
}
