# 📦 OpenPrimer Compilation & Publication Guide
## Google Play Store, Apple App Store & Chrome Web Store

This technical guide walks you through the step-by-step process of building, signing, and submitting your OpenPrimer applications to various application stores.

---

## 📂 Table of Contents
1. [📱 Configuration & Preparation (EAS CLI)](#1-configuration--preparation-eas-cli)
2. [🤖 Publishing on the Google Play Store (Android)](#2-publishing-on-the-google-play-store-android)
3. [🍏 Publishing on the Apple App Store (iOS)](#3-publishing-on-the-apple-app-store-ios)
4. [🌐 Publishing on the Chrome Web Store (Web/PWA Option)](#4-publishing-on-the-chrome-web-store-webpwa-option)
5. [🔄 Summary of Key Commands](#5-summary-of-key-commands)

---

## 1. 📱 Configuration & Preparation (EAS CLI)

OpenPrimer uses **Expo SDK 50**. To build your mobile application professionally and securely, we utilize **EAS (Expo Application Services)**. EAS performs highly optimized cloud builds, manages your signing keys (Keystores/Certificats), and eliminates the need to install Android Studio or Xcode locally.

### Step 1.1: Install EAS CLI Globally
Open your terminal and run:
```bash
npm install -g eas-cli
```

### Step 1.2: Log in or Create an Expo Account
Log in to your Expo account via the command line interface:
```bash
eas login
```
*(If you do not have an account, create one for free at [expo.dev](https://expo.dev/)).*

### Step 1.3: Initialize EAS in Your Mobile Project
Navigate to your `/mobile` folder and configure EAS:
```bash
cd mobile
eas build:configure
```
This command automatically creates an `eas.json` file at the root of your `/mobile` directory. This file governs build profiles (development, preview, production).

---

## 2. 🤖 Publishing on the Google Play Store (Android)

To submit your Android application to Google Play, you need to generate a signed **Android App Bundle (.aab)** file.

### Step 2.1: Configure `mobile/app.json`
Ensure that your application's unique identifier is correct in the `app.json` file:
```json
{
  "expo": {
    "name": "OpenPrimer",
    "slug": "openprimer-mobile",
    "version": "1.0.0",
    "android": {
      "package": "app.openprimer.mobile",
      "versionCode": 1
    }
  }
}
```
> [!IMPORTANT]
> Each time you publish an update to the Play Store, you must increment the `versionCode` (e.g., 2, 3...) in `app.json`.

### Step 2.2: Launch Android Build (.aab)
Run the following command inside the `/mobile` directory:
```bash
npm run build:android
```
*(Or directly: `eas build --platform android --profile production`)*

#### Build Workflow:
1. **Signing File (Keystore):** EAS will ask if you want it to manage your Android signing key. Select **Yes** (recommended). Expo will safely generate and store your production Keystore.
2. **Cloud Queue:** Your project is uploaded to Expo's servers, compiled in an isolated environment, and optimized.
3. **Download:** Once compile-checking and building are completed, EAS provides a web link to download your final `app-release.aab` file.

---

### Step 2.3: Set Up Your Google Play Console Account
1. Go to the [Google Play Console](https://play.google.com/console/).
2. Create a Google Play developer account (one-time registration fee of **$25**).
3. Click on **Create app**:
   * App name: `OpenPrimer`.
   * Default language: `French` (or your preferred default).
   * App or game: `App`.
   * Free or paid: `Free`.

### Step 2.4: Complete the Mandatory Checklist (Store Listing)
Google requires completing compliance questionnaires before allowing publishing:
* **Privacy Policy:** Provide the URL of your privacy policy page (e.g., `https://openprimer.vercel.app/privacy`).
* **App Access:** Choose "All functionality is available without special access".
* **Ads:** Declare that your app does not contain ads.
* **Content Rating:** Fill in the questionnaire to obtain a PEGI rating (PEGI 3 recommended).
* **Target Audience:** Define the age group (e.g., 13 and older or Adults).

### Step 2.5: Upload the Build (.aab) and Publish
1. In the left menu, navigate to **Production** under the *Release* section.
2. Click on **Create new release**.
3. Drag and drop the `.aab` file downloaded in step 2.2.
4. Fill in release notes (e.g., *"Initial release of the OpenPrimer educational platform"*).
5. Save and click **Review release**, then roll out the release to Production.
6. Your application will enter the **In review** status. Google's review process typically takes between 2 and 5 days for the first release.

---

## 3. 🍏 Publishing on the Apple App Store (iOS)

If you target **iOS (Apple App Store)**, here is the official deployment procedure.

### Step 3.1: Enroll in the Apple Developer Program
Apple requires an annual subscription fee of **$99/year** to publish on the App Store. Create your account at [Apple Developer](https://developer.apple.com/).

### Step 3.2: Build the iOS Application (.ipa)
Run the following command inside the `/mobile` directory:
```bash
npm run build:ios
```
*(Or directly: `eas build --platform ios --profile production`)*

#### Apple Credentials Management:
1. EAS will ask you to log in to your Apple Developer Account.
2. It will automatically generate the required Provisioning Profiles and production distribution Certificates for you.
3. It compiles the application on the cloud and delivers a signed `.ipa` package.

### Step 3.3: Upload the Build to App Store Connect
To upload the application directly from Expo to Apple without needing a Mac:
```bash
eas submit --platform ios
```
This command takes the cloud-built `.ipa` file and injects it seamlessly into your **App Store Connect** account.

### Step 3.4: Final Submission on App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com/).
2. Select your application, fill in metadata (screenshots, description, privacy policy link).
3. Select the build uploaded in the previous step.
4. Click **Submit for Review**. Apple's review process usually takes 24 to 48 hours.

---

## 4. 🌐 Publishing on the Chrome Web Store (Web/PWA Option)

If you want to offer OpenPrimer as a **Chrome Browser Extension** or an installable **PWA App** directly from Google Chrome, follow this workflow.

### Option A: Enable Progressive Web App (PWA) on the Web
This is Google's recommended method to distribute web apps as native apps on PC, Mac, ChromeOS, and Android.
1. Our Next.js platform (`/web`) can be configured with a `manifest.json` and a Service Worker to cache key assets.
2. When users visit `openprimer.vercel.app` in Chrome, an **"Install App"** icon appears directly in their address bar.

### Option B: Publish a Chrome Extension Shortcut
To distribute OpenPrimer officially on the [Chrome Web Store](https://chrome.google.com/webstore):

1. **Create an Extension Directory:**
   Create a lightweight directory containing a `manifest.json` and application icons:
   ```json
   {
     "manifest_version": 3,
     "name": "OpenPrimer",
     "version": "1.0.0",
     "description": "Access your AI tutor and scientific curriculum with a single click.",
     "icons": {
       "16": "icon16.png",
       "48": "icon48.png",
       "128": "icon128.png"
     },
     "action": {
       "default_popup": "popup.html"
     }
   }
   ```
2. **Create `popup.html`:**
   This file embeds or redirects to the live Next.js app:
   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="utf-8">
       <style>
         body { width: 320px; height: 400px; margin: 0; padding: 0; font-family: sans-serif; }
         iframe { border: none; width: 100%; height: 100%; }
       </style>
     </head>
     <body>
       <iframe src="https://openprimer.vercel.app"></iframe>
     </body>
   </html>
   ```
3. **Zip the Directory:** Compress the directory containing `manifest.json`, `popup.html`, and icons into a `.zip` file.
4. **Submit on the Chrome Developer Dashboard:**
   * Go to the [Chrome Developer Console](https://chrome.google.com/webstore/devconsole).
   * Pay the one-time **$5** developer registration fee.
   * Click **Add new item**, upload your `.zip` file.
   * Complete the product listing (title, description, screenshots) and publish. Review takes about 1 to 3 days.

---

## 5. 🔄 Summary of Key Commands

Here is a summary of the commands required to maintain and update your mobile ecosystem:

| Command | Action | Scope / Context |
| :--- | :--- | :--- |
| `npm install -g eas-cli` | Install Expo Application Services CLI | Dev PC (Global) |
| `eas login` | Authenticate to your Expo account | Terminal |
| `eas build:configure` | Configure EAS inside `/mobile` | Mobile Directory |
| `npm run build:android` | Build Production Android App Bundle (`.aab`) | Expo Cloud |
| `npm run build:ios` | Build Production iOS Package (`.ipa`) | Expo Cloud |
| `eas submit --platform ios` | Upload the iOS build directly to Apple | App Store Connect |
| `eas build --list` | List active or past builds | Terminal |

> [!TIP]
> **Backup Warning:** Keep your Expo credentials safe. If you lose your Android signing key (Keystore), Google Play will refuse any future updates of your app. EAS handles this backup for you automatically in the Expo cloud.
