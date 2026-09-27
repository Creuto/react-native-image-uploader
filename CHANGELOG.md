# Changelog

All notable changes to `@creuto/react-native-app-splash` will be documented in this file.

## [0.1.0] - 2026-09-23

### Added
- Initial release of `@creuto/react-native-app-splash`.
- Core native splash screen control: `hide()`, `show()`, `isVisible()`, `getVisibilityStatus()`.
- Native Kotlin implementation for Android supporting Android 12+ splash APIs and UI thread safety.
- Native Objective-C/Swift implementation for iOS supporting main queue execution and key window dismissal.
- Comprehensive TypeScript declarations and default `BootSplash` export.
- Full Jest unit test suite covering native calls, fallback safety, and idempotency.
- Minimal interactive React Native example application (`example/`).
