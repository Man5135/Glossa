import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import  RegistrationScreen  from './src/screens/RegistrationScreen/RegistrationScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import LessonScreen from './src/screens/LessonScreen/LessonScreen';
import AppNavigation  from './src/components/navigation/Navigation';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';
import { createElement, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator, Platform } from 'react-native';
import { auth } from './src/firebase/config';
import  AlphabetScreen  from './src/screens/AlphabetScreen/AlphabetScreen';
import AdminScreen from './src/screens/AdminScreen/AdminScreen';
import CreateLesson from './src/screens/CreateLesson/CreateLesson';

const Stack = createStackNavigator();

export default function App(){
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if(Platform.OS === 'web'){
      document.body.style.overflow = 'auto';
      document.body.style.height = '100%';
    }
  }, [])

  if(loading){
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#00F0FF" />
      </View>
    )
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Если пользователь вошел, показываем только эти экраны
          <>
            <Stack.Screen name="Main" component={AppNavigation} />
            <Stack.Screen name="LessonScreen" component={LessonScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Alphabet" component={AlphabetScreen}/>
            <Stack.Screen name="AdminScreen" component={AdminScreen}/>
            <Stack.Screen name="CreateLesson" component={CreateLesson}/>
          </>
        ) : (
          // Если не вошел — отправляем на авторизацию
          <>
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}