import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { ScreenFlatList } from "@/components/ScreenFlatList";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import {
  getScanHistory,
  deleteScanFromHistory,
  clearScanHistory,
  ScanResult,
} from "@/utils/storage";
import { getDiseaseInfo } from "@/utils/diseaseData";

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "History">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HistoryCardProps {
  scan: ScanResult;
  onDelete: (id: string) => void;
}

function HistoryCard({ scan, onDelete }: HistoryCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);
  const primaryColors = isDark ? Colors.dark : Colors.light;
  const diseaseInfo = getDiseaseInfo(scan.disease);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Delete this scan from history?")) {
        onDelete(scan.id);
      }
    } else {
      Alert.alert(
        "Delete Scan",
        "Are you sure you want to delete this scan from history?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDelete(scan.id),
          },
        ]
      );
    }
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.historyCard,
          { backgroundColor: theme.backgroundDefault },
          animatedStyle,
        ]}
      >
        <Image source={{ uri: scan.imageUri }} style={styles.thumbnail} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              {diseaseInfo.displayName}
            </ThemedText>
            <View
              style={[
                styles.severityDot,
                { backgroundColor: getSeverityColor(diseaseInfo.severity) },
              ]}
            />
          </View>
          <ThemedText
            type="small"
            style={{ color: primaryColors.primary, fontWeight: "500" }}
          >
            {scan.confidence}% confidence
          </ThemedText>
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, marginTop: 2 }}
          >
            {formatDate(scan.timestamp)}
          </ThemedText>
        </View>
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          hitSlop={8}
        >
          <Feather name="trash-2" size={18} color={primaryColors.error} />
        </Pressable>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { theme, isDark } = useTheme();
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const primaryColors = isDark ? Colors.dark : Colors.light;

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    setIsLoading(true);
    const data = await getScanHistory();
    setHistory(data);
    setIsLoading(false);
  };

  const handleDelete = async (scanId: string) => {
    await deleteScanFromHistory(scanId);
    setHistory((prev) => prev.filter((scan) => scan.id !== scanId));
  };

  const handleClearAll = () => {
    if (history.length === 0) return;

    if (Platform.OS === "web") {
      if (window.confirm("Clear all scan history? This cannot be undone.")) {
        clearScanHistory();
        setHistory([]);
      }
    } else {
      Alert.alert(
        "Clear All History",
        "Are you sure you want to delete all scan history? This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear All",
            style: "destructive",
            onPress: async () => {
              await clearScanHistory();
              setHistory([]);
            },
          },
        ]
      );
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        history.length > 0 ? (
          <Pressable
            onPress={handleClearAll}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            hitSlop={8}
          >
            <Feather name="trash" size={20} color={primaryColors.error} />
          </Pressable>
        ) : null,
    });
  }, [navigation, history.length, primaryColors.error]);

  const renderItem = ({ item }: { item: ScanResult }) => (
    <HistoryCard scan={item} onDelete={handleDelete} />
  );

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: primaryColors.primaryLight + "20" },
        ]}
      >
        <Feather name="clock" size={48} color={primaryColors.primary} />
      </View>
      <Spacer height={Spacing.lg} />
      <ThemedText type="h4" style={styles.emptyTitle}>
        No Scan History
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.emptyText, { color: theme.textSecondary }]}
      >
        Your diagnosed leaves will appear here. Start by scanning a leaf in the
        Diagnose tab.
      </ThemedText>
    </ThemedView>
  );

  return (
    <ScreenFlatList
      data={history}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Spacer height={Spacing.md} />}
      ListEmptyComponent={renderEmpty}
      refreshing={isLoading}
      onRefresh={loadHistory}
    />
  );
}

const styles = StyleSheet.create({
  historyCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.sm,
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing.xs,
  },
});
