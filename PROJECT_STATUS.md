# Bike Tracks Mobile — Project Status

## Phase 6: Mobile App

### ✅ Completed: NFC + BikeIndex Foundation

**What was built:**
- Full Expo Router project structure (tabs template)
- `types/bike.ts` — TypeScript types for BikeIndex API v3 responses
- `api/bikeindex.ts` — `getBikeById()` and `searchBikes()` against BikeIndex public API (no key required)
- `hooks/useNFC.ts` — NFC read + write via `react-native-nfc-manager`
- `hooks/useAuth.ts` — stub (returns null user, auth deferred)
- `components/BikeCard.tsx` — bike info display card
- `components/StolenAlert.tsx` — prominent red stolen alert with "Alert Owner" placeholder
- `components/NFCStatus.tsx` — NFC availability/scanning state UI
- `app/(tabs)/index.tsx` — Scan screen: tap NFC → lookup → show stolen/safe result
- `app/(tabs)/tag.tsx` — Tag screen: verify bike ID → write to NFC tag
- `app/(tabs)/search.tsx` — Search screen: serial number search via BikeIndex
- `app/(auth)/login.tsx` + `register.tsx` — stubs
- `lib/firebase.ts` — Firebase init (guarded against hot-reload re-init)
- `__mocks__/react-native-nfc-manager.ts` — Jest mock for NFC
- `__tests__/api/bikeindex.test.ts` — unit tests for API client
- `__tests__/components/BikeCard.test.tsx` — render tests
- `__tests__/components/StolenAlert.test.tsx` — render + interaction tests

### NFC tag data format
Plain text NDEF record containing only the numeric BikeIndex bike ID (e.g., `"3350313"`).

### Known constraints
- NFC requires `npx expo run:android` — does NOT work in Expo Go or simulators
- iOS NFC requires Apple developer account + entitlements (build Android first)
- Owner alerting is a placeholder — stubbed with `Alert.alert("Coming soon")`
- Auth flow is deferred

---

## Up next (not started)

- [ ] Firebase Auth implementation (login, register, protected routes)
- [ ] "My Bikes" screen (requires auth + backend API)
- [ ] Owner alert notification (push notification to bike owner when their bike is scanned)
- [ ] Report stolen flow
- [ ] iOS NFC entitlements + build
