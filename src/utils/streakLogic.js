import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const updateStreak = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const today = new Date().toISOString().split('T')[0];
  const lastDate = userData.lastActivityDate;

  if (lastDate === today) return; // Сегодня уже зачтено

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  let newStreak = userData.currentStreak || 0;
  
  // Если вчера занимался — инкремент, если пропустил — сброс на 1
  newStreak = (lastDate === yesterdayString) ? newStreak + 1 : 1;

  await updateDoc(userRef, {
    currentStreak: newStreak,
    lastActivityDate: today,
  });
};