import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function TabsLayout() {
  const { favorites } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#0a2e12',
          borderTopColor: '#1a5c2a',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: '#86a892',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#0a2e12',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#f0fdf4',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: 'Rutopía',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          headerTitle: 'Explorar lugares',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          headerTitle: 'Tus favoritos',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={26}
              color={color}
            />
          ),
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: 10,
          },
        }}
      />

      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          headerTitle: 'Top lugares',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'trophy' : 'trophy-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: 'Mi perfil',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Pantalla de detalle de lugar - no aparece en el tab bar */}
      <Tabs.Screen
        name="place-detail"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      {/* Pantalla del chatbot - no aparece en el tab bar */}
      <Tabs.Screen
        name="chatbot"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}