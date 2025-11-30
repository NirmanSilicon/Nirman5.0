import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface FeatureCardProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const { theme, isDark } = useTheme();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.featureCard,
        { backgroundColor: theme.backgroundDefault },
      ]}
    >
      <View
        style={[
          styles.featureIcon,
          { backgroundColor: primaryColors.primaryLight + "20" },
        ]}
      >
        <Feather name={icon} size={24} color={primaryColors.primary} />
      </View>
      <Spacer height={Spacing.md} />
      <ThemedText type="body" style={styles.featureTitle}>
        {title}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.featureDescription, { color: theme.textSecondary }]}
      >
        {description}
      </ThemedText>
    </View>
  );
}

export default function CommunityScreen() {
  const { theme, isDark } = useTheme();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: primaryColors.primaryLight + "20" },
          ]}
        >
          <Feather name="users" size={48} color={primaryColors.primary} />
        </View>
        <Spacer height={Spacing.xl} />
        <ThemedText type="h2" style={styles.title}>
          Community
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          Connect with fellow farmers
        </ThemedText>
      </View>

      <Spacer height={Spacing["3xl"]} />

      <View
        style={[
          styles.comingSoonCard,
          { backgroundColor: primaryColors.warning + "15" },
        ]}
      >
        <Feather name="clock" size={24} color={primaryColors.warning} />
        <Spacer height={Spacing.md} />
        <ThemedText type="h4" style={styles.comingSoonTitle}>
          Coming Soon
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.comingSoonText, { color: theme.textSecondary }]}
        >
          We're building a community platform where farmers can share their
          experiences, treatments, and tips with each other.
        </ThemedText>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText type="h4" style={styles.sectionTitle}>
        Planned Features
      </ThemedText>
      <Spacer height={Spacing.lg} />

      <View style={styles.featuresGrid}>
        <FeatureCard
          icon="message-square"
          title="Discussion Forums"
          description="Ask questions and share knowledge with the farming community"
        />
        <FeatureCard
          icon="share-2"
          title="Share Diagnoses"
          description="Share your leaf scans and get advice from experienced farmers"
        />
        <FeatureCard
          icon="award"
          title="Expert Tips"
          description="Learn from agricultural experts and verified professionals"
        />
        <FeatureCard
          icon="map"
          title="Local Groups"
          description="Connect with farmers in your region for location-specific advice"
        />
      </View>

      <Spacer height={Spacing["3xl"]} />

      <View
        style={[
          styles.notifyCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ThemedText type="body" style={styles.notifyText}>
          Want to be notified when the community feature launches?
        </ThemedText>
        <Spacer height={Spacing.lg} />
        <Pressable
          style={({ pressed }) => [
            styles.notifyButton,
            { backgroundColor: primaryColors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="bell" size={18} color="#FFFFFF" />
          <ThemedText style={styles.notifyButtonText}>Notify Me</ThemedText>
        </Pressable>
        <Spacer height={Spacing.md} />
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, textAlign: "center" }}
        >
          This feature requires a backend server which is not yet available
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  comingSoonCard: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  comingSoonTitle: {
    textAlign: "center",
  },
  comingSoonText: {
    textAlign: "center",
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  sectionTitle: {
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  featureCard: {
    width: "48%",
    minWidth: 150,
    flexGrow: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontWeight: "600",
  },
  featureDescription: {
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  notifyCard: {
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  notifyText: {
    textAlign: "center",
    fontWeight: "500",
  },
  notifyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  notifyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
