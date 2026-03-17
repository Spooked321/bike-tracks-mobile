import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';

// NFC is unavailable on web and simulators — guard import
let NfcManager: typeof import('react-native-nfc-manager').default | null = null;
let NfcTech: typeof import('react-native-nfc-manager').NfcTech | null = null;
let Ndef: typeof import('react-native-nfc-manager').Ndef | null = null;

if (Platform.OS !== 'web') {
  const nfcModule = require('react-native-nfc-manager');
  NfcManager = nfcModule.default;
  NfcTech = nfcModule.NfcTech;
  Ndef = nfcModule.Ndef;
}

// Reject tag content that is implausibly long (guards against malicious tags)
const MAX_TAG_CONTENT_LENGTH = 500;
// BikeIndex IDs are positive integers; reject values outside this range
const MAX_BIKEINDEX_ID = 100_000_000;

export type NFCState =
  | 'idle'
  | 'starting'
  | 'scanning'
  | 'writing'
  | 'error';

export type ScannedTag =
  | { type: 'blank' }
  | { type: 'bt'; id: string }
  | { type: 'bikeindex'; id: number }
  | { type: 'unknown'; raw: string };

export interface UseNFCReturn {
  isSupported: boolean;
  isEnabled: boolean;
  state: NFCState;
  error: string | null;
  scannedTag: ScannedTag | null;
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  writeTag: (payload: string) => Promise<void>;
}

export function useNFC(): UseNFCReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [state, setState] = useState<NFCState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [scannedTag, setScannedTag] = useState<ScannedTag | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' || !NfcManager) return;

    let mounted = true;

    async function initNfc() {
      if (!NfcManager) return;
      try {
        await NfcManager.start();
        const supported = await NfcManager.isSupported();
        const enabled = supported ? await NfcManager.isEnabled() : false;
        if (mounted) {
          setIsSupported(supported);
          setIsEnabled(enabled);
        }
      } catch (err) {
        if (mounted) {
          setIsSupported(false);
          setIsEnabled(false);
        }
      }
    }

    initNfc();

    return () => {
      mounted = false;
      NfcManager?.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const startScan = useCallback(async () => {
    if (!NfcManager || !NfcTech || !Ndef) {
      setError('NFC is not available on this device');
      setState('error');
      return;
    }

    setError(null);
    setScannedTag(null);
    setState('scanning');

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const ndefRecords = tag?.ndefMessage;

      if (!ndefRecords || ndefRecords.length === 0) {
        setScannedTag({ type: 'blank' });
        setState('idle');
        return;
      }

      const firstRecord = ndefRecords[0];
      const decoded = Ndef.text.decodePayload(
        new Uint8Array(firstRecord.payload)
      );

      if (decoded.length > MAX_TAG_CONTENT_LENGTH) {
        setScannedTag({ type: 'unknown', raw: decoded.slice(0, 80) + '…' });
        setState('idle');
        return;
      }

      const parsedId = parseInt(decoded, 10);
      if (decoded.startsWith('bt:')) {
        setScannedTag({ type: 'bt', id: decoded });
      } else if (!isNaN(parsedId) && parsedId > 0 && parsedId <= MAX_BIKEINDEX_ID) {
        setScannedTag({ type: 'bikeindex', id: parsedId });
      } else {
        setScannedTag({ type: 'unknown', raw: decoded });
      }

      setState('idle');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to read NFC tag';
      setError(message);
      setState('error');
    } finally {
      NfcManager?.cancelTechnologyRequest().catch(() => {});
    }
  }, []);

  const stopScan = useCallback(async () => {
    await NfcManager?.cancelTechnologyRequest().catch(() => {});
    setState('idle');
    setError(null);
  }, []);

  const writeTag = useCallback(async (payload: string) => {
    if (!NfcManager || !NfcTech || !Ndef) {
      setError('NFC is not available on this device');
      setState('error');
      return;
    }

    setError(null);
    setState('writing');

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(payload)]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      setState('idle');
      Alert.alert('Success', `Tag written successfully`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to write NFC tag';
      setError(message);
      setState('error');
    } finally {
      NfcManager?.cancelTechnologyRequest().catch(() => {});
    }
  }, []);

  return {
    isSupported,
    isEnabled,
    state,
    error,
    scannedTag,
    startScan,
    stopScan,
    writeTag,
  };
}
