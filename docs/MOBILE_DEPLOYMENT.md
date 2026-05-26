# 📱 OpenPrimer Mobile Deployment Guide

This guide explains how to run, test, and deploy the OpenPrimer mobile app located in the `/mobile` directory.

## 🛠️ Prerequisites
- Node.js (v18+)
- Expo CLI: `npm install -g expo-cli`
- **Expo Go** app installed on your physical device (iOS or Android).

## 🚀 Local Development
1. Navigate to the mobile directory: `cd mobile`
2. Install dependencies: `npm install`
3. Start the project: `npx expo start`
4. **Scan the QR Code** with your phone's camera (iOS) or the Expo Go app (Android) to see the app live.

## 📦 Building for Production (App Store / Play Store)
OpenPrimer uses **EAS (Expo Application Services)** for industrial builds.

1. **Install EAS CLI**: `npm install -g eas-cli`
2. **Login to Expo**: `eas login`
3. **Configure Project**: `eas build:configure`
4. **Build APK (Android)**: `eas build --platform android --profile preview`
5. **Build IPA (iOS)**: `eas build --platform ios`

## 🔗 Connecting to Content
The mobile app is designed to fetch MDX content from your Vercel URL.
Update the `BASE_API_URL` in `App.js` to point to your live OpenPrimer site to fetch real-time updates.

---
*OpenPrimer Mobile • Industrial Deployment Phase*
