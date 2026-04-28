import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AnalysisResult } from "./analyzer";

const HISTORY_KEY = "scam-shield.history";
const SETTINGS_KEY = "scam-shield.settings";
const MAX_HISTORY_ITEMS = 40;

export type HistoryItem = {
  id: string;
  message: string;
  result: AnalysisResult;
  createdAt: string;
};

export type AppSettings = {
  backendEndpoint: string;
  analysisMode: "local" | "backend-ready";
};

export async function loadHistory(): Promise<HistoryItem[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveHistoryItem(input: {
  message: string;
  result: AnalysisResult;
}): Promise<HistoryItem> {
  const item: HistoryItem = {
    id: input.result.id,
    message: input.message,
    result: input.result,
    createdAt: input.result.createdAt
  };
  const existing = await loadHistory();
  const next = [item, ...existing].slice(0, MAX_HISTORY_ITEMS);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return item;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function loadSettings(): Promise<AppSettings> {
  const fallback: AppSettings = {
    backendEndpoint: "",
    analysisMode: "local"
  };
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    return { ...fallback, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return fallback;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
