import React from 'react';
import { StyleSheet, ImageBackground, SafeAreaView, StatusBar, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './styles'; // Подключаем стили из отдельного файла

export function ScreenWrapper({ children }) {
  return (
    <ImageBackground 
      source={require('../../img/background.png')} // ПУТЬ К ТВОЕМУ ФОНУ
      style={styles.backgroundImage} // Стили для растягивания
      resizeMode="cover" // Важно: "cover" растянет картинку, обрезав лишнее, но без искажений
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          extraScrollHeight={20}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled" // Чтобы тапы по экрану закрывали клавиатуру
        >
          {/* Контейнер для контента с maxWidth, чтобы не было слишком широко */}
          <View style={styles.innerContainer}>
            {children}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}