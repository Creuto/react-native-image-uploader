/**
 * Status of the native splash screen
 */
export type VisibilityStatus = 'visible' | 'hidden' | 'transitioning';

/**
 * Basic splash configuration options
 */
export interface SplashConfig {
  /**
   * Hex color or named color for background (e.g., "#FFFFFF")
   */
  backgroundColor?: string;
  /**
   * Bundled image/logo asset identifier
   */
  logo?: string;
  /**
   * Optional fade-out animation duration in milliseconds
   */
  fadeDuration?: number;
}

/**
 * Native bridge interface for RNAppSplash
 */
export interface NativeRNAppSplash {
  hide(): Promise<boolean>;
  show(): Promise<boolean>;
  isVisible(): Promise<boolean>;
  getVisibilityStatus(): Promise<VisibilityStatus>;
}
