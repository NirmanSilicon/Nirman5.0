import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  LAST_SCAN: "@leafsense_last_scan",
  SCAN_HISTORY: "@leafsense_scan_history",
  FARMER_NAME: "@leafsense_farmer_name",
  CHAT_HISTORY: "@leafsense_chat_history",
  LANGUAGE: "@leafsense_language",
  CACHED_WEATHER: "@leafsense_cached_weather",
};

const MAX_HISTORY_ITEMS = 50;

export interface ScanResult {
  id: string;
  disease: string;
  confidence: number;
  imageUri: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  location: string;
  timestamp: number;
}

export async function saveLastScan(scan: Omit<ScanResult, "id">): Promise<ScanResult> {
  try {
    const scanWithId: ScanResult = {
      ...scan,
      id: Date.now().toString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SCAN, JSON.stringify(scanWithId));
    await addToScanHistory(scanWithId);
    return scanWithId;
  } catch (error) {
    console.error("Error saving last scan:", error);
    throw error;
  }
}

export async function getLastScan(): Promise<ScanResult | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SCAN);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting last scan:", error);
    return null;
  }
}

async function addToScanHistory(scan: ScanResult): Promise<void> {
  try {
    const history = await getScanHistory();
    const updatedHistory = [scan, ...history].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SCAN_HISTORY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Error adding to scan history:", error);
  }
}

export async function getScanHistory(): Promise<ScanResult[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting scan history:", error);
    return [];
  }
}

export async function deleteScanFromHistory(scanId: string): Promise<void> {
  try {
    const history = await getScanHistory();
    const updatedHistory = history.filter((scan) => scan.id !== scanId);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SCAN_HISTORY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Error deleting scan from history:", error);
  }
}

export async function clearScanHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_SCAN);
  } catch (error) {
    console.error("Error clearing scan history:", error);
  }
}

export async function saveFarmerName(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FARMER_NAME, name);
  } catch (error) {
    console.error("Error saving farmer name:", error);
  }
}

export async function getFarmerName(): Promise<string> {
  try {
    const name = await AsyncStorage.getItem(STORAGE_KEYS.FARMER_NAME);
    return name || "Farmer";
  } catch (error) {
    console.error("Error getting farmer name:", error);
    return "Farmer";
  }
}

export async function saveChatHistory(messages: ChatMessage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CHAT_HISTORY,
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
}

export async function clearChatHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
}

export async function saveLanguage(language: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (error) {
    console.error("Error saving language:", error);
  }
}

export async function getLanguage(): Promise<string> {
  try {
    const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return language || "en";
  } catch (error) {
    console.error("Error getting language:", error);
    return "en";
  }
}

export async function saveWeatherData(weather: WeatherData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CACHED_WEATHER, JSON.stringify(weather));
  } catch (error) {
    console.error("Error saving weather data:", error);
  }
}

export async function getCachedWeather(): Promise<WeatherData | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_WEATHER);
    if (!data) return null;
    const weather = JSON.parse(data) as WeatherData;
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - weather.timestamp > oneHour) {
      return null;
    }
    return weather;
  } catch (error) {
    console.error("Error getting cached weather:", error);
    return null;
  }
}
