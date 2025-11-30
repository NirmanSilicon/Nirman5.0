import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { DISEASES, DiseaseInfo } from "@/utils/diseaseData";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DiseaseCardProps {
  disease: DiseaseInfo;
}

function DiseaseCard({ disease }: DiseaseCardProps) {
  const { theme, isDark } = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const scale = useSharedValue(1);
  const primaryColors = isDark ? Colors.dark : Colors.light;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return primaryColors.success;
      case "medium":
        return primaryColors.warning;
      case "high":
        return primaryColors.error;
    }
  };

  return (
    <AnimatedPressable
      onPress={() => setExpanded(!expanded)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.diseaseCard,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <ThemedText type="h4">{disease.displayName}</ThemedText>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(disease.severity) + "20" },
            ]}
          >
            <ThemedText
              type="small"
              style={{
                color: getSeverityColor(disease.severity),
                fontWeight: "600",
              }}
            >
              {disease.severity.toUpperCase()}
            </ThemedText>
          </View>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </View>

      <ThemedText
        type="small"
        style={[styles.description, { color: theme.textSecondary }]}
      >
        {disease.description}
      </ThemedText>

      {expanded ? (
        <View style={styles.expandedContent}>
          {disease.symptoms.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather
                  name="alert-circle"
                  size={16}
                  color={primaryColors.warning}
                />
                <ThemedText type="body" style={styles.sectionTitle}>
                  Symptoms
                </ThemedText>
              </View>
              {disease.symptoms.map((symptom, index) => (
                <View key={index} style={styles.listItem}>
                  <View
                    style={[
                      styles.bullet,
                      { backgroundColor: primaryColors.warning },
                    ]}
                  />
                  <ThemedText type="small" style={styles.listText}>
                    {symptom}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {disease.treatments.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather
                  name="check-circle"
                  size={16}
                  color={primaryColors.success}
                />
                <ThemedText type="body" style={styles.sectionTitle}>
                  Treatments
                </ThemedText>
              </View>
              {disease.treatments.map((treatment, index) => (
                <View key={index} style={styles.listItem}>
                  <View
                    style={[
                      styles.bullet,
                      { backgroundColor: primaryColors.success },
                    ]}
                  />
                  <ThemedText type="small" style={styles.listText}>
                    {treatment}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {disease.prevention.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather
                  name="shield"
                  size={16}
                  color={primaryColors.primary}
                />
                <ThemedText type="body" style={styles.sectionTitle}>
                  Prevention
                </ThemedText>
              </View>
              {disease.prevention.map((tip, index) => (
                <View key={index} style={styles.listItem}>
                  <View
                    style={[
                      styles.bullet,
                      { backgroundColor: primaryColors.primary },
                    ]}
                  />
                  <ThemedText type="small" style={styles.listText}>
                    {tip}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

export default function CommonDiseasesScreen() {
  const diseases = Object.values(DISEASES);

  return (
    <ScreenScrollView>
      <ThemedText type="body" style={styles.intro}>
        Learn about common plant diseases that LeafSense AI can detect. Tap any
        card to see symptoms, treatments, and prevention tips.
      </ThemedText>

      <Spacer height={Spacing.xl} />

      {diseases.map((disease, index) => (
        <React.Fragment key={disease.name}>
          <DiseaseCard disease={disease} />
          {index < diseases.length - 1 ? (
            <Spacer height={Spacing.md} />
          ) : null}
        </React.Fragment>
      ))}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  intro: {
    opacity: 0.8,
  },
  diseaseCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
    flexWrap: "wrap",
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  description: {
    marginTop: Spacing.sm,
  },
  expandedContent: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: Spacing.sm,
  },
  listText: {
    flex: 1,
  },
});
