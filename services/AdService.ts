// Check if the native module is available (won't be in Expo Go)
let mobileAds: any = null;
let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;

try {
  const adsModule = require('react-native-google-mobile-ads');
  mobileAds = adsModule.default || adsModule.mobileAds;
  InterstitialAd = adsModule.InterstitialAd;
  AdEventType = adsModule.AdEventType;
  TestIds = adsModule.TestIds;
} catch (error) {
  console.log('AdMob module not available (running in Expo Go - ads will be disabled)');
}

// AdMob Ad Unit ID for Interstitial ads
// This will show between rounds in the game
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? (TestIds?.INTERSTITIAL || 'test-id') // Use test ID in development (automatically used in dev mode)
  : 'ca-app-pub-5925476125839963/8531254723'; // Production Ad Unit ID from AdMob

class AdService {
  private interstitialAd: any = null;
  private isInitialized = false;
  private adLoadPromise: Promise<void> | null = null;
  private isAdMobAvailable = false;

  async initialize() {
    if (this.isInitialized) return;
    
    // Check if AdMob is available
    if (!mobileAds || !InterstitialAd) {
      console.log('AdMob not available - running in Expo Go or module not linked');
      this.isAdMobAvailable = false;
      this.isInitialized = true; // Mark as initialized to prevent retries
      return;
    }

    try {
      this.isAdMobAvailable = true;
      await mobileAds().initialize();
      this.isInitialized = true;
      this.loadInterstitial();
    } catch (error) {
      console.error('AdMob initialization error:', error);
      this.isAdMobAvailable = false;
      this.isInitialized = true; // Mark as initialized to prevent retries
    }
  }

  private async loadInterstitial() {
    if (!this.isAdMobAvailable || !InterstitialAd) {
      return;
    }

    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Preload the ad
      this.adLoadPromise = this.interstitialAd.load();
      await this.adLoadPromise;

      // Set up event listeners for debugging
      if (AdEventType) {
        this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
          console.log('Interstitial ad loaded');
        });

        this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
          console.error('Interstitial ad error:', error);
          // Reload after error
          setTimeout(() => this.loadInterstitial(), 30000);
        });

        this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
          console.log('Interstitial ad closed');
          // Reload ad for next time
          this.loadInterstitial();
        });
      }
    } catch (error) {
      console.error('Error loading interstitial ad:', error);
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // If AdMob is not available (e.g., running in Expo Go), just return false silently
    if (!this.isAdMobAvailable) {
      // Silently skip ads in Expo Go - no need to log every time
      return false;
    }

    try {
      // Wait a bit for ad to load if we just initialized
      if (this.adLoadPromise) {
        await this.adLoadPromise;
      }

      // Wait for ad to be loaded if still loading
      if (this.adLoadPromise) {
        await this.adLoadPromise;
      }

      if (this.interstitialAd && this.interstitialAd.loaded) {
        await this.interstitialAd.show();
        return true;
      } else {
        console.log('Interstitial ad not ready, loading...');
        // Try to load and show if not ready
        await this.loadInterstitial();
        if (this.interstitialAd && this.interstitialAd.loaded) {
          await this.interstitialAd.show();
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }

  isAdReady(): boolean {
    if (!this.isAdMobAvailable) {
      return false;
    }
    return this.interstitialAd?.loaded ?? false;
  }
}

export const adService = new AdService();

