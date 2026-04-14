import React from "react";
import {View, Image} from 'react-native';
import { styles } from "./styles";

export function Logo(){
  return(
    <View style={styles.container}>
      <Image source={require('../../img/logo.svg')}
      style={styles.image}
      resizeMode="contain"
      />
    </View>
  );
}