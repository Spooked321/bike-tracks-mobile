import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getMyBikes } from '../../api/bikes';
import type { OurBike } from '../../api/bikes';
import { OurBikeCard } from '../../components/OurBikeCard';
import { NFCStatus } from '../../components/NFCStatus';
import { useNFC } from '../../hooks/useNFC';
import { colors, presets, spacing } from '../../lib/theme';

export default function MyBikesScreen() {
  const router = useRouter();
  const { isSupported, isEnabled, state: nfcState, error: nfcError, writeTag } = useNFC();

  const [bikes, setBikes] = useState<OurBike[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [writingBikeId, setWritingBikeId] = useState<string | null>(null);

  useEffect(() => {
    getMyBikes()
      .then(setBikes)
      .catch(() => setLoadError('Failed to load bikes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleWriteTag(bike: OurBike) {
    setWritingBikeId(bike.id);
    try {
      await writeTag(bike.id);
    } finally {
      setWritingBikeId(null);
    }
  }

  function handleReportStolen(bike: OurBike) {
    Alert.alert(
      'Report Stolen',
      'Mark this bike as stolen?',
      [
        { text: 'Cancel' },
        {
          text: 'Confirm',
          onPress: () => console.log('Report stolen:', bike.id),
        },
      ]
    );
  }

  function renderItem({ item }: { item: OurBike }) {
    const isWritingThis = writingBikeId === item.id && nfcState === 'writing';

    return (
      <View>
        <OurBikeCard bike={item} />

        {isWritingThis && (
          <NFCStatus
            isSupported={isSupported}
            isEnabled={isEnabled}
            state={nfcState}
            error={nfcError}
          />
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleWriteTag(item)}
            disabled={nfcState === 'writing'}
          >
            <Text style={styles.secondaryButtonText}>Write NFC Tag</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={() => handleReportStolen(item)}
          >
            <Text style={styles.dangerButtonText}>Report Stolen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={presets.screenContainer}>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push('/register-bike?source=my-bikes')}
      >
        <Text style={styles.registerButtonText}>+ Register New Bike</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.orange} size="large" />
        </View>
      ) : loadError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      ) : (
        <FlatList
          data={bikes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={bikes.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bikes registered yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  registerButton: {
    backgroundColor: colors.orange,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontFamily: 'BarlowCondensed_700Bold',
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3131',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FF3131',
  },
  dangerButtonText: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '600',
  },
});
