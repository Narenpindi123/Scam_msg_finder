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
  onShareReport: () => void;
};

export function AnalyzeScreen({
  message,
  result,
  onAnalyze,
  onChangeMessage,
  onClear,
  onShareReport
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

      {result ? <ResultPanel result={result} onShareReport={onShareReport} /> : <EmptyResult />}
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

function ResultPanel({
  result,
  onShareReport
}: {
  result: AnalysisResult;
  onShareReport: () => void;
}) {
  const contacts = result.contacts ?? [];
  const responsePlan = result.responsePlan ?? result.recommendedActions;

  return (
    <View>
      <Section>
        <RiskBadge level={result.riskLevel} score={result.score} />
        <Text style={styles.category}>{result.category}</Text>
        <Text style={styles.summary}>{result.summary}</Text>
        <Button label="Share report" onPress={onShareReport} style={styles.shareButton} variant="secondary" />
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

      {contacts.length > 0 ? (
        <Section title="Visible contact points">
          {contacts.map((contact) => (
            <View key={`${contact.type}-${contact.value}`} style={styles.contactRow}>
              <Text style={styles.contactLabel}>{contact.label}</Text>
              <Text style={styles.contactValue}>{contact.value}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      <Section title="Response plan">
        {responsePlan.map((action, index) => (
          <View key={action} style={styles.planRow}>
            <Text style={styles.planNumber}>{index + 1}</Text>
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}
      </Section>

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
  shareButton: {
    marginTop: spacing.lg
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
  contactRow: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: spacing.sm,
    padding: spacing.sm
  },
  contactLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 2
  },
  contactValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  planRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  planNumber: {
    backgroundColor: colors.primarySoft,
    borderRadius: 6,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    height: 22,
    lineHeight: 22,
    textAlign: "center",
    width: 22
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
