import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- FONDO ANIMADO MEJORADO ---
function MovingGradientBackground() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8], // Variación sutil para no cansar la vista
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Capa Base: Azul Cobalto Profundo (para contraste) */}
      <LinearGradient
        colors={['#004AAD', '#007CF0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Capa Animada: Cian Eléctrico */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <LinearGradient
          colors={['#00DFD8', '#004AAD']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

function BadgeFav({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={b.badge}>
      <Text style={b.badgeText}>{count}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { favoritos } = useApp();

  return (
    <Tabs
      screenOptions={{
        // HEADER
        headerTitle: 'RUTOPÍA',
        headerTitleAlign: 'center',
        headerBackground: () => <MovingGradientBackground />,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 22,
          letterSpacing: 2,
        },
        headerShadowVisible: false,

        // TAB BAR (Corrección de nombres cortados)
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 75, // Más alto para que quepa el texto
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 12,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'transparent', // Para que se vea el background animado
        },
        tabBarBackground: () => <MovingGradientBackground />,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        
        // Ajuste de etiquetas para evitar que se corten
        tabBarLabelStyle: {
          fontSize: 9, // Un punto más pequeño para asegurar que quepan 6 opciones
          fontWeight: '800',
          marginTop: 4,
        },
        tabBarIconStyle: {
            marginBottom: -2
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'INICIO',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'EXPLORAR',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emprendedores"
        options={{
          title: 'COMUNIDAD', // Nombre más corto para ayudar al espacio
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'FAVORITOS',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={22} color={color} />
              <BadgeFav count={favoritos.length} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'RANKING',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'PERFIL',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const b = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#FFFFFF' },
});