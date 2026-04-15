import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LUGARES, EMPRENDEDORES, useApp } from '../../context/AppContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 1. Configuración dinámica según el tipo de Ranking
const RANKING_THEME = {
  lugares: {
    titulos: ['DESTINO DE ÉLITE', 'PARADA OBLIGATORIA', 'JOYA POR DESCUBRIR'],
    simbolos: ['⭐', '📍', '🧭']
  },
  emprendedores: {
    titulos: ['MAESTRO ARTESANO', 'COMERCIO PREMIUM', 'TALENTO LOCAL'],
    simbolos: ['💎', '🤝', '🚀']
  }
};

const PODIO_CONFIG = {
  1: { 
    colors: ['#BF953F', '#FCF6BA', '#B38728', '#AA771C'], // Oro
    border: '#D4AF37', 
    text: '#5d4300' 
  },
  2: { 
    colors: ['#BDBDBD', '#E0E0E0', '#9E9E9E', '#757575'], // Plata
    border: '#9E9E9E', 
    text: '#333333' 
  },
  3: { 
    colors: ['#804A00', '#CD7F32', '#A0522D', '#5E2605'], // Bronce
    border: '#804A00', 
    text: '#ffffff' 
  },
};

const PODIO_HEIGHTS = [120, 150, 100];

