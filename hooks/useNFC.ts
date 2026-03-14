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

export type NFCState =
  | 'idle'
  | 'starting'
  | 'scanning'
  | 'writing'
  | 'error';

export interface UseNFCReturn {
  isSupported: boolean;
  isEnabled: boolean;
  state: NFCState;
  error: string | null;
  scannedId: number | null;
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  writeId: (bikeId: number) => Promise<void>;
}

export function useNFC(): UseNFCReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [state, setState] = useState<NFCState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [scannedId, setScannedId] = useState<number | null>(null);

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
    setScannedId(null);
    setState('scanning');

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const ndefRecords = tag?.ndefMessage;

      if (!ndefRecords || ndefRecords.length === 0) {
        throw new Error('No NDEF records found on tag');
      }

      const firstRecord = ndefRecords[0];
      const decoded = Ndef.text.decodePayload(
        new Uint8Array(firstRecord.payload)
      );
      const bikeId = parseInt(decoded, 10);

      if (isNaN(bikeId)) {
        throw new Error(`Tag does not contain a valid bike ID: "${decoded}"`);
      }

      setScannedId(bikeId);
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

  const writeId = useCallback(async (bikeId: number) => {
    if (!NfcManager || !NfcTech || !Ndef) {
      setError('NFC is not available on this device');
      setState('error');
      return;
    }

    setError(null);
    setState('writing');

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(String(bikeId))]);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      setState('idle');
      Alert.alert('Success', `Bike ID ${bikeId} written to NFC tag`);
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
    scannedId,
    startScan,
    stopScan,
    writeId,
  };
}
