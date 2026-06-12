import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc,  Timestamp,  writeBatch } from "firebase/firestore";

import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { Logo } from '../../components/logo/Logo';
import { AuthInput } from '../../components/auth-input/AuthInput';
import { Button } from '../../components/button/Button';
import { AuthLink } from '../../components/auth-link/AuthLink';
import { Notification } from '../../components/notification/Notification';

export default function RegistrationScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [notif, setNotif] = useState({ visible: false, message: '', type: 'error' });

  const showNotification = (message, type = 'error') => {
    setNotif({ visible: true, message, type });
  };

  const handleSignUp = async () => {
    setErrors({});
    
    // Валидация
    if (!email.includes('@')) {
      showNotification("Введите корректный email");
      return;
    }

    if (password.length < 6) {
      showNotification("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      // 1. Создаем пользователя в Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Используем Batch для записи в Firestore
      const batch = writeBatch(db);

      // Ссылка на документ пользователя
      const userRef = doc(db, "users", user.uid);
      // Ссылка на документ прогресса

      batch.set(userRef, {
        uid: user.uid,
        email: email,
        login: login,
        nickname: nickname,
        role: "user",
        createdAt: new Date().toISOString(),
        lastActivityDate: new Date().toISOString().split('T')[0],
        currentStreak: 0,
        completedLessons: [], // Массив ID пройденных уроков
        learnedWords: [],     // Объекты слов для режима Review
        learnedGrammar: [],   // ID изученных правил
      });

      // Фиксируем транзакцию
      await batch.commit();

      showNotification("Регистрация успешна!", "success");
      
      // Переходим на главный экран (TabBar)
      // Убедись, что 'Home' или 'Main' есть в App.js
      navigation.replace('Home'); 

    } catch (error) {
      console.error(error.code);
      if (error.code === 'auth/email-already-in-use') {
        showNotification("Эта почта уже занята");
      } else {
        showNotification("Ошибка при регистрации. Попробуйте снова.");
      }
    }
  };

  return (
    <ScreenWrapper>
      <Notification 
        visible={notif.visible} 
        message={notif.message} 
        type={notif.type} 
        onHide={() => setNotif(prev => ({ ...prev, visible: false }))} 
      />

      <Logo />

      <AuthInput
        label="Электронная почта"
        value={email}
        onChangeText={setEmail}
        placeholder="example@mail.com"
      />

      <AuthInput
        label="Ваш никнейм"
        value={nickname}
        onChangeText={setNickname}
        placeholder="Artur"
      />
      
      <AuthInput
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry={true}
      />

      <Button 
        title="Создать аккаунт" 
        onPress={handleSignUp} 
      />

      <AuthLink 
        description="Уже есть аккаунт?" 
        actionText="Войти" 
        onPress={() => navigation.navigate('Login')} 
      />
    </ScreenWrapper>
  );
}