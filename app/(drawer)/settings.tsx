import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { presets, colors, typography } from '../../lib/theme';

export default function SettingsScreen() {
  return (
    <View style={[presets.screenContainer, styles.container]}>
      <Text style={styles.heading}>SETTINGS</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...typography.headingLG,
    color: colors.textPrimary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
