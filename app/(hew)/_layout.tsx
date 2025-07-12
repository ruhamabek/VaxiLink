import { Tabs } from "expo-router";
import React from "react";
import { Home, Users, Calendar, AlertCircle, RefreshCw, User } from "lucide-react-native";
import { useLanguage } from "@/context/LanguageContext";
import colors from "@/constants/colors";

export default function HEWLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.hew,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.hew,
        },
        headerTintColor: colors.card,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("hew.home"),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="children"
        options={{
          title: t("hew.children"),
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: t("hew.visits"),
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="defaulters"
        options={{
          title: t("hew.defaulters"),
          tabBarIcon: ({ color }) => <AlertCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sync"
        options={{
          title: t("hew.sync"),
          tabBarIcon: ({ color }) => <RefreshCw size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("common.profile"),
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}