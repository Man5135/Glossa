```markdown
# Glossa — Мобильное приложение для изучения греческого языка 🇬🇷📱

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**Glossa** — это современное кроссплатформенное мобильное приложение, разработанное в рамках Выпускной квалификационной работы (ВКР), предназначенное для интерактивного и эффективного изучения новогреческого языка на базе методологий микрообучения (*microlearning*) и геймификации.

---

## ✨ Ключевые возможности
* **🧩 Система микрообучения:** Весь учебный материал разбит на короткие интерактивные сессии (квизы) по 3-5 минут.
* **🔥 Геймификация (Daily Streaks):** Алгоритм удержания пользователей посредством подсчета и визуализации дней непрерывной активности.
* **✍️ Алгоритмическая валидация тоносов:** Уникальный алгоритмический парсер ввода, проверяющий обязательную постановку знака ударения (`΄`), критически влияющего на смысл греческих слов.
* **🌐 Синхронизация данных реального времени:** Хранение и мгновенное обновление прогресса пользователя в облаке.

## 🛠️ Стек технологий
* **Frontend:** React Native, Expo SDK, Tailwind CSS / NativeWind
* **Backend-as-a-Service (BaaS):** Firebase (Auth, Cloud Firestore)

## 📐 Архитектура приложения
В проекте реализована модульная трехкомпонентная архитектура (**Separation of Concerns**):
1. **Presentation Layer:** Экраны навигации (`React Navigation`) и атомарные UI-компоненты.
2. **Domain Layer:** Бизнес-логика (`streakLogic.js`) и управление состояниями квиза.
3. **Data Layer:** Репозитории взаимодействия с Firebase Firestore API.