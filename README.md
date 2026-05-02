# Scam Shield

Scam Shield is an Android app that helps users check suspicious text messages, emails, direct messages, marketplace messages, delivery notices, job offers, and banking alerts.

The app runs its scam check locally on the phone. Users can paste a message, review the risk score, see the red flags, and get simple next steps.

## Download

Download the APK from GitHub:

[Download Scam Shield APK](https://github.com/Narenpindi123/Scam_msg_finder/raw/refs/heads/master/dist/scam-shield-v0.1.0.apk)

Backup Expo download:

https://expo.dev/artifacts/eas/6LwLToQMVQUjvJJCSomYPx.apk

APK checksum:

```text
90115b3b664392a7d9200348bc4db4fb7461eab3b9fd9a95561dc8e27febe306
```

## Install On Android

1. Download the APK on your Android phone.
2. Open the downloaded file.
3. If Android asks for permission, allow installs from that browser or file manager.
4. Tap Install.
5. Open Scam Shield.

## Features

- Paste a suspicious message and scan it.
- Get a risk score from Low to Critical.
- See red flags such as payment pressure, credential requests, fake delivery links, suspicious domains, and impersonation.
- Detect visible links, phone numbers, and email addresses.
- View a response plan for what to do next.
- Share a plain-English scam report.
- Save recent scans on the device.
- Use the Safety Guide for common scam patterns and reporting resources.

## Privacy

Scam Shield analyzes messages locally in this version. The pasted message is not sent to an AI provider or external server by default.

If a backend is added later, API keys should stay on the backend server, not inside the Android app.

## Developer Setup

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm run start
```

Then open Expo Go on Android and scan the QR code.

Run the type check:

```bash
npm run typecheck
```

Build a new APK with EAS:

```bash
npx eas-cli build -p android --profile apk
```

## Project

- Framework: Expo React Native
- Platform: Android
- Package name: `com.naren.scamshield`
- Current APK: `dist/scam-shield-v0.1.0.apk`
