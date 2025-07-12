import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import { mockClinics } from "@/mocks/clinics";
import { mockFeedback } from "@/mocks/feedback";
import { Feedback } from "@/types/child";
import Button from "@/components/Button";
import Card from "@/components/Card";
import colors from "@/constants/colors";

type FeedbackType = "clinic-issue" | "vaccine-unavailable" | "service-quality" | "app-feedback" | "other";

export default function FeedbackScreen() {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(mockFeedback);

  const handleSubmit = () => {
    if (!feedbackType) {
      Alert.alert("Error", "Please select a feedback type");
      return;
    }
    
    if ((feedbackType === "clinic-issue" || feedbackType === "vaccine-unavailable") && !selectedClinic) {
      Alert.alert("Error", "Please select a clinic");
      return;
    }
    
    if (!description.trim()) {
      Alert.alert("Error", "Please provide a description");
      return;
    }
    
    const newFeedback: Feedback = {
      id: `f${submittedFeedback.length + 1}`,
      userId: "c1",
      type: feedbackType,
      clinicId: selectedClinic || undefined,
      description: description.trim(),
      timestamp: new Date().toISOString(),
      status: "submitted",
    };
    
    setSubmittedFeedback([newFeedback, ...submittedFeedback]);
    setFeedbackType(null);
    setSelectedClinic(null);
    setDescription("");
    
    Alert.alert(
      "Thank you!",
      "Your feedback has been sent to the health office.",
      [{ text: "OK" }]
    );
  };

  const getFeedbackTypeLabel = (type: FeedbackType): string => {
    switch (type) {
      case "clinic-issue":
        return "Clinic Issue";
      case "vaccine-unavailable":
        return "Vaccine Unavailable";
      case "service-quality":
        return "Service Quality";
      case "app-feedback":
        return "App Feedback";
      case "other":
        return "Other";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "in-review":
        return "In Review";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "submitted":
        return colors.info;
      case "in-review":
        return colors.warning;
      case "resolved":
        return colors.success;
      default:
        return colors.textLight;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Community Feedback</Text>
      <Text style={styles.description}>
        Help us improve our services by providing feedback on your experiences.
      </Text>
      
      <Card variant="outlined" style={styles.feedbackForm}>
        <Text style={styles.formTitle}>Submit New Feedback</Text>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Feedback Type</Text>
          <View style={styles.buttonGroup}>
            {["clinic-issue", "vaccine-unavailable", "service-quality", "app-feedback", "other"].map((type) => (
              <Button
                key={type}
                title={getFeedbackTypeLabel(type as FeedbackType)}
                onPress={() => setFeedbackType(type as FeedbackType)}
                variant={feedbackType === type ? "primary" : "outline"}
                size="small"
                style={styles.typeButton}
              />
            ))}
          </View>
        </View>
        
        {(feedbackType === "clinic-issue" || feedbackType === "vaccine-unavailable") && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Select Clinic</Text>
            <View style={styles.buttonGroup}>
              {mockClinics.map((clinic) => (
                <Button
                  key={clinic.id}
                  title={clinic.name}
                  onPress={() => setSelectedClinic(clinic.id)}
                  variant={selectedClinic === clinic.id ? "primary" : "outline"}
                  size="small"
                  style={styles.clinicButton}
                />
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Please describe your feedback in detail..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <Button
          title="Submit Feedback"
          onPress={handleSubmit}
          fullWidth
          style={styles.submitButton}
        />
      </Card>
      
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Your Previous Feedback</Text>
        
        {submittedFeedback.length > 0 ? (
          submittedFeedback.map((feedback) => (
            <Card key={feedback.id} variant="outlined" style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <Text style={styles.feedbackType}>
                  {getFeedbackTypeLabel(feedback.type as FeedbackType)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(feedback.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(feedback.status)}
                  </Text>
                </View>
              </View>
              
              {feedback.clinicId && (
                <Text style={styles.clinicName}>
                  {mockClinics.find((c) => c.id === feedback.clinicId)?.name}
                </Text>
              )}
              
              <Text style={styles.feedbackDescription}>{feedback.description}</Text>
              
              <Text style={styles.feedbackDate}>
                {new Date(feedback.timestamp).toLocaleDateString()}
              </Text>
            </Card>
          ))
        ) : (
          <Text style={styles.noFeedbackText}>
            You haven't submitted any feedback yet.
          </Text>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  feedbackForm: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: colors.text,
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  typeButton: {
    marginHorizontal: 4,
    marginBottom: 8,
  },
  clinicButton: {
    marginHorizontal: 4,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
  },
  submitButton: {
    marginTop: 8,
  },
  historySection: {
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: colors.text,
    marginBottom: 16,
  },
  feedbackCard: {
    marginBottom: 16,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  feedbackType: {
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
  clinicName: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  feedbackDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  feedbackDate: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "right",
  },
  noFeedbackText: {
    fontSize: 16,
    color: colors.textLight,
    fontStyle: "italic" as const,
    textAlign: "center",
    marginTop: 16,
  },
});