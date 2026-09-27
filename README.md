# @creuto/react-native-app-splash

<p align="center">
  <a href="https://creuto.com">
    <img src="https://img.shields.io/badge/Powered%20By-Creuto-0066FF?style=for-the-badge&logo=react&logoColor=white" alt="Creuto Product Engineering" />
  </a>
  <img src="https://img.shields.io/npm/v/@creuto/react-native-app-splash?style=for-the-badge&color=00C853" alt="NPM Version" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/platforms-Android%20%7C%20iOS-orange?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Strict" />
</p>

> **High-performance, zero-flicker native splash screen solution for React Native applications by [Creuto](https://creuto.com).**

`@creuto/react-native-app-splash` provides a lightweight, bulletproof native splash screen controller for React Native on Android (including Android 12+ Splash APIs) and iOS. The native launch screen appears instantly on app cold start and remains frozen until your JavaScript application finishes initialization and invokes `BootSplash.hide()`.

---

## 📌 Table of Contents

- [Why `@creuto/react-native-app-splash`?](#-why-creuto-react-native-app-splash)
- [Feature Comparison](#-feature-comparison)
- [Key Features](#-key-features)
- [Installation](#-installation)
  - [iOS Setup](#ios-setup)
  - [Android Setup](#android-setup)
- [Usage & Examples](#-usage--examples)
  - [Basic Initialization](#basic-initialization)
  - [React Navigation Integration](#react-navigation-integration)
- [API Reference](#-api-reference)
  - [`BootSplash.hide()`](#bootsplashhide)
  - [`BootSplash.show()`](#bootsplashshow)
  - [`BootSplash.isVisible()`](#bootsplashisvisible)
  - [`BootSplash.getVisibilityStatus()`](#bootsplashgetvisibilitystatus)
- [Platform Support & Requirements](#-platform-support--requirements)
- [Troubleshooting](#-troubleshooting)
- [About Creuto](#-about-creuto)
- [License](#-license)

---

## ⚡ Why `@creuto/react-native-app-splash`?

During React Native application startup, there is an unavoidable delay while the JS engine initializes, parses the JavaScript bundle, and builds the initial React component tree. Without a native splash screen controller:

1. **White or Black Flash**: Users see a jarring white or black blank screen before React renders.
2. **Layout Jumps**: Images, custom fonts, and async state load asynchronously, causing UI shifts.
3. **Unprofessional UX**: The user experience feels sluggish and incomplete.

`@creuto/react-native-app-splash` fixes startup UX by seamlessly delegating launch screen dismissal to your JavaScript initialization logic.

---

## 📊 Feature Comparison

| Feature | `@creuto/react-native-app-splash` | Default RN Startup | Pure JS Overlays |
| :--- | :---: | :---: | :---: |
| **Instant Native Launch Screen** | ✅ **YES** | ❌ No | ❌ No |
| **Zero White/Black Screen Flash** | ✅ **YES** | ❌ No | ❌ No |
| **Android 12+ SplashScreen API** | ✅ **YES** | ❌ No | ❌ No |
| **iOS KeyWindow Dismissal** | ✅ **YES** | ❌ No | ❌ No |
| **Idempotent / Crash-Proof** | ✅ **YES** | N/A | ❌ No |
| **Zero External Dependencies** | ✅ **YES** | ✅ Yes | ❌ No |
| **Strict TypeScript Support** | ✅ **YES** | ❌ No | ⚠️ Partial |

---

## ✨ Key Features

- 📱 **Native Launch Control**: Android (Kotlin) & iOS (Objective-C/Swift) native modules.
- 🎨 **Android 12+ API Compatibility**: Fully supports modern Android splash window standards.
- 🛡️ **Thread-Safe & Crash-Proof**: Safe to call `hide()` or `show()` repeatedly without race conditions or app crashes.
- ⚡ **Zero Heavy Dependencies**: Pure lightweight native bridge implementation.
- 🔷 **100% Strict TypeScript**: Exported typings with strict type checking.

---

## 📦 Installation

```bash
# Using npm
npm install @creuto/react-native-app-splash

# Using yarn
yarn add @creuto/react-native-app-splash
```

### iOS Setup
For iOS, install CocoaPods dependencies:

```bash
cd ios && pod install && cd ..
```

### Android Setup
React Native autolinks native modules automatically on Android (`compileSdkVersion >= 34` recommended).

---

## 🚀 Usage & Examples

### Basic Initialization

Import `BootSplash` and trigger `hide()` inside your root component's `useEffect`:

```typescript
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BootSplash from '@creuto/react-native-app-splash';

export default function App() {
  useEffect(() => {
    async function initApp() {
      try {
        // Perform app startup work (hydrate state, fetch auth token, pre-cache resources)
        await loadInitialAppData();
      } finally {
        // Smoothly dismiss native splash screen once initial UI is ready
        await BootSplash.hide();
      }
    }

    initApp();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to your React Native App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    color: '#1A202C',
  },
});
```

### React Navigation Integration

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from '@creuto/react-native-app-splash';

export default function AppNavigation() {
  return (
    <NavigationContainer
      onReady={async () => {
        // Hide splash screen as soon as navigation container is mounted and ready
        await BootSplash.hide();
      }}
    >
      {/* App Screens */}
    </NavigationContainer>
  );
}
```

---

## 📖 API Reference

### `BootSplash.hide(): Promise<boolean>`
Dismisses the native launch splash screen with a smooth fade animation.
- **Returns**: `Promise<boolean>` resolving to `true` if successful.
- **Safety**: Idempotent and thread-safe. Multiple calls will resolve safely without error.

```typescript
await BootSplash.hide();
```

### `BootSplash.show(): Promise<boolean>`
Displays the native splash screen overlay.
- **Returns**: `Promise<boolean>` resolving to `true` if successful.

```typescript
await BootSplash.show();
```

### `BootSplash.isVisible(): Promise<boolean>`
Queries whether the native splash screen is currently active or transitioning.

```typescript
const isVisible = await BootSplash.isVisible();
```

### `BootSplash.getVisibilityStatus(): Promise<VisibilityStatus>`
Returns the current visibility state: `'visible' | 'hidden' | 'transitioning'`.

```typescript
const status = await BootSplash.getVisibilityStatus();
```

---

## 🛠️ Platform Support & Requirements

- **React Native**: `>= 0.68.0`
- **React**: `>= 17.0.0`
- **iOS Target**: `>= 11.0`
- **Android SDK**: `minSdkVersion >= 21`, `compileSdkVersion >= 34`

---

## 🔍 Troubleshooting

### Native Module Missing / Linking Warning
If you see `The package '@creuto/react-native-app-splash' doesn't seem to be linked`:
1. Rebuild the app native binary:
   - Android: `npx react-native run-android`
   - iOS: `cd ios && pod install && cd .. && npx react-native run-ios`
2. Ensure you are running on a mobile simulator/device (not Web/SSR).

---

## 🏢 About Creuto

**[Creuto](https://creuto.com)** is a premier product engineering and software development company specializing in high-performance mobile applications, adaptive software systems, and AI-driven solutions.

- 🌐 **Website**: [creuto.com](https://creuto.com)
- 💼 **Custom Development**: Have a mobile or web application project? Reach out to our team at [Creuto](https://creuto.com).
- 📦 **Open Source**: Discover more Creuto packages on [GitHub](https://github.com/Creuto).

---

## 📄 License

MIT © [Creuto](https://creuto.com)
