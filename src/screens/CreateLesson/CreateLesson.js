import React, { useState } from "react";
import { View, Alert, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../firebase/config";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ScreenWrapper } from "../../components/screen-wrapper/ScreenWrapper";
import { Typography } from "../../components/typography/Typography";
import { AuthInput } from "../../components/auth-input/AuthInput";
import { Button } from "../../components/button/Button";
import { HeaderButton } from "../../components/header-button/HeaderButton";

import { styles } from "./styles";

export default function CreateLesson({ navigation, route }) {
  const { lesson: editLesson, type = 'normal' } = route.params || {};
  const isEdit = !!editLesson;
  
  const collectionName = type === 'grammar' ? 'grammar_library' : 'lessons';

  // --- Грамматические поля ---
  const [category, setCategory] = useState(editLesson?.category || "");
  const [fullText, setFullText] = useState(editLesson?.fullText || "");
  const [table, setTable] = useState(editLesson?.table || []);
  const [unlockLessonId, setUnlockLessonId] = useState(editLesson?.unlockLessonId?.toString() || "");

  // --- Обычные поля ---
  const [order, setOrder] = useState(editLesson?.order?.toString() || "");
  const [title, setTitle] = useState(editLesson?.title || "");
  const [description, setDescription] = useState(editLesson?.description || "");
  const [contentBlocks, setContentBlocks] = useState(editLesson?.content || []);

  const [loading, setLoading] = useState(false);

  const addBlock = (type) => {
    const newBlock = {
      id: `${type}_${Date.now()}`, // ДОБАВЛЕНО ТОЛЬКО ЭТО
      type,
      original: '',
      translation: '',
      example: '',
      rule: '',
      explanation: '',
      question: '',
      options: ['', '', ''],
      correct: ''
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlock = (index, fields) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index] = { ...newBlocks[index], ...fields };
    setContentBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const addTableRow = () => {
    setTable([...table, { col1: "", col2: "" }]);
  };

  const updateTableRow = (index, field, value) => {
    const newTable = [...table];
    newTable[index][field] = value;
    setTable(newTable);
  };

  const handleSave = async () => {
    if (!title || !order) {
      Alert.alert("Ошибка", "Заполните название и номер (order)");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, collectionName, isEdit ? editLesson.id : order);

      const formattedUnlockId = unlockLessonId ? `lesson_${unlockLessonId}` : null;
      const lessonData = {
        id: isEdit ? editLesson.id : order,
        title,
        order: parseInt(order),
        unlockLessonId: formattedUnlockId,
        updatedAt: serverTimestamp(),
      };

      if (type === 'grammar') {
        lessonData.category = category;
        lessonData.fullText = fullText;
        lessonData.table = table;
      } else {
        lessonData.description = description;
        lessonData.content = contentBlocks;
      }

      await setDoc(docRef, lessonData);
      
      Alert.alert("Успех", isEdit ? "Обновлено" : "Создано");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Ошибка", "Не удалось сохранить");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {

        try {
          await deleteDoc(doc(db, collectionName, editLesson.id));
          navigation.goBack();
        } catch (e) {
          Alert.alert("Ошибка", "Не удалось удалить");
        }
  };

  const renderBlock = (block, index) => (
    <View key={index} style={styles.blockContainer}>
      <View style={styles.blockHeader}>
        <Typography style={styles.blockTypeText}>{block.type.toUpperCase()}</Typography>
        <TouchableOpacity onPress={() => removeBlock(index)}>
          <Typography style={styles.deleteButtonText}>Удалить</Typography>
        </TouchableOpacity>
      </View>

      {block.type === 'word' && (
        <>
          <AuthInput label="Слово (оригинал)" value={block.original} onChangeText={(t) => updateBlock(index, { original: t })} />
          <AuthInput label="Перевод" value={block.translation} onChangeText={(t) => updateBlock(index, { translation: t })} />
          <AuthInput label="Пример" value={block.example} onChangeText={(t) => updateBlock(index, { example: t })} />
        </>
      )}

      {block.type === 'grammar' && (
        <>
          <AuthInput label="Правило (кратко)" value={block.rule} onChangeText={(t) => updateBlock(index, { rule: t })} />
          <AuthInput label="Объяснение" value={block.explanation} onChangeText={(t) => updateBlock(index, { explanation: t })} multiline />
        </>
      )}

      {block.type === 'quiz' && (
        <>
          <AuthInput label="Вопрос" value={block.question} onChangeText={(t) => updateBlock(index, { question: t })} />
          {block.options.map((opt, i) => (
            <AuthInput 
              key={i} 
              label={`Вариант ${i + 1}`} 
              value={opt} 
              onChangeText={(t) => {
                const newOpts = [...block.options];
                newOpts[i] = t;
                updateBlock(index, { options: newOpts });
              }} 
            />
          ))}
          <AuthInput label="Правильный ответ (как в вариантах)" value={block.correct} onChangeText={(t) => updateBlock(index, { correct: t })} />
        </>
      )}
    </View>
  );

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <HeaderButton type="close" onPress={() => navigation.goBack()} />
        <Typography variant="header" style={styles.headerTitle}>
          {isEdit ? "РЕДАКТИРОВАНИЕ" : "НОВЫЙ УРОК"}
        </Typography>

        <AuthInput label="ID урока" value={order} onChangeText={setOrder} keyboardType="numeric" placeholder="1" />
        <AuthInput label="Название" value={title} onChangeText={setTitle} />

        {type === 'grammar' ? (
          <View>
            <AuthInput label="Категория" value={category} onChangeText={setCategory} placeholder="Напр: Глаголы" />
            <AuthInput label="Номер урока для разблокировки" value={unlockLessonId} onChangeText={setUnlockLessonId} keyboardType="numeric" placeholder="5" />
            <AuthInput label="Полный текст правила" value={fullText} onChangeText={setFullText} multiline />
            <Typography variant="description" style={styles.sectionLabel}>Таблица:</Typography>
            {table.map((row, index) => (
              <View key={index} style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                <View style={{ flex: 1 }}><AuthInput value={row.col1} onChangeText={(t) => updateTableRow(index, 'col1', t)} placeholder="Греческий" /></View>
                <View style={{ flex: 1 }}><AuthInput value={row.col2} onChangeText={(t) => updateTableRow(index, 'col2', t)} placeholder="Перевод" /></View>
              </View>
            ))}
            <Button title="+ Строка таблицы" onPress={addTableRow} style={{ marginBottom: 20 }} />
          </View>
        ) : (
          <View>
            <AuthInput label="Описание" value={description} onChangeText={setDescription} multiline />
            <Typography variant="description" style={styles.sectionLabel}>Конструктор блоков:</Typography>
            {contentBlocks.map((block, index) => renderBlock(block, index))}
            <View style={styles.addButtonsWrapper}>
              <Button title="+ Слово" onPress={() => addBlock('word')} style={styles.addBlockButton} />
              <Button title="+ Грамм." onPress={() => addBlock('grammar')} style={styles.addBlockButton} />
              <Button title="+ Квиз" onPress={() => addBlock('quiz')} style={styles.addBlockButton} />
            </View>
          </View>
        )}

        <Button
          title={loading ? "Сохранение..." : (isEdit ? "Обновить" : "Создать")}
          onPress={handleSave}
          disabled={loading}
          style={{ marginTop: 20 }}
        />

        {isEdit && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Typography style={styles.deleteButtonText}>УДАЛИТЬ</Typography>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}