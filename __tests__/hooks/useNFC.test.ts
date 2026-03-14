import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useNFC } from '../../hooks/useNFC';

// The __mocks__/react-native-nfc-manager.ts mock is used automatically.
// We need access to the mocked functions to configure per-test behaviour.
import NfcManagerMock, { Ndef as NdefMock } from 'react-native-nfc-manager';

const getTagMock = NfcManagerMock.getTag as jest.Mock;
const textRecordMock = NdefMock.textRecord as jest.Mock;
const encodeMessageMock = NdefMock.encodeMessage as jest.Mock;

function makeTag(payload: string) {
  const bytes = [0x02, 0x65, 0x6e, ...new TextEncoder().encode(payload)];
  return {
    ndefMessage: [{ tnf: 1, type: [0x54], id: [], payload: bytes }],
  };
}

describe('useNFC — startScan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: NFC supported + enabled
    (NfcManagerMock.isSupported as jest.Mock).mockResolvedValue(true);
    (NfcManagerMock.isEnabled as jest.Mock).mockResolvedValue(true);
  });

  it('blank tag (empty ndefMessage) → scannedTag { type: blank }, state idle', async () => {
    getTagMock.mockResolvedValue({ ndefMessage: [] });

    const { result } = renderHook(() => useNFC());

    await act(async () => {
      await result.current.startScan();
    });

    expect(result.current.scannedTag).toEqual({ type: 'blank' });
    expect(result.current.state).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('null ndefMessage → scannedTag { type: blank }, state idle', async () => {
    getTagMock.mockResolvedValue({ ndefMessage: null });

    const { result } = renderHook(() => useNFC());

    await act(async () => {
      await result.current.startScan();
    });

    expect(result.current.scannedTag).toEqual({ type: 'blank' });
    expect(result.current.state).toBe('idle');
  });

  it('bt: payload → scannedTag { type: bt, id }', async () => {
    const btId = 'bt:a3f9c821-4b2d-4abc-8abc-000000000001';
    getTagMock.mockResolvedValue(makeTag(btId));

    const { result } = renderHook(() => useNFC());

    await act(async () => {
      await result.current.startScan();
    });

    expect(result.current.scannedTag).toEqual({ type: 'bt', id: btId });
    expect(result.current.state).toBe('idle');
  });

  it('numeric payload → scannedTag { type: bikeindex, id: number }', async () => {
    getTagMock.mockResolvedValue(makeTag('3350313'));

    const { result } = renderHook(() => useNFC());

    await act(async () => {
      await result.current.startScan();
    });

    expect(result.current.scannedTag).toEqual({ type: 'bikeindex', id: 3350313 });
    expect(result.current.state).toBe('idle');
  });

  it('unknown string → scannedTag { type: unknown, raw }', async () => {
    getTagMock.mockResolvedValue(makeTag('hello-world'));

    const { result } = renderHook(() => useNFC());

    await act(async () => {
      await result.current.startScan();
    });

    expect(result.current.scannedTag).toEqual({ type: 'unknown', raw: 'hello-world' });
    expect(result.current.state).toBe('idle');
  });
});

describe('useNFC — writeTag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NfcManagerMock.isSupported as jest.Mock).mockResolvedValue(true);
    (NfcManagerMock.isEnabled as jest.Mock).mockResolvedValue(true);
  });

  it('writeTag calls Ndef.textRecord with the full payload string', async () => {
    const { result } = renderHook(() => useNFC());
    const payload = 'bt:a3f9c821-4b2d-4abc-8abc-000000000001';

    await act(async () => {
      await result.current.writeTag(payload);
    });

    expect(textRecordMock).toHaveBeenCalledWith(payload);
    expect(encodeMessageMock).toHaveBeenCalled();
    expect(result.current.state).toBe('idle');
  });
});
