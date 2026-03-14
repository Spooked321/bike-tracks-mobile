import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { OurBike } from '../api/bikes';

interface Props {
  bike: OurBike;
}

export function OurBikeCard({ bike }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{bike.year ? `${bike.year} ` : ''}{bike.make} {bike.model}</Text>
        <Text style={styles.detail}>Serial: {bike.serial}</Text>
        <Text style={styles.detail}>Color: {bike.color}</Text>
        {bike.year && <Text style={styles.detail}>Year: {bike.year}</Text>}
        <View style={[styles.statusBadge, bike.status === 'stolen' ? styles.stolenBadge : styles.safeBadge]}>
          <Text style={styles.statusText}>{bike.status.toUpperCase()}</Text>
        </View>
        <Text style={styles.idText}>ID: {bike.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginVertical: 8,
  },
  safeBadge: {
    backgroundColor: '#d1fae5',
  },
  stolenBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  idText: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: 'monospace' as const,
  },
});
