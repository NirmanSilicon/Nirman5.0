import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { generateChatResponse } from "@/utils/chatResponses";
import {
  ChatMessage,
  saveChatHistory,
  getChatHistory,
  getLastScan,
} from "@/utils/storage";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const { theme, isDark } = useTheme();
  const isAi = message.sender === "ai";
  const primaryColors = isDark ? Colors.dark : Colors.light;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.messageBubble,
        isAi ? styles.aiBubble : styles.userBubble,
        {
          backgroundColor: isAi
            ? primaryColors.chatAi
            : primaryColors.chatUser,
        },
      ]}
    >
      <ThemedText
        type="body"
        style={[
          styles.messageText,
          { color: isAi ? "#FFFFFF" : theme.text },
        ]}
      >
        {message.text}
      </ThemedText>
    </Animated.View>
  );
}

function TypingIndicator() {
  const { isDark } = useTheme();
  const primaryColors = isDark ? Colors.dark : Colors.light;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[
        styles.messageBubble,
        styles.aiBubble,
        styles.typingBubble,
        { backgroundColor: primaryColors.chatAi },
      ]}
    >
      <View style={styles.typingDots}>
        <View style={styles.typingDot} />
        <View style={[styles.typingDot, styles.typingDotMiddle]} />
        <View style={styles.typingDot} />
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentDisease, setCurrentDisease] = useState<string>("unknown");
  const flatListRef = useRef<FlatList>(null);
  const primaryColors = isDark ? Colors.dark : Colors.light;

  const scale = useSharedValue(1);

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const savedMessages = await getChatHistory();
    const lastScan = await getLastScan();

    if (lastScan) {
      setCurrentDisease(lastScan.disease);
    }

    if (savedMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        sender: "ai",
        text: lastScan
          ? `Hello! I'm LeafSense AI. I noticed you recently scanned a leaf with ${lastScan.disease.replace(/_/g, " ")}. Ask me anything about this condition or plant care in general!`
          : "Hello! I'm LeafSense AI, your digital crop doctor. Scan a leaf first, then ask me questions about the detected disease, treatments, or prevention tips!",
        timestamp: Date.now(),
      };
      setMessages([welcomeMessage]);
      await saveChatHistory([welcomeMessage]);
    } else {
      setMessages(savedMessages);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = generateChatResponse(currentDisease, userMessage.text);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: response.answer,
      timestamp: Date.now(),
    };

    const finalMessages = [...updatedMessages, aiMessage];
    setMessages(finalMessages);
    setIsTyping(false);
    await saveChatHistory(finalMessages);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  const renderFooter = () => {
    if (isTyping) {
      return <TypingIndicator />;
    }
    return null;
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messageList,
            {
              paddingTop: headerHeight + Spacing.lg,
              paddingBottom: Spacing.lg,
            },
          ]}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.backgroundRoot,
              paddingBottom: tabBarHeight + Spacing.sm,
              borderTopColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about plant diseases..."
              placeholderTextColor={theme.textSecondary}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <AnimatedPressable
              onPress={handleSend}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={!inputText.trim()}
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim()
                    ? primaryColors.primary
                    : theme.backgroundSecondary,
                },
                sendButtonStyle,
              ]}
            >
              <Feather
                name="send"
                size={20}
                color={inputText.trim() ? "#FFFFFF" : theme.textSecondary}
              />
            </AnimatedPressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: Spacing.lg,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  aiBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: Spacing.xs,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: Spacing.xs,
  },
  messageText: {
    lineHeight: 22,
  },
  typingBubble: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  typingDotMiddle: {
    opacity: 0.8,
  },
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: BorderRadius.xl,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
