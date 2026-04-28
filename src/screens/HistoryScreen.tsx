import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button";
import { RiskBadge } from "../components/RiskBadge";
import { Section } from "../components/Section";
import type { HistoryItem } from "../services/storage";
import { colors, spacing } from "../theme/theme";

type HistoryScreenProps = {
  history: HistoryItem[];
  onClear: () => void;
  onOpen: (item: HistoryItem) => void;
};

export function HistoryScreen({ history, onClear, onOpen }: HistoryScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Recent scans</Text>
        {history.length > 0 ? <Button label="Clear" onPress={onClear} variant="danger" /> : null}
      </View>

      {history.length === 0 ? (
        <Section>
          <Text style={styles.emptyTitle}>No saved scans</Text>
          <Text style={styles.emptyText}>Analyze a message and it will be saved on this device.</Text>
        </Section>
      ) : (
        history.map((item) => (
          <Pressable key={item.id} onPress={() => onOpen(item)} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <RiskBadge level={item.result.riskLevel} score={item.result.score} />
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            </View>
            <Text numberOfLines={1} style={styles.category}>
              {item.result.category}
            </Text>
            <Text numberOfLines={3} style={styles.preview}>
              {item.message}
            </Text>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  screenTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14
  },
  historyItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg
  },
  historyHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  dateText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  category: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: spacing.xs
  },
  preview: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
