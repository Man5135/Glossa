import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../firebase/config";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
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
  const [unlockLessonId, setUnlockLessonId] = useState(() => {
    if (!editLesson?.unlockLessonId) return "";
    return editLesson.unlockLessonId.toString().replace("lesson_", "");
  });

  // Безопасное приведение старой/новой структуры из БД к рабочему формату приложения
  const getInitialTable = () => {
    if (!editLesson || !editLesson.table || !Array.isArray(editLesson.table)) {
      return [{ id: `row_${Date.now()}`, cells: ["", ""] }];
    }
    
    // Если старый формат [{col1, col2}]
    if (editLesson.table[0] && !Array.isArray(editLesson.table[0]) && typeof editLesson.table[0] === 'object' && 'col1' in editLesson.table[0]) {
      return editLesson.table.map((row, idx) => ({
        id: `row_${Date.now()}_${idx}`,
        cells: [row.col1 || "", row.col2 || ""]
      }));
    }

    // Если в БД уже лежит массив массивов (на случай, если что-то проскочило)
    if (Array.isArray(editLesson.table[0])) {
      return editLesson.table.map((row, idx) => ({
        id: `row_${Date.now()}_${idx}`,
        cells: row
      }));
    }

    // Стандартный рабочий формат объектов с массивом внутри ячеек
    return editLesson.table;
  };

  const [table, setTable] = useState(getInitialTable);
  
  // Вычисляем количество колонок по первой строке
  const columnCount = table.length > 0 && Array.isArray(table[0].cells) ? table[0].cells.length : 2;

  // --- Обычные поля ---
  const [order, setOrder] = useState(editLesson?.order?.toString() || "");
  const [title, setTitle] = useState(editLesson?.title || "");
  const [description, setDescription] = useState(editLesson?.description || "");
  const [contentBlocks, setContentBlocks] = useState(editLesson?.content || []);

  const [loading, setLoading] = useState(false);

  const addBlock = (type) => {
    const newBlock = {
      id: `${type}_${Date.now()}`,
      type,
      original: '',
      image: '',
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

  // --- Управление Динамической Таблицей (Фикс для Firebase) ---
  
  const addTableRow = () => {
    const emptyCells = Array(columnCount).fill("");
    setTable([...table, { id: `row_${Date.now()}`, cells: emptyCells }]);
  };

  const removeTableRow = () => {
    if (table.length > 0) {
      setTable(table.slice(0, -1)); 
    }
  };

  const addTableColumn = () => {
    const updatedTable = table.map(row => ({
      ...row,
      cells: [...row.cells, ""]
    }));
    setTable(updatedTable);
  };

  const removeTableColumn = () => {
    if (columnCount > 1) {
      const updatedTable = table.map(row => ({
        ...row,
        cells: row.cells.slice(0, -1)
      }));
      setTable(updatedTable);
    } else {
      Alert.alert("Внимание", "Нельзя удалить последнюю колонку");
    }
  };

  const updateTableCell = (rowIndex, colIndex, value) => {
    const updatedTable = [...table];
    updatedTable[rowIndex].cells[colIndex] = value;
    setTable(updatedTable);
  };

  const handleSave = async () => {
    if (!title || !order) {
      Alert.alert("Ошибка", "Заполните название и номер (order)");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, collectionName, isEdit ? editLesson.id : order);
      const formattedUnlockId = unlockLessonId.trim() ? unlockLessonId.trim() : null;
      
      const lessonData = {
        id: isEdit ? editLesson.id : order,
        title,
        order: parseInt(order),
        unlockLessonId: formattedUnlockId,
      };

      if (type === 'grammar') {
        lessonData.category = category;
        lessonData.fullText = fullText;
        lessonData.table = table; // Сохраняем как плоский массив объектов {id, cells: [...]}
      } else {
        lessonData.description = description;
        lessonData.content = contentBlocks;
      }

      await setDoc(docRef, lessonData);
      
      Alert.alert("Успех", isEdit ? "Обновлено" : "Создано");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert("Ошибка", "Не удалось сохранить изменения в Firebase");
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
          <AuthInput label="Изображение(ссылка)" value={block.image} onChangeText={(t) => updateBlock(index, {image: t})}/>
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
        
        {!isEdit  && (
          <AuthInput label="ID урока/Порядок" value={order} onChangeText={setOrder} keyboardType="numeric" placeholder="1" />
        )}
       
        <AuthInput label="Название" value={title} onChangeText={setTitle} />

        {type === 'grammar' ? (
          <View>
            <AuthInput label="Категория" value={category} onChangeText={setCategory} placeholder="Напр: Глаголы" />
            <AuthInput label="Номер урока для разблокировки" value={unlockLessonId} onChangeText={setUnlockLessonId} keyboardType="numeric" placeholder="5" />
            <AuthInput label="Полный текст правила" value={fullText} onChangeText={setFullText} multiline />
            
            <Typography variant="description" style={styles.sectionLabel}>Таблица:</Typography>
            
            {Array.isArray(table) && table.map((row, rowIndex) => (
              <View key={row.id || rowIndex} style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                {Array.isArray(row.cells) && row.cells.map((cellValue, colIndex) => (
                  <View key={colIndex} style={{ flex: 1 }}>
                    <AuthInput 
                      value={cellValue} 
                      onChangeText={(t) => updateTableCell(rowIndex, colIndex, t)} 
                      placeholder={`Колонка ${colIndex + 1}`} 
                    />
                  </View>
                ))}
              </View>
            ))}

            {/* Кнопки управления строками */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              <Button title="+ Строка" onPress={addTableRow} style={{ flex: 1 }} />
              <Button title="- Строка" onPress={removeTableRow} style={{ flex: 1 }} />
            </View>

            {/* Кнопки управления колонками */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              <Button title="+ Колонка" onPress={addTableColumn} style={{ flex: 1 }} />
              <Button title="- Колонка" onPress={removeTableColumn} style={{ flex: 1 }} />
            </View>
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
          <View style={styles.dangerousZoneContainer}>
            <Button title="УДАЛИТЬ УРОК" variant="danger" onPress={handleDelete}/>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}