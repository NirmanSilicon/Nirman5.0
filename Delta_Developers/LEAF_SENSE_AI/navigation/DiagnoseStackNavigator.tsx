import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DiagnoseScreen from "@/screens/DiagnoseScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type DiagnoseStackParamList = {
  Diagnose: undefined;
};

const Stack = createNativeStackNavigator<DiagnoseStackParamList>();

export default function DiagnoseStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Diagnose"
        component={DiagnoseScreen}
        options={{
          title: "Diagnose Leaf Disease",
        }}
      />
    </Stack.Navigator>
  );
}
