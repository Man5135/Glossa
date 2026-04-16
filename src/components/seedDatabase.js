import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, writeBatch, doc } from "firebase/firestore";

const LESSONS_DATA = [
  {
    order: 1,
    title: "Знакомство",
    type: "regular",
    content: [
      {
        id: "l1_w1",
        type: "word",
        original: "Γεια σου",
        translation: "Привет",
        example: "Γεια σου, Νίκο! (Привет, Нико!)",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=500"
      },
      {
        id: "l1_g1",
        type: "grammar",
        title: "Местоимение 'Я'",
        rule: "Εγώ (Ego)",
        explanation: "В греческом языке местоимения часто опускаются, так как форма глагола уже указывает на лицо.",
        example: "Εγώ είμαι здесь. (Я здесь.)"
      },
      {
        id: "l1_q1",
        type: "quiz",
        question: "Как по-гречески будет 'Привет'?",
        options: ["Καλημέρα", "Γεια σου", "Ευχαριστώ"],
        correct: "Γεια σου"
      },
      {
        id: "l1_w2",
        type: "word",
        original: "Εγώ",
        translation: "Я",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500"
      }
    ]
  },
  {
    order: 2,
    title: "Вежливость",
    type: "regular",
    content: [
      {
        id: "l2_w1",
        type: "word",
        original: "Ευχαριστώ",
        translation: "Спасибо",
        example: "Ευχαριστώ πολύ! (Большое спасибо!)"
      },
      {
        id: "l2_q1",
        type: "quiz",
        question: "Выберите перевод слова 'Спасибо':",
        options: ["Παраκαλώ", "Ευχαριστώ", "Ναι"],
        correct: "Ευχαριστώ"
      }
    ]
  }
];

export const seedLessons = async () => {
  try {
    const lessonsCol = collection(db, "lessons");
    const snapshot = await getDocs(lessonsCol);

    // Проверка: если уроки уже есть, не дублируем
    if (!snapshot.empty) {
      console.log("База данных уже содержит уроки.");
      return;
    }

    console.log("Начинаю загрузку уроков...");
    
    for (const lesson of LESSONS_DATA) {
      await addDoc(lessonsCol, lesson);
    }

    console.log("Все уроки успешно загружены!");
  } catch (error) {
    console.error("Ошибка при сидировании базы:", error);
  }
};