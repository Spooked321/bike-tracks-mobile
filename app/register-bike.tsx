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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNFC } from '../hooks/useNFC';
import { NFCStatus } from '../components/NFCStatus';
import { registerBike } from '../api/bikes';
import type { OurBike, BikeRegistrationData } from '../api/bikes';

type ScreenState = 'form' | 'submitting' | 'writing_nfc' | 'registered' | 'done' | 'error';

const CURRENT_YEAR = new Date().getFullYear();

export default function RegisterBikeScreen() {
  const router = useRouter();
  const { source } = useLocalSearchParams<{ source?: 'scan' | 'tag' | 'my-bikes' }>();
  const { isSupported, isEnabled, state: nfcState, error: nfcError, writeTag } = useNFC();

  const [screenState, setScreenState] = useState<ScreenState>('form');
  const [registeredBike, setRegisteredBike] = useState<OurBike | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [serial, setSerial] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');

  function validate(): string | null {
    if (!make.trim()) return 'Make is required';
    if (!model.trim()) return 'Model is required';
    if (!serial.trim()) return 'Serial number is required';
    if (!color.trim()) return 'Color is required';
    if (year.trim()) {
      const y = parseInt(year.trim(), 10);
      if (isNaN(y) || y < 1900 || y > CURRENT_YEAR) {
        return `Year must be between 1900 and ${CURRENT_YEAR}`;
      }
    }
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      setSubmitError(err);
      return;
    }

    setSubmitError(null);
    setScreenState('submitting');

    const data: BikeRegistrationData = {
      make: make.trim(),
      model: model.trim(),
      serial: serial.trim(),
      color: color.trim(),
      year: year.trim() ? parseInt(year.trim(), 10) : undefined,
    };

    try {
      const bike = await registerBike(data);
      setRegisteredBike(bike);

      if (isSupported && isEnabled) {
        setScreenState('writing_nfc');
      } else {
        setScreenState('registered');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Registration failed');
      setScreenState('error');
    }
  }

  async function handleWriteTag() {
    if (!registeredBike) return;
    await writeTag(registeredBike.id);
    setScreenState('done');
  }

  function handleSkip() {
    setScreenState('done');
  }

  if (screenState === 'submitting') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.statusText}>Registering your bike…</Text>
      </View>
    );
  }

  if (screenState === 'writing_nfc') {
    return (
      <View style={styles.centered}>
        <NFCStatus
          isSupported={isSupported}
          isEnabled={isEnabled}
          state={nfcState}
          error={nfcError}
        />
        <Text style={styles.nfcPrompt}>Tap your NFC sticker to write the tag</Text>
        <TouchableOpacity
          style={[styles.primaryButton, nfcState === 'writing' && styles.buttonDisabled]}
          onPress={handleWriteTag}
          disabled={nfcState === 'writing'}
        >
          {nfcState === 'writing' ? (
            <ActivityIndicator color="#FAFAFA" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Write to NFC Tag</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleSkip}>
          <Text style={styles.secondaryButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screenState === 'registered') {
    return (
      <View style={styles.centered}>
        <Ionicons name="checkmark-circle" size={56} color="#00D4FF" />
        <Text style={styles.successTitle}>Bike Registered!</Text>
        <Text style={styles.idLabel}>Your bike ID:</Text>
        <Text style={styles.idValue}>{registeredBike?.id}</Text>
        <Text style={styles.nfcNote}>NFC is not available — save your bike ID for reference.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.primaryButtonText}>Go to Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screenState === 'done') {
    return (
      <View style={styles.centered}>
        <Ionicons name="ribbon" size={56} color="#FF6B00" />
        <Text style={styles.successTitle}>All done!</Text>
        <Text style={styles.successSub}>Your bike has been registered{registeredBike ? ` as ${registeredBike.id}` : ''}.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.primaryButtonText}>Go to Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screenState === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        {submitError && <Text style={styles.errorText}>{submitError}</Text>}
        <TouchableOpacity style={styles.primaryButton} onPress={() => setScreenState('form')}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Register a Bike</Text>
        <Text style={styles.subheading}>
          {source === 'scan'
            ? 'This tag is blank. Register your bike to claim it.'
            : source === 'my-bikes'
            ? 'Fill in the details to register your bike.'
            : 'Fill in the details to register your bike and write an NFC tag.'}
        </Text>

        {submitError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {submitError}</Text>
          </View>
        )}

        <Text style={styles.label}>Make *</Text>
        <TextInput style={styles.input} value={make} onChangeText={setMake} placeholder="e.g. Trek" placeholderTextColor="#333333" returnKeyType="next" maxLength={100} />

        <Text style={styles.label}>Model *</Text>
        <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="e.g. Marlin 5" placeholderTextColor="#333333" returnKeyType="next" maxLength={100} />

        <Text style={styles.label}>Serial Number *</Text>
        <TextInput style={styles.input} value={serial} onChangeText={setSerial} placeholder="Found under the bottom bracket" placeholderTextColor="#333333" autoCapitalize="characters" returnKeyType="next" maxLength={60} />

        <Text style={styles.label}>Color *</Text>
        <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="e.g. Blue" placeholderTextColor="#333333" returnKeyType="next" maxLength={60} />

        <Text style={styles.label}>Year</Text>
        <TextInput style={styles.input} value={year} onChangeText={setYear} placeholder={`e.g. ${CURRENT_YEAR}`} placeholderTextColor="#333333" keyboardType="numeric" returnKeyType="done" maxLength={4} />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Register Bike</Text>
        </TouchableOpacity>
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
    fontWeight: '800',
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
  label: {
    fontSize: 12,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FAFAFA',
  },
  primaryButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#FAFAFA',
    fontSize: 18,
    fontFamily: 'BarlowCondensed_700Bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
    maxWidth: 320,
  },
  secondaryButtonText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#1A0000',
    borderColor: '#3A0000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    lineHeight: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#0F0F0F',
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888888',
  },
  nfcPrompt: {
    fontSize: 16,
    color: '#FAFAFA',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FAFAFA',
    marginBottom: 12,
    marginTop: 16,
  },
  successSub: {
    fontSize: 15,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  idLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  idValue: {
    fontSize: 14,
    fontFamily: 'SpaceMono_400Regular',
    color: '#00D4FF',
    marginBottom: 16,
  },
  nfcNote: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 12,
  },
});
