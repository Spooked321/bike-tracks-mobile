import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    <View style={[styles.card, bike.stolen ? styles.cardStolen : styles.cardSafe]}>
      {bike.thumb ? (
        <Image source={{ uri: bike.thumb }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="bicycle" size={40} color="#555555" />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{bike.title}</Text>
        {bike.manufacturer_name && (
          <Text style={styles.detail}>Brand: <Text style={styles.detailValue}>{bike.manufacturer_name}</Text></Text>
        )}
        {bike.year && (
          <Text style={styles.detail}>Year: <Text style={styles.detailValue}>{bike.year}</Text></Text>
        )}
        {bike.serial && (
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Serial: </Text>
            <Text style={styles.serial}>{bike.serial}</Text>
          </Text>
        )}
        {bike.frame_colors.length > 0 && (
          <Text style={styles.detail}>
            Color: <Text style={styles.detailValue}>{bike.frame_colors.join(', ')}</Text>
          </Text>
        )}
        <View style={[styles.statusBadge, bike.stolen ? styles.stolenBadge : styles.safeBadge]}>
          <Text style={[styles.statusText, bike.stolen ? styles.stolenText : styles.safeText]}>
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
            Stolen: <Text style={styles.detailValue}>{formatDate(bike.date_stolen)}</Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 3,
    overflow: 'hidden',
  },
  cardSafe: {
    borderLeftColor: '#00D4FF',
  },
  cardStolen: {
    borderLeftColor: '#FF3131',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 16,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 20,
    color: '#FAFAFA',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#888888',
  },
  detailValue: {
    color: '#888888',
  },
  serial: {
    fontFamily: 'SpaceMono_400Regular',
    fontSize: 13,
    color: '#FAFAFA',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginVertical: 8,
  },
  safeBadge: {
    backgroundColor: '#003A45',
  },
  stolenBadge: {
    backgroundColor: '#4A0A0A',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  safeText: {
    color: '#00D4FF',
  },
  stolenText: {
    color: '#FF3131',
  },
  stolenLocation: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 4,
  },
});
