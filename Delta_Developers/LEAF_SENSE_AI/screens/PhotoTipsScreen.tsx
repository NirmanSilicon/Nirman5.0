import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface TipCardProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  tipNumber: number;
}

function TipCard({ icon, title, description, tipNumber }: TipCardProps) {
  const { theme, isDark } = useTheme();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[styles.tipCard, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={styles.tipHeader}>
        <View
          style={[
            styles.tipNumber,
            { backgroundColor: primaryColors.primary },
          ]}
        >
          <ThemedText type="body" style={styles.tipNumberText}>
            {tipNumber}
          </ThemedText>
        </View>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: primaryColors.primaryLight + "20" },
          ]}
        >
          <Feather name={icon} size={24} color={primaryColors.primary} />
        </View>
      </View>
      <ThemedText type="h4" style={styles.tipTitle}>
        {title}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.tipDescription, { color: theme.textSecondary }]}
      >
        {description}
      </ThemedText>
    </View>
  );
}

const tips = [
  {
    icon: "sun" as const,
    title: "Use Natural Light",
    description:
      "Take photos in natural daylight, preferably on a cloudy day or in shade to avoid harsh shadows. Avoid using flash as it can wash out important details.",
  },
  {
    icon: "maximize" as const,
    title: "Fill the Frame",
    description:
      "Position the camera so the leaf fills most of the frame. This helps the AI see details clearly. Leave a small border around the leaf.",
  },
  {
    icon: "target" as const,
    title: "Focus on Affected Areas",
    description:
      "If you can see spots, discoloration, or damage, make sure these areas are visible and in focus. The AI needs to see the symptoms clearly.",
  },
  {
    icon: "layers" as const,
    title: "Use a Plain Background",
    description:
      "Place the leaf on a plain, contrasting background like white paper or a solid-colored surface. This helps the AI isolate the leaf.",
  },
  {
    icon: "camera" as const,
    title: "Keep Camera Steady",
    description:
      "Hold your phone steady to avoid blurry images. Rest your elbows on a surface or use both hands to stabilize the camera.",
  },
  {
    icon: "image" as const,
    title: "Take Multiple Photos",
    description:
      "If you are not sure about the quality, take several photos from different angles. Choose the clearest one for analysis.",
  },
];

export default function PhotoTipsScreen() {
  const { theme, isDark } = useTheme();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  return (
    <ScreenScrollView>
      <View
        style={[
          styles.introCard,
          { backgroundColor: primaryColors.primaryLight + "15" },
        ]}
      >
        <Feather name="info" size={24} color={primaryColors.primary} />
        <View style={styles.introContent}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            Better Photos = Better Results
          </ThemedText>
          <ThemedText
            type="small"
            style={[{ color: theme.textSecondary, marginTop: 4 }]}
          >
            Follow these tips to get the most accurate disease detection from
            LeafSense AI.
          </ThemedText>
        </View>
      </View>

      <Spacer height={Spacing.xl} />

      {tips.map((tip, index) => (
        <React.Fragment key={index}>
          <TipCard
            icon={tip.icon}
            title={tip.title}
            description={tip.description}
            tipNumber={index + 1}
          />
          {index < tips.length - 1 ? <Spacer height={Spacing.md} /> : null}
        </React.Fragment>
      ))}

      <Spacer height={Spacing.xl} />

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ThemedText type="h4" style={styles.summaryTitle}>
          Quick Checklist
        </ThemedText>
        <Spacer height={Spacing.md} />
        {[
          "Good lighting (natural, no flash)",
          "Leaf fills most of the frame",
          "Affected areas are visible",
          "Plain background",
          "Image is sharp and clear",
        ].map((item, index) => (
          <View key={index} style={styles.checklistItem}>
            <Feather
              name="check-circle"
              size={18}
              color={primaryColors.success}
            />
            <ThemedText type="small" style={styles.checklistText}>
              {item}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  introCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  introContent: {
    flex: 1,
  },
  tipCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tipNumberText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: {
    marginBottom: Spacing.xs,
  },
  tipDescription: {},
  summaryCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  summaryTitle: {
    marginBottom: Spacing.xs,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  checklistText: {},
});
