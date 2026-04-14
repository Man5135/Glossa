import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator();

export function TabBar(){
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Учи' ? 'trail-sign-outline' : 
                         route.name === 'Тренировка' ? 'book-outline' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: '#1A2A32', borderTopWidth: 0 },
        tabBarActiveTintColor: '#00F0FF',
        tabBarInactiveTintColor: '#FFF',
      })}
    >

    </Tab.Navigator>
  )
}