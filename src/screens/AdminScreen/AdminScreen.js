import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { Typography } from "../../components/typography/Typography";
import { HeaderButton } from "../../components/header-button/HeaderButton";
import { ScreenWrapper } from "../../components/screen-wrapper/ScreenWrapper";
import {View, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native'
import { collection, getDocs } from "firebase/firestore";
import { Button } from "../../components/button/Button";
import { styles } from "./styles";



export default function AdminScreen({navigation}){
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLessons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lessons"));
      const lessonsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLessons(lessonsData);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const renderLessonItem = ({ item }) => {
  return (
    <TouchableOpacity 
      style={styles.lessonItem} 
      onPress={() => navigation.navigate('CreateLesson', { lesson: item })} // Передаем данные урока
    >
      <View style={styles.lessonInfo}>
        <Typography style={styles.lessonTitle}>{item.title || 'Без названия'}</Typography>
        <Typography style={styles.lessonId}>ID: {item.id}</Typography>
      </View>
      <Typography style={{ color: '#00F0FF' }}>Изм.</Typography>
    </TouchableOpacity>
  );
};
 
  return(
    <ScreenWrapper>
      <HeaderButton type="close" onPress={() => navigation.goBack()}/>
        <Typography variant="header">УПРАВЛЕНИЕ УРОКАМИ</Typography>
        {loading ?(
          <ActivityIndicator size="large" color="#00F0FF"/>
        ):(
          <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          renderItem={renderLessonItem}
          contentContainerStyle={styles.adminContainer}
          ListEmptyComponent={
            <Typography style={{ textAlign: 'center', color: '#aaa', marginTop: 20 }}>
              Уроков пока нет. Создайте первый!
            </Typography>
          }
        />
      )}
      <Button
      title={"+ Добавить уроки"}
      onPress={() => navigation.navigate('CreateLesson')}
      />
    </ScreenWrapper>
  )
}