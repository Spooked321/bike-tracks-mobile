import { jest } from '@jest/globals';

const NfcManager = {
  start: jest.fn().mockResolvedValue(undefined),
  isSupported: jest.fn().mockResolvedValue(false),
  isEnabled: jest.fn().mockResolvedValue(false),
  requestTechnology: jest.fn().mockResolvedValue(undefined),
  cancelTechnologyRequest: jest.fn().mockResolvedValue(undefined),
  getTag: jest.fn().mockResolvedValue(null),
  ndefHandler: {
    writeNdefMessage: jest.fn().mockResolvedValue(undefined),
  },
};

export const NfcTech = {
  Ndef: 'Ndef',
  NfcA: 'NfcA',
  NfcB: 'NfcB',
  NfcF: 'NfcF',
  NfcV: 'NfcV',
  IsoDep: 'IsoDep',
  MifareClassic: 'MifareClassic',
  MifareUltralight: 'MifareUltralight',
};

export const Ndef = {
  text: {
    decodePayload: jest.fn((bytes: Uint8Array) => {
      // Simple UTF-8 decode skipping language code byte
      return new TextDecoder().decode(bytes.slice(3));
    }),
  },
  textRecord: jest.fn((text: string) => ({
    tnf: 1,
    type: [0x54],
    id: [],
    payload: [0x02, 0x65, 0x6e, ...new TextEncoder().encode(text)],
  })),
  encodeMessage: jest.fn((records: unknown[]) => new Uint8Array([0, 1, 2])),
};

export default NfcManager;
