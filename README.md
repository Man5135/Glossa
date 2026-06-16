# Glossa — Мобильное приложение для изучения греческого языка 🇬🇷📱

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**Glossa** — это современное кроссплатформенное мобильное приложение, разработанное в рамках Выпускной квалификационной работы (ВКР), предназначенное для интерактивного и эффективного изучения новогреческого языка на базе методологий микрообучения (*microlearning*) и геймификации.

---

## ✨ Ключевые возможности
* **🧩 Система микрообучения:** Весь учебный материал разбит на короткие интерактивные сессии (квизы) по 3-5 минут.
* **🔥 Геймификация (Daily Streaks):** Алгоритм удержания пользователей посредством подсчета и визуализации дней непрерывной активности.
* **🌐 Синхронизация данных реального времени:** Хранение и мгновенное обновление прогресса пользователя в облаке.

## 🛠️ Стек технологий
* **Frontend:** React Native, Expo SDK, Tailwind CSS / NativeWind
* **Backend-as-a-Service (BaaS):** Firebase (Auth, Cloud Firestore)

## 📐 Архитектура приложения
В проекте реализована модульная трехкомпонентная архитектура (**Separation of Concerns**):
1. **Presentation Layer:** Экраны навигации (`React Navigation`) и атомарные UI-компоненты.
2. **Domain Layer:** Бизнес-логика (`streakLogic.js`) и управление состояниями квиза.
3. **Data Layer:** Репозитории взаимодействия с Firebase Firestore API.


Для запуска проекта на локальном компьютере вам понадобятся Node.js (рекомендуемая версия v18+) и установленное приложение Expo Go на вашем смартфоне (iOS/Android).

## 1. Клонирование репозитория

git clone https://github.com/your-username/glossa-app.git

cd glossa-app

## 2. Установка зависимостей
npm install
#### или, если вы используете yarn:
yarn install


## 3. Настройка переменных окружения (Firebase)
Создайте файл .env в корневой директории проекта и добавьте туда конфигурационные ключи вашего проекта Firebase:

EXPO_PUBLIC_FIREBASE_API_KEY="your_api_key"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your_auth_domain"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
EXPO_PUBLIC_FIREBASE_APP_ID="your_app_id" 

## 4. Запуск приложения
Запустите локальный сервер разработки Expo:

npx expo start
#### или
npm run start