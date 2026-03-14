import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNFC } from '../../hooks/useNFC';
import { getBikeById, BikeNotFoundError } from '../../api/bikeindex';
import { getBikeByBtId, BtBikeNotFoundError } from '../../api/bikes';
import { BikeCard } from '../../components/BikeCard';
import { OurBikeCard } from '../../components/OurBikeCard';
import { StolenAlert } from '../../components/StolenAlert';
import { NFCStatus } from '../../components/NFCStatus';
import type { BikeDetail } from '../../types/bike';
import type { OurBike } from '../../api/bikes';

type ScreenState =
  | 'idle'
  | 'scanning'
  | 'looking_up'
  | 'found_stolen'
  | 'found_safe'
  | 'not_found'
  | 'error';

export default function ScanScreen() {
  const router = useRouter();
  const { isSupported, isEnabled, state: nfcState, error: nfcError, scannedTag, startScan, stopScan } = useNFC();
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [bike, setBike] = useState<BikeDetail | null>(null);
  const [ourBike, setOurBike] = useState<OurBike | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (scannedTag == null) return;

    switch (scannedTag.type) {
      case 'blank':
        router.push('/register-bike?source=scan');
        break;

      case 'bt': {
        setScreenState('looking_up');
        setBike(null);
        setOurBike(null);
        setLookupError(null);
        getBikeByBtId(scannedTag.id)
          .then((result) => {
            setOurBike(result);
            setScreenState(result.status === 'stolen' ? 'found_stolen' : 'found_safe');
          })
          .catch((err) => {
            if (err instanceof BtBikeNotFoundError) {
              setScreenState('not_found');
              setLookupError(`No bike found with ID ${scannedTag.id}.`);
            } else {
              setScreenState('error');
              setLookupError(err instanceof Error ? err.message : 'Lookup failed');
            }
          });
        break;
      }

      case 'bikeindex': {
        setScreenState('looking_up');
        setBike(null);
        setOurBike(null);
        setLookupError(null);
        getBikeById(scannedTag.id)
          .then((result) => {
            setBike(result);
            setScreenState(result.stolen ? 'found_stolen' : 'found_safe');
          })
          .catch((err) => {
            if (err instanceof BikeNotFoundError) {
              setScreenState('not_found');
              setLookupError(`No bike found with ID ${scannedTag.id} on BikeIndex.`);
            } else {
              setScreenState('error');
              setLookupError(err instanceof Error ? err.message : 'Lookup failed');
            }
          });
        break;
      }

      case 'unknown':
        setScreenState('error');
        setLookupError(`Unrecognized tag format: "${scannedTag.raw}"`);
        break;
    }
  }, [scannedTag]);

  useEffect(() => {
    if (nfcState === 'error') setScreenState('error');
  }, [nfcState]);

  function handleScan() {
    setScreenState('scanning');
    setBike(null);
    setOurBike(null);
    setLookupError(null);
    startScan();
  }

  function handleReset() {
    stopScan();
    setScreenState('idle');
    setBike(null);
    setOurBike(null);
    setLookupError(null);
  }

  const showNfcStatus =
    nfcState === 'scanning' ||
    nfcState === 'error' ||
    !isSupported ||
    !isEnabled;

  const lookupId = scannedTag?.type === 'bikeindex' ? scannedTag.id
    : scannedTag?.type === 'bt' ? scannedTag.id
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Scan a Bike Tag</Text>
      <Text style={styles.subheading}>
        Tap an NFC tag on a bike to look it up
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
          <Text style={styles.lookupText}>Looking up bike {lookupId}…</Text>
        </View>
      )}

      {screenState === 'found_stolen' && (bike || ourBike) && (
        bike ? <StolenAlert bike={bike} /> : (
          <View style={styles.stolenHeader}>
            <Text style={styles.stolenIcon}>🚨</Text>
            <Text style={styles.stolenText}>This bike is reported stolen!</Text>
            {ourBike && <OurBikeCard bike={ourBike} />}
          </View>
        )
      )}

      {screenState === 'found_safe' && (bike || ourBike) && (
        <>
          <View style={styles.safeHeader}>
            <Text style={styles.safeIcon}>✅</Text>
            <Text style={styles.safeText}>This bike is not reported stolen</Text>
          </View>
          {bike ? <BikeCard bike={bike} /> : ourBike ? <OurBikeCard bike={ourBike} /> : null}
        </>
      )}

      {(screenState === 'not_found' || screenState === 'error') && lookupError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {lookupError}</Text>
          {screenState === 'not_found' && (
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => router.push('/register-bike?source=scan')}
            >
              <Text style={styles.registerLinkText}>Register This Bike</Text>
            </TouchableOpacity>
          )}
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
  stolenHeader: {
    marginBottom: 8,
  },
  stolenIcon: {
    fontSize: 24,
  },
  stolenText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
    paddingHorizontal: 16,
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
  registerLink: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  registerLinkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
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
