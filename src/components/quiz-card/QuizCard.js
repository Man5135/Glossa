import React from "react";
import { View} from 'react-native';
import { Typography } from "../typography/Typography";
import { Button } from "../button/Button";
import { styles } from "./styles";

export function QuizCard({question, options, onAnswer}){
  if(!options || options.length === 0){
    return <Typography variant="body">Загрузка</Typography>
  }

  return(
    <View style={styles.container}>
      <Typography variant="title" style={styles.questionText}>
        {question}
      </Typography>
      <View>
        {options.map((option, index) => (
          <View key={index} style={styles.buttonWrapper}>
            <Button 
              title={option} 
              onPress={() => onAnswer(option)} 
              variant="primary"
            />
          </View>
        ))}
      </View>
    </View>
  )
}