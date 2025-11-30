import React, { useState, useCallback } from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import { MainTabParamList } from "@/navigation/MainTabNavigator";
import { getLastScan, getFarmerName, getScanHistory, ScanResult } from "@/utils/storage";
import { getDiseaseInfo } from "@/utils/diseaseData";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, "Home">,
  BottomTabNavigationProp<MainTabParamList>
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  isPrimary?: boolean;
}

function ActionCard({ title, subtitle, icon, onPress, isPrimary = false }: ActionCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const primaryColors = isDark ? Colors.dark : Colors.light;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.actionCard,
        {
          backgroundColor: isPrimary
            ? primaryColors.primary
            : theme.backgroundDefault,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isPrimary
              ? "rgba(255,255,255,0.2)"
              : primaryColors.primaryLight + "20",
          },
        ]}
      >
        <Feather
          name={icon}
          size={28}
          color={isPrimary ? "#FFFFFF" : primaryColors.primary}
        />
      </View>
      <Spacer height={Spacing.md} />
      <ThemedText
        type="h4"
        style={[
          styles.cardTitle,
          { color: isPrimary ? "#FFFFFF" : theme.text },
        ]}
      >
        {title}
      </ThemedText>
      <ThemedText
        type="small"
        style={[
          styles.cardSubtitle,
          { color: isPrimary ? "rgba(255,255,255,0.8)" : theme.textSecondary },
        ]}
      >
        {subtitle}
      </ThemedText>
    </AnimatedPressable>
  );
}

interface QuickActionProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  badge?: number;
}

function QuickAction({ title, icon, onPress, badge }: QuickActionProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);
  const primaryColors = isDark ? Colors.dark : Colors.light;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.quickAction,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.quickActionIcon,
          { backgroundColor: primaryColors.primaryLight + "20" },
        ]}
      >
        <Feather name={icon} size={20} color={primaryColors.primary} />
      </View>
      <ThemedText type="small" style={styles.quickActionTitle}>
        {title}
      </ThemedText>
      {badge && badge > 0 ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: primaryColors.primary },
          ]}
        >
          <ThemedText type="small" style={styles.badgeText}>
            {badge > 99 ? "99+" : badge}
          </ThemedText>
        </View>
      ) : null}
      <Feather name="chevron-right" size={16} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { theme, isDark } = useTheme();
  const [farmerName, setFarmerName] = useState("Farmer");
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const primaryColors = isDark ? Colors.dark : Colors.light;

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const name = await getFarmerName();
    const scan = await getLastScan();
    const history = await getScanHistory();
    setFarmerName(name);
    setLastScan(scan);
    setHistoryCount(history.length);
  };

  const handleDiagnose = () => {
    navigation.navigate("DiagnoseTab");
  };

  const handleViewHistory = () => {
    navigation.navigate("History");
  };

  const handleCommonDiseases = () => {
    navigation.navigate("CommonDiseases");
  };

  const handlePhotoTips = () => {
    navigation.navigate("PhotoTips");
  };

  const handleChat = () => {
    navigation.navigate("ChatTab");
  };

  return (
    <ScreenScrollView>
      <View style={styles.greetingContainer}>
        <ThemedText type="h2" style={styles.greeting}>
          Hello, {farmerName}!
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subGreeting, { color: theme.textSecondary }]}
        >
          What do you want to do today?
        </ThemedText>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ActionCard
        title="Diagnose Leaf Disease"
        subtitle="Upload a leaf photo and let LeafSense AI analyze it"
        icon="camera"
        onPress={handleDiagnose}
        isPrimary
      />

      <Spacer height={Spacing.xl} />

      {lastScan ? (
        <>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Last Scan
          </ThemedText>
          <Spacer height={Spacing.md} />
          <Pressable
            onPress={handleViewHistory}
            style={({ pressed }) => [
              styles.lastScanCard,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Image
              source={{ uri: lastScan.imageUri }}
              style={styles.lastScanImage}
            />
            <View style={styles.lastScanInfo}>
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                {getDiseaseInfo(lastScan.disease).displayName}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: primaryColors.primary }}
              >
                {lastScan.confidence}% confidence
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                {new Date(lastScan.timestamp).toLocaleDateString()}
              </ThemedText>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
          <Spacer height={Spacing.xl} />
        </>
      ) : null}

      <ThemedText type="h4" style={styles.sectionTitle}>
        Quick Actions
      </ThemedText>
      <Spacer height={Spacing.md} />

      <QuickAction
        title="Scan History"
        icon="clock"
        onPress={handleViewHistory}
        badge={historyCount}
      />
      <Spacer height={Spacing.sm} />
      <QuickAction
        title="Common Diseases"
        icon="book-open"
        onPress={handleCommonDiseases}
      />
      <Spacer height={Spacing.sm} />
      <QuickAction
        title="How to Take Good Photos"
        icon="image"
        onPress={handlePhotoTips}
      />
      <Spacer height={Spacing.sm} />
      <QuickAction
        title="Ask LeafSense AI"
        icon="message-circle"
        onPress={handleChat}
      />
      <Spacer height={Spacing.sm} />
      <QuickAction
        title="Farmer Community"
        icon="users"
        onPress={() => navigation.navigate("Community")}
      />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  greetingContainer: {
    marginBottom: Spacing.sm,
  },
  greeting: {
    marginBottom: Spacing.xs,
  },
  subGreeting: {
    opacity: 0.8,
  },
  actionCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    opacity: 0.8,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  quickActionTitle: {
    flex: 1,
    fontWeight: "500",
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xs,
    marginRight: Spacing.sm,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  lastScanCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  lastScanImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  lastScanInfo: {
    flex: 1,
  },
});
