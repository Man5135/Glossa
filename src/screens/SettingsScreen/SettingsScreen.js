import React, { useEffect, useState } from 'react';
import { View, Alert, Typography as RNText } from 'react-native';
import { auth, db } from '../../firebase/config';
import { 
  verifyBeforeUpdateEmail, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider,
  updateProfile, 
  signOut
} from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { AuthInput } from '../../components/auth-input/AuthInput';
import { Button } from '../../components/button/Button';
import { Typography } from '../../components/typography/Typography';
import { styles } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { AdminScreen } from '../AdminScreen/AdminScreen';
import { HeaderButton } from '../../components/header-button/HeaderButton';

export default function SettingsScreen({navigation}) {
  const user = auth.currentUser;

  const [userRole, setUserRole] = useState(null);
  // Состояния для никнейма
  const [nickname, setNickname] = useState(user?.displayName || '');

  useEffect(() => {
    const checkAdmin = async () => {
      if (user?.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          
          if (snap.exists()) {
            setUserRole(snap.data().role);
          }
        } catch (e) {
          console.error("Ошибка БД:", e);
        }
      }
    };
    checkAdmin();
  }, [user]);

  // Состояния для смены почты
  const [currentEmailConfirm, setCurrentEmailConfirm] = useState(''); 
  const [newEmail, setNewEmail] = useState('');
  const [passForEmail, setPassForEmail] = useState('');

  // Состояния для смены пароля
  const [passForPass, setPassForPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 1. Обновление никнейма
  const handleUpdateNickname = async () => {
    try {
      if (!nickname.trim()) return Alert.alert("Ошибка", "Введите никнейм");
      await updateProfile(user, { displayName: nickname });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { nickname: nickname });
      Alert.alert("Успех", "Никнейм обновлен");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось обновить никнейм");
    }
  };

  const handleSignOut = async () => {
    try{
      await signOut(auth);
    } catch (error) {
      Alert.alert("Ошибка")
    }
};

  // 2. Обновление почты (через верификацию)
  const handleUpdateEmail = async () => {
    try {
      const cleanOldEmail = currentEmailConfirm.trim();
      const cleanNewEmail = newEmail.trim();

      if (cleanOldEmail !== user.email) {
        return Alert.alert("Ошибка", "Текущая почта введена неверно");
      }
      if (!cleanNewEmail || !cleanNewEmail.includes('@')) {
        return Alert.alert("Ошибка", "Введите корректный новый email");
      }
      if (!passForEmail) {
        return Alert.alert("Ошибка", "Введите пароль для подтверждения");
      }


      // Реавторизация
      const credential = EmailAuthProvider.credential(user.email, passForEmail);
      await reauthenticateWithCredential(user, credential);
      
      // Отправка письма на НОВУЮ почту
      await verifyBeforeUpdateEmail(user, cleanNewEmail);
      
      // Обновляем в Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { email: cleanNewEmail });

      Alert.alert(
        "Подтверждение отправлено", 
        `На ${cleanNewEmail} отправлено письмо. Подтвердите его, чтобы завершить смену почты.`
      );
      
      setCurrentEmailConfirm('');
      setNewEmail('');
      setPassForEmail('');
    } catch (error) {
      console.log(error);
      Alert.alert("Ошибка", "Не удалось инициировать смену почты. Проверьте данные.");
    }
  };

  // 3. Обновление пароля
  const handleUpdatePassword = async () => {
    try {
      if (!passForPass || !newPassword) return Alert.alert("Ошибка", "Заполните поля пароля");
      if (newPassword !== confirmPassword) return Alert.alert("Ошибка", "Пароли не совпадают");

      const credential = EmailAuthProvider.credential(user.email, passForPass);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      Alert.alert("Успех", "Пароль успешно изменен");
      
      setPassForPass('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось изменить пароль. Проверьте текущий пароль.");
    }
  };

  return (
    <ScreenWrapper>
        <HeaderButton onPress={() => navigation.goBack()}/>
        {/* СЕКЦИЯ НИКНЕЙМА */}
        <Typography variant="description" style={styles.sectionTitle}>ПРОФИЛЬ</Typography>
        <View style={styles.inputGroup}>
          <AuthInput 
            label="Ваш никнейм" 
            value={nickname} 
            onChangeText={setNickname} 
          />
          <Button title="Сохранить имя" onPress={handleUpdateNickname} />
        </View>

        {userRole === 'admin' && (
        <View>
          <Button
          title="Админ-панель"
          onPress={() => navigation.navigate('AdminScreen')} />
        </View>
        )}
          

        {/* СЕКЦИЯ ПОЧТЫ */}
        <View style={[styles.inputGroup, { marginTop: 25 }]}>
          <Typography variant="description" style={styles.sectionTitle}>СМЕНА ПОЧТЫ</Typography>
          <Typography variant="body" style={{ marginBottom: 10, color: '#aaa' }}>
            Текущий адрес: {user?.email}
          </Typography>
          
          <AuthInput
            label="Введите текущую почту"
            value={currentEmailConfirm}
            onChangeText={setCurrentEmailConfirm}
            placeholder="Для проверки"
          />
          <AuthInput
            label="Новая почта"
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="example@new.com"
          />
          <AuthInput
            label="Пароль"
            value={passForEmail}
            onChangeText={setPassForEmail}
            secureTextEntry
            placeholder="********"
          />
          <Button title="Обновить почту" onPress={handleUpdateEmail} />
        </View>

        {/* СЕКЦИЯ ПАРОЛЯ */}
        <View style={[styles.inputGroup, { marginTop: 25 }]}>
          <Typography variant="description" style={styles.sectionTitle}>БЕЗОПАСНОСТЬ</Typography>
          <AuthInput
            label="Текущий пароль"
            value={passForPass}
            onChangeText={setPassForPass}
            secureTextEntry
          />
          <AuthInput
            label="Новый пароль"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <AuthInput
            label="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button title="Сменить пароль" onPress={handleUpdatePassword} />
        </View>

        <View style={{ marginTop: 40, marginBottom: 20 }}>
          <Button 
            title="Выйти из аккаунта" 
            onPress={handleSignOut}
            variant="danger" // Если твой компонент Button принимает стили
          />
        </View>
    </ScreenWrapper>
  );
}