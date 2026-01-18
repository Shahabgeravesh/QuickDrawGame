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
   - **App ID**: Use your bundle identifier from `app.config.js`:
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

## 4. Configure App IDs in Expo Config

Since you're using Expo, configure App IDs through environment variables and `app.config.js`.

### Configure via Environment Variables (Recommended)

Set these in your shell or EAS secrets:

```
ADMOB_ANDROID_APP_ID=ca-app-pub-XXXXXXXX~YYYYYYYY
ADMOB_IOS_APP_ID=ca-app-pub-XXXXXXXX~YYYYYYYY
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXXXXXX/ZZZZZZZZ
EXPO_PUBLIC_ADMOB_TEST_DEVICE_IDS=YOUR_TEST_DEVICE_ID,ANOTHER_ID
```

Then `app.config.js` will wire the App IDs automatically for EAS builds.

### Use the Same Ad Unit ID for Both Platforms

You can create one ad unit and use it for both iOS and Android - AdMob allows this!

## 5. Update `services/AdService.ts`

The Ad Unit ID is now read from `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID` (set via env).

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
- **Production**: Set `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID` before submitting to App Store

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
- **Build errors**: Make sure your App IDs in `app.config.js` env vars are correct

For more help, see: https://developers.google.com/admob

