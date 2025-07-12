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
import { AlertCircle, Calendar, CheckCircle, Clock, RefreshCw, Users } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { mockHEWChildren } from "@/mocks/children";
import { mockHomeVisits } from "@/mocks/hew";
import Button from "@/components/Button";
import Card from "@/components/Card";
import colors from "@/constants/colors";

export default function HEWHomeScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");

  const defaulters = mockHEWChildren.filter((child) => 
    child.vaccinations.some((v) => v.status === "overdue")
  );

  const upcomingVisits = mockHomeVisits
    .filter((visit) => visit.status === "scheduled")
    .slice(0, 3);

  const handleSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("synced");
    }, 2000);
  };

  const renderDefaulterItem = ({ item }: { item: typeof mockHEWChildren[0] }) => (
    <Card variant="outlined" style={styles.defaulterCard}>
      <View style={styles.defaulterHeader}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.childPhoto} />
        ) : (
          <View style={[styles.childPhoto, styles.childPhotoPlaceholder]}>
            <Text style={styles.childPhotoPlaceholderText}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
        
        <View style={styles.defaulterInfo}>
          <Text style={styles.defaulterName}>{item.name}</Text>
          <Text style={styles.defaulterAge}>{calculateAge(item.birthdate)}</Text>
        </View>
        
        <View style={styles.defaulterStatus}>
          <AlertCircle size={16} color={colors.error} />
          <Text style={styles.defaulterStatusText}>Overdue</Text>
        </View>
      </View>
      
      <View style={styles.defaulterVaccines}>
        {item.vaccinations
          .filter((v) => v.status === "overdue")
          .map((vaccine) => (
            <View key={vaccine.id} style={styles.vaccineItem}>
              <Text style={styles.vaccineName}>{vaccine.name}</Text>
              <Text style={styles.vaccineDate}>
                Due: {formatDate(vaccine.scheduledDate)}
              </Text>
            </View>
          ))}
      </View>
      
      <View style={styles.defaulterActions}>
        <Button
          title={t("hew.schedule")}
          onPress={() => router.push("/visits")}
          variant="outline"
          size="small"
          icon={<Calendar size={16} color={colors.primary} />}
          style={styles.defaulterActionButton}
        />
        
        <Button
          title={t("hew.record")}
          onPress={() => {
            // Navigate to record vaccination
          }}
          variant="outline"
          size="small"
          icon={<CheckCircle size={16} color={colors.primary} />}
          style={styles.defaulterActionButton}
        />
      </View>
    </Card>
  );

  const renderVisitItem = ({ item }: { item: typeof upcomingVisits[0] }) => {
    const child = mockHEWChildren.find((c) => c.id === item.childId);
    
    return (
      <Card variant="outlined" style={styles.visitCard}>
        <View style={styles.visitHeader}>
          <View style={styles.visitInfo}>
            <Text style={styles.visitChildName}>{child?.name}</Text>
            <Text style={styles.visitDate}>
              {formatDate(item.scheduledDate)}
            </Text>
          </View>
          
          <View style={styles.visitStatus}>
            <Clock size={16} color={colors.info} />
            <Text style={styles.visitStatusText}>Scheduled</Text>
          </View>
        </View>
        
        {item.notes && (
          <Text style={styles.visitNotes}>{item.notes}</Text>
        )}
        
        <View style={styles.visitActions}>
          <Button
            title="Complete Visit"
            onPress={() => {
              // Mark visit as completed
            }}
            variant="outline"
            size="small"
            icon={<CheckCircle size={16} color={colors.primary} />}
            style={styles.visitActionButton}
          />
          
          <Button
            title="Reschedule"
            onPress={() => {
              // Reschedule visit
            }}
            variant="outline"
            size="small"
            icon={<Calendar size={16} color={colors.primary} />}
            style={styles.visitActionButton}
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
            Health Extension Worker Dashboard
          </Text>
        </View>
        
        <Pressable
          onPress={handleSync}
          style={({ pressed }) => [
            styles.syncButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <RefreshCw
            size={24}
            color={
              syncStatus === "synced"
                ? colors.success
                : syncStatus === "syncing"
                ? colors.info
                : colors.warning
            }
            style={syncStatus === "syncing" ? styles.syncingIcon : undefined}
          />
          <View style={styles.syncStatus}>
            <View
              style={[
                styles.syncStatusDot,
                {
                  backgroundColor:
                    syncStatus === "synced"
                      ? colors.success
                      : syncStatus === "syncing"
                      ? colors.info
                      : colors.warning,
                },
              ]}
            />
            <Text style={styles.syncStatusText}>
              {syncStatus === "synced"
                ? "Synced"
                : syncStatus === "syncing"
                ? "Syncing..."
                : "Offline"}
            </Text>
          </View>
        </Pressable>
      </View>
      
      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <Users size={24} color={colors.hew} />
          <Text style={styles.statValue}>{mockHEWChildren.length}</Text>
          <Text style={styles.statLabel}>Children</Text>
        </Card>
        
        <Card variant="elevated" style={styles.statCard}>
          <AlertCircle size={24} color={colors.error} />
          <Text style={styles.statValue}>{defaulters.length}</Text>
          <Text style={styles.statLabel}>Defaulters</Text>
        </Card>
        
        <Card variant="elevated" style={styles.statCard}>
          <Calendar size={24} color={colors.info} />
          <Text style={styles.statValue}>{upcomingVisits.length}</Text>
          <Text style={styles.statLabel}>Visits</Text>
        </Card>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("hew.defaulters")}</Text>
          <Button
            title="View All"
            onPress={() => router.push("/defaulters")}
            variant="text"
            size="small"
          />
        </View>
        
        {defaulters.length > 0 ? (
          <FlatList
            data={defaulters.slice(0, 3)}
            renderItem={renderDefaulterItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No defaulters at this time.</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Home Visits</Text>
          <Button
            title="View All"
            onPress={() => router.push("/visits")}
            variant="text"
            size="small"
          />
        </View>
        
        {upcomingVisits.length > 0 ? (
          <FlatList
            data={upcomingVisits}
            renderItem={renderVisitItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>No upcoming visits scheduled.</Text>
        )}
      </View>
      
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              // Navigate to register child
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.hew }]}>
              <Users size={24} color={colors.card} />
            </View>
            <Text style={styles.actionText}>{t("hew.register")}</Text>
          </Pressable>
          
          <Pressable
            style={styles.actionButton}
            onPress={() => router.push("/visits")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
              <Calendar size={24} color={colors.card} />
            </View>
            <Text style={styles.actionText}>{t("hew.schedule")}</Text>
          </Pressable>
          
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              // Navigate to record vaccination
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
              <CheckCircle size={24} color={colors.card} />
            </View>
            <Text style={styles.actionText}>{t("hew.record")}</Text>
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
  syncButton: {
    alignItems: "center",
  },
  syncingIcon: {
    animation: "spin 1s linear infinite",
  },
  syncStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  syncStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  syncStatusText: {
    fontSize: 12,
    color: colors.textLight,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  section: {
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
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    fontStyle: "italic" as const,
    textAlign: "center",
    marginTop: 16,
  },
  defaulterCard: {
    marginBottom: 16,
  },
  defaulterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  childPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  childPhotoPlaceholder: {
    backgroundColor: colors.hew,
    justifyContent: "center",
    alignItems: "center",
  },
  childPhotoPlaceholderText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "700" as const,
  },
  defaulterInfo: {
    flex: 1,
  },
  defaulterName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  defaulterAge: {
    fontSize: 14,
    color: colors.textLight,
  },
  defaulterStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaulterStatusText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 4,
    fontWeight: "500" as const,
  },
  defaulterVaccines: {
    marginBottom: 12,
  },
  vaccineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vaccineName: {
    fontSize: 14,
    color: colors.text,
  },
  vaccineDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  defaulterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  defaulterActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  visitCard: {
    marginBottom: 16,
  },
  visitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  visitInfo: {
    flex: 1,
  },
  visitChildName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  visitDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  visitStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visitStatusText: {
    fontSize: 12,
    color: colors.info,
    marginLeft: 4,
    fontWeight: "500" as const,
  },
  visitNotes: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  visitActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  visitActionButton: {
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