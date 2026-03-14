import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { NFCState } from '../hooks/useNFC';

interface Props {
  isSupported: boolean;
  isEnabled: boolean;
  state: NFCState;
  error: string | null;
}

export function NFCStatus({ isSupported, isEnabled, state, error }: Props) {
  if (!isSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>📵</Text>
        <Text style={styles.title}>NFC Not Available</Text>
        <Text style={styles.subtitle}>
          NFC is not supported on this device or simulator. Use a physical
          Android device to scan tags.
        </Text>
      </View>
    );
  }

  if (!isEnabled) {
    return (
      <View style={styles.container}>
        <Text style={styles.icon}>🔕</Text>
        <Text style={styles.title}>NFC is Off</Text>
        <Text style={styles.subtitle}>
          Please enable NFC in your device settings.
        </Text>
      </View>
    );
  }

  if (state === 'scanning') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" style={styles.spinner} />
        <Text style={styles.title}>Ready to Scan</Text>
        <Text style={styles.subtitle}>Hold your phone near the NFC tag on the bike.</Text>
      </View>
    );
  }

  if (state === 'writing') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16a34a" style={styles.spinner} />
        <Text style={styles.title}>Writing Tag</Text>
        <Text style={styles.subtitle}>Hold your phone near the NFC tag.</Text>
      </View>
    );
  }

  if (state === 'error' && error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={[styles.title, styles.errorText]}>NFC Error</Text>
        <Text style={styles.subtitle}>{error}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    margin: 16,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  spinner: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    color: '#dc2626',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
