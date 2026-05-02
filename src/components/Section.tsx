import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing } from "../theme/theme";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      {title ? (
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.card
  },
  titleRow: {
    borderBottomColor: colors.borderFaint,
    borderBottomWidth: 1,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm
  },
  title: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4
  }
});
