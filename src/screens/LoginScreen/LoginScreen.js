import React, { useState } from 'react'; // Добавляем useState
import { Alert } from 'react-native';
import { auth } from '../../firebase/config'; // Импорт твоей базы
import { signInWithEmailAndPassword } from "firebase/auth";

import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { Logo } from '../../components/logo/Logo';
import { AuthInput } from '../../components/auth-input/AuthInput';
import { Button } from '../../components/button/Button';
import { AuthLink } from '../../components/auth-link/AuthLink';
import { seedAppDatabase, seedLessons } from '../../components/seedDatabase';


export default function LoginScreen({ navigation }) {
  // Создаем переменные для хранения текста
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Простейшая проверка на пустые поля
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert("Ошибка", "Введите почту и пароль");
      return;
    }

    try {
      // Сама проверка Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Успешный вход:", userCredential.user.email);
      navigation.navigate('Main')
      
      Alert.alert("Успех", "Вы вошли в систему!");
      
      // Здесь можно будет сделать переход на Home, когда он будет готов
      // navigation.navigate('Home'); 
      
    } catch (error) {
      console.error(error.code);
      // Обработка ошибок (неверный пароль или пользователь не найден)
      if (error.code === 'auth/invalid-credential') {

        Alert.alert("Ошибка", "Неверная почта или пароль");
      } else {
        Alert.alert("Ошибка", "Что-то пошло не так. Проверьте интернет.");
      }
    }
  };

  return (
    <ScreenWrapper>
      <Logo />

      {/* Привязываем переменные к инпутам */}
      <AuthInput 
        label="Введите почту" 
        value={email}
        onChangeText={setEmail} // Сохраняем ввод в email
        placeholder="example@mail.com"
      />
      
      <AuthInput 
        label="Введите пароль" 
        secureTextEntry={true} 
        value={password}
        onChangeText={setPassword} // Сохраняем ввод в password
        placeholder="********"
      />
      
      <AuthLink 
        description="Нет аккаунта?" 
        actionText="Создайте аккаунт" 
        onPress={() => navigation.navigate('Registration')}
      />
      
      {/* Кнопка теперь вызывает handleLogin */}
      <Button title="Продолжить" onPress={handleLogin} />
    </ScreenWrapper>
  );
}