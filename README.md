# Scam Shield Android

Android-first Expo React Native app for analyzing suspicious SMS, email, marketplace, delivery, job, banking, and social messages.

## Download APK

Install the latest Android APK:

- GitHub: [dist/scam-shield-v0.1.0.apk](dist/scam-shield-v0.1.0.apk)
- Expo artifact: https://expo.dev/artifacts/eas/6LwLToQMVQUjvJJCSomYPx.apk

SHA-256:

```text
90115b3b664392a7d9200348bc4db4fb7461eab3b9fd9a95561dc8e27febe306
```

## What it does

- Lets a user paste a suspicious message.
- Scores likely scam risk locally with deterministic rules.
- Highlights red flags and suspicious links.
- Extracts visible phone numbers and email addresses from suspicious messages.
- Builds a shareable plain-English scan report.
- Shows a response plan for what to do next.
- Gives plain-English next actions.
- Saves scan history on-device.
- Includes a Safety Guide tab with common scam signals, incident playbooks, and reporting resources.
- Keeps AI/API keys out of the mobile app. A future backend endpoint can be configured in Settings.

## Run on Android

```bash
npm install
npm run start
```

Then open the Expo Go app on Android and scan the QR code. Your phone and this machine need to
be on the same network. If LAN discovery is blocked, use:

```bash
npm run start:tunnel
```

On a machine with the Android SDK and `adb` installed, you can also run:

```bash
npm run android
```

## Production architecture

Do not put an AI provider key in the app. Use:

```text
Android app -> your backend -> AI provider
```

The included local analyzer gives useful MVP behavior without sending private messages off-device. When a backend is added, it should enforce authentication, rate limits, privacy controls, model prompts, and cost limits.

## Build an APK

```bash
npx eas-cli build -p android --profile apk
```

The `apk` EAS profile builds an installable Android Package instead of the Play Store `.aab`
format.
