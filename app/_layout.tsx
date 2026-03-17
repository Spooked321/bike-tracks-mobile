import '../lib/firebase';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({ BarlowCondensed_700Bold, SpaceMono_400Regular });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="register-bike" options={{ title: 'Register Bike', presentation: 'modal', headerStyle: { backgroundColor: '#1A1A1A' }, headerTintColor: '#FAFAFA' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
