import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button";
import { Section } from "../components/Section";
import { colors, spacing } from "../theme/theme";

const playbooks = [
  {
    title: "Clicked a suspicious link",
    steps: [
      "Close the page and do not enter codes, passwords, or payment details.",
      "Change the affected password from the official app or a typed website.",
      "Turn on MFA and sign out other active sessions when the service supports it."
    ]
  },
  {
    title: "Shared card or bank info",
    steps: [
      "Call the bank using the number on the card or the official website.",
      "Ask about card replacement, account locks, and recent pending activity.",
      "Save screenshots, phone numbers, email addresses, and transaction IDs."
    ]
  },
  {
    title: "Sent a password or MFA code",
    steps: [
      "Change the password from a trusted device.",
      "Remove unfamiliar devices, sessions, recovery emails, or forwarding rules.",
      "Use unique passwords for any accounts that reused the same password."
    ]
  },
  {
    title: "Installed remote access software",
    steps: [
      "Disconnect from the internet if someone still has access.",
      "Uninstall the remote access app and revoke permissions.",
      "Have a trusted technician inspect the device before banking or password changes."
    ]
  }
];

const scamPatterns = [
  "Urgency: threats, deadlines, account locks, or legal consequences.",
  "Payment pressure: gift cards, wire transfers, crypto, Zelle-only requests, or deposits.",
  "Impersonation: banks, carriers, marketplaces, employers, tech support, or family members.",
  "Channel switching: moving to Telegram, WhatsApp, Signal, or an unverified phone number.",
  "Credential capture: requests for passwords, OTP codes, MFA codes, SSN, DOB, or card data."
];

const resources = [
  { label: "Report fraud", url: "https://reportfraud.ftc.gov/" },
  { label: "Identity theft help", url: "https://www.identitytheft.gov/" },
  { label: "FBI IC3 cybercrime report", url: "https://www.ic3.gov/" }
];

export function GuideScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Safety guide</Text>

      <Section title="Fast rule">
        <Text style={styles.body}>
          Treat unexpected requests as untrusted until verified through a channel you already know:
          the official app, a typed website, or a number from a card, bill, or verified account.
        </Text>
      </Section>

      <Section title="If something happened">
        {playbooks.map((playbook) => (
          <View key={playbook.title} style={styles.playbook}>
            <Text style={styles.playbookTitle}>{playbook.title}</Text>
            {playbook.steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
      </Section>

      <Section title="Common scam signals">
        {scamPatterns.map((pattern) => (
          <View key={pattern} style={styles.signalRow}>
            <View style={styles.signalDot} />
            <Text style={styles.signalText}>{pattern}</Text>
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl
  },
  screenTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: spacing.md
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  },
  playbook: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg
  },
  playbookTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: spacing.md
  },
  stepRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  stepNumber: {
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
  stepText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  signalRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  signalDot: {
    backgroundColor: colors.warning,
    borderRadius: 5,
    height: 10,
    marginTop: 5,
    width: 10
  },
  signalText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  resourceList: {
    gap: spacing.sm,
    marginTop: spacing.md
  }
});
