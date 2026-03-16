import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OurBike } from '../api/bikes';

interface Props {
  bike: OurBike;
}

export function OurBikeCard({ bike }: Props) {
  const isStolen = bike.status === 'stolen';
  return (
    <View style={[styles.card, isStolen ? styles.cardStolen : styles.cardNormal]}>
      <View style={styles.imagePlaceholder}>
        <Ionicons name="bicycle" size={40} color="#555555" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{bike.year ? `${bike.year} ` : ''}{bike.make} {bike.model}</Text>
        <Text style={styles.detail}>Color: {bike.color}</Text>
        {bike.year && <Text style={styles.detail}>Year: {bike.year}</Text>}
        <View style={[styles.statusBadge, isStolen ? styles.stolenBadge : styles.safeBadge]}>
          <Text style={[styles.statusText, isStolen ? styles.stolenText : styles.safeText]}>{bike.status.toUpperCase()}</Text>
        </View>
        <Text style={styles.idLabel}>BT-ID <Text style={styles.idValue}>{bike.id}</Text></Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNormal: {
    borderLeftColor: '#FF6B00',
  },
  cardStolen: {
    borderLeftColor: '#FF3131',
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 20,
    color: '#FAFAFA',
    marginBottom: 6,
  },
  detail: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginVertical: 6,
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
  idLabel: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  idValue: {
    fontFamily: 'SpaceMono_400Regular',
    color: '#888888',
  },
});
