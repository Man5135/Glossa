import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { Typography } from "../../components/typography/Typography";
import { HeaderButton } from "../../components/header-button/HeaderButton";
import { ScreenWrapper } from "../../components/screen-wrapper/ScreenWrapper";
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Button } from "../../components/button/Button";
import { styles } from "./styles";

export default function AdminScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' или 'grammar'

  useEffect(() => {
    setLoading(true);
    // Используем grammar_library по твоему уточнению
    const collectionName = activeTab === 'lessons' ? "lessons" : "grammar_library";
    
    // Сортируем по 'order' (убедись, что в базе у документов грамматики есть это поле)
    const q = query(collection(db, collectionName), orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(data);
      setLoading(false);
    }, (error) => {
      console.error("Ошибка Firebase:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.lessonItem} 
      onPress={() => navigation.navigate('CreateLesson', { 
        lesson: item, 
        type: activeTab === 'lessons' ? 'normal' : 'grammar' 
      })}
    >
      <View style={styles.lessonInfo}>
        <Typography style={styles.lessonTitle}>{item.title || 'Без названия'}</Typography>
        <Typography style={styles.lessonId}>
          {activeTab === 'lessons' ? `Порядок: ${item.order}` : `Категория: ${item.category || '—'}`}
        </Typography>
      </View>
      <Typography style={{ color: '#00F0FF' }}>Изм.</Typography>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <HeaderButton type="close" onPress={() => navigation.goBack()} />
      <Typography variant="header" style={{ marginBottom: 20 }}>АДМИН-ПАНЕЛЬ</Typography>

      <View style={{ flexDirection: 'row', marginBottom: 20, gap: 10 }}>
        <TouchableOpacity 
          onPress={() => setActiveTab('lessons')}
          style={{ flex: 1, padding: 12, backgroundColor: activeTab === 'lessons' ? '#00F0FF' : '#1A1A1A', borderRadius: 8 }}
        >
          <Typography style={{ textAlign: 'center', color: activeTab === 'lessons' ? '#000' : '#FFF', fontWeight: 'bold' }}>Уроки</Typography>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('grammar')}
          style={{ flex: 1, padding: 12, backgroundColor: activeTab === 'grammar' ? '#00F0FF' : '#1A1A1A', borderRadius: 8 }}
        >
          <Typography style={{ textAlign: 'center', color: activeTab === 'grammar' ? '#000' : '#FFF', fontWeight: 'bold' }}>Грамматика</Typography>
        </TouchableOpacity>
      </View>

      <Button 
        title={activeTab === 'lessons' ? "+ Добавить урок" : "+ Добавить правило"} 
        onPress={() => navigation.navigate('CreateLesson', { type: activeTab === 'lessons' ? 'normal' : 'grammar' })} 
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00F0FF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40, marginTop: 10 }}
        />
      )}
    </ScreenWrapper>
  );
}