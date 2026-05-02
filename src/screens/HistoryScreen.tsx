import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button";
import { RiskBadge } from "../components/RiskBadge";
import { Section } from "../components/Section";
import type { HistoryItem } from "../services/storage";
import { colors, radii, shadows, spacing } from "../theme/theme";

type HistoryScreenProps = {
  history: HistoryItem[];
  onClear: () => void;
  onOpen: (item: HistoryItem) => void;
};

const riskAccent = {
  Low: colors.success,
  Medium: colors.warning,
  High: colors.danger,
  Critical: colors.critical
};

const riskAccentBg = {
  Low: colors.successSoft,
  Medium: colors.warningSoft,
  High: colors.dangerSoft,
  Critical: colors.criticalSoft
};

export function HistoryScreen({ history, onClear, onOpen }: HistoryScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.screenTitle}>Scan History</Text>
          <Text style={styles.screenSubtitle}>
            {history.length === 0 ? "No scans yet" : `${history.length} saved on this device`}
          </Text>
        </View>
        {history.length > 0 ? <Button label="Clear all" onPress={onClear} variant="danger" /> : null}
      </View>

      {history.length === 0 ? (
        <Section>
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🕐</Text>
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptyText}>
              Each message you analyze is saved here so you can review past results.
            </Text>
          </View>
        </Section>
      ) : (
        history.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => onOpen(item)}
            style={({ pressed }) => [styles.historyItem, pressed && styles.historyItemPressed]}
          >
            <View style={[styles.riskStripe, { backgroundColor: riskAccent[item.result.riskLevel] }]} />
            <View style={[styles.historyInner, { backgroundColor: riskAccentBg[item.result.riskLevel] }]}>
              <View style={styles.historyHeader}>
                <RiskBadge level={item.result.riskLevel} score={item.result.score} />
                <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
              </View>
              <Text numberOfLines={1} style={styles.category}>
                {item.result.category}
              </Text>
              <Text numberOfLines={2} style={styles.preview}>
                {item.message}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  screenTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.2
  },
  screenSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.lg
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.md
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
    lineHeight: 20,
    textAlign: "center"
  },
  historyItem: {
    borderRadius: radii.md,
    flexDirection: "row",
    marginBottom: spacing.sm,
    overflow: "hidden",
    ...shadows.card
  },
  historyItemPressed: {
    opacity: 0.82
  },
  riskStripe: {
    width: 5
  },
  historyInner: {
    flex: 1,
    padding: spacing.md
  },
  historyHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  dateText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  category: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: spacing.xs
  },
  preview: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19
  }
});
