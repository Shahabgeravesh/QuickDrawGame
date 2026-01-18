# AdMob Quick Start - Get IDs Before Publishing

## ✅ You CAN Get IDs Even If App Isn't Published!

AdMob allows you to create apps and ad units even before your app is on the App Store.

## Step-by-Step:

### 1. Get Your App IDs

1. Go to https://apps.admob.com
2. Click **"Apps"** (left sidebar) → **"Add app"**
3. When asked "Is your app listed on a supported app store?" → Select **"No"**
4. Fill in:
   - **App name**: Quick Draw
   - **Platform**: iOS
   - **App ID**: `com.quickdrawgame.app` (from your app.config.js)
5. Click **"Add"**
6. **Copy the App ID** shown (format: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)

**Repeat steps 2-6 for Android** (select Android platform, same bundle ID)

### 2. Get Your Ad Unit ID

1. Click **"Ad units"** (left sidebar) → **"Add ad unit"**
2. Select your app (iOS or Android - doesn't matter)
3. Select **"Interstitial"** ad format
4. Name it: "Round Transition Ad"
5. Click **"Create ad unit"**
6. **Copy the Ad Unit ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)

### 3. Update Your Config

**Set environment variables:**
```
ADMOB_IOS_APP_ID=ca-app-pub-XXXX~IOS
ADMOB_ANDROID_APP_ID=ca-app-pub-XXXX~ANDROID
EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID=ca-app-pub-XXXX/INTERSTITIAL
```

**Note**: App IDs are wired via `app.config.js`. The Ad Unit ID is read from env.

### 4. Test

- In development (`__DEV__ = true`): Uses test ads automatically ✅
- In production build: Uses your real ad unit ID from env

## That's It!

You can now build your app with EAS. The ads will show between rounds once you've:
1. ✅ Got your Ad Unit ID from AdMob
2. ✅ Added it to your env vars
3. ✅ Built your app with `eas build`

**No need to publish first** - AdMob works with unpublished apps!


