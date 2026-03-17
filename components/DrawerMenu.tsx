import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';

const SCREENS = [
  { name: 'index',          label: 'SCAN NFC' },
  { name: 'my-bikes',       label: 'MY BIKES' },
  { name: 'stolen-reports', label: 'STOLEN REPORTS' },
  { name: 'settings',       label: 'SETTINGS' },
  { name: 'help',           label: 'HELP & SUPPORT' },
];

export default function DrawerMenu(props: DrawerContentComponentProps) {
  const router = useRouter();
  const activeRouteName = props.state.routes[props.state.index].name;

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.appName}>BIKE TRACKS</Text>
        <Text style={styles.subtitle}>v1.0.0</Text>
      </View>

      {/* divider */}
      <View style={styles.divider} />

      {/* nav items */}
      <View style={styles.nav}>
        {SCREENS.map((item) => {
          const isActive = activeRouteName === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, isActive && styles.navItemActive]}
              activeOpacity={0.7}
              onPress={() => {
                props.navigation.navigate(item.name);
                props.navigation.closeDrawer();
              }}
            >
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* spacer */}
      <View style={styles.spacer} />

      {/* footer */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={[styles.navLabel, styles.signOutLabel]}>SIGN OUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  appName: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 28,
    color: '#FF6B00',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#555555',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
  },
  nav: {
    marginTop: 8,
  },
  navItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  navItemActive: {
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 2,
    borderLeftColor: '#FF6B00',
    paddingLeft: 18, // compensate for border width to keep text aligned
  },
  navLabel: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#888888',
  },
  navLabelActive: {
    color: '#FF6B00',
  },
  spacer: {
    flex: 1,
  },
  footer: {
    paddingBottom: 8,
  },
  signOutLabel: {
    color: '#FF3131',
  },
});
