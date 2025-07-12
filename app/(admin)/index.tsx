import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { AlertCircle, BarChart2, Map, Users } from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { mockDistricts } from "@/mocks/hew";
import Button from "@/components/Button";
import Card from "@/components/Card";
import colors from "@/constants/colors";

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Calculate summary statistics
  const totalChildren = mockDistricts.reduce((sum, district) => sum + district.totalChildren, 0);
  const totalZeroDose = mockDistricts.reduce((sum, district) => sum + district.zeroDoseCount, 0);
  const averageCoverage = mockDistricts.reduce((sum, district) => sum + district.coverageRate, 0) / mockDistricts.length;
  
  // Find districts with highest and lowest coverage
  const sortedByZeroDose = [...mockDistricts].sort((a, b) => b.zeroDoseCount - a.zeroDoseCount);
  const highestZeroDose = sortedByZeroDose.slice(0, 3);
  
  const sortedByCoverage = [...mockDistricts].sort((a, b) => a.coverageRate - b.coverageRate);
  const lowestCoverage = sortedByCoverage.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome, {user?.name.split(" ")[0]}
        </Text>
        <Text style={styles.subGreeting}>
          Health Administrator Dashboard
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <Users size={24} color={colors.admin} />
          <Text style={styles.statValue}>{totalChildren.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Children</Text>
        </Card>
        
        <Card variant="elevated" style={styles.statCard}>
          <AlertCircle size={24} color={colors.error} />
          <Text style={styles.statValue}>{totalZeroDose.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Zero-Dose</Text>
        </Card>
        
        <Card variant="elevated" style={styles.statCard}>
          <BarChart2 size={24} color={colors.success} />
          <Text style={styles.statValue}>{averageCoverage.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Avg. Coverage</Text>
        </Card>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Zero-Dose Hotspots</Text>
          <Button
            title="View Heatmap"
            onPress={() => router.push("/heatmap")}
            variant="text"
            size="small"
            icon={<Map size={16} color={colors.primary} />}
          />
        </View>
        
        {highestZeroDose.map((district) => (
          <Card key={district.id} variant="outlined" style={styles.districtCard}>
            <View style={styles.districtHeader}>
              <Text style={styles.districtName}>{district.name}</Text>
              <Text style={styles.districtRegion}>{district.region}</Text>
            </View>
            
            <View style={styles.districtStats}>
              <View style={styles.districtStat}>
                <Text style={styles.districtStatLabel}>Zero-Dose:</Text>
                <Text style={styles.districtStatValue}>
                  {district.zeroDoseCount}
                </Text>
              </View>
              
              <View style={styles.districtStat}>
                <Text style={styles.districtStatLabel}>Total Children:</Text>
                <Text style={styles.districtStatValue}>
                  {district.totalChildren}
                </Text>
              </View>
              
              <View style={styles.districtStat}>
                <Text style={styles.districtStatLabel}>Coverage Rate:</Text>
                <Text
                  style={[
                    styles.districtStatValue,
                    district.coverageRate < 97 ? styles.lowCoverage : styles.highCoverage,
                  ]}
                >
                  {district.coverageRate.toFixed(1)}%
                </Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${district.coverageRate}%`,
                      backgroundColor:
                        district.coverageRate < 97
                          ? colors.error
                          : district.coverageRate < 98
                          ? colors.warning
                          : colors.success,
                    },
                  ]}
                />
              </View>
            </View>
          </Card>
        ))}
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Low Coverage Districts</Text>
          <Button
            title="View Reports"
            onPress={() => router.push("/reports")}
            variant="text"
            size="small"
          />
        </View>
        
        {lowestCoverage.map((district) => (
          <Card key={district.id} variant="outlined" style={styles.districtCard}>
            <View style={styles.districtHeader}>
              <Text style={styles.districtName}>{district.name}</Text>
              <Text style={styles.districtRegion}>{district.region}</Text>
            </View>
            
            <View style={styles.districtStats}>
              <View style={styles.districtStat}>
                <Text style={styles.districtStatLabel}>Coverage Rate:</Text>
                <Text
                  style={[
                    styles.districtStatValue,
                    district.coverageRate < 97 ? styles.lowCoverage : styles.highCoverage,
                  ]}
                >
                  {district.coverageRate.toFixed(1)}%
                </Text>
              </View>
              
              <View style={styles.districtStat}>
                <Text style={styles.districtStatLabel}>Zero-Dose:</Text>
                <Text style={styles.districtStatValue}>
                  {district.zeroDoseCount}
                </Text>
              </View>
              
              <View style={styles.districtStat}>
                <Text style={styles.districtStatLabel}>Total Children:</Text>
                <Text style={styles.districtStatValue}>
                  {district.totalChildren}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${district.coverageRate}%`,
                      backgroundColor:
                        district.coverageRate < 97
                          ? colors.error
                          : district.coverageRate < 98
                          ? colors.warning
                          : colors.success,
                    },
                  ]}
                />
              </View>
            </View>
          </Card>
        ))}
      </View>
      
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <Button
            title="Export Reports"
            onPress={() => {
              // Export reports
            }}
            variant="outline"
            style={styles.actionButton}
          />
          
          <Button
            title="Manage Users"
            onPress={() => {
              // Navigate to user management
            }}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </View>
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
  header: {
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
  districtCard: {
    marginBottom: 16,
  },
  districtHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  districtName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  districtRegion: {
    fontSize: 14,
    color: colors.textLight,
  },
  districtStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  districtStat: {
    alignItems: "center",
  },
  districtStatLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  districtStatValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  lowCoverage: {
    color: colors.error,
  },
  highCoverage: {
    color: colors.success,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
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
    marginHorizontal: 4,
  },
});