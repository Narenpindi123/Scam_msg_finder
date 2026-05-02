import { Alert, Linking, StyleSheet, Text, View } from "react-native";

import { Button } from "./Button";
import type { AvailableAppUpdate } from "../services/appUpdate";
import { colors, radii, shadows, spacing } from "../theme/theme";

type AppUpdateBannerProps = {
  onDismiss: () => void;
  update: AvailableAppUpdate;
};

export function AppUpdateBanner({ onDismiss, update }: AppUpdateBannerProps) {
  const handleDownload = async () => {
    const canOpen = await Linking.canOpenURL(update.apkUrl);

    if (!canOpen) {
      Alert.alert("Download unavailable", "Android could not open the GitHub download link.");
      return;
    }

    await Linking.openURL(update.apkUrl);
  };

  return (
    <View style={styles.banner}>
      <View style={styles.indicator} />
      <View style={styles.inner}>
        <View style={styles.copy}>
          <Text style={styles.title}>⬆  {update.title}</Text>
          <Text style={styles.body}>
            {update.message} v{update.latestVersion} is ready.
          </Text>
        </View>
        <View style={styles.actions}>
          <Button label="Download" onPress={handleDownload} style={styles.primaryAction} />
          <Button label="Later" onPress={onDismiss} style={styles.secondaryAction} variant="secondary" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warningBorder,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.sm
  },
  indicator: {
    backgroundColor: colors.warning,
    width: 4
  },
  inner: {
    flex: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  copy: {
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  primaryAction: {
    flex: 1,
    minHeight: 40
  },
  secondaryAction: {
    flex: 0.6,
    minHeight: 40
  }
});