export default function RankingScreen() {
  const { t } = useApp();
  const [tab, setTab] = useState<'lugares' | 'emprendedores'>('lugares');

  const topLugares = [...LUGARES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 8);
  const topEmp = [...EMPRENDEDORES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 8);

  const dataActual = tab === 'lugares' ? topLugares : topEmp;
  const currentTheme = RANKING_THEME[tab];
  
  const podio = [
    { data: dataActual[1], puesto: 2 },
    { data: dataActual[0], puesto: 1 },
    { data: dataActual[2], puesto: 3 }
  ];

  const resto = dataActual.slice(3);

  const handleTabChange = (nuevaTab: 'lugares' | 'emprendedores') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTab(nuevaTab);
  };

  const handlePressItem = (item: any) => {
    if (tab === 'lugares') router.push(`/lugar/${item.id}` as any);
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>

      {/* Hero */}
      <LinearGradient colors={['#0a2e12', '#16a34a']} style={s.hero}>
        <Text style={s.heroTitle}>🏆 {t.ranking}</Text>
        <Text style={s.heroSub}>Los mejores de Sabana Centro</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={s.tabsWrapper}>
        <View style={s.tabs}>
          <TouchableOpacity
            style={[s.tabBtn, tab === 'lugares' && s.tabActive]}
            onPress={() => handleTabChange('lugares')}
          >
            <Text style={[s.tabText, tab === 'lugares' && s.tabTextActive]}>🗺️ {t.explorar}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tabBtn, tab === 'emprendedores' && s.tabActive]}
            onPress={() => handleTabChange('emprendedores')}
          >
            <Text style={[s.tabText, tab === 'emprendedores' && s.tabTextActive]}>👥 {t.emprendedores}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PODIO DINÁMICO */}
      <View style={s.podioSection}>
        <View style={s.podioAvatarsRow}>
          {podio.map((p, index) => {
            if (!p.data) return null;
            const config = PODIO_CONFIG[p.puesto as keyof typeof PODIO_CONFIG];
            const esPrimero = p.puesto === 1;

            return (
              <TouchableOpacity
                key={p.data.id}
                style={[s.podioCol, esPrimero && s.podioColPrincipal]}
                onPress={() => handlePressItem(p.data)}
                activeOpacity={0.85}
              >
                <View style={s.avatarWrapper}>
                  {esPrimero && <Text style={s.corona}>👑</Text>}
                  <View style={[
                    s.avatarRing, 
                    { borderColor: config.border }, 
                    esPrimero && s.avatarRingGold
                  ]}>
                    <Image
                      source={{ uri: p.data.imagen }}
                      style={[s.avatarImg, esPrimero && s.avatarImgGrande]}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                {/* Nombre del Emprendimiento / Lugar */}
                <Text style={[s.nombrePodio, esPrimero && s.nombrePodioGrande]} numberOfLines={2}>
                  {tab === 'lugares' ? (p.data as any).nombre : (p.data as any).negocio}
                </Text>

                <View style={s.ratingPodioRow}>
                  <Text style={s.ratingPodioNum}>{p.data.calificacion}</Text>
                  <Text style={s.ratingPodioStar}>⭐</Text>
                </View>

                {/* INSIGNIA PROFESIONAL ADAPTADA */}
                <LinearGradient
                  colors={config.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[s.escalon, { height: PODIO_HEIGHTS[index] }]}
                >
                  <View style={s.insigniaInner}>
                    <Text style={s.simboloInsignia}>{currentTheme.simbolos[p.puesto - 1]}</Text>
                    <Text style={[s.tituloViajero, { color: config.text }]}>
                      {currentTheme.titulos[p.puesto - 1]}
                    </Text>
                    <View style={[s.divider, { backgroundColor: config.text, opacity: 0.3 }]} />
                    <Text style={[s.puestoLabel, { color: config.text }]}>N° {p.puesto}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* LISTA RESTANTE */}
      <View style={s.list}>
        {resto.map((item, i) => (
          <TouchableOpacity
            key={item.id}
            style={s.card}
            onPress={() => handlePressItem(item)}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#0a2e12', '#16a34a']} style={s.numBadge}>
              <Text style={s.numBadgeText}>#{i + 4}</Text>
            </LinearGradient>

            {item.imagen ? (
              <Image source={{ uri: item.imagen }} style={s.avatar} resizeMode="cover" />
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

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  hero: {
    padding: 24, paddingTop: 52, paddingBottom: 36,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    alignItems: 'center', elevation: 8,
  },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#f0fdf4' },
  heroSub: { fontSize: 14, color: '#4ade80', marginTop: 4, opacity: 0.9 },
  tabsWrapper: { paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  tabs: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 5,
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10,
  },
  tabBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#0a2e12' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#4b7c5a' },
  tabTextActive: { color: '#4ade80' },
  podioSection: { paddingHorizontal: 8, marginTop: 16, marginBottom: 8 },
  podioAvatarsRow: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'center',
  },
  podioCol: { alignItems: 'center', width: '31%', marginHorizontal: 2 },
  podioColPrincipal: { width: '34%' },
  avatarWrapper: { position: 'relative', alignItems: 'center', marginBottom: 8 },
  corona: { fontSize: 26, marginBottom: 2 },
  avatarRing: {
    borderWidth: 3, borderRadius: 50,
    padding: 3, backgroundColor: '#fff',
    elevation: 10, shadowColor: '#000',
    shadowOpacity: 0.3, shadowRadius: 5,
  },
  avatarRingGold: { borderWidth: 4 },
  avatarImg: { width: 60, height: 60, borderRadius: 30 },
  avatarImgGrande: { width: 80, height: 80, borderRadius: 40 },
  
  nombrePodio: { 
    fontSize: 10, 
    fontWeight: '900', 
    color: '#064e3b', 
    textAlign: 'center', 
    height: 30,
    textTransform: 'uppercase' 
  },
  nombrePodioGrande: { fontSize: 12 },
  ratingPodioRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 10 },
  ratingPodioNum: { fontSize: 12, fontWeight: '800', color: '#16a34a' },
  ratingPodioStar: { fontSize: 10 },

  escalon: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 3,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
  },
  insigniaInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  simboloInsignia: { fontSize: 18, marginBottom: 2 },
  tituloViajero: { 
    fontSize: 8, 
    fontWeight: '900', 
    textAlign: 'center',
    paddingHorizontal: 4,
    letterSpacing: 0.5,
  },
  divider: { width: '60%', height: 1, marginVertical: 6 },
  puestoLabel: { fontSize: 14, fontWeight: '900' },

  list: { paddingHorizontal: 16, gap: 10, marginTop: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  numBadge: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  numBadgeText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  avatar: { width: 50, height: 50, borderRadius: 14 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  info: { flex: 1 },
  itemNombre: { fontSize: 15, fontWeight: '700', color: '#0f4c20' },
  itemSub: { fontSize: 12, color: '#4b7c5a', marginTop: 2 },
  ratingBox: { alignItems: 'center', backgroundColor: '#f0fdf4', padding: 8, borderRadius: 12 },
  ratingNum: { fontSize: 17, fontWeight: '900', color: '#0f4c20' },
  ratingStar: { fontSize: 11 },
});