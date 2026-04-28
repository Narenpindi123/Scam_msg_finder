import { StyleSheet, Text, View } from "react-native";

import type { RiskLevel } from "../services/analyzer";
import { colors, spacing } from "../theme/theme";

type RiskBadgeProps = {
  level: RiskLevel;
  score: number;
};

const stylesByLevel = {
  Low: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
    color: colors.successText
  },
  Medium: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warning,
    color: colors.warning
  },
  High: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    color: colors.danger
  },
  Critical: {
    backgroundColor: colors.criticalSoft,
    borderColor: colors.critical,
    color: colors.critical
  }
};

export function RiskBadge({ level, score }: RiskBadgeProps) {
  const levelStyle = stylesByLevel[level];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: levelStyle.backgroundColor,
          borderColor: levelStyle.borderColor
        }
      ]}
    >
      <Text style={[styles.level, { color: levelStyle.color }]}>{level}</Text>
      <Text style={[styles.score, { color: levelStyle.color }]}>{score}/100</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 38,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  level: {
    fontSize: 15,
    fontWeight: "900"
  },
  score: {
    fontSize: 13,
    fontWeight: "800"
  }
});
