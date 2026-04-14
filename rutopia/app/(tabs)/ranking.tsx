import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { LUGARES, EMPRENDEDORES, useApp } from '../../context/AppContext';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function RankingScreen() {
  const { t } = useApp();
  const [tab, setTab] = useState<'lugares' | 'emprendedores'>('lugares');

  const topLugares = [...LUGARES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 8);
  const topEmp = [...EMPRENDEDORES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 8);

  const dataActual = tab === 'lugares' ? topLugares : topEmp;
  
  // Lógica de Podio: Reorganizamos para que el 1ero quede en el centro [2do, 1ro, 3ro]
  const podio = [dataActual[1], dataActual[0], dataActual[2]];
  const resto = dataActual.slice(3);

  const handleTabChange = (nuevaTab: 'lugares' | 'emprendedores') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTab(nuevaTab);
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>🏆 {t.ranking}</Text>
        <Text style={s.heroSub}>Los mejores de Sabana Centro</Text>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'lugares' && s.tabActive]}
          onPress={() => handleTabChange('lugares')}
        >
          <Text style={[s.tabText, tab === 'lugares' && s.tabTextActive]}>
            Map 🗺️ {t.explorar}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'emprendedores' && s.tabActive]}
          onPress={() => handleTabChange('emprendedores')}
        >
          <Text style={[s.tabText, tab === 'emprendedores' && s.tabTextActive]}>
            👤 {t.emprendedores}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN PODIO */}
      <View style={s.podioContainer}>
        {podio.map((item, index) => {
          if (!item) return null;
          const esPrimero = index === 1;
          const medallaReal = index === 0 ? '🥈' : index === 1 ? '🥇' : '🥉';
          
          return (
            <View key={item.id} style={[s.podioPoste, esPrimero && s.podioPostePrincipal]}>
              <View style={s.avatarPodioWrapper}>
                {esPrimero && <Text style={s.corona}>👑</Text>}
                <Image
                  source={{ uri: item.imagen }}
                  style={[s.avatarPodio, esPrimero && s.avatarPodioGrande]}
                />
                <View style={s.badgeMedalla}><Text style={{fontSize: 12}}>{medallaReal}</Text></View>
              </View>
              <Text style={s.nombrePodio} numberOfLines={1}>
                {tab === 'lugares' ? (item as any).nombre : (item as any).negocio}
              </Text>
              <Text style={s.ratingPodio}>{item.calificacion} ⭐</Text>
              {/* Escalón visual */}
              <View style={[s.escalon, esPrimero ? s.escalonOro : s.escalonPlata]} />
            </View>
          );
        })}
      </View>

      {/* LISTA RESTANTE */}
      <View style={s.list}>
        {resto.map((item, i) => (
          <TouchableOpacity
            key={item.id}
            style={s.card}
            onPress={() => tab === 'lugares' && router.push(`/lugar/${item.id}` as any)}
            activeOpacity={tab === 'lugares' ? 0.85 : 1}
          >
            <Text style={s.medalla}>#{i + 4}</Text>

            {item.imagen ? (
              <Image source={{ uri: item.imagen }} style={s.avatar} />
            ) : (
              <View style={[s.avatarPlaceholder, { backgroundColor: item.color }]}>
                <Text style={s.avatarText}>
                  {tab === 'lugares' ? (item as any).categoria[0].toUpperCase() : (item as any).nombre[0]}
                </Text>
              </View>
            )}

            <View style={s.info}>
              <Text style={s.itemNombre} numberOfLines={1}>
                {tab === 'lugares' ? (item as any).nombre : (item as any).negocio}
              </Text>
              <Text style={s.itemSub}>
                {tab === 'lugares' ? `📍 ${(item as any).municipio}` : `👤 ${(item as any).nombre}`}
              </Text>
            </View>

            <View style={s.ratingBox}>
              <Text style={s.ratingNum}>{item.calificacion}</Text>
              <Text style={s.ratingStar}>⭐</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  hero: { 
    backgroundColor: '#0a2e12', 
    padding: 24, 
    paddingTop: 40, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    alignItems: 'center'
  },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#f0fdf4' },
  heroSub: { fontSize: 14, color: '#4ade80', marginTop: 4, opacity: 0.9 },
  
  tabs: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    marginTop: -25, 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#0a2e12' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#4b7c5a' },
  tabTextActive: { color: '#4ade80' },

  // Estilos del Podio
  podioContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    marginTop: 40, 
    height: 200,
    paddingHorizontal: 10 
  },
  podioPoste: { alignItems: 'center', width: '30%', marginHorizontal: 5 },
  podioPostePrincipal: { width: '35%', transform: [{ translateY: -15 }] },
  avatarPodioWrapper: { position: 'relative', marginBottom: 10 },
  avatarPodio: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: '#fff' },
  avatarPodioGrande: { width: 84, height: 84, borderRadius: 42, borderColor: '#fbbf24' },
  corona: { position: 'absolute', top: -25, alignSelf: 'center', fontSize: 24, zIndex: 10 },
  badgeMedalla: { 
    position: 'absolute', 
    bottom: -5, 
    right: -5, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    width: 24, 
    height: 24, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 3
  },
  nombrePodio: { fontSize: 12, fontWeight: '800', color: '#0f4c20', marginTop: 5, textAlign: 'center' },
  ratingPodio: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
  escalon: { width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 8 },
  escalonOro: { height: 60, backgroundColor: '#fef3c7' },
  escalonPlata: { height: 40, backgroundColor: '#f1f5f9' },

  // Estilos de Lista Originales
  list: { paddingHorizontal: 16, gap: 12, marginTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  medalla: { fontSize: 16, width: 36, textAlign: 'center', fontWeight: 'bold', color: '#86a892' },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  avatarPlaceholder: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  info: { flex: 1 },
  itemNombre: { fontSize: 15, fontWeight: '700', color: '#0f4c20' },
  itemSub: { fontSize: 12, color: '#4b7c5a', marginTop: 2 },
  ratingBox: { alignItems: 'center' },
  ratingNum: { fontSize: 18, fontWeight: '800', color: '#0f4c20' },
  ratingStar: { fontSize: 12 },
});