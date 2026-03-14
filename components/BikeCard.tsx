import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import type { BikeListItem } from '../types/bike';

interface Props {
  bike: BikeListItem;
}

function formatDate(timestamp: number | null): string {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function BikeCard({ bike }: Props) {
  return (
    <View style={styles.card}>
      {bike.thumb ? (
        <Image source={{ uri: bike.thumb }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No photo</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{bike.title}</Text>
        {bike.manufacturer_name && (
          <Text style={styles.detail}>Brand: {bike.manufacturer_name}</Text>
        )}
        {bike.year && (
          <Text style={styles.detail}>Year: {bike.year}</Text>
        )}
        {bike.serial && (
          <Text style={styles.detail}>Serial: {bike.serial}</Text>
        )}
        {bike.frame_colors.length > 0 && (
          <Text style={styles.detail}>
            Color: {bike.frame_colors.join(', ')}
          </Text>
        )}
        <View style={[styles.statusBadge, bike.stolen ? styles.stolenBadge : styles.safeBadge]}>
          <Text style={styles.statusText}>
            {bike.stolen ? 'STOLEN' : bike.status.toUpperCase()}
          </Text>
        </View>
        {bike.stolen && bike.stolen_location && (
          <Text style={styles.stolenLocation}>
            Last seen: {bike.stolen_location}
          </Text>
        )}
        {bike.stolen && bike.date_stolen && (
          <Text style={styles.detail}>
            Stolen: {formatDate(bike.date_stolen)}
          </Text>
        )}
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
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#9ca3af',
    fontSize: 14,
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
  stolenLocation: {
    fontSize: 13,
    color: '#ef4444',
    marginBottom: 4,
  },
});
