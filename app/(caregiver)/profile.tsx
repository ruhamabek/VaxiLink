import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Bell, Globe, HelpCircle, LogOut, Settings, User } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/Button";
import Card from "@/components/Card";
import LanguageSelector from "@/components/LanguageSelector";
import colors from "@/constants/colors";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => logout(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        {user?.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <User size={40} color={colors.card} />
          </View>
        )}
        
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileInfo}>{user?.phone}</Text>
        <Text style={styles.profileInfo}>{user?.email}</Text>
        
        <Button
          title="Edit Profile"
          onPress={() => {
            // Navigate to edit profile
          }}
          variant="outline"
          size="small"
          style={styles.editButton}
        />
      </View>
      
      <Card variant="outlined" style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>{t("common.settings")}</Text>
        
        <LanguageSelector />
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{t("common.notifications")}</Text>
            <Text style={styles.settingDescription}>
              Manage your notification preferences
            </Text>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{t("common.help")}</Text>
            <Text style={styles.settingDescription}>
              Get help and support
            </Text>
          </View>
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Settings size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{t("common.about")}</Text>
            <Text style={styles.settingDescription}>
              About the app and version information
            </Text>
          </View>
        </View>
      </Card>
      
      <Button
        title={t("common.logout")}
        onPress={handleLogout}
        variant="outline"
        icon={<LogOut size={20} color={colors.error} />}
        style={styles.logoutButton}
      />
      
      <Text style={styles.versionText}>{t("common.version")}: 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
  },
  profileInfo: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 16,
  },
  settingsCard: {
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  logoutButton: {
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
  },
});