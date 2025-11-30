import React, { useState, useCallback } from "react";
import { StyleSheet, View, TextInput, Pressable, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors, Typography } from "@/constants/theme";
import { getFarmerName, saveFarmerName, clearChatHistory, getScanHistory, clearScanHistory } from "@/utils/storage";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { t, Language } from "@/utils/i18n";

interface SettingRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, label, value, onPress, danger }: SettingRowProps) {
  const { theme, isDark } = useTheme();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  const content = (
    <View
      style={[
        styles.settingRow,
        { backgroundColor: theme.backgroundDefault },
      ]}
    >
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: danger ? primaryColors.error + "20" : primaryColors.primaryLight + "20" },
        ]}
      >
        <Feather name={icon} size={20} color={danger ? primaryColors.error : primaryColors.primary} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {label}
        </ThemedText>
        <ThemedText type="body" style={danger ? { color: primaryColors.error } : undefined}>
          {value}
        </ThemedText>
      </View>
      {onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [farmerName, setFarmerName] = useState("Farmer");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [totalScans, setTotalScans] = useState(0);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const primaryColors = isDark ? Colors.dark : Colors.light;

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const name = await getFarmerName();
    const history = await getScanHistory();
    setFarmerName(name);
    setEditName(name);
    setTotalScans(history.length);
  };

  const handleSaveName = async () => {
    const trimmedName = editName.trim() || "Farmer";
    await saveFarmerName(trimmedName);
    setFarmerName(trimmedName);
    setIsEditing(false);
  };

  const handleClearChat = async () => {
    await clearChatHistory();
  };

  const handleClearAllData = async () => {
    await clearChatHistory();
    await clearScanHistory();
    setTotalScans(0);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageModal(false);
  };

  const getCurrentLanguageName = () => {
    const lang = LANGUAGES.find((l) => l.code === language);
    return lang ? lang.nativeName : "English";
  };

  return (
    <>
      <ScreenScrollView>
        <View
          style={[
            styles.profileHeader,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: primaryColors.primaryLight + "30" },
            ]}
          >
            <Feather name="user" size={40} color={primaryColors.primary} />
          </View>
          <Spacer height={Spacing.lg} />
          {isEditing ? (
            <View style={styles.editNameContainer}>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    color: theme.text,
                  },
                ]}
                value={editName}
                onChangeText={setEditName}
                placeholder={t("profile.farmerName")}
                placeholderTextColor={theme.textSecondary}
                autoFocus
                onSubmitEditing={handleSaveName}
                returnKeyType="done"
              />
              <Pressable
                onPress={handleSaveName}
                style={({ pressed }) => [
                  styles.saveButton,
                  { backgroundColor: primaryColors.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="check" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsEditing(true)}
              style={({ pressed }) => [
                styles.nameContainer,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText type="h3">{farmerName}</ThemedText>
              <Feather
                name="edit-2"
                size={16}
                color={theme.textSecondary}
                style={styles.editIcon}
              />
            </Pressable>
          )}
          <ThemedText
            type="small"
            style={[styles.role, { color: theme.textSecondary }]}
          >
            {t("profile.totalScans")}: {totalScans}
          </ThemedText>
        </View>

        <Spacer height={Spacing["2xl"]} />

        <ThemedText type="h4" style={styles.sectionTitle}>
          {t("profile.title")}
        </ThemedText>
        <Spacer height={Spacing.md} />

        <SettingRow
          icon="globe"
          label={t("profile.language")}
          value={getCurrentLanguageName()}
          onPress={() => setShowLanguageModal(true)}
        />
        <Spacer height={Spacing.sm} />
        <SettingRow
          icon="info"
          label={t("profile.version")}
          value="1.0.0"
        />
        <Spacer height={Spacing.sm} />
        <SettingRow
          icon="message-circle"
          label={t("chat.clearHistory")}
          value={t("common.clear")}
          onPress={handleClearChat}
        />
        <Spacer height={Spacing.sm} />
        <SettingRow
          icon="trash-2"
          label={t("profile.clearData")}
          value={t("common.clear")}
          onPress={handleClearAllData}
          danger
        />

        <Spacer height={Spacing["3xl"]} />

        <ThemedText type="h4" style={styles.sectionTitle}>
          {t("profile.about")}
        </ThemedText>
        <Spacer height={Spacing.md} />

        <View
          style={[
            styles.aboutCard,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <ThemedText type="body" style={styles.aboutText}>
            LeafSense AI is your digital crop doctor, designed to help farmers
            identify plant diseases quickly and accurately. Simply upload a photo
            of an affected leaf, and our AI will analyze it to detect potential
            diseases.
          </ThemedText>
          <Spacer height={Spacing.md} />
          <ThemedText type="body" style={styles.aboutText}>
            Our goal is to empower farmers with technology that helps protect
            crops and improve yields. Get instant diagnosis, treatment
            recommendations, and prevention tips all in one app.
          </ThemedText>
        </View>

        <Spacer height={Spacing["2xl"]} />

        <View style={styles.footer}>
          <Feather name="heart" size={16} color={primaryColors.error} />
          <ThemedText
            type="small"
            style={[styles.footerText, { color: theme.textSecondary }]}
          >
            Made for farmers, with love
          </ThemedText>
        </View>
      </ScreenScrollView>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLanguageModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <ThemedText type="h4" style={styles.modalTitle}>
              {t("profile.selectLanguage")}
            </ThemedText>
            <Spacer height={Spacing.lg} />
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code)}
                style={({ pressed }) => [
                  styles.languageOption,
                  {
                    backgroundColor:
                      language === lang.code
                        ? primaryColors.primaryLight + "30"
                        : "transparent",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={styles.languageInfo}>
                  <ThemedText type="body" style={{ fontWeight: "600" }}>
                    {lang.nativeName}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {lang.name}
                  </ThemedText>
                </View>
                {language === lang.code ? (
                  <Feather
                    name="check"
                    size={20}
                    color={primaryColors.primary}
                  />
                ) : null}
              </Pressable>
            ))}
            <Spacer height={Spacing.lg} />
            <Pressable
              onPress={() => setShowLanguageModal(false)}
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  backgroundColor: theme.backgroundSecondary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemedText type="body">{t("common.cancel")}</ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editIcon: {
    marginLeft: Spacing.sm,
  },
  editNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  nameInput: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
    minWidth: 200,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  role: {
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  aboutCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  aboutText: {
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  footerText: {
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    textAlign: "center",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  languageInfo: {
    flex: 1,
  },
  cancelButton: {
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
});
