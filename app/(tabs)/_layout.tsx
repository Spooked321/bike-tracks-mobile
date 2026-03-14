import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        headerStyle: { backgroundColor: '#1e40af' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color }) => (
            // Using text emoji as lightweight icon — replace with @expo/vector-icons if desired
            <TabIcon icon="📡" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tag"
        options={{
          title: 'Tag Bike',
          tabBarLabel: 'Tag',
          tabBarIcon: ({ color }) => <TabIcon icon="🏷️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search Stolen',
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <TabIcon icon="🔍" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color: _ }: { icon: string; color: string }) {
  return <Text style={{ fontSize: 20 }}>{icon}</Text>;
}
