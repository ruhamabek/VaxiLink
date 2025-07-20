import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Mail, Lock, User } from "lucide-react-native";
import { UserRole, useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LanguageSelector from "@/components/LanguageSelector";
import colors from "@/constants/colors";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("caregiver");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      await login(email, password, role);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
              source={require("../../assets/images/VaxiLink.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>{t("login.title")}</Text>

          <View style={styles.roleSelector}>
            <Text style={styles.roleLabel}>{t("login.role")}</Text>
            <View style={styles.roleButtons}>
              <Button
                title={t("login.caregiver")}
                onPress={() => handleRoleSelect("caregiver")}
                variant={role === "caregiver" ? "primary" : "outline"}
                size="small"
                style={styles.roleButton}
              />
              <Button
                title={t("login.hew")}
                onPress={() => handleRoleSelect("hew")}
                variant={role === "hew" ? "primary" : "outline"}
                size="small"
                style={styles.roleButton}
              />
              <Button
                title={t("login.admin")}
                onPress={() => handleRoleSelect("admin")}
                variant={role === "admin" ? "primary" : "outline"}
                size="small"
                style={styles.roleButton}
              />
            </View>
          </View>

          <Input
            label={t("login.email")}
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.textLight} />}
          />

          <Input
            label={t("login.password")}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={colors.textLight} />}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title={t("login.button")}
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />

          <LanguageSelector />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.primary,
    marginTop: 16,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 24,
  },
  roleSelector: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.text,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
});