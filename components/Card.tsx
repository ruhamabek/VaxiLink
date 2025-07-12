import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import colors from "@/constants/colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
}

export default function Card({ children, style, variant = "default" }: CardProps) {
  const getCardStyle = () => {
    switch (variant) {
      case "elevated":
        return {
          ...styles.card,
          ...styles.elevated,
        };
      case "outlined":
        return {
          ...styles.card,
          ...styles.outlined,
        };
      default:
        return styles.card;
    }
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  elevated: {
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});