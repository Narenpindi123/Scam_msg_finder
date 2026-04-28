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
import { colors, spacing } from "../theme/theme";

type SettingsScreenProps = {
  settings: AppSettings;
  onSave: (settings: AppSettings) => Promise<void>;
};

export function SettingsScreen({ settings, onSave }: SettingsScreenProps) {
  const [backendEndpoint, setBackendEndpoint] = useState(settings.backendEndpoint);
  const [backendReady, setBackendReady] = useState(settings.analysisMode === "backend-ready");

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

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Section title="Privacy model">
        <Text style={styles.body}>
          Scam Shield analyzes messages locally in this MVP. A production AI version should call
          your backend server, and that backend should call the AI provider with your protected API
          key.
        </Text>
      </Section>

      <Section title="Backend endpoint">
        <Text style={styles.label}>Server URL</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          onChangeText={setBackendEndpoint}
          placeholder="https://api.example.com/analyze"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={backendEndpoint}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchTitle}>Backend ready</Text>
            <Text style={styles.switchDetail}>Use this after a secure server is deployed.</Text>
          </View>
          <Switch
            onValueChange={setBackendReady}
            thumbColor={backendReady ? colors.primary : "#FFFFFF"}
            trackColor={{ false: colors.border, true: colors.primarySoft }}
            value={backendReady}
          />
        </View>

        <Button label="Save settings" onPress={handleSave} />
      </Section>

      <Section title="Backend contract">
        <Text style={styles.code}>
          POST /analyze{"\n"}
          {"{"}"message": "suspicious text"{"}"}{"\n\n"}
          returns{"\n"}
          {"{"}"riskLevel": "High", "score": 78, "summary": "...", "signals": []{"}"}
        </Text>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: spacing.sm
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
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
  code: {
    backgroundColor: "#101820",
    borderRadius: 8,
    color: "#ECF2F8",
    fontSize: 12,
    lineHeight: 18,
    padding: spacing.md
  }
});
