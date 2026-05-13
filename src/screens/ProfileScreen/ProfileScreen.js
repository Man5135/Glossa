import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Typography } from "../../components/typography/Typography";
import { ScreenWrapper } from "../../components/screen-wrapper/ScreenWrapper";
import { auth, db } from "../../firebase/config"; // Добавили db
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore"; // Добавили методы Firestore
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";
import { Button } from "../../components/button/Button";


export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  // Создаем стейты для данных, чтобы кнопка их видела
  const [userData, setUserData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 1. Слушаем данные пользователя (прогресс)
    const userRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      }
    });

    // 2. Загружаем уроки (нужны для поиска слов по ID)
    const loadLessons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lessons"));
        const lessonsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLessons(lessonsData);
      } catch (e) {
        console.error("Ошибка загрузки уроков в профиле:", e);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
    return () => unsubUser();
  }, [user]);

  return(
  <ScreenWrapper>
    <View style={styles.headerRow}>
      <Typography variant="header">Профиль</Typography>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Ionicons name="settings-outline" size={26} color="#00F0FF"/>
      </TouchableOpacity>
    </View>

    <View>
      <Typography style={styles.nickname}>
        {user?.displayName || "Ученик Glossa"}
      </Typography>

      <Typography style={styles.email}>
          {user?.email}
        </Typography>

      <Typography variant="body" style={styles.subtitle}>
        Выучено слов: {userData?.learnedWords?.length || 0}
      </Typography>

      <Button
        title="Повторить выученное" 
        onPress={() => navigation.navigate('Review', { 
          lessons: lessons, 
          learnedWordsIds: userData?.learnedWords || []
        })} 
      />
    </View>
  </ScreenWrapper>
  )
  
}