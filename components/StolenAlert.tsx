import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import type { BikeDetail } from '../types/bike';

interface Props {
  bike: BikeDetail;
}

function formatDate(timestamp: number | null): string {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function StolenAlert({ bike }: Props) {
  function handleAlertOwner() {
    Alert.alert('Coming soon', 'Owner alerting will be available in a future update.');
  }

  const record = bike.stolen_record;
  const location =
    record?.city && record?.state
      ? `${record.city}, ${record.state}`
      : bike.stolen_location ?? 'Unknown location';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.alertIcon}>🚨</Text>
        <Text style={styles.alertTitle}>STOLEN BIKE</Text>
      </View>

      <Text style={styles.bikeTitle}>{bike.title}</Text>

      {bike.serial && (
        <Text style={styles.detail}>Serial: {bike.serial}</Text>
      )}

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Theft details</Text>
      <Text style={styles.detail}>
        Date stolen: {formatDate(bike.date_stolen)}
      </Text>
      <Text style={styles.detail}>Location: {location}</Text>

      {record?.theft_description && (
        <Text style={styles.description}>{record.theft_description}</Text>
      )}

      {record?.police_report_number && (
        <Text style={styles.detail}>
          Police report: {record.police_report_number}
        </Text>
      )}

      <TouchableOpacity style={styles.alertButton} onPress={handleAlertOwner}>
        <Text style={styles.alertButtonText}>Alert Owner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  alertIcon: {
    fontSize: 28,
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#dc2626',
    letterSpacing: 1,
  },
  bikeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#fca5a5',
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    marginVertical: 8,
    lineHeight: 20,
  },
  alertButton: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
