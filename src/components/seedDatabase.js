import { db } from '../firebase/config';
import { writeBatch, doc } from "firebase/firestore";

const LESSONS_DATA = [
  {
    id: "lesson_1",
    order: 1,
    title: "Знакомство",
    content: [
      { id: "l1_w1", type: "word", original: "Γεια σου", translation: "Привет", example: "Γεια σου, Νίκο!", image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500" },
      { id: "g_pronouns_1", type: "grammar", title: "Местоимение 'Я'", rule: "Εγώ (Ego)", explanation: "В греческом языке Εγώ часто опускается, так как окончание глагола уже указывает на лицо." },
      { id: "l1_q1", type: "quiz", question: "Как будет 'Я'?", options: ["Εγώ", "Εσύ", "Αυτός"], correct: "Εγώ" }
    ]
  },
  {
    id: "lesson_2",
    order: 2,
    title: "Глагол 'Быть'",
    content: [
      { id: "l2_w1", type: "word", original: "Είμαι", translation: "Я есть", example: "Είμαι δάσκαλος (Я учитель)" },
      { id: "g_verb_be", type: "grammar", title: "Глагол Είμαι (Быть)", rule: "Είμαι / Είσαι", explanation: "Настоящее время глагола 'быть' для 1-го и 2-го лица ед.ч." },
      { id: "l2_q1", type: "quiz", question: "Выберите 'Я есть':", options: ["Είμαι", "Είσαι"], correct: "Είμαι" }
    ]
  },
  {
    id: "lesson_3",
    order: 3,
    title: "Артикли (М)",
    content: [
      { id: "l3_w1", type: "word", original: "Ο άντρας", translation: "Мужчина" },
      { id: "g_article_m", type: "grammar", title: "Мужской род", rule: "Ο (мужской род)", explanation: "Используется перед существительными мужского рода." },
      { id: "l3_q1", type: "quiz", question: "Какой артикль у 'άντρας'?", options: ["Ο", "Η", "Το"], correct: "Ο" }
    ]
  },
  {
    id: "lesson_4",
    order: 4,
    title: "Артикли (Ж)",
    content: [
      { id: "l4_w1", type: "word", original: "Η γυναίка", translation: "Женщина" },
      { id: "g_article_f", type: "grammar", title: "Женский род", rule: "Η (женский род)", explanation: "Используется для существительных женского рода." },
      { id: "l4_q1", type: "quiz", question: "Найдите женский артикль:", options: ["Ο", "Η", "Το"], correct: "Η" }
    ]
  },
  {
    id: "lesson_5",
    order: 5,
    title: "Вежливость",
    content: [
      { id: "l5_w1", type: "word", original: "Ευχαριστώ", translation: "Спасибо" },
      { id: "g_polite", type: "grammar", title: "Вежливые формы", rule: "Паракало", explanation: "Слово означает и 'Пожалуйста', и ответ на 'Спасибо'." },
      { id: "l5_q1", type: "quiz", question: "Как сказать 'Спасибо'?", options: ["Γεια", "Ευхаριστώ"], correct: "Ευχαριστώ" }
    ]
  }
];

const GRAMMAR_LIBRARY = [
  { id: "g_pronouns_1", title: "Местоимение 'Я'", category: "База", fullText: "Местоимение Εγώ (я) используется для акцента. В обычном разговоре его опускают.",table: [
      { col1: "Εγώ", col2: "Я" },
      { col1: "Εσύ", col2: "Ты" },
      { col1: "Αυτός", col2: "Он" },
      { col1: "Αυτή", col2: "Она" },
      { col1: "Αυτό", col2: "Оно" }
    ] },
  { id: "g_verb_be", title: "Глагол Είμαι (Быть)", category: "Глаголы", fullText: "Я есть — Είμαι, Ты есть — Είσαι. Это основа греческого предложения." },
  { id: "g_article_m", title: "Мужской род", category: "Артикли", fullText: "Определенный артикль мужского рода — Ο. Например, Ο Νίκος." },
  { id: "g_article_f", title: "Женский род", category: "Артикли", fullText: "Определенный артикль женского рода — Η. Например, Η Μαρία." },
  { id: "g_polite", title: "Вежливые формы", category: "Этикет", fullText: "Ευχαριστώ — Спасибо. Παρακαλώ — Пожалуйста / Не за что." }
];

export const seedAppDatabase = async () => {
  try {
    const batch = writeBatch(db);

    // Загружаем уроки
    LESSONS_DATA.forEach(lesson => {
      const ref = doc(db, "lessons", lesson.id);
      batch.set(ref, lesson);
    });

    // Загружаем библиотеку
    GRAMMAR_LIBRARY.forEach(topic => {
      const ref = doc(db, "grammar_library", topic.id);
      batch.set(ref, topic);
    });

    await batch.commit();
    console.log("✅ База данных успешно обновлена и синхронизирована!");
  } catch (e) {
    console.error("❌ Ошибка при обновлении базы:", e);
  }
};