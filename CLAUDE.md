# Bike Tracks Mobile

## What this is
React Native / Expo mobile app for a bike tracking app with NFC tagging and stolen bike reporting.
This is one of 3 repos in the project (api / web / mobile).

## Stack
- **Framework**: React Native via Expo (SDK 51+)
- **Language**: TypeScript
- **Auth**: Firebase Auth
- **NFC**: expo-nfc (or react-native-nfc-manager)
- **Navigation**: Expo Router (file-based routing)
- **Testing**: Jest + React Native Testing Library

## Project phases
- [ ] Phase 1–5: (Backend + Web — separate repos, done first)
- [ ] Phase 6: Mobile App ← THIS REPO
  - Auth flow
  - My bikes screen
  - NFC scan to look up a bike
  - NFC write to tag a bike
  - Report stolen
  - Search stolen bikes

## Folder structure (target)
```
bike-tracks-mobile/
├── app/                 # Expo Router pages (file-based)
│   ├── (auth)/          # Login / register screens
│   ├── (tabs)/          # Main tab navigation
│   └── _layout.tsx
├── components/          # Reusable UI components
├── hooks/               # Custom hooks (useAuth, useNFC etc.)
├── api/                 # API call functions
├── types/               # Shared TypeScript types
├── lib/                 # Firebase config, utils
├── .env.example
└── PROJECT_STATUS.md
```

## NFC notes
- NFC only works on physical devices — not in simulators/emulators
- Android: works out of the box with Expo
- iOS: requires Apple developer account + entitlements
- Plan: build Android first, iOS later

## Working rules
- Keep it simple — don't over-engineer
- TypeScript strict mode — no `any` unless truly necessary
- Test on a real Android device early (for NFC)
- Never commit real credentials — use .env files
- Update PROJECT_STATUS.md after completing each phase
- Ask before adding new native dependencies (they require a new build)

## Environment variables needed
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_FIREBASE_API_KEY=your-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## Key commands
```bash
npx expo start           # Start dev server
npx expo start --android # Open on Android device/emulator
npx expo start --ios     # Open on iOS simulator
npx expo run:android     # Build + run native Android
jest                     # Run tests
```
