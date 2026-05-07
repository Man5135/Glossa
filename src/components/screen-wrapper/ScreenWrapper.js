import React from 'react';
import { StatusBar, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from './styles';

export function ScreenWrapper({ children }) {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* KeyboardAvoidingView поможет кнопкам не перекрываться клавиатурой */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          // Это заставляет скролл работать, даже если контента мало
          alwaysBounceVertical={true} 
        >
          <View style={styles.innerContainer}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}