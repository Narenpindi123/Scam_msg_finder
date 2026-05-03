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
import type { AnalysisResult, MitreTechnique, NistPhase, Signal } from "../services/analyzer";
import { colors, radii, spacing } from "../theme/theme";

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
      <Section title="Check a message">
        <TextInput
          multiline
          numberOfLines={8}
          onChangeText={onChangeMessage}
          placeholder="Paste a suspicious text, email, DM, or marketplace message…"
          placeholderTextColor={colors.mutedLight}
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
      <View style={styles.emptyState}>
        <View style={styles.emptyIconWrap}>
          <Text style={styles.emptyIconEmoji}>🛡️</Text>
        </View>
        <Text style={styles.emptyTitle}>Ready to scan</Text>
        <Text style={styles.emptyText}>
          Paste any suspicious message above and tap Analyze. The check runs locally — nothing leaves your device.
        </Text>
        <View style={styles.chipRow}>
          {["Urgency traps", "Payment pressure", "Fake links", "Impersonation"].map((tag) => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Section>
  );
}

const nistColors: Record<NistPhase, string> = {
  "Detection & Analysis": "#2563EB",
  "Containment": "#D97706",
  "Eradication": "#DC2626",
  "Recovery": "#059669"
};

const tacticColors: Record<string, string> = {
  "Initial Access":       "#2563EB",
  "Reconnaissance":       "#7C3AED",
  "Impact":               "#DC2626",
  "Credential Access":    "#D97706",
  "Defense Evasion":      "#0891B2",
  "Command & Control":    "#991B1B",
  "Resource Development": "#5E7491",
  "Execution":            "#EA580C"
};

function ThreatIntelPanel({ techniques }: { techniques: MitreTechnique[] }) {
  if (!techniques || techniques.length === 0) return null;

  return (
    <Section title="MITRE ATT&CK">
      {techniques.map((tech) => {
        const color = tacticColors[tech.tactic] ?? "#5E7491";
        return (
          <View key={tech.id} style={styles.mitreRow}>
            <View style={[styles.mitreBadge, { backgroundColor: color + "18", borderColor: color + "40" }]}>
              <Text style={[styles.mitreId, { color }]}>{tech.id}</Text>
            </View>
            <View style={styles.mitreInfo}>
              <Text style={styles.mitreName}>{tech.name}</Text>
              <Text style={[styles.mitreTactic, { color }]}>{tech.tactic}</Text>
            </View>
          </View>
        );
      })}
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
  const displaySteps = result.responseSteps ??
    (result.responsePlan ?? result.recommendedActions).map((action) => ({ action, nistPhase: undefined }));

  return (
    <View>
      <Section>
        <View style={styles.resultHeader}>
          <RiskBadge level={result.riskLevel} score={result.score} />
          <Text style={styles.category}>{result.category}</Text>
        </View>
        <Text style={styles.summary}>{result.summary}</Text>
        <Button label="Share report" onPress={onShareReport} style={styles.shareButton} variant="secondary" />
      </Section>

      <Section title="Red flags">
        {result.signals.map((signal, index) => (
          <SignalRow key={`${signal.label}-${index}`} signal={signal} />
        ))}
      </Section>

      <ThreatIntelPanel techniques={result.mitreTechniques ?? []} />

      {result.links.length > 0 ? (
        <Section title="Visible links">
          {result.links.map((link) => (
            <View key={link} style={styles.linkItem}>
              <Text style={styles.linkIcon}>🔗</Text>
              <Text style={styles.linkText}>{link}</Text>
            </View>
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
        {displaySteps.map((step, index) => (
          <View key={step.action} style={styles.planRow}>
            <View style={styles.planNumberWrap}>
              <Text style={styles.planNumber}>{index + 1}</Text>
            </View>
            <View style={styles.planStepBody}>
              {step.nistPhase ? (
                <View style={[styles.nistBadge, { backgroundColor: nistColors[step.nistPhase] + "15", borderColor: nistColors[step.nistPhase] + "35" }]}>
                  <Text style={[styles.nistBadgeText, { color: nistColors[step.nistPhase] }]}>
                    NIST · {step.nistPhase}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.actionText}>{step.action}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Section title="Next actions">
        {result.recommendedActions.map((action) => (
          <View key={action} style={styles.actionRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}
      </Section>
    </View>
  );
}

const severityBorderColor = {
  info: colors.primary,
  warning: colors.warning,
  danger: colors.danger
};

const severityBg = {
  info: colors.primarySoft,
  warning: colors.warningSoft,
  danger: colors.dangerSoft
};

function SignalRow({ signal }: { signal: Signal }) {
  return (
    <View style={[styles.signalRow, { borderLeftColor: severityBorderColor[signal.severity], backgroundColor: severityBg[signal.severity] }]}>
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
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 176,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.lg
  },
  emptyIconWrap: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 68,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 68
  },
  emptyIconEmoji: {
    fontSize: 32
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: spacing.sm,
    textAlign: "center"
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
    textAlign: "center"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center"
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600"
  },
  resultHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  category: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
    textAlign: "right"
  },
  summary: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md
  },
  shareButton: {
    marginTop: spacing.md
  },
  signalRow: {
    borderLeftWidth: 3,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2
  },
  signalBody: {
    flex: 1
  },
  signalLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  signalDetail: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  },
  evidence: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm - 2,
    borderWidth: 1,
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.sm,
    padding: spacing.sm
  },
  linkItem: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
    padding: spacing.sm
  },
  linkIcon: {
    fontSize: 13
  },
  linkText: {
    color: colors.primary,
    flex: 1,
    fontSize: 13
  },
  contactRow: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
    padding: spacing.sm
  },
  contactLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    marginBottom: 2,
    textTransform: "uppercase"
  },
  contactValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  mitreRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  mitreBadge: {
    borderRadius: radii.sm - 2,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    minWidth: 86,
    alignItems: "center"
  },
  mitreId: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.3,
    fontFamily: "monospace" as const
  },
  mitreInfo: {
    flex: 1
  },
  mitreName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700"
  },
  mitreTactic: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 1,
    letterSpacing: 0.2
  },
  planRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  planNumberWrap: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radii.sm - 2,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    marginTop: 2,
    width: 22
  },
  planNumber: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900"
  },
  planStepBody: {
    flex: 1,
    gap: spacing.xs
  },
  nistBadge: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3
  },
  nistBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4
  },
  actionRow: {
    alignItems: "flex-start",
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
