import React from "react";
import { View, Modal, TouchableOpacity,ScrollView,StatusBar } from 'react-native';
import { Typography } from "../typography/Typography";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";

export function GrammarModal(visible,onClose,data,onMarkAsLearned){
  if(!data) return null;

  const handleFinish = () => {
    if(onMarkAsLearned){
      onMarkAsLearned(data.id)
    }
    onClose();
  }

  return(
    <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="light-content"/>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Typography variant="title" style={styles.title}>
                {data.title || "Грамматика"}
              </Typography>
              <Typography variant="body" style={styles.category}>
                {data.category || "Общее"}
              </Typography>
            </View>
            <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.exampleCard}>
                <View style={styles.exampleHeader}>
                  <Ionicons name="bulb-outline" size={18} color="#00F0FF"/>
                  <Typography variant="body" style={styles.exampleLabel}>
                    Пример использования
                  </Typography>
                </View>
                <Typography variant="header" style={styles.exampleText}>
                  {data.example}
                </Typography>
              </View>
              <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFinish}
              activeOpacity={0.8}
              >
                <Typography variant="body" style={stylesButtonText}>
                  Понятно, в справочник!
                </Typography>
                <Ionicons name="checkmark-circle" size={20} color="#000" style={{marginLeft: 8}} />
              </TouchableOpacity>
            </ScrollView>
            </View>
        </View>
      </View>

    </Modal>
  )

}