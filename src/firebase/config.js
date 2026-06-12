import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// Добавляем необходимые методы инициализации Auth
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
// Импортируем AsyncStorage и Platform для разделения ПК и Телефона
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Безопасное считывание параметров из переменных окружения (подход Expo)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Инициализация экземпляра приложения
const app = initializeApp(firebaseConfig);

// Экспорт базы данных
export const db = getFirestore(app);

// Правильная кроссплатформенная инициализация Auth
export const auth = Platform.OS === 'web' 
  ? getAuth(app) // Для ПК (веб-версии) оставляем стандартное поведение
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage), // Для телефонов принудительно сохраняем сессию в память
    });