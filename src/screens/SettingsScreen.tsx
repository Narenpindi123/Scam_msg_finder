import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";

import { Button } from "../components/Button";
import { Section } from "../components/Section";
import type { AppSettings } from "../services/storage";
import { colors, radii, spacing } from "../theme/theme";

type SettingsScreenProps = {
  onCheckForUpdate: () => Promise<void>;
  settings: AppSettings;
  onSave: (settings: AppSettings) => Promise<void>;
};

export function SettingsScreen({ onCheckForUpdate, settings, onSave }: SettingsScreenProps) {
  const [backendEndpoint, setBackendEndpoint] = useState(settings.backendEndpoint);
  const [backendReady, setBackendReady] = useState(settings.analysisMode === "backend-ready");
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  useEffect(() => {
    setBackendEndpoint(settings.backendEndpoint);
    setBackendReady(settings.analysisMode === "backend-ready");
  }, [settings]);

  const handleSave = async () => {
    await onSave({
      backendEndpoint: backendEndpoint.trim(),
      analysisMode: backendReady ? "backend-ready" : "local"
    });
    Alert.alert("Settings saved", "Scam Shield will continue using local analysis in this MVP.");
  };

  const handleCheckForUpdate = async () => {
    setCheckingUpdate(true);

    try {
      await onCheckForUpdate();
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Settings</Text>

      <Section title="Privacy model">
        <View style={styles.privacyBox}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <View style={styles.privacyCopy}>
            <Text style={styles.privacyTitle}>Local-only analysis</Text>
            <Text style={styles.body}>
              Scam Shield analyzes messages on this device. Nothing is sent to external servers unless you enable a backend.
            </Text>
          </View>
        </View>
      </Section>

      <Section title="App update">
        <Text style={styles.body}>
          Check GitHub for the latest APK when you want to test update prompts or install a newer native build.
        </Text>
        <Button
          disabled={checkingUpdate}
          label={checkingUpdate ? "Checking…" : "Check for update"}
          onPress={handleCheckForUpdate}
          style={styles.updateButton}
          variant="secondary"
        />
      </Section>

      <Section title="Backend endpoint">
        <Text style={styles.label}>Server URL</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          onChangeText={setBackendEndpoint}
          placeholder="https://api.example.com/analyze"
          placeholderTextColor={colors.mutedLight}
          style={styles.input}
          value={backendEndpoint}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchTitle}>Backend ready</Text>
            <Text style={styles.switchDetail}>Enable after a secure server is deployed.</Text>
          </View>
          <Switch
            onValueChange={setBackendReady}
            thumbColor={backendReady ? colors.primary : "#FFFFFF"}
            trackColor={{ false: colors.border, true: colors.primaryBorder }}
            value={backendReady}
          />
        </View>

        <Button label="Save settings" onPress={handleSave} />
      </Section>

      <Section title="Backend contract">
        <Text style={styles.codeLabel}>Expected request / response shape</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            POST /analyze{"\n"}
            {"{"}"message": "suspicious text"{"}"}{"\n\n"}
            {"{"}"riskLevel": "High",{"\n"} "score": 78,{"\n"} "summary": "...",{"\n"} "signals": []{"}"}
          </Text>
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  },
  screenTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: spacing.md
  },
  privacyBox: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm
  },
  privacyIcon: {
    fontSize: 22,
    marginTop: 2
  },
  privacyCopy: {
    flex: 1,
    gap: spacing.xs
  },
  privacyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  },
  updateButton: {
    marginTop: spacing.md
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
    textTransform: "uppercase"
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    color: colors.text,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginVertical: spacing.lg
  },
  switchText: {
    flex: 1
  },
  switchTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  switchDetail: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  codeLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.sm
  },
  codeBlock: {
    backgroundColor: colors.text,
    borderRadius: radii.sm,
    padding: spacing.md
  },
  codeText: {
    color: "#B8D0EC",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 19
  }
});
