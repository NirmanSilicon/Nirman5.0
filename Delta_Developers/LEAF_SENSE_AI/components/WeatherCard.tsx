import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { WeatherData } from "@/utils/storage";
import { formatTemperature } from "@/utils/weatherService";
import { t } from "@/utils/i18n";

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading?: boolean;
  compact?: boolean;
}

export function WeatherCard({ weather, isLoading, compact }: WeatherCardProps) {
  const { theme, isDark } = useTheme();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  const getWeatherIcon = (condition: string): keyof typeof Feather.glyphMap => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "sun";
      case "partly cloudy":
        return "cloud";
      case "foggy":
        return "cloud";
      case "drizzle":
      case "rain":
        return "cloud-rain";
      case "snow":
        return "cloud-snow";
      case "thunderstorm":
        return "cloud-lightning";
      default:
        return "cloud";
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          compact && styles.compactContainer,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ActivityIndicator color={primaryColors.primary} />
        <Spacer height={Spacing.sm} />
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {t("common.loading")}
        </ThemedText>
      </View>
    );
  }

  if (!weather) {
    return (
      <View
        style={[
          styles.container,
          compact && styles.compactContainer,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <Feather name="cloud-off" size={24} color={theme.textSecondary} />
        <Spacer height={Spacing.sm} />
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {t("weather.noData")}
        </ThemedText>
      </View>
    );
  }

  if (compact) {
    return (
      <View
        style={[
          styles.compactContainer,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.compactRow}>
          <Feather
            name={getWeatherIcon(weather.condition)}
            size={20}
            color={primaryColors.primary}
          />
          <ThemedText type="body" style={styles.compactTemp}>
            {formatTemperature(weather.temperature)}
          </ThemedText>
          <View style={styles.compactDivider} />
          <Feather name="droplet" size={16} color={primaryColors.info} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {weather.humidity}%
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: primaryColors.primaryLight + "20" },
          ]}
        >
          <Feather
            name={getWeatherIcon(weather.condition)}
            size={28}
            color={primaryColors.primary}
          />
        </View>
        <View style={styles.headerInfo}>
          <ThemedText type="h3">
            {formatTemperature(weather.temperature)}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {weather.condition}
          </ThemedText>
        </View>
      </View>

      <Spacer height={Spacing.lg} />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <View style={styles.statHeader}>
            <Feather name="droplet" size={16} color={primaryColors.info} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {t("weather.humidity")}
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {weather.humidity}%
          </ThemedText>
        </View>

        <View style={styles.stat}>
          <View style={styles.statHeader}>
            <Feather name="thermometer" size={16} color={primaryColors.warning} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {t("weather.temperature")}
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {formatTemperature(weather.temperature)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  compactContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    marginLeft: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  compactTemp: {
    fontWeight: "600",
  },
  compactDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#ccc",
    marginHorizontal: Spacing.xs,
  },
});
