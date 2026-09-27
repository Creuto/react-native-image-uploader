/**
 * @creuto/react-native-app-splash
 * High-performance, lightweight native splash screen solution for React Native applications by Creuto.
 * https://creuto.com
 */

import { NativeModules } from 'react-native';
import type { NativeRNAppSplash, VisibilityStatus, SplashConfig } from './types';

export type { NativeRNAppSplash, VisibilityStatus, SplashConfig };

const LINKING_ERROR =
  `The package '@creuto/react-native-app-splash' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not running on web or an unsupported target platform\n';

function getNativeModule(): NativeRNAppSplash | null {
  return NativeModules.RNAppSplash ?? null;
}

/**
 * Hides the native splash screen.
 * Safe to call multiple times or before native layer initialization completes.
 */
export async function hide(): Promise<boolean> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    if (__DEV__) {
      console.warn(LINKING_ERROR);
    }
    return false;
  }
  try {
    return await nativeModule.hide();
  } catch (error) {
    if (__DEV__) {
      console.warn('[RNAppSplash] Error hiding splash screen:', error);
    }
    return false;
  }
}

/**
 * Shows the native splash screen overlay.
 * Safe to call multiple times.
 */
export async function show(): Promise<boolean> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    if (__DEV__) {
      console.warn(LINKING_ERROR);
    }
    return false;
  }
  try {
    return await nativeModule.show();
  } catch (error) {
    if (__DEV__) {
      console.warn('[RNAppSplash] Error showing splash screen:', error);
    }
    return false;
  }
}

/**
 * Checks whether the splash screen is currently visible.
 */
export async function isVisible(): Promise<boolean> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    return false;
  }
  try {
    return await nativeModule.isVisible();
  } catch {
    return false;
  }
}

/**
 * Gets the current visibility status of the splash screen.
 */
export async function getVisibilityStatus(): Promise<VisibilityStatus> {
  const nativeModule = getNativeModule();
  if (!nativeModule) {
    return 'hidden';
  }
  try {
    return await nativeModule.getVisibilityStatus();
  } catch {
    return 'hidden';
  }
}

const BootSplash = {
  hide,
  show,
  isVisible,
  getVisibilityStatus,
};

export default BootSplash;
