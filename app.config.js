export default {
  expo: {
    name: 'Quick Draw',
    slug: 'quickdrawgame',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/AppIcon.appiconset/1024.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#6366F1',
    },
    ios: {
      icon: './assets/AppIcon.appiconset/1024.png',
      supportsTablet: true,
      bundleIdentifier: 'com.quickdrawgame.app',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
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
    extra: {
      eas: {
        projectId: 'd79a2499-d662-4fe3-af6e-dce0417488c2',
      },
    },
  },
};

