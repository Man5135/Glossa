import React from "react";
import { Text } from "react-native";
import { styles } from "./styles";

export function Typography ({children, variant = 'body', style}) {
    const textStyle = styles[variant] || styles.body

    return(
      <Text style={[textStyle, style]}>
        {children}
      </Text>
    )
}