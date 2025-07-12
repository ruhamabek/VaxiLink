import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Bell, Calendar, MapPin, Plus } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { mockChildren } from "@/mocks/children";
import { mockMessages } from "@/mocks/messages";
import Button from "@/components/Button";
import Card from "@/components/Card";
import colors from "@/constants/colors";

export default function CaregiverHomeScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [children] = useState(mockChildren);
  const [unreadMessages] = useState(
    mockMessages.filter((msg) => !msg.read).length
  );

  const getUpcomingVaccinations = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return [];
    
    return child.vaccinations
      .filter((v) => v.status === "due" || v.status === "overdue")
      .slice(0, 3);
  };

  const getCompletedVaccinationsCount = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return 0;
    
    return child.vaccinations.filter((v) => v.status === "completed").length;
  };

  const getTotalVaccinationsCount = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return 0;
    
    return child.vaccinations.length;
  };

  const renderChildCard = ({ item: child }: { item: typeof children[0] }) => {
    const upcomingVaccinations = getUpcomingVaccinations(child.id);
    const completedCount = getCompletedVaccinationsCount(child.id);
    const totalCount = getTotalVaccinationsCount(child.id);
    const progressPercentage = (completedCount / totalCount) * 100;

    return (
      <Card variant="elevated" style={styles.childCard}>
        <View style={styles.childHeader}>
          <View style={styles.childInfo}>
            {child.photo ? (
              <Image source={{ uri: child.photo }} style={styles.childPhoto} />
            ) : (
              <View style={[styles.childPhoto, styles.childPhotoPlaceholder]}>
                <Text style={styles.childPhotoPlaceholderText}>
                  {child.name.charAt(0)}
                </Text>
              </View>
            )}
            <View>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childAge}>
                {calculateAge(child.birthdate)}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              // Navigate to child details
            }}
            style={({ pressed }) => [
              styles.viewDetailsButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </Pressable>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedCount}/{totalCount} {t("caregiver.vaccinesCompleted")}
          </Text>
        </View>

        {upcomingVaccinations.length > 0 ? (
          <View style={styles.upcomingContainer}>
            <Text style={styles.upcomingTitle}>
              {t("caregiver.vaccinesDue")}:
            </Text>
            {upcomingVaccinations.map((vaccination) => (
              <View key={vaccination.id} style={styles.vaccinationItem}>
                <View
                  style={[
                    styles.vaccinationStatus,
                    vaccination.status === "overdue"
                      ? styles.overdue
                      : styles.due,
                  ]}
                />
                <Text style={styles.vaccinationName}>{vaccination.name}</Text>
                <Text style={styles.vaccinationDate}>
                  {formatDate(vaccination.scheduledDate)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noUpcomingText}>
            No upcoming vaccinations at this time.
          </Text>
        )}

        {child.nextAppointment && (
          <View style={styles.appointmentContainer}>
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.appointmentText}>
              {t("caregiver.nextAppointment")}: {formatDate(child.nextAppointment)}
            </Text>
          </View>
        )}

        <View style={styles.cardActions}>
          <Button
            title={t("caregiver.viewCard")}
            onPress={() => {
              // Navigate to digital card
            }}
            variant="outline"
            size="small"
            style={styles.cardActionButton}
          />
          <Button
            title={t("caregiver.findClinic")}
            onPress={() => router.push("/clinics")}
            variant="outline"
            size="small"
            icon={<MapPin size={16} color={colors.primary} />}
            style={styles.cardActionButton}
          />
        </View>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.name.split(" ")[0]}
          </Text>
          <Text style={styles.subGreeting}>
            Track your children's vaccination progress
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/messages")}
          style={({ pressed }) => [
            styles.notificationButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Bell size={24} color={colors.text} />
          {unreadMessages > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadMessages}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.childrenSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("caregiver.children")}</Text>
          <Button
            title={t("caregiver.addChild")}
            onPress={() => {
              // Navigate to add child
            }}
            variant="text"
            size="small"
            icon={<Plus size={16} color={colors.primary} />}
          />
        </View>

        <FlatList
          data={children}
          renderItem={renderChildCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.childrenList}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={320}
        />
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/schedule")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <Calendar size={24} color={colors.card} />
            </View>
            <Text style={styles.actionText}>View Schedule</Text>
          </Pressable>
          
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/clinics")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
              <MapPin size={24} color={colors.card} />
            </View>
            <Text style={styles.actionText}>Find Clinic</Text>
          </Pressable>
          
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/education")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.accent }]}>
              <Bell size={24} color={colors.card} />
            </View>
            <Text style={styles.actionText}>Reminders</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function calculateAge(birthdate: string): string {
  const today = new Date();
  const birth = new Date(birthdate);
  
  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += today.getMonth();
  
  if (months < 1) {
    const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days old`;
  } else if (months < 24) {
    return `${months} months old`;
  } else {
    const years = Math.floor(months / 12);
    return `${years} years old`;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textLight,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.card,
  },
  notificationBadgeText: {
    color: colors.card,
    fontSize: 10,
    fontWeight: "700" as const,
  },
  childrenSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
  },
  childrenList: {
    paddingRight: 16,
  },
  childCard: {
    width: 300,
    marginRight: 16,
  },
  childHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  childInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  childPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  childPhotoPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  childPhotoPlaceholderText: {
    color: colors.card,
    fontSize: 20,
    fontWeight: "700" as const,
  },
  childName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  childAge: {
    fontSize: 14,
    color: colors.textLight,
  },
  viewDetailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  viewDetailsText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500" as const,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "right",
  },
  upcomingContainer: {
    marginBottom: 16,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 8,
  },
  vaccinationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  vaccinationStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  due: {
    backgroundColor: colors.info,
  },
  overdue: {
    backgroundColor: colors.error,
  },
  vaccinationName: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  vaccinationDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  noUpcomingText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: "italic" as const,
    marginBottom: 16,
  },
  appointmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  appointmentText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 8,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
  },
});