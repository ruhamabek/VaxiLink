import React, { useState } from "react";
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import { mockClinics } from "@/mocks/clinics";
import { Clinic } from "@/types/child";
import Card from "@/components/Card";
import Input from "@/components/Input";
import { Calendar, Clock, MapPin, Phone, Search, Shield } from "lucide-react-native";
import colors from "@/constants/colors";

export default function ClinicsScreen() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const regions = Array.from(new Set(mockClinics.map((clinic) => clinic.region)));

  const filteredClinics = mockClinics.filter((clinic) => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = !selectedRegion || clinic.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  const handlePhoneCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenMaps = (clinic: Clinic) => {
    const { latitude, longitude } = clinic.coordinates;
    const label = encodeURIComponent(clinic.name);
    
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderClinicItem = ({ item }: { item: Clinic }) => (
    <Card
      variant="outlined"
      style={[
        styles.clinicCard,
        selectedClinic?.id === item.id && styles.selectedClinicCard,
      ]}
    >
      <Pressable
        onPress={() => setSelectedClinic(selectedClinic?.id === item.id ? null : item)}
        style={styles.clinicCardContent}
      >
        <View style={styles.clinicHeader}>
          <Text style={styles.clinicName}>{item.name}</Text>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>2.5 km</Text>
          </View>
        </View>
        
        <View style={styles.clinicInfo}>
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.infoText}>{item.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={16} color={colors.textLight} />
            <Text style={styles.infoText}>
              {getTodayHours(item.openingHours)}
            </Text>
          </View>
        </View>
        
        {selectedClinic?.id === item.id && (
          <View style={styles.clinicDetails}>
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              {item.phone && (
                <Pressable
                  onPress={() => handlePhoneCall(item.phone || "")}
                  style={styles.contactButton}
                >
                  <Phone size={16} color={colors.primary} />
                  <Text style={styles.contactButtonText}>{item.phone}</Text>
                </Pressable>
              )}
              {item.email && (
                <Text style={styles.contactInfo}>{item.email}</Text>
              )}
            </View>
            
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Opening Hours</Text>
              {Object.entries(item.openingHours).map(([day, hours]) => (
                <View key={day} style={styles.hoursRow}>
                  <Text style={styles.dayText}>{capitalizeFirstLetter(day)}</Text>
                  <Text style={styles.hoursText}>{hours}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Available Vaccines</Text>
              <View style={styles.vaccinesList}>
                {item.vaccinesAvailable.map((vaccine) => (
                  <View key={vaccine} style={styles.vaccineBadge}>
                    <Shield size={12} color={colors.primary} />
                    <Text style={styles.vaccineText}>{vaccine}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => handleOpenMaps(item)}
                style={styles.actionButton}
              >
                <MapPin size={16} color={colors.card} />
                <Text style={styles.actionButtonText}>Directions</Text>
              </Pressable>
              
              <Pressable
                onPress={() => {/* Navigate to appointment booking */}}
                style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              >
                <Calendar size={16} color={colors.card} />
                <Text style={styles.actionButtonText}>Book Appointment</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
    </Card>
  );

  const renderRegionItem = ({ item }: { item: string }) => (
    <Pressable
      style={[
        styles.regionButton,
        selectedRegion === item && styles.selectedRegionButton,
      ]}
      onPress={() => setSelectedRegion(selectedRegion === item ? null : item)}
    >
      <Text
        style={[
          styles.regionButtonText,
          selectedRegion === item && styles.selectedRegionButtonText,
        ]}
      >
        {item}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder={t("common.search")}
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.textLight} />}
          style={styles.searchInput}
        />
      </View>
      
      <View style={styles.regionsContainer}>
        <FlatList
          data={regions}
          renderItem={renderRegionItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.regionsList}
        />
      </View>
      
      <FlatList
        data={filteredClinics}
        renderItem={renderClinicItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.clinicsList}
      />
    </View>
  );
}

function getTodayHours(openingHours: Record<string, string>): string {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = days[new Date().getDay()];
  return `Today: ${openingHours[today]}`;
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.card,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    backgroundColor: colors.background,
  },
  regionsContainer: {
    backgroundColor: colors.card,
    paddingBottom: 16,
  },
  regionsList: {
    paddingHorizontal: 16,
  },
  regionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  selectedRegionButton: {
    backgroundColor: colors.primary,
  },
  regionButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedRegionButtonText: {
    color: colors.card,
    fontWeight: "600" as const,
  },
  clinicsList: {
    padding: 16,
    paddingBottom: 32,
  },
  clinicCard: {
    marginBottom: 16,
  },
  selectedClinicCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  clinicCardContent: {
    width: "100%",
  },
  clinicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: colors.textLight,
  },
  clinicInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
    flex: 1,
  },
  clinicDetails: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 8,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
    width: 100,
  },
  hoursText: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  vaccinesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  vaccineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  vaccineText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.card,
    marginLeft: 8,
  },
});