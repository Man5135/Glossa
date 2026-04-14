import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, writeBatch } from "firebase/firestore";

import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { Logo } from '../../components/logo/Logo';
import { AuthInput } from '../../components/auth-input/AuthInput';
import { Button } from '../../components/button/Button';
import { AuthLink } from '../../components/auth-link/AuthLink';
import { Notification } from '../../components/notification/Notification';

export default function RegistrationScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [notif, setNotif] = useState({ visible: false, message: '', type: 'error' });

  const showNotification = (message, type = 'error') => {
    setNotif({ visible: true, message, type });
  };

  const handleSignUp = async () => {
    setErrors({});
    let currentErrors = {};

    if (!email.includes('@')) currentErrors.email = "Некорректный email";
    if (login.length <= 2) currentErrors.login = "Логин слишком короткий";
    if (password.length < 6) currentErrors.password = "Пароль минимум 6 символов";

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      showNotification("Проверьте правильность заполнения полей", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const batch = writeBatch(db);

      const userRef = doc(db, "users", user.uid);
      batch.set(userRef, {
        uid: user.uid,
        email: email,
        login: login,
        createdAt: new Date(),
      });

      const progressRef = doc(db, "progress", user.uid);
      batch.set(progressRef, {
        learnedWords: [],
        totalPoints: 0,
        lastTraining: new Date(),
        level: 1
      });

      await batch.commit();

      showNotification("Аккаунт успешно создан!", "success");

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);

    } catch (error) {
      console.error("Ошибка:", error.code);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: "Эта почта уже занята" });
        showNotification("Email уже зарегистрирован", "error");
      } else if (error.code === 'permission-denied') {
        showNotification("Ошибка доступа к базе данных", "error");
      } else {
        showNotification("Ошибка при регистрации", "error");
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
        label="Введите почту"
        value={email}
        onChangeText={setEmail}
        placeholder={"example@mail.com"}
        error={errors.email}
      />
      
      <AuthInput
        label="Введите логин"
        value={login}
        onChangeText={setLogin}
        placeholder={"Ваш логин"}
        error={errors.login}
      />
      
      <AuthInput
        label="Введите пароль"
        value={password}
        onChangeText={setPassword}
        placeholder={"********"}
        secureTextEntry={true}
        error={errors.password}
      />

      <AuthLink
        description="Есть аккаунт?"
        actionText="Войдите"
        onPress={() => navigation.navigate('Login')}
      />

      <Button title="Продолжить" onPress={handleSignUp} />
    </ScreenWrapper>
  );
}