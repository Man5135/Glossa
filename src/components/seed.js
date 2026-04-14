import { db } from '../firebase/config';
import { collection, addDoc } from "firebase/firestore";

const GREEK_WORDS = [
  { greek: 'Γεια σου', translation: 'Привет', category: 'basic', level: 1 },
  { greek: 'Ευχαριστώ', translation: 'Спасибо', category: 'basic', level: 1 },
  { greek: 'Καλημέρα', translation: 'Доброе утро', category: 'basic', level: 1 },
  // Добавь сюда свои слова
];

export const seedDatabase = async () => {
  const wordsRef = collection(db, "dictionary");
  for (const word of GREEK_WORDS) {
    await addDoc(wordsRef, word);
  }
  console.log("База наполнена!");
};