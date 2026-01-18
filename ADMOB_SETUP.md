# AdMob Setup Guide

Ads have been integrated into your app to show between rounds. Follow these steps to complete the setup:

## 1. Create AdMob Account

1. Go to https://apps.admob.com and sign in with your Google account
2. Create a new AdMob account (if you don't have one)

## 2. Add Your App (Even If Not Published!)

**You can create an app in AdMob even before it's published!**

1. In AdMob dashboard, click "Apps" → "Add app"
2. Select **"No, my app is not listed on any app store"**
3. Fill in your app details:
   - **App name**: Quick Draw (or your app name)
   - **Platform**: Select both iOS and Android (you'll need to add them separately)
   - **App ID**: Use your bundle identifier from `app.json`:
     - iOS: `com.quickdrawgame.app`
     - Android: `com.quickdrawgame.app`
4. Click "Add app"

**Repeat this for both iOS and Android** - you'll get separate App IDs for each.

## 3. Get Your App IDs

After adding your apps:

1. Go to "Apps" in AdMob dashboard
2. You'll see your apps listed
3. Click on each app to see its details
4. Find the **App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
5. Note down both iOS and Android App IDs

## 4. Create Interstitial Ad Units

1. In AdMob, go to "Ad units" → "Add ad unit"
2. Select the app you want to create the ad unit for
3. Select "Interstitial" ad format
4. Name it (e.g., "Round Transition Ad")
5. Click "Create ad unit"
6. Copy the **Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

**Important**: Create separate ad units for iOS and Android, OR you can use the same ad unit ID for both platforms (AdMob allows this).

## 4. Configure App IDs in Native Code

Since you're using Expo, you'll need to configure the App IDs when building. For EAS Build, you have two options:

### Option A: Configure during EAS Build (Recommended)

The App IDs will be configured in the native iOS and Android projects during the build process. You can add them to `app.json` for easier management:

```json
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.quickdrawgame.app",
  "buildNumber": "1.0.0",
  "config": {
    "googleMobileAdsAppId": "ca-app-pub-YOUR-IOS-APP-ID"
  }
},
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#6366F1"
  },
  "edgeToEdgeEnabled": true,
  "predictiveBackGestureEnabled": false,
  "package": "com.quickdrawgame.app",
  "config": {
    "googleMobileAdsAppId": "ca-app-pub-YOUR-ANDROID-APP-ID"
  }
}
```

**OR** configure them directly in the native project files after running `eas build --local` or during the build process.

### Option B: Use the Same Ad Unit ID for Both Platforms

You can create one ad unit and use it for both iOS and Android - AdMob allows this!

## 5. Update `services/AdService.ts`

Replace the placeholder in `INTERSTITIAL_AD_UNIT_ID`:

```typescript
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL // Use test ID in development
  : 'ca-app-pub-YOUR-AD-UNIT-ID'; // Replace with your production ID
```

**Tip**: You can use the same Ad Unit ID for both platforms, or create separate ones for better analytics.

## 5. Rebuild Your App

Since `react-native-google-mobile-ads` is a native module, you need to rebuild:

```bash
# For iOS
eas build --platform ios

# For Android
eas build --platform android
```

You cannot test ads in Expo Go - you must create a development build or production build.

## 6. Testing

- **Development**: The app uses test ad IDs automatically (`TestIds.INTERSTITIAL`)
- **Production**: Replace with your real ad unit ID before submitting to App Store

## How It Works

- Ads show automatically between rounds (after the first round)
- Ads do NOT show:
  - After the final round (game end)
  - On the first round
  - If an ad fails to load (game continues normally)

## Important Notes

1. **GDPR/Privacy**: You may need to implement consent mechanisms for EU users
2. **Test Ads**: Always use test ads during development to avoid policy violations
3. **Revenue**: Revenue depends on impressions, clicks, and ad quality. Typical eCPM ranges from $1-10+ depending on region and ad quality
4. **App Store**: Make sure your app's privacy policy mentions ad collection if required by app stores

## Troubleshooting

- **Ads not showing**: Make sure you've rebuilt the app after adding native code
- **Test ads in production**: Never use test ad IDs in production builds
- **Build errors**: Make sure your App IDs in `app.json` are correct

For more help, see: https://developers.google.com/admob

