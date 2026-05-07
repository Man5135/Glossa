import { View, TouchableOpacity } from "react-native";
import { ScreenWrapper } from "../../components/screen-wrapper/ScreenWrapper";
import { Typography } from "../../components/typography/Typography";
import * as Speech from 'expo-speech';
import { styles } from "./styles";
import { HeaderButton } from "../../components/header-button/HeaderButton";

const alphabetData = [
  { id: '1', char: 'Α α', name: 'Альфа', sound: 'А' },
  { id: '2', char: 'Β β', name: 'Вита', sound: 'В' },
  { id: '3', char: 'Γ γ', name: 'Гамма', sound: 'Г/Й' },
  { id: '4', char: 'Δ δ', name: 'Дельта', sound: 'Д' },
  { id: '5', char: 'Ε ε', name: 'Эпсилон', sound: 'Э' },
  { id: '6', char: 'Ζ ζ', name: 'Зита', sound: 'З' },
  { id: '7', char: 'Η η', name: 'Ита', sound: 'И' },
  { id: '8', char: 'Θ θ', name: 'Фита', sound: 'Th (межзуб.)' },
  { id: '9', char: 'Ι ι', name: 'Йота', sound: 'И' },
  { id: '10', char: 'Κ κ', name: 'Каппа', sound: 'К' },
  { id: '11', char: 'Λ λ', name: 'Лямбда', sound: 'Л' },
  { id: '12', char: 'Μ μ', name: 'Ми', sound: 'М' },
  { id: '13', char: 'Ν ν', name: 'Ни', sound: 'Н' },
  { id: '14', char: 'Ξ ξ', name: 'Кси', sound: 'КС' },
  { id: '15', char: 'Ο ο', name: 'Омикрон', sound: 'О' },
  { id: '16', char: 'Π π', name: 'Пи', sound: 'П' },
  { id: '17', char: 'Ρ ρ', name: 'Ро', sound: 'Р' },
  { id: '18', char: 'Σ σ/ς', name: 'Сигма', sound: 'С' },
  { id: '19', char: 'Τ τ', name: 'Тав', sound: 'Т' },
  { id: '20', char: 'Υ υ', name: 'Ипсилон', sound: 'И' },
  { id: '21', char: 'Φ φ', name: 'Фи', sound: 'Ф' },
  { id: '22', char: 'Χ χ', name: 'Хи', sound: 'Х' },
  { id: '23', char: 'Ψ ψ', name: 'Пси', sound: 'ПС' },
  { id: '24', char: 'Ω ω', name: 'Омега', sound: 'О' },
];

const playSound = (text) => {
  Speech.speak(text, { language: 'el', pitch: 0.9, rate: 0.8 });
}

export default function AlphabetScreen( {navigation} ){
  return(
  <ScreenWrapper>
    <View>
      <HeaderButton type="close" onPress={() => navigation.goBack()} />
    </View>
    <Typography variant="header" style={styles.header}>Греческий алфавит</Typography>
    <View style={styles.grid}>
      {alphabetData.map((item) => (
        <TouchableOpacity key={item.id} style={styles.card}
        onPress={() => playSound(item.char.split(" ")[0])}
        activeOpacity={0.7}
        >
          <Typography style={styles.char}>{item.char}</Typography>
          <Typography style={styles.name}>{item.name}</Typography>
          <View style={styles.soundBadge}>
            <Typography style={styles.soundText}>[{item.sound}]</Typography>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </ScreenWrapper>
  )
  
}