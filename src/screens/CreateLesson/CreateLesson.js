import React, { useState } from "react";
import { View, Alert, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../firebase/config";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ScreenWrapper } from "../../components/screen-wrapper/ScreenWrapper";
import { Typography } from "../../components/typography/Typography";
import { AuthInput } from "../../components/auth-input/AuthInput";
import { Button } from "../../components/button/Button";
import { HeaderButton } from "../../components/header-button/HeaderButton";

// ИМПОРТ СТИЛЕЙ
import { styles } from "./styles";

export default function CreateLesson({ navigation, route }) {
  const editLesson = route.params?.lesson || null;
  const isEdit = !!editLesson;

  const [order, setOrder] = useState
  const [title, setTitle] = useState(editLesson?.title || "");
  const [description, setDescription] = useState(editLesson?.description || "");
  const [contentBlocks, setContentBlocks] = useState(editLesson?.content || []);
  const [loading, setLoading] = useState(false);

  // Логика добавления/удаления/обновления блоков (остается прежней)
  const addBlock = (type) => {
    const templates = {
      word: { type: "word", original: "", translation: "", example: "", image: "" },
      grammar: { type: "grammar", title: "", rule: "", explanation: "" },
      quiz: { type: "quiz", question: "", options: "", correctAnswer: "" }
    };
    setContentBlocks([...contentBlocks, { id: Date.now().toString(), ...templates[type] }]);
  };

  const updateBlock = (index, field, value) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index][field] = value;
    setContentBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    const newBlocks = [...contentBlocks];
    newBlocks.splice(index, 1);
    setContentBlocks(newBlocks);
  };

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert("Ошибка", "Введите название урока");
    setLoading(true);
    try {
      const lessonData = { title: title.trim(), description: description.trim(), content: contentBlocks };
      if (isEdit) {
        await updateDoc(doc(db, "lessons", editLesson.id), { ...lessonData, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "lessons"), { ...lessonData, createdAt: serverTimestamp() });
      }
      navigation.goBack();
    } catch (e) { Alert.alert("Ошибка", e.message); } finally { setLoading(false); }
  };

  const renderBlock = (block, index) => (
    <View key={block.id} style={styles.blockContainer}>
      <View style={styles.blockHeader}>
        <Typography style={styles.blockTypeText}>{block.type.toUpperCase()}</Typography>
        <TouchableOpacity onPress={() => removeBlock(index)}>
          <Typography style={styles.deleteButtonText}>Удалить</Typography>
        </TouchableOpacity>
      </View>

      {block.type === 'word' && (
        <View style={{ gap: 8 }}>
          <AuthInput label="Слово" value={block.original} onChangeText={(t) => updateBlock(index, 'original', t)} />
          <AuthInput label="Ссылка на картинку (URL)" value={block.image} onChangeText={(t) => updateBlock(index, 'image', t)} placeholder="https://example.com/image.png"/>
          
          <AuthInput label="Перевод" value={block.translation} onChangeText={(t) => updateBlock(index, 'translation', t)} />
        </View>
      )}

      {block.type === 'grammar' && (
        <View style={{ gap: 8 }}>
          <AuthInput label="Заголовок" value={block.title} onChangeText={(t) => updateBlock(index, 'title', t)} />
          <AuthInput label="Объяснение" value={block.explanation} onChangeText={(t) => updateBlock(index, 'explanation', t)} multiline />
        </View>
      )}

      {block.type === 'quiz' && (
        <View style={{ gap: 8 }}>
          <AuthInput label="Вопрос" value={block.question} onChangeText={(t) => updateBlock(index, 'question', t)} />
          <Typography style={styles.quizOptionsInfo}>Варианты через запятую</Typography>
          <AuthInput label="Варианты" value={block.options} onChangeText={(t) => updateBlock(index, 'options', t)} />
          <AuthInput label="Ответ" value={block.correctAnswer} onChangeText={(t) => updateBlock(index, 'correctAnswer', t)} />
        </View>
      )}
    </View>
  );

  return (
    <ScreenWrapper>
      <HeaderButton type="close" onPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        <Typography variant="header" style={styles.headerTitle}>
          {isEdit ? "РЕДАКТИРОВАНИЕ" : "НОВЫЙ УРОК"}
        </Typography>

        <AuthInput label="Название" value={title} onChangeText={setTitle} />
        <AuthInput label="Описание" value={description} onChangeText={setDescription} multiline />

        <Typography variant="description" style={styles.sectionLabel}>Конструктор:</Typography>

        {contentBlocks.map((block, index) => renderBlock(block, index))}

        <View style={styles.addButtonsWrapper}>
          <Button title="+ Слово" onPress={() => addBlock('word')} style={styles.addBlockButton} />
          <Button title="+ Грамм." onPress={() => addBlock('grammar')} style={styles.addBlockButton} />
          <Button title="+ Квиз" onPress={() => addBlock('quiz')} style={styles.addBlockButton} />
        </View>

        <Button
          title={loading ? "Сохранение..." : (isEdit ? "Обновить" : "Создать")}
          onPress={handleSave}
          disabled={loading}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}