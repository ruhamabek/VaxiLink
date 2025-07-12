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
import { Calendar, Check, Clock } from "lucide-react-native";
import { useLanguage } from "@/context/LanguageContext";
import { mockChildren } from "@/mocks/children";
import { mockVaccines } from "@/mocks/vaccines";
import Card from "@/components/Card";
import colors from "@/constants/colors";

export default function ScheduleScreen() {
  const { t } = useLanguage();
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [selectedVaccine, setSelectedVaccine] = useState<string | null>(null);

  const sortedVaccinations = [...selectedChild.vaccinations].sort((a, b) => {
    const dateA = new Date(a.scheduledDate);
    const dateB = new Date(b.scheduledDate);
    return dateA.getTime() - dateB.getTime();
  });

  const getVaccineInfo = (name: string) => {
    return mockVaccines.find((v) => v.name === name);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "due":
        return colors.info;
      case "overdue":
        return colors.error;
      case "upcoming":
        return colors.textLight;
      default:
        return colors.textLight;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "due":
        return "Due Now";
      case "overdue":
        return "Overdue";
      case "upcoming":
        return "Upcoming";
      default:
        return status;
    }
  };

  const renderChildItem = ({ item }: { item: typeof mockChildren[0] }) => (
    <Pressable
      style={[
        styles.childItem,
        selectedChild.id === item.id && styles.selectedChildItem,
      ]}
      onPress={() => setSelectedChild(item)}
    >
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.childPhoto} />
      ) : (
        <View style={[styles.childPhoto, styles.childPhotoPlaceholder]}>
          <Text style={styles.childPhotoPlaceholderText}>
            {item.name.charAt(0)}
          </Text>
        </View>
      )}
      <Text
        style={[
          styles.childName,
          selectedChild.id === item.id && styles.selectedChildName,
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </Pressable>
  );

  const renderTimelineItem = ({ item }: { item: typeof sortedVaccinations[0] }) => {
    const isSelected = selectedVaccine === item.id;
    const statusColor = getStatusColor(item.status);
    const vaccineInfo = getVaccineInfo(item.name);

    return (
      <Pressable
        style={[styles.timelineItem, isSelected && styles.selectedTimelineItem]}
        onPress={() => setSelectedVaccine(isSelected ? null : item.id)}
      >
        <View style={styles.timelineLeft}>
          <View style={[styles.timelineDot, { backgroundColor: statusColor }]}>
            {item.status === "completed" && (
              <Check size={12} color={colors.card} />
            )}
          </View>
          {!isSelected && <View style={styles.timelineLine} />}
        </View>

        <View style={styles.timelineContent}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>

          <View style={styles.timelineDate}>
            <Calendar size={14} color={colors.textLight} />
            <Text style={styles.timelineDateText}>
              {formatDate(item.scheduledDate)}
            </Text>
          </View>

          {item.administeredDate && (
            <View style={styles.timelineDate}>
              <Check size={14} color={colors.success} />
              <Text style={styles.timelineDateText}>
                Administered on {formatDate(item.administeredDate)}
              </Text>
            </View>
          )}

          {isSelected && vaccineInfo && (
            <View style={styles.vaccineDetails}>
              <Text style={styles.vaccineDescription}>
                {vaccineInfo.description}
              </Text>
              
              <View style={styles.vaccineInfoRow}>
                <View style={styles.vaccineInfoItem}>
                  <Text style={styles.vaccineInfoLabel}>Age:</Text>
                  <Text style={styles.vaccineInfoValue}>
                    {vaccineInfo.ageAdministered}
                  </Text>
                </View>
                
                <View style={styles.vaccineInfoItem}>
                  <Text style={styles.vaccineInfoLabel}>Doses:</Text>
                  <Text style={styles.vaccineInfoValue}>
                    {vaccineInfo.doses}
                  </Text>
                </View>
              </View>

              <Text style={styles.vaccineInfoLabel}>Protects Against:</Text>
              <View style={styles.protectionList}>
                {vaccineInfo.protectsAgainst.map((disease, index) => (
                  <View key={index} style={styles.protectionItem}>
                    <Text style={styles.protectionText}>{disease}</Text>
                  </View>
                ))}
              </View>

              {item.location && (
                <View style={styles.locationContainer}>
                  <Text style={styles.locationLabel}>Location:</Text>
                  <Text style={styles.locationValue}>{item.location}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.childrenContainer}>
        <FlatList
          data={mockChildren}
          renderItem={renderChildItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.childrenList}
        />
      </View>

      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>
            {t("caregiver.schedule")} - {selectedChild.name}
          </Text>
          {selectedChild.nextAppointment && (
            <View style={styles.nextAppointment}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.nextAppointmentText}>
                {t("caregiver.nextAppointment")}: {formatDate(selectedChild.nextAppointment)}
              </Text>
            </View>
          )}
        </View>

        <Card variant="outlined" style={styles.progressCard}>
          <Text style={styles.progressTitle}>Vaccination Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(selectedChild.vaccinations.filter(v => v.status === "completed").length / 
                      selectedChild.vaccinations.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0%</Text>
              <Text style={styles.progressLabel}>100%</Text>
            </View>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <View style={[styles.statDot, { backgroundColor: colors.success }]} />
              <Text style={styles.statText}>
                {selectedChild.vaccinations.filter(v => v.status === "completed").length} Completed
              </Text>
            </View>
            <View style={styles.progressStat}>
              <View style={[styles.statDot, { backgroundColor: colors.info }]} />
              <Text style={styles.statText}>
                {selectedChild.vaccinations.filter(v => v.status === "due").length} Due
              </Text>
            </View>
            <View style={styles.progressStat}>
              <View style={[styles.statDot, { backgroundColor: colors.error }]} />
              <Text style={styles.statText}>
                {selectedChild.vaccinations.filter(v => v.status === "overdue").length} Overdue
              </Text>
            </View>
            <View style={styles.progressStat}>
              <View style={[styles.statDot, { backgroundColor: colors.textLight }]} />
              <Text style={styles.statText}>
                {selectedChild.vaccinations.filter(v => v.status === "upcoming").length} Upcoming
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.timelineTitle}>Vaccination Timeline</Text>
        <FlatList
          data={sortedVaccinations}
          renderItem={renderTimelineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.timelineList}
        />
      </View>
    </View>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  childrenContainer: {
    backgroundColor: colors.card,
    paddingVertical: 12,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  childrenList: {
    paddingHorizontal: 16,
  },
  childItem: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  selectedChildItem: {
    opacity: 1,
  },
  childPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  childPhotoPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  childPhotoPlaceholderText: {
    color: colors.card,
    fontSize: 24,
    fontWeight: "700" as const,
  },
  childName: {
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
  },
  selectedChildName: {
    fontWeight: "600" as const,
    color: colors.primary,
  },
  scheduleContainer: {
    flex: 1,
    padding: 16,
  },
  scheduleHeader: {
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
  },
  nextAppointment: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextAppointmentText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: "500" as const,
  },
  progressCard: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  progressStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  progressStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statText: {
    fontSize: 12,
    color: colors.text,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 16,
  },
  timelineList: {
    paddingBottom: 24,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  selectedTimelineItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: -12,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineLeft: {
    alignItems: "center",
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.card,
    fontWeight: "500" as const,
  },
  timelineDate: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timelineDateText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 6,
  },
  vaccineDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  vaccineDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  vaccineInfoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  vaccineInfoItem: {
    marginRight: 24,
  },
  vaccineInfoLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 6,
  },
  vaccineInfoValue: {
    fontSize: 14,
    color: colors.textLight,
  },
  protectionList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    marginBottom: 12,
  },
  protectionItem: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  protectionText: {
    fontSize: 12,
    color: colors.text,
  },
  locationContainer: {
    marginTop: 8,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    color: colors.textLight,
  },
});