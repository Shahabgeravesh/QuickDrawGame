const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    console.warn(`[app.config] Missing environment variable: ${key}`);
  }
  return value;
};

const getOptionalEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    console.warn(`[app.config] Optional environment variable not set: ${key}`);
  }
  return value;
};

export default {
  expo: {
    name: 'Quick Draw',
    slug: 'quickdrawgame',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#6366F1',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.quickdrawgame.app',
      buildNumber: '1.0.0',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#6366F1',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.quickdrawgame.app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: getOptionalEnv('ADMOB_ANDROID_APP_ID'),
          iosAppId: getRequiredEnv('ADMOB_IOS_APP_ID'),
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'd79a2499-d662-4fe3-af6e-dce0417488c2',
      },
    },
  },
};

