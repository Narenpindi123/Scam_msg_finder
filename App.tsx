import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AppUpdateBanner } from "./src/components/AppUpdateBanner";
import { AnalyzeScreen } from "./src/screens/AnalyzeScreen";
import { CURRENT_APP_VERSION } from "./src/config/appUpdate";
import { GuideScreen } from "./src/screens/GuideScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { analyzeMessage, type AnalysisResult } from "./src/services/analyzer";
import { checkForAppUpdate, type AvailableAppUpdate } from "./src/services/appUpdate";
import {
  clearHistory,
  loadHistory,
  loadSettings,
  saveHistoryItem,
  saveSettings,
  type AppSettings,
  type HistoryItem
} from "./src/services/storage";
import { colors, spacing } from "./src/theme/theme";

type TabKey = "analyze" | "history" | "guide" | "settings";

const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "analyze", label: "Analyze", icon: "Scan" },
  { key: "history", label: "History", icon: "Log" },
  { key: "guide", label: "Guide", icon: "Help" },
  { key: "settings", label: "Settings", icon: "Gear" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("analyze");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [availableUpdate, setAvailableUpdate] = useState<AvailableAppUpdate | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    backendEndpoint: "",
    analysisMode: "local"
  });

  useEffect(() => {
    loadHistory().then(setHistory).catch(() => setHistory([]));
    loadSettings().then(setSettings).catch(() => undefined);
  }, []);

  useEffect(() => {
    let mounted = true;

    checkForAppUpdate()
      .then((update) => {
        if (mounted) {
          setAvailableUpdate(update);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const handleAnalyze = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      Alert.alert("Message required", "Paste a suspicious message before running an analysis.");
      return;
    }

    const analysis = analyzeMessage(trimmed);
    const item = await saveHistoryItem({
      message: trimmed,
      result: analysis
    });

    setResult(analysis);
    setHistory((items) => [item, ...items]);
  }, [message]);

  const handleReopen = useCallback((item: HistoryItem) => {
    setMessage(item.message);
    setResult(item.result);
    setActiveTab("analyze");
  }, []);

  const handleClearHistory = useCallback(() => {
    Alert.alert("Clear history", "Remove all saved scam analyses from this device?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        }
      }
    ]);
  }, []);

  const handleSaveSettings = useCallback(async (next: AppSettings) => {
    await saveSettings(next);
    setSettings(next);
  }, []);

  const handleManualUpdateCheck = useCallback(async () => {
    try {
      const update = await checkForAppUpdate();

      if (update) {
        setAvailableUpdate(update);
        Alert.alert("Update available", `Version ${update.latestVersion} is ready to download.`);
        return;
      }

      Alert.alert("Scam Shield is current", `You are running version ${CURRENT_APP_VERSION}.`);
    } catch {
      Alert.alert("Update check failed", "Check your connection and try again.");
    }
  }, []);

  const handleShareReport = useCallback(async () => {
    if (!result) {
      return;
    }

    await Share.share({
      message: formatReport(result, message)
    });
  }, [message, result]);

  const content = useMemo(() => {
    if (activeTab === "history") {
      return <HistoryScreen history={history} onClear={handleClearHistory} onOpen={handleReopen} />;
    }

    if (activeTab === "guide") {
      return <GuideScreen />;
    }

    if (activeTab === "settings") {
      return (
        <SettingsScreen
          onCheckForUpdate={handleManualUpdateCheck}
          settings={settings}
          onSave={handleSaveSettings}
        />
      );
    }

    return (
      <AnalyzeScreen
        message={message}
        result={result}
        onAnalyze={handleAnalyze}
        onChangeMessage={setMessage}
        onClear={() => {
          setMessage("");
          setResult(null);
        }}
        onShareReport={handleShareReport}
      />
    );
  }, [
    activeTab,
    handleAnalyze,
    handleClearHistory,
    handleManualUpdateCheck,
    handleReopen,
    handleSaveSettings,
    handleShareReport,
    history,
    message,
    result,
    settings
  ]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.shell}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Scam Shield</Text>
              <Text style={styles.subtitle}>Minimal message risk check</Text>
            </View>
            <View style={styles.modePill}>
              <Text style={styles.modePillText}>v2 Local</Text>
            </View>
          </View>

          {availableUpdate ? (
            <AppUpdateBanner
              onDismiss={() => setAvailableUpdate(null)}
              update={availableUpdate}
            />
          ) : null}

          <View style={styles.content}>{content}</View>

          <View style={styles.tabBar}>
            {tabs.map((tab) => {
              const selected = tab.key === activeTab;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[styles.tabButton, selected && styles.tabButtonActive]}
                >
                  <Text style={[styles.tabIcon, selected && styles.tabTextActive]}>{tab.icon}</Text>
                  <Text style={[styles.tabLabel, selected && styles.tabTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function formatReport(result: AnalysisResult, message: string): string {
  const redFlags = result.signals.map((signal) => `- ${signal.label}: ${signal.detail}`).join("\n");
  const links = result.links.length > 0 ? result.links.map((link) => `- ${link}`).join("\n") : "- None";
  const visibleContacts = result.contacts ?? [];
  const contacts =
    visibleContacts.length > 0
      ? visibleContacts.map((contact) => `- ${contact.label}: ${contact.value}`).join("\n")
      : "- None";
  const plan = (result.responsePlan ?? result.recommendedActions)
    .map((action) => `- ${action}`)
    .join("\n");

  return [
    "Scam Shield report",
    `${result.riskLevel} risk (${result.score}/100)`,
    result.category,
    "",
    result.summary,
    "",
    "Message:",
    message.trim(),
    "",
    "Red flags:",
    redFlags,
    "",
    "Visible links:",
    links,
    "",
    "Visible contact points:",
    contacts,
    "",
    "Response plan:",
    plan
  ].join("\n");
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  shell: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2
  },
  modePill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6
  },
  modePillText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700"
  },
  content: {
    flex: 1
  },
  tabBar: {
    backgroundColor: colors.background,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    gap: 2,
    justifyContent: "center",
    minHeight: 54
  },
  tabButtonActive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  tabIcon: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  tabTextActive: {
    color: colors.primary
  }
});
