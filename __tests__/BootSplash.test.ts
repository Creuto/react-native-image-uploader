import { NativeModules } from 'react-native';
import BootSplash, { hide, show, isVisible, getVisibilityStatus } from '../src';

describe('@creuto/react-native-app-splash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Exports', () => {
    it('exports default BootSplash object with methods', () => {
      expect(BootSplash).toBeDefined();
      expect(typeof BootSplash.hide).toBe('function');
      expect(typeof BootSplash.show).toBe('function');
      expect(typeof BootSplash.isVisible).toBe('function');
      expect(typeof BootSplash.getVisibilityStatus).toBe('function');
    });

    it('exports named helper functions matching default export', () => {
      expect(hide).toBe(BootSplash.hide);
      expect(show).toBe(BootSplash.show);
      expect(isVisible).toBe(BootSplash.isVisible);
      expect(getVisibilityStatus).toBe(BootSplash.getVisibilityStatus);
    });
  });

  describe('Module Native Interactions', () => {
    beforeEach(() => {
      NativeModules.RNAppSplash = {
        hide: jest.fn().mockResolvedValue(true),
        show: jest.fn().mockResolvedValue(true),
        isVisible: jest.fn().mockResolvedValue(true),
        getVisibilityStatus: jest.fn().mockResolvedValue('visible'),
      };
    });

    it('calls native hide() successfully', async () => {
      const result = await BootSplash.hide();
      expect(NativeModules.RNAppSplash.hide).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('calls native show() successfully', async () => {
      const result = await BootSplash.show();
      expect(NativeModules.RNAppSplash.show).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('queries isVisible() successfully', async () => {
      const result = await BootSplash.isVisible();
      expect(NativeModules.RNAppSplash.isVisible).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('queries getVisibilityStatus() successfully', async () => {
      const status = await BootSplash.getVisibilityStatus();
      expect(NativeModules.RNAppSplash.getVisibilityStatus).toHaveBeenCalledTimes(1);
      expect(status).toBe('visible');
    });

    it('handles repeated hide() calls safely', async () => {
      await BootSplash.hide();
      await BootSplash.hide();
      await BootSplash.hide();
      expect(NativeModules.RNAppSplash.hide).toHaveBeenCalledTimes(3);
    });
  });

  describe('Fallback and Safety Behavior', () => {
    beforeEach(() => {
      // Simulate unlinked or missing native module
      delete NativeModules.RNAppSplash;
    });

    it('returns false when hide() is called on unlinked native module', async () => {
      const result = await BootSplash.hide();
      expect(result).toBe(false);
    });

    it('returns false when show() is called on unlinked native module', async () => {
      const result = await BootSplash.show();
      expect(result).toBe(false);
    });

    it('returns false when isVisible() is called on unlinked native module', async () => {
      const result = await BootSplash.isVisible();
      expect(result).toBe(false);
    });

    it('returns "hidden" when getVisibilityStatus() is called on unlinked native module', async () => {
      const status = await BootSplash.getVisibilityStatus();
      expect(status).toBe('hidden');
    });
  });
});
