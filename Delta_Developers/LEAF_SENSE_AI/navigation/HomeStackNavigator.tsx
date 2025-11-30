import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import CommonDiseasesScreen from "@/screens/CommonDiseasesScreen";
import PhotoTipsScreen from "@/screens/PhotoTipsScreen";
import CommunityScreen from "@/screens/CommunityScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HomeStackParamList = {
  Home: undefined;
  History: undefined;
  CommonDiseases: undefined;
  PhotoTips: undefined;
  Community: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="LeafSense AI" />,
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerTitle: "Scan History" }}
      />
      <Stack.Screen
        name="CommonDiseases"
        component={CommonDiseasesScreen}
        options={{ headerTitle: "Common Diseases" }}
      />
      <Stack.Screen
        name="PhotoTips"
        component={PhotoTipsScreen}
        options={{ headerTitle: "Photo Tips" }}
      />
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
        options={{ headerTitle: "Community" }}
      />
    </Stack.Navigator>
  );
}
