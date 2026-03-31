import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { View, Text, StyleSheet } from 'react-native';

function BadgeFav({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={b.badge}>
      <Text style={b.badgeText}>{count}</Text>
    </View>
  );
}

const b = StyleSheet.create({
  badge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#4ade80', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#0a2e12' },
});

export default function TabsLayout() {
  const { favoritos } = useApp();
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#0a2e12', borderTopColor: '#1a5c2a', height: 62, paddingBottom: 8 },
      tabBarActiveTintColor: '#4ade80',
      tabBarInactiveTintColor: '#86a892',
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      headerStyle: { backgroundColor: '#0a2e12' },
      headerTintColor: '#f0fdf4',
      headerTitleStyle: { fontWeight: '700', fontSize: 18 },
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Inicio', headerTitle: 'Rutopía',
        tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />,
      }} />
      <Tabs.Screen name="two" options={{
        title: 'Explorar',
        tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />,
      }} />
      <Tabs.Screen name="emprendedores" options={{
        title: 'Emprendedores',
        tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />,
      }} />
      <Tabs.Screen name="favoritos" options={{
        title: 'Favoritos',
        tabBarIcon: ({ focused, color }) => (
          <View>
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
            <BadgeFav count={favoritos.length} />
          </View>
        ),
      }} />
      <Tabs.Screen name="ranking" options={{
        title: 'Ranking',
        tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={24} color={color} />,
      }} />
      <Tabs.Screen name="perfil" options={{
        title: 'Perfil',
        tabBarIcon: ({ focused, color }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />,
      }} />
    </Tabs>
  );
}