import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={styles.banner}>
        <Ionicons name="warning" size={20} color="#0F0F0F" />
        <Text style={styles.bannerText}>STOLEN BIKE</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.bikeTitle}>{bike.title}</Text>

        {bike.serial && (
          <Text style={styles.detail}>Serial: {bike.serial}</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Theft details</Text>
        <Text style={styles.detail}>
          Date stolen: <Text style={styles.detailValue}>{formatDate(bike.date_stolen)}</Text>
        </Text>
        <Text style={styles.detail}>
          Location: <Text style={styles.detailValue}>{location}</Text>
        </Text>

        {record?.theft_description && (
          <Text style={styles.description}>{record.theft_description}</Text>
        )}

        {record?.police_report_number && (
          <Text style={styles.detail}>
            Police report: <Text style={styles.detailValue}>{record.police_report_number}</Text>
          </Text>
        )}

        <TouchableOpacity style={styles.alertButton} onPress={handleAlertOwner}>
          <Text style={styles.alertButtonText}>Alert Owner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4A0A0A',
    borderWidth: 2,
    borderColor: '#FF3131',
    borderRadius: 14,
    margin: 16,
    overflow: 'hidden',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3131',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  bannerText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 22,
    color: '#0F0F0F',
    letterSpacing: 1,
  },
  body: {
    padding: 20,
  },
  bikeTitle: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 20,
    color: '#FAFAFA',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#FAFAFA',
    marginBottom: 6,
  },
  detailValue: {
    fontFamily: 'SpaceMono_400Regular',
    color: '#FF6B00',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#7A1A1A',
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
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    color: '#FF6B00',
    fontStyle: 'italic',
    marginVertical: 8,
    lineHeight: 20,
  },
  alertButton: {
    backgroundColor: '#FF3131',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  alertButtonText: {
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '700',
  },
});
