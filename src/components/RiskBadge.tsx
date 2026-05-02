import { StyleSheet, Text, View } from "react-native";

import type { RiskLevel } from "../services/analyzer";
import { colors, radii, spacing } from "../theme/theme";

type RiskBadgeProps = {
  level: RiskLevel;
  score: number;
};

const levelConfig = {
  Low: {
    bg: colors.successSoft,
    border: colors.successBorder,
    color: colors.successText,
    icon: "✓",
    iconBg: colors.success
  },
  Medium: {
    bg: colors.warningSoft,
    border: colors.warningBorder,
    color: colors.warning,
    icon: "!",
    iconBg: colors.warning
  },
  High: {
    bg: colors.dangerSoft,
    border: colors.dangerBorder,
    color: colors.danger,
    icon: "⚠",
    iconBg: colors.danger
  },
  Critical: {
    bg: colors.criticalSoft,
    border: colors.criticalBorder,
    color: colors.critical,
    icon: "✕",
    iconBg: colors.critical
  }
};

export function RiskBadge({ level, score }: RiskBadgeProps) {
  const cfg = levelConfig[level];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <View style={[styles.iconCircle, { backgroundColor: cfg.iconBg }]}>
        <Text style={styles.iconText}>{cfg.icon}</Text>
      </View>
      <View>
        <Text style={[styles.level, { color: cfg.color }]}>{level.toUpperCase()}</Text>
        <Text style={[styles.score, { color: cfg.color }]}>{score} / 100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2
  },
  iconCircle: {
    alignItems: "center",
    borderRadius: radii.pill,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  iconText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  level: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8
  },
  score: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 1,
    opacity: 0.75
  }
});
