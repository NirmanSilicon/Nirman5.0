import React, { useState, useEffect } from "react";
import { StyleSheet, View, Platform, Pressable } from "react-native";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { WeatherCard } from "@/components/WeatherCard";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { WeatherData } from "@/utils/storage";
import { fetchWeatherData, getWeatherBasedTips } from "@/utils/weatherService";
import { t } from "@/utils/i18n";

interface WeatherTipsCardProps {
  disease?: string;
}

export function WeatherTipsCard({ disease }: WeatherTipsCardProps) {
  const { theme, isDark } = useTheme();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    loadWeatherData();
  }, [locationPermission?.granted]);

  const loadWeatherData = async () => {
    setIsLoading(true);

    try {
      if (!locationPermission?.granted) {
        const permission = await requestLocationPermission();
        if (!permission.granted) {
          setIsLoading(false);
          return;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const weatherData = await fetchWeatherData(
        location.coords.latitude,
        location.coords.longitude
      );

      setWeather(weatherData);
    } catch (error) {
      console.error("Error loading weather:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tips = getWeatherBasedTips(weather, disease);

  if (!locationPermission?.granted && !isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.header}>
          <Feather name="map-pin" size={20} color={primaryColors.primary} />
          <ThemedText type="body" style={styles.headerText}>
            {t("weather.tips")}
          </ThemedText>
        </View>
        <Spacer height={Spacing.md} />
        <ThemedText
          type="small"
          style={[styles.permissionText, { color: theme.textSecondary }]}
        >
          Enable location access to get weather-based farming tips
        </ThemedText>
        <Spacer height={Spacing.md} />
        <Pressable
          onPress={requestLocationPermission}
          style={({ pressed }) => [
            styles.enableButton,
            { backgroundColor: primaryColors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText type="body" style={styles.enableButtonText}>
            Enable Location
          </ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundDefault }]}
    >
      <View style={styles.header}>
        <Feather name="cloud" size={20} color={primaryColors.primary} />
        <ThemedText type="body" style={styles.headerText}>
          {t("weather.tips")}
        </ThemedText>
        <Pressable
          onPress={loadWeatherData}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          hitSlop={8}
        >
          <Feather name="refresh-cw" size={16} color={theme.textSecondary} />
        </Pressable>
      </View>

      <Spacer height={Spacing.md} />

      <WeatherCard weather={weather} isLoading={isLoading} compact />

      <Spacer height={Spacing.lg} />

      <View style={styles.tipsContainer}>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <View
              style={[
                styles.tipBullet,
                { backgroundColor: primaryColors.primaryLight },
              ]}
            />
            <ThemedText
              type="small"
              style={[styles.tipText, { color: theme.textSecondary }]}
            >
              {tip}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerText: {
    flex: 1,
    fontWeight: "600",
  },
  tipsContainer: {
    gap: Spacing.sm,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  tipText: {
    flex: 1,
    lineHeight: 20,
  },
  permissionText: {
    textAlign: "center",
  },
  enableButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  enableButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
