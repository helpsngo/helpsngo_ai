import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

export interface MobileDeviceInfo {
  isNative: boolean;
  platform: 'android' | 'ios' | 'web';
  appId: string;
  version: string;
  isPWA: boolean;
}

export const mobileService = {
  getDeviceInfo(): MobileDeviceInfo {
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform() as 'android' | 'ios' | 'web';
    const isPWA =
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true);

    return {
      isNative,
      platform,
      appId: 'org.helpsngo.app',
      version: '1.0.0 (Build 1)',
      isPWA,
    };
  },

  async initMobileApp(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Configure Status Bar for native Android immersion
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#EA580C' });
    } catch (e) {
      console.warn('[MobileService] StatusBar init skipped', e);
    }

    try {
      // Hide Splash Screen once web app is rendered
      await SplashScreen.hide();
    } catch (e) {
      console.warn('[MobileService] SplashScreen hide skipped', e);
    }

    try {
      // Listen for Android hardware back button
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          CapApp.exitApp();
        } else {
          window.history.back();
        }
      });
    } catch (e) {
      console.warn('[MobileService] BackButton listener skipped', e);
    }
  },

  async hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const capStyle =
          style === 'heavy'
            ? ImpactStyle.Heavy
            : style === 'medium'
            ? ImpactStyle.Medium
            : ImpactStyle.Light;
        await Haptics.impact({ style: capStyle });
      } else if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(style === 'heavy' ? [40] : style === 'medium' ? [25] : [15]);
      }
    } catch {
      // Ignore vibration errors on unsupported devices
    }
  },

  async hapticNotification(type: 'success' | 'warning' | 'error' = 'success'): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const notifType =
          type === 'error'
            ? NotificationType.Error
            : type === 'warning'
            ? NotificationType.Warning
            : NotificationType.Success;
        await Haptics.notification({ type: notifType });
      } else if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        if (type === 'success') navigator.vibrate([20, 50, 30]);
        else if (type === 'error') navigator.vibrate([40, 40, 40]);
        else navigator.vibrate([30]);
      }
    } catch {
      // Ignore vibration errors
    }
  },
};
