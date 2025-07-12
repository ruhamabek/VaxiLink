import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Language, useLanguage } from "@/context/LanguageContext";
import colors from "@/constants/colors";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "English" },
    { code: "am", name: "አማርኛ" },
    { code: "or", name: "Afaan Oromoo" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("common.language")}</Text>
      <View style={styles.languageContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              language === lang.code && styles.activeLanguage,
            ]}
            onPress={() => setLanguage(lang.code)}
          >
            <Text
              style={[
                styles.languageText,
                language === lang.code && styles.activeLanguageText,
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 12,
  },
  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  activeLanguage: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageText: {
    fontSize: 14,
    color: colors.text,
  },
  activeLanguageText: {
    color: colors.card,
    fontWeight: "600" as const,
  },
});