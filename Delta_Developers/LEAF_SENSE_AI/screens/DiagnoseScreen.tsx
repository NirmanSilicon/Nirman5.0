import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Platform,
  Linking,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { WeatherTipsCard } from "@/components/WeatherTipsCard";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { simulatePrediction, getDiseaseInfo, DiseaseInfo } from "@/utils/diseaseData";
import { saveLastScan } from "@/utils/storage";

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PredictionResult {
  disease: string;
  confidence: number;
  diseaseInfo: DiseaseInfo;
}

export default function DiagnoseScreen() {
  const { theme, isDark } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const primaryColors = isDark ? Colors.dark : Colors.light;

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;

      if (useCamera) {
        if (!cameraPermission?.granted) {
          const permission = await requestCameraPermission();
          if (!permission.granted) {
            if (!permission.canAskAgain && Platform.OS !== "web") {
              try {
                await Linking.openSettings();
              } catch (e) {
                console.log("Could not open settings");
              }
            }
            return;
          }
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        if (!mediaPermission?.granted) {
          const permission = await requestMediaPermission();
          if (!permission.granted) {
            if (!permission.canAskAgain && Platform.OS !== "web") {
              try {
                await Linking.openSettings();
              } catch (e) {
                console.log("Could not open settings");
              }
            }
            return;
          }
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setPrediction(null);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const analyzePrediction = async () => {
    if (!imageUri) return;

    setIsLoading(true);
    setPrediction(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = simulatePrediction();
    const diseaseInfo = getDiseaseInfo(result.disease);

    const predictionResult: PredictionResult = {
      disease: result.disease,
      confidence: result.confidence,
      diseaseInfo,
    };

    setPrediction(predictionResult);

    await saveLastScan({
      disease: result.disease,
      confidence: result.confidence,
      imageUri,
      timestamp: Date.now(),
    });

    setIsLoading(false);
  };

  const resetDiagnosis = () => {
    setImageUri(null);
    setPrediction(null);
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
    <ScreenScrollView>
      {!imageUri ? (
        <View style={styles.uploadSection}>
          <View
            style={[
              styles.uploadArea,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            ]}
          >
            <View
              style={[
                styles.uploadIconContainer,
                { backgroundColor: primaryColors.primaryLight + "20" },
              ]}
            >
              <Feather name="upload-cloud" size={48} color={primaryColors.primary} />
            </View>
            <Spacer height={Spacing.lg} />
            <ThemedText type="h4" style={styles.uploadTitle}>
              Upload Leaf Image
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.uploadSubtitle, { color: theme.textSecondary }]}
            >
              Take a photo or select from gallery
            </ThemedText>
          </View>

          <Spacer height={Spacing.xl} />

          <View style={styles.buttonRow}>
            <Button
              onPress={() => pickImage(true)}
              style={[styles.halfButton, { backgroundColor: primaryColors.primary }]}
            >
              <View style={styles.buttonContent}>
                <Feather name="camera" size={20} color="#FFFFFF" />
                <ThemedText style={styles.buttonText}>Camera</ThemedText>
              </View>
            </Button>
            <Spacer width={Spacing.md} />
            <Button
              onPress={() => pickImage(false)}
              style={[styles.halfButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <View style={styles.buttonContent}>
                <Feather name="image" size={20} color={theme.text} />
                <ThemedText style={[styles.buttonText, { color: theme.text }]}>
                  Gallery
                </ThemedText>
              </View>
            </Button>
          </View>

          <Spacer height={Spacing["3xl"]} />

          <View
            style={[
              styles.tipCard,
              { backgroundColor: primaryColors.primaryLight + "15" },
            ]}
          >
            <Feather name="info" size={20} color={primaryColors.primary} />
            <View style={styles.tipContent}>
              <ThemedText type="small" style={{ fontWeight: "600" }}>
                Tips for better results
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, marginTop: 4 }}
              >
                Use good lighting, capture the affected area clearly, and ensure
                the leaf fills most of the frame.
              </ThemedText>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.resultSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            <Pressable
              onPress={resetDiagnosis}
              style={({ pressed }) => [
                styles.resetButton,
                { backgroundColor: theme.backgroundRoot, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="x" size={20} color={theme.text} />
            </Pressable>
          </View>

          <Spacer height={Spacing.xl} />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColors.primary} />
              <Spacer height={Spacing.lg} />
              <ThemedText type="body" style={{ textAlign: "center" }}>
                Analyzing leaf...
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, textAlign: "center" }}
              >
                LeafSense AI is processing your image
              </ThemedText>
            </View>
          ) : prediction ? (
            <View style={styles.predictionContainer}>
              <View
                style={[
                  styles.resultCard,
                  { backgroundColor: theme.backgroundDefault },
                ]}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.resultTitleRow}>
                    <ThemedText type="h3">{prediction.diseaseInfo.displayName}</ThemedText>
                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(prediction.diseaseInfo.severity) + "20" },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={{
                          color: getSeverityColor(prediction.diseaseInfo.severity),
                          fontWeight: "600",
                        }}
                      >
                        {prediction.diseaseInfo.severity.toUpperCase()}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText
                    type="body"
                    style={{ color: primaryColors.primary, fontWeight: "600" }}
                  >
                    {prediction.confidence}% confidence
                  </ThemedText>
                </View>

                <Spacer height={Spacing.lg} />

                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                >
                  {prediction.diseaseInfo.description}
                </ThemedText>
              </View>

              <Spacer height={Spacing.lg} />

              {prediction.diseaseInfo.treatments.length > 0 ? (
                <View
                  style={[
                    styles.actionCard,
                    { backgroundColor: theme.backgroundDefault },
                  ]}
                >
                  <View style={styles.actionHeader}>
                    <Feather name="check-circle" size={20} color={primaryColors.success} />
                    <ThemedText type="body" style={styles.actionTitle}>
                      Suggested Actions
                    </ThemedText>
                  </View>
                  <Spacer height={Spacing.md} />
                  {prediction.diseaseInfo.treatments.slice(0, 3).map((treatment, index) => (
                    <View key={index} style={styles.actionItem}>
                      <View
                        style={[
                          styles.actionBullet,
                          { backgroundColor: primaryColors.primary },
                        ]}
                      />
                      <ThemedText type="small" style={styles.actionText}>
                        {treatment}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              ) : null}

              <Spacer height={Spacing.lg} />

              <WeatherTipsCard disease={prediction.disease} />

              <Spacer height={Spacing.xl} />

              <Button
                onPress={resetDiagnosis}
                style={{ backgroundColor: primaryColors.primary }}
              >
                Scan Another Leaf
              </Button>
            </View>
          ) : (
            <Button
              onPress={analyzePrediction}
              style={{ backgroundColor: primaryColors.primary }}
            >
              <View style={styles.buttonContent}>
                <Feather name="search" size={20} color="#FFFFFF" />
                <ThemedText style={styles.buttonText}>Predict Disease</ThemedText>
              </View>
            </Button>
          )}
        </View>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  uploadSection: {
    flex: 1,
  },
  uploadArea: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["4xl"],
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  uploadIconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTitle: {
    textAlign: "center",
  },
  uploadSubtitle: {
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  buttonRow: {
    flexDirection: "row",
  },
  halfButton: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  tipCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  resultSection: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
  },
  resetButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: Spacing["4xl"],
  },
  predictionContainer: {
    flex: 1,
  },
  resultCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  resultHeader: {},
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  actionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  actionTitle: {
    fontWeight: "600",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  actionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: Spacing.sm,
  },
  actionText: {
    flex: 1,
  },
});
