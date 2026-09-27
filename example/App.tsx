import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import BootSplash, { VisibilityStatus } from '@creuto/react-native-app-splash';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [status, setStatus] = useState<VisibilityStatus>('visible');
  const [visible, setVisible] = useState(true);

  const checkSplashStatus = async () => {
    const isVis = await BootSplash.isVisible();
    const currentStatus = await BootSplash.getVisibilityStatus();
    setVisible(isVis);
    setStatus(currentStatus);
  };

  useEffect(() => {
    async function initApp() {
      // Simulate app initialization tasks (fetching token, loading cache, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await BootSplash.hide();
      setInitializing(false);
      await checkSplashStatus();
    }

    initApp();
  }, []);

  const handleHide = async () => {
    await BootSplash.hide();
    await checkSplashStatus();
  };

  const handleShow = async () => {
    await BootSplash.show();
    await checkSplashStatus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>@creuto/react-native-app-splash</Text>
        <Text style={styles.subtitle}>Example Application</Text>

        {initializing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066FF" />
            <Text style={styles.loadingText}>Initializing application state...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Splash Screen Status</Text>
            <Text style={styles.statusText}>Is Visible: {visible ? 'YES' : 'NO'}</Text>
            <Text style={styles.statusText}>Visibility Status: {status.toUpperCase()}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleHide}>
                <Text style={styles.buttonText}>Hide Splash</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleShow}>
                <Text style={styles.buttonText}>Show Splash</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={checkSplashStatus}>
              <Text style={styles.refreshButtonText}>Refresh Status</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
    marginTop: 4,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4A5568',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#4A5568',
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  secondaryButton: {
    backgroundColor: '#4A5568',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  refreshButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#0066FF',
    fontWeight: '500',
    fontSize: 14,
  },
});
