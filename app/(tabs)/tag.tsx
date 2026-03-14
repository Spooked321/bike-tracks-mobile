import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNFC } from '../../hooks/useNFC';
import { getBikeById, BikeNotFoundError } from '../../api/bikeindex';
import { BikeCard } from '../../components/BikeCard';
import { NFCStatus } from '../../components/NFCStatus';
import type { BikeDetail } from '../../types/bike';

type ScreenState = 'idle' | 'verifying' | 'verified' | 'writing' | 'error';

export default function TagScreen() {
  const { isSupported, isEnabled, state: nfcState, error: nfcError, writeId } = useNFC();
  const [bikeIdInput, setBikeIdInput] = useState('');
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [bike, setBike] = useState<BikeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    const id = parseInt(bikeIdInput.trim(), 10);
    if (isNaN(id)) {
      setError('Please enter a valid numeric BikeIndex bike ID');
      setScreenState('error');
      return;
    }

    setError(null);
    setBike(null);
    setScreenState('verifying');

    try {
      const result = await getBikeById(id);
      setBike(result);
      setScreenState('verified');
    } catch (err) {
      setScreenState('error');
      if (err instanceof BikeNotFoundError) {
        setError(`No bike with ID ${id} found on BikeIndex. Double-check the ID.`);
      } else {
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    }
  }

  async function handleWrite() {
    if (!bike) return;
    setScreenState('writing');
    await writeId(bike.id);
    // writeId shows an Alert on success; NFC errors are surfaced via nfcError
    setScreenState('verified');
  }

  function handleReset() {
    setBikeIdInput('');
    setBike(null);
    setError(null);
    setScreenState('idle');
  }

  const showNfcStatus = !isSupported || !isEnabled || nfcState === 'writing' || nfcState === 'error';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Tag a Bike</Text>
        <Text style={styles.subheading}>
          Enter the bike's BikeIndex.org ID to write it to an NFC sticker.
        </Text>

        {showNfcStatus && (
          <NFCStatus
            isSupported={isSupported}
            isEnabled={isEnabled}
            state={nfcState}
            error={nfcError}
          />
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={bikeIdInput}
            onChangeText={setBikeIdInput}
            placeholder="BikeIndex bike ID (e.g. 3350313)"
            keyboardType="numeric"
            editable={screenState !== 'verifying' && screenState !== 'writing'}
            returnKeyType="done"
            onSubmitEditing={handleVerify}
          />
          <TouchableOpacity
            style={[styles.verifyButton, screenState === 'verifying' && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={screenState === 'verifying'}
          >
            {screenState === 'verifying' ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>

        {screenState === 'error' && error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {screenState === 'verified' && bike && (
          <>
            <Text style={styles.confirmedLabel}>Bike confirmed:</Text>
            <BikeCard bike={bike} />

            {isSupported && isEnabled && (
              <TouchableOpacity
                style={styles.writeButton}
                onPress={handleWrite}
                disabled={nfcState === 'writing'}
              >
                <Text style={styles.writeButtonText}>🏷️ Write to NFC Tag</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  verifyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    minWidth: 80,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    lineHeight: 20,
  },
  confirmedLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  writeButton: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 16,
  },
  resetButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
