import React from "react";
import { View, FlatList } from "react-native";
import { Typography } from "../typography/Typography";
import { Button } from "../button/Button";
import { HeaderButton } from "../header-button/HeaderButton";
import { styles } from "./styles";


export function WordListScreen(route, navigation){
  const {title, words} = route.params;
  
  const renderWordItem = ({item}) => (
    <View style={styles.wordItem}>
      <Typography variant="body" style={styles.greekText}>{item.greek}</Typography>
      <Typography variant="caption" style={styles.translationText}>{item.translation}</Typography>
    </View>
  )

  return(
    <View style={styles.container}>
      <View>
        <HeaderButton type="back" onPress={() => navigation.goBack()}/>
          <Typography variant="title" style={styles.headerTitle}>{title}</Typography>
          <Typography variant="body">{words.length} слов</Typography>
      </View>

      <Button title="Тренировать слова"></Button>

      <FlatList
        data={words}
        renderItem={renderWordItem}
        keyExtractor={item => item.id}
        contentContainerStyle={style.list}
      />
    </View>
  )
}