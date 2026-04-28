import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { Button } from "../components/Button";
import { RiskBadge } from "../components/RiskBadge";
import { Section } from "../components/Section";
import type { AnalysisResult, Signal } from "../services/analyzer";
import { colors, spacing } from "../theme/theme";

type AnalyzeScreenProps = {
  message: string;
  result: AnalysisResult | null;
  onAnalyze: () => void;
  onChangeMessage: (message: string) => void;
  onClear: () => void;
};

export function AnalyzeScreen({
  message,
  result,
  onAnalyze,
  onChangeMessage,
  onClear
}: AnalyzeScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Section title="Message">
        <TextInput
          multiline
          numberOfLines={8}
          onChangeText={onChangeMessage}
          placeholder="Paste a suspicious text, email, DM, or marketplace message..."
          placeholderTextColor={colors.muted}
          style={styles.input}
          textAlignVertical="top"
          value={message}
        />
        <View style={styles.actions}>
          <Button label="Analyze message" onPress={onAnalyze} style={styles.primaryAction} />
          <Button label="Clear" onPress={onClear} variant="secondary" />
        </View>
      </Section>

      {result ? <ResultPanel result={result} /> : <EmptyResult />}
    </ScrollView>
  );
}

function EmptyResult() {
  return (
    <Section>
      <Text style={styles.emptyTitle}>Ready to scan</Text>
      <Text style={styles.emptyText}>
        The app checks for urgency, payment pressure, credential requests, suspicious links,
        impersonation, and common scam categories. Analysis runs locally on this device.
      </Text>
    </Section>
  );
}

function ResultPanel({ result }: { result: AnalysisResult }) {
  return (
    <View>
      <Section>
        <RiskBadge level={result.riskLevel} score={result.score} />
        <Text style={styles.category}>{result.category}</Text>
        <Text style={styles.summary}>{result.summary}</Text>
      </Section>

      <Section title="Red flags">
        {result.signals.map((signal, index) => (
          <SignalRow key={`${signal.label}-${index}`} signal={signal} />
        ))}
      </Section>

      {result.links.length > 0 ? (
        <Section title="Visible links">
          {result.links.map((link) => (
            <Text key={link} style={styles.linkText}>
              {link}
            </Text>
          ))}
        </Section>
      ) : null}

      <Section title="Next actions">
        {result.recommendedActions.map((action) => (
          <View key={action} style={styles.actionRow}>
            <Text style={styles.check}>OK</Text>
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}
      </Section>
    </View>
  );
}

function SignalRow({ signal }: { signal: Signal }) {
  return (
    <View style={styles.signalRow}>
      <View style={[styles.signalDot, styles[signal.severity]]} />
      <View style={styles.signalBody}>
        <Text style={styles.signalLabel}>{signal.label}</Text>
        <Text style={styles.signalDetail}>{signal.detail}</Text>
        {signal.evidence ? <Text style={styles.evidence}>{signal.evidence}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    minHeight: 164,
    padding: spacing.md
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  primaryAction: {
    flex: 1
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  },
  category: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: spacing.md
  },
  summary: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm
  },
  signalRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md
  },
  signalDot: {
    borderRadius: 5,
    height: 10,
    marginTop: 5,
    width: 10
  },
  info: {
    backgroundColor: colors.primary
  },
  warning: {
    backgroundColor: colors.warning
  },
  danger: {
    backgroundColor: colors.danger
  },
  signalBody: {
    flex: 1
  },
  signalLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  signalDetail: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3
  },
  evidence: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 6,
    color: colors.text,
    fontSize: 12,
    marginTop: spacing.sm,
    padding: spacing.sm
  },
  linkText: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    color: colors.primary,
    fontSize: 13,
    marginBottom: spacing.sm,
    padding: spacing.sm
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  check: {
    color: colors.success,
    fontSize: 15,
    fontWeight: "900"
  },
  actionText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  }
});
