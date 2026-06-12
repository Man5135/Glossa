import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const getLocalDateString = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  const d = new Intl.DateTimeFormat('en-US', options).format(date);
  const [month, day, year] = d.split('/');
  return `${year}-${month}-${day}`;
};

const getDaysDifference = (dateStr1, dateStr2) => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

const getNetworkTodayDate = async () => {
  try {
    const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
    const data = await response.json();
    return new Date(data.utc_datetime); 
  } catch (error) {
    console.warn("Не удалось получить сетевое время, откат на системное:", error);
    return new Date();
  }
};

export const checkStreakValidity = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const lastLocalDate = userData.lastLocalDate; // Строка 'YYYY-MM-DD'
    
    if (!lastLocalDate || userData.currentStreak === 0) return;

    const networkDate = await getNetworkTodayDate();
    const todayLocalDate = getLocalDateString(networkDate);

    const daysDiff = getDaysDifference(lastLocalDate, todayLocalDate);

    if (daysDiff > 1) {
      await updateDoc(userRef, {
        currentStreak: 0
      });
      console.log("Стрик сброшен: пропущен календарный день.");
    }
  } catch (error) {
    console.error("Ошибка при валидации стрика:", error);
  }
};

export const updateStreak = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const lastLocalDate = userData.lastLocalDate; // Строка 'YYYY-MM-DD'

    const networkDate = await getNetworkTodayDate();
    const todayLocalDate = getLocalDateString(networkDate); // Текущая дата устройства с учетом его пояса

    if (lastLocalDate === todayLocalDate) {
      console.log("Сегодня урок уже засчитан локально.");
      return;
    }

    let currentStreak = userData.currentStreak || 0;
    let newStreak = 1;

    const daysDiff = lastLocalDate ? getDaysDifference(lastLocalDate, todayLocalDate) : 0;

    if (daysDiff === 1) {
      newStreak = currentStreak + 1;
    } 
    else {
      newStreak = 1;
    }

    await updateDoc(userRef, {
      currentStreak: newStreak,
      lastLocalDate: todayLocalDate,          
      lastActivityDate: serverTimestamp(),     
    });

  } catch (error) {
    console.error("Ошибка при обновлении стрика:", error);
  }
};