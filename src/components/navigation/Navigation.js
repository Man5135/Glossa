import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen'; 
import { styles } from './styles';
import GrammarScreen from '../../screens/GrammarScreen/GrammarScreen';

const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

export default function AppNavigation() {
  const isWeb = Platform.OS === 'web' || Dimensions.get('window').width > 768;

  const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#00F0FF',
    tabBarInactiveTintColor: '#888',
    tabBarIcon: ({ color, size }) => {
      let iconName = route.name === 'Home' ? 'home' : 'person';
      return <Ionicons name={iconName} size={size || 22} color={color} />;
    },
  });

  if (isWeb) {
    return (
      <TopTab.Navigator
        screenOptions={(props) => ({
          ...screenOptions(props),
          tabBarStyle: styles.topTabBar,
          tabBarIndicatorStyle: styles.indicator,
          swipeEnabled: false,
        })}
      >
        <TopTab.Screen name="Grammar" component={GrammarScreen} options={{ title: 'ГРАММАТИКА' }} />
        <TopTab.Screen name="Home" component={HomeScreen} options={{ title: 'УРОКИ' }} />
        <TopTab.Screen name="Profile" component={ProfileScreen} options={{ title: 'ПРОФИЛЬ' }} />
      </TopTab.Navigator>
    );
  }

  return (
    <BottomTab.Navigator
      screenOptions={(props) => ({
        ...screenOptions(props),
        tabBarStyle: styles.bottomTabBar,
        tabBarLabelStyle: styles.label,
      })}
    >
      <BottomTab.Screen name="Home" component={HomeScreen} options={{ title: 'Уроки' }} />
      <BottomTab.Screen name="Grammar" component={GrammarScreen} options={{ title: 'Грамматика' }} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
    </BottomTab.Navigator>
  );
}