import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button";
import { Section } from "../components/Section";
import { colors, radii, spacing } from "../theme/theme";

const playbooks = [
  {
    title: "Clicked a suspicious link",
    icon: "🔗",
    steps: [
      "Close the page and do not enter codes, passwords, or payment details.",
      "Change the affected password from the official app or a typed website.",
      "Turn on MFA and sign out other active sessions when the service supports it."
    ]
  },
  {
    title: "Shared card or bank info",
    icon: "💳",
    steps: [
      "Call the bank using the number on the card or the official website.",
      "Ask about card replacement, account locks, and recent pending activity.",
      "Save screenshots, phone numbers, email addresses, and transaction IDs."
    ]
  },
  {
    title: "Sent a password or MFA code",
    icon: "🔑",
    steps: [
      "Change the password from a trusted device.",
      "Remove unfamiliar devices, sessions, recovery emails, or forwarding rules.",
      "Use unique passwords for any accounts that reused the same password."
    ]
  },
  {
    title: "Installed remote access software",
    icon: "🖥",
    steps: [
      "Disconnect from the internet if someone still has access.",
      "Uninstall the remote access app and revoke permissions.",
      "Have a trusted technician inspect the device before banking or password changes."
    ]
  }
];

const scamPatterns = [
  { icon: "⏰", text: "Urgency: threats, deadlines, account locks, or legal consequences." },
  { icon: "💸", text: "Payment pressure: gift cards, wire transfers, crypto, Zelle-only requests." },
  { icon: "🎭", text: "Impersonation: banks, carriers, marketplaces, employers, or family." },
  { icon: "📱", text: "Channel switching: moving to Telegram, WhatsApp, or unverified numbers." },
  { icon: "🔐", text: "Credential capture: passwords, OTP codes, MFA codes, SSN, card data." }
];

const resources = [
  { label: "🏛  Report fraud — FTC", url: "https://reportfraud.ftc.gov/" },
  { label: "🪪  Identity theft help — IdentityTheft.gov", url: "https://www.identitytheft.gov/" },
  { label: "🌐  FBI cybercrime report — IC3", url: "https://www.ic3.gov/" }
];

export function GuideScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Safety Guide</Text>

      <Section title="Fast rule">
        <View style={styles.fastRuleBox}>
          <Text style={styles.fastRuleEmoji}>💡</Text>
          <Text style={styles.fastRuleText}>
            Treat unexpected requests as untrusted until verified through a channel you already know:
            the official app, a typed website, or a number from your card or bill.
          </Text>
        </View>
      </Section>

      <Section title="If something happened">
        {playbooks.map((playbook, pIndex) => (
          <View key={playbook.title} style={[styles.playbook, pIndex === playbooks.length - 1 && styles.playbookLast]}>
            <View style={styles.playbookHeader}>
              <Text style={styles.playbookIcon}>{playbook.icon}</Text>
              <Text style={styles.playbookTitle}>{playbook.title}</Text>
            </View>
            {playbook.steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepNumberWrap}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
      </Section>

      <Section title="Common scam signals">
        {scamPatterns.map((pattern) => (
          <View key={pattern.text} style={styles.signalRow}>
            <Text style={styles.signalIcon}>{pattern.icon}</Text>
            <Text style={styles.signalText}>{pattern.text}</Text>
          </View>
        ))}
      </Section>

      <Section title="Reporting resources">
        <Text style={styles.body}>
          Use official reporting sites when money, identity data, or account access may be involved.
        </Text>
        <View style={styles.resourceList}>
          {resources.map((resource) => (
            <Button
              key={resource.url}
              label={resource.label}
              onPress={() => Linking.openURL(resource.url)}
              variant="secondary"
            />
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm
  },
  screenTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.2,
    marginBottom: spacing.md
  },
  fastRuleBox: {
    alignItems: "flex-start",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  fastRuleEmoji: {
    fontSize: 18,
    marginTop: 1
  },
  fastRuleText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 14,
    lineHeight: 21
  },
  playbook: {
    borderBottomColor: colors.borderFaint,
    borderBottomWidth: 1,
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg
  },
  playbookLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0
  },
  playbookHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  playbookIcon: {
    fontSize: 18
  },
  playbookTitle: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "900"
  },
  stepRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  stepNumberWrap: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderRadius: radii.sm - 2,
    borderWidth: 1,
    height: 22,
    justifyContent: "center",
    width: 22
  },
  stepNumber: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900"
  },
  stepText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  signalRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  signalIcon: {
    fontSize: 16,
    marginTop: 1
  },
  signalText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.md
  },
  resourceList: {
    gap: spacing.sm
  }
});
