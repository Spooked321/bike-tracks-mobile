import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={[styles.container, { borderColor: '#555555' }]}>
        <Ionicons name="phone-portrait-outline" size={48} color="#555555" style={styles.iconSpacing} />
        <Text style={[styles.title, { color: '#555555' }]}>NFC Not Available</Text>
        <Text style={styles.subtitle}>
          NFC is not supported on this device or simulator. Use a physical
          Android device to scan tags.
        </Text>
      </View>
    );
  }

  if (!isEnabled) {
    return (
      <View style={[styles.container, { borderColor: '#F5A623' }]}>
        <Ionicons name="radio-outline" size={48} color="#F5A623" style={styles.iconSpacing} />
        <Text style={[styles.title, { color: '#F5A623' }]}>NFC is Off</Text>
        <Text style={styles.subtitle}>
          Please enable NFC in your device settings.
        </Text>
      </View>
    );
  }

  if (state === 'scanning') {
    return (
      <View style={[styles.container, { borderColor: '#00D4FF' }]}>
        <Ionicons name="scan" size={48} color="#00D4FF" style={styles.iconSpacing} />
        <ActivityIndicator size="large" color="#00D4FF" style={styles.spinner} />
        <Text style={[styles.title, { color: '#00D4FF' }]}>Ready to Scan</Text>
        <Text style={styles.subtitle}>Hold your phone near the NFC tag on the bike.</Text>
      </View>
    );
  }

  if (state === 'writing') {
    return (
      <View style={[styles.container, { borderColor: '#FF6B00' }]}>
        <Ionicons name="create-outline" size={48} color="#FF6B00" style={styles.iconSpacing} />
        <ActivityIndicator size="large" color="#FF6B00" style={styles.spinner} />
        <Text style={[styles.title, { color: '#FF6B00' }]}>Writing Tag</Text>
        <Text style={styles.subtitle}>Hold your phone near the NFC tag.</Text>
      </View>
    );
  }

  if (state === 'error' && error) {
    return (
      <View style={[styles.container, { borderColor: '#FF3131' }]}>
        <Ionicons name="warning-outline" size={48} color="#FF3131" style={styles.iconSpacing} />
        <Text style={[styles.title, { color: '#FF3131' }]}>NFC Error</Text>
        <Text style={styles.subtitle}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderColor: '#00D4FF' }]}>
      <Ionicons name="checkmark-circle-outline" size={48} color="#00D4FF" style={styles.iconSpacing} />
      <Text style={[styles.title, { color: '#00D4FF' }]}>NFC Ready</Text>
      <Text style={styles.subtitle}>NFC is enabled and ready to use.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    borderWidth: 2,
    margin: 16,
  },
  iconSpacing: {
    marginBottom: 12,
  },
  spinner: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'BarlowCondensed_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
