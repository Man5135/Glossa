import React from "react";
import { View, Image, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech'
import {Ionicons} from '@expo/vector-icons';
import { Typography } from "../typography/Typography";

export function WordCard({data}){
  const handleSpeak = () => {
    Speech.speak(data.original, {language: 'el'})
  }
  return(
    <View style={styles.container}>
      <Typography variant="header" style={styles.topText}>Что-то новое!</Typography>
      <View style={styles.imageContainer}>
        <Image
        source = {{uri: data.image}}
        style={styles.image}
        resizeMode="cover"
        />
      </View>

      <View style={styles.wordInfo}>
        <View style={styles.row}>
          <Typography variant="title" style={styles.originalText}>
            {data.original}
          </Typography>
          
          <TouchableOpacity onPress={handleSpeak} style={styles.audioBtn}>
            <Ionicons name="volume-medium" size={28} color="#00E5FF"/>
          </TouchableOpacity>
        </View>

        <Typography variant="body" style={styles.translationText}>
          {data.translation}
        </Typography>
      </View>
    </View>
  );
};