import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Typography } from "../typography/Typography";
import { styles } from "./styles";

export function AuthLink({description, actionText, onPress}){
  return (
    <View style={styles.container}>
      <Typography variant="description">{description} </Typography>
      <TouchableOpacity onPress={onPress}>
        <Typography variant="link">{actionText}</Typography>
      </TouchableOpacity>
    </View>
  )
}