import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import DrawerMenu from '../../components/DrawerMenu';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#1A1A1A' },
        headerTintColor: '#FAFAFA',
        headerTitleStyle: {
          fontFamily: 'BarlowCondensed_700Bold',
          fontSize: 20,
          letterSpacing: 1,
        },
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ paddingRight: 16 }}
          >
            <Ionicons name="menu" size={26} color="#FAFAFA" />
          </TouchableOpacity>
        ),
        drawerStyle: { backgroundColor: '#111111', width: '75%' },
      })}
    >
      <Drawer.Screen name="index"          options={{ title: 'Scan NFC' }} />
      <Drawer.Screen name="my-bikes"       options={{ title: 'My Bikes' }} />
      <Drawer.Screen name="stolen-reports" options={{ title: 'Stolen Reports' }} />
      <Drawer.Screen name="settings"       options={{ title: 'Settings' }} />
      <Drawer.Screen name="help"           options={{ title: 'Help & Support' }} />
    </Drawer>
  );
}
