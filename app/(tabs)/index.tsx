import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNFC } from '../../hooks/useNFC';
import { getBikeById, BikeNotFoundError } from '../../api/bikeindex';
import { BikeCard } from '../../components/BikeCard';
import { StolenAlert } from '../../components/StolenAlert';
import { NFCStatus } from '../../components/NFCStatus';
import type { BikeDetail } from '../../types/bike';

type ScreenState =
  | 'idle'
  | 'scanning'
  | 'looking_up'
  | 'found_stolen'
  | 'found_safe'
  | 'not_found'
  | 'error';

export default function ScanScreen() {
  const { isSupported, isEnabled, state: nfcState, error: nfcError, scannedId, startScan, stopScan } = useNFC();
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [bike, setBike] = useState<BikeDetail | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (scannedId == null) return;

    setScreenState('looking_up');
    setBike(null);
    setLookupError(null);

    getBikeById(scannedId)
      .then((result) => {
        setBike(result);
        setScreenState(result.stolen ? 'found_stolen' : 'found_safe');
      })
      .catch((err) => {
        if (err instanceof BikeNotFoundError) {
          setScreenState('not_found');
          setLookupError(`No bike found with ID ${scannedId} on BikeIndex.`);
        } else {
          setScreenState('error');
          setLookupError(err instanceof Error ? err.message : 'Lookup failed');
        }
      });
  }, [scannedId]);

  useEffect(() => {
    if (nfcState === 'error') setScreenState('error');
  }, [nfcState]);

  function handleScan() {
    setScreenState('scanning');
    setBike(null);
    setLookupError(null);
    startScan();
  }

  function handleReset() {
    stopScan();
    setScreenState('idle');
    setBike(null);
    setLookupError(null);
  }

  const showNfcStatus =
    nfcState === 'scanning' ||
    nfcState === 'error' ||
    !isSupported ||
    !isEnabled;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Scan a Bike Tag</Text>
      <Text style={styles.subheading}>
        Tap an NFC tag on a bike to look it up on BikeIndex.org
      </Text>

      {showNfcStatus && (
        <NFCStatus
          isSupported={isSupported}
          isEnabled={isEnabled}
          state={nfcState}
          error={nfcError}
        />
      )}

      {screenState === 'looking_up' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.lookupText}>Looking up bike #{scannedId}…</Text>
        </View>
      )}

      {screenState === 'found_stolen' && bike && (
        <StolenAlert bike={bike} />
      )}

      {screenState === 'found_safe' && bike && (
        <>
          <View style={styles.safeHeader}>
            <Text style={styles.safeIcon}>✅</Text>
            <Text style={styles.safeText}>This bike is not reported stolen</Text>
          </View>
          <BikeCard bike={bike} />
        </>
      )}

      {(screenState === 'not_found' || screenState === 'error') && lookupError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {lookupError}</Text>
        </View>
      )}

      {screenState === 'idle' && isSupported && isEnabled && (
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Text style={styles.scanButtonText}>📡 Tap NFC Tag</Text>
        </TouchableOpacity>
      )}

      {screenState !== 'idle' && (
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Scan Another Bike</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginTop: 16,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  lookupText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  safeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  safeIcon: {
    fontSize: 24,
  },
  safeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
