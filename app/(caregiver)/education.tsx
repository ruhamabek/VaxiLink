import React, { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Play, Volume2 } from "lucide-react-native";
import { useLanguage } from "@/context/LanguageContext";
import { mockVaccines, vaccineEducationTopics } from "@/mocks/vaccines";
import Card from "@/components/Card";
import colors from "@/constants/colors";

export default function EducationScreen() {
  const { t } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const renderTopicItem = ({ item }: { item: typeof vaccineEducationTopics[0] }) => {
    const isSelected = selectedTopic === item.id;
    
    return (
      <Card
        variant={isSelected ? "elevated" : "outlined"}
        style={[
          styles.topicCard,
          isSelected && styles.selectedTopicCard,
        ]}
      >
        <Pressable
          onPress={() => setSelectedTopic(isSelected ? null : item.id)}
          style={styles.topicCardContent}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.topicImage} />
          
          <View style={styles.topicContent}>
            <Text style={styles.topicTitle}>{item.title}</Text>
            <Text
              style={styles.topicDescription}
              numberOfLines={isSelected ? undefined : 2}
            >
              {item.description}
            </Text>
            
            {isSelected && (
              <Pressable
                onPress={() => setPlayingAudio(playingAudio === item.id ? null : item.id)}
                style={[
                  styles.audioButton,
                  playingAudio === item.id && styles.audioButtonPlaying,
                ]}
              >
                {playingAudio === item.id ? (
                  <>
                    <Volume2 size={16} color={colors.card} />
                    <Text style={styles.audioButtonText}>Playing Audio...</Text>
                  </>
                ) : (
                  <>
                    <Play size={16} color={colors.primary} />
                    <Text style={styles.audioButtonText}>Play Audio</Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </Pressable>
      </Card>
    );
  };

  const renderVaccineItem = ({ item }: { item: typeof mockVaccines[0] }) => (
    <Card variant="outlined" style={styles.vaccineCard}>
      <View style={styles.vaccineHeader}>
        <Text style={styles.vaccineName}>{item.name}</Text>
        <Text style={styles.vaccineAge}>{item.ageAdministered}</Text>
      </View>
      
      <Text style={styles.vaccineDescription} numberOfLines={3}>
        {item.description}
      </Text>
      
      <View style={styles.protectionContainer}>
        <Text style={styles.protectionTitle}>Protects Against:</Text>
        <View style={styles.protectionList}>
          {item.protectsAgainst.map((disease, index) => (
            <View key={index} style={styles.protectionBadge}>
              <Text style={styles.protectionText}>{disease}</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vaccine Education</Text>
        <Text style={styles.sectionDescription}>
          Learn about vaccines and common myths
        </Text>
        
        <FlatList
          data={vaccineEducationTopics}
          renderItem={renderTopicItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.topicsList}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vaccine Information</Text>
        <Text style={styles.sectionDescription}>
          Details about each vaccine in the immunization schedule
        </Text>
        
        <FlatList
          data={mockVaccines}
          renderItem={renderVaccineItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vaccinesList}
          snapToAlignment="start"
          decelerationRate="fast"
          snapToInterval={280}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  topicsList: {
    paddingBottom: 16,
  },
  topicCard: {
    marginBottom: 16,
  },
  selectedTopicCard: {
    borderColor: colors.primary,
  },
  topicCardContent: {
    flexDirection: "row",
  },
  topicImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 8,
  },
  topicDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 12,
  },
  audioButtonPlaying: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  audioButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  vaccinesList: {
    paddingRight: 16,
  },
  vaccineCard: {
    width: 260,
    marginRight: 16,
  },
  vaccineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: colors.text,
  },
  vaccineAge: {
    fontSize: 12,
    color: colors.textLight,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vaccineDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  protectionContainer: {
    marginTop: 8,
  },
  protectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 8,
  },
  protectionList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  protectionBadge: {
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
});