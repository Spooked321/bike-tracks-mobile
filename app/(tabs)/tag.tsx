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
import { useRouter } from 'expo-router';
import { useNFC } from '../../hooks/useNFC';
import { getBikeById, BikeNotFoundError } from '../../api/bikeindex';
import { BikeCard } from '../../components/BikeCard';
import { NFCStatus } from '../../components/NFCStatus';
import type { BikeDetail } from '../../types/bike';

type ScreenState = 'idle' | 'verifying' | 'verified' | 'writing' | 'error';

export default function TagScreen() {
  const router = useRouter();
  const { isSupported, isEnabled, state: nfcState, error: nfcError, writeTag } = useNFC();
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
    await writeTag(String(bike.id));
    // writeTag shows an Alert on success; NFC errors are surfaced via nfcError
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
          Register a new bike and write its ID to an NFC sticker, or tag an existing BikeIndex bike.
        </Text>

        {showNfcStatus && (
          <NFCStatus
            isSupported={isSupported}
            isEnabled={isEnabled}
            state={nfcState}
            error={nfcError}
          />
        )}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/register-bike?source=tag')}
        >
          <Text style={styles.registerButtonText}>+ Register New Bike</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or tag by BikeIndex ID</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={bikeIdInput}
            onChangeText={setBikeIdInput}
            placeholder="BikeIndex bike ID (e.g. 3350313)"
            placeholderTextColor="#555555"
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
              <ActivityIndicator color="#FF6B00" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>

        {screenState === 'error' && error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
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
                <Text style={styles.writeButtonText}>Write to NFC Tag</Text>
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
    backgroundColor: '#0F0F0F',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontFamily: 'BarlowCondensed_700Bold',
    color: '#FAFAFA',
    marginTop: 16,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 24,
    lineHeight: 22,
  },
  registerButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#FAFAFA',
    fontSize: 18,
    fontFamily: 'BarlowCondensed_700Bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  dividerText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FAFAFA',
  },
  verifyButton: {
    backgroundColor: '#888888',
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
    color: '#FAFAFA',
    fontSize: 15,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 3,
    borderLeftColor: '#FF3131',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  errorText: {
    color: '#FF3131',
    fontSize: 14,
    lineHeight: 20,
  },
  confirmedLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00D4FF',
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  writeButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
  },
  writeButtonText: {
    color: '#FAFAFA',
    fontSize: 18,
    fontFamily: 'BarlowCondensed_700Bold',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 16,
  },
  resetButtonText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
});
