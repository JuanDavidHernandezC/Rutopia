import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LUGARES, EMPRENDEDORES, useApp } from '../../context/AppContext';

export default function HomeScreen() {
  const { usuario, t } = useApp();
  const [showPromo, setShowPromo] = useState(false);
  const top3 = [...LUGARES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 3);

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>

      {/* Pop-up oferta */}
      <Modal visible={showPromo} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalEmoji}>🎉</Text>
            <Text style={s.modalTitle}>¡Oferta del día!</Text>
            <Text style={s.modalDesc}>Visita Café de Montaña hoy y obtén{'\n'}un café gratis con tu tour</Text>
            <TouchableOpacity style={s.modalBtn} onPress={() => { setShowPromo(false); router.push('/lugar/4' as any); }}>
              <Text style={s.modalBtnText}>Ver oferta →</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPromo(false)}>
              <Text style={s.modalClose}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.heroSub}>Sabana Centro · Colombia</Text>
        <Text style={s.heroTitle}>{t.hola}, {usuario?.nombre?.split(' ')[0]} 👋</Text>
        <Text style={s.heroDesc}>{t.dondeVamos}</Text>
        <TouchableOpacity style={s.searchBtn} onPress={() => router.push('/(tabs)/two' as any)}>
          <Ionicons name="search" size={16} color="#86a892" />
          <Text style={s.searchBtnText}>{t.buscar}</Text>
        </TouchableOpacity>
      </View>

      {/* Banner publicitario */}
      <View style={s.adBanner}>
        <Text style={s.adEmoji}>☕</Text>
        <View style={s.adInfo}>
          <Text style={s.adLabel}>PUBLICIDAD</Text>
          <Text style={s.adTitle}>Café de Montaña — Tabio</Text>
          <Text style={s.adDesc}>Tour + cata de café desde $35.000</Text>
        </View>
        <TouchableOpacity style={s.adBtn} onPress={() => router.push('/lugar/4' as any)}>
          <Text style={s.adBtnText}>Ver</Text>
        </TouchableOpacity>
      </View>

      {/* Café destacado */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>☕ Café destacado del día</Text>
        <TouchableOpacity style={s.featuredCard} onPress={() => router.push('/lugar/4' as any)}>
          {LUGARES[3].imagen ? (
            <Image source={{ uri: LUGARES[3].imagen }} style={s.featuredImg} resizeMode="cover" />
          ) : (
            <View style={[s.featuredImgPlaceholder, { backgroundColor: LUGARES[3].color }]}>
              <Text style={s.featuredImgText}>CAFÉ</Text>
            </View>
          )}
          <View style={s.featuredBody}>
            <Text style={s.featuredName}>Café de Montaña</Text>
            <Text style={s.featuredSub}>📍 Tabio · ⭐ 4.9</Text>
            <Text style={s.featuredDesc}>Recorrido guiado + desayuno campesino</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Top 3 */}
      <View style={s.section}>
        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>🏆 {t.ranking}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/ranking' as any)}>
            <Text style={s.verTodos}>Ver ranking →</Text>
          </TouchableOpacity>
        </View>
        {top3.map((lugar, i) => (
          <TouchableOpacity
            key={lugar.id}
            style={s.topCard}
            onPress={() => router.push(`/lugar/${lugar.id}` as any)}
            activeOpacity={0.9}
          >
            <Text style={s.topMedal}>{['🥇','🥈','🥉'][i]}</Text>
            <View style={[s.topDot, { backgroundColor: lugar.color }]} />
            <Text style={s.topNombre} numberOfLines={1}>{lugar.nombre}</Text>
            <Text style={s.topRating}>⭐ {lugar.calificacion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Emprendedores */}
      <View style={s.section}>
        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>👥 {t.emprendedores}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/emprendedores' as any)}>
            <Text style={s.verTodos}>Ver todos →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {EMPRENDEDORES.slice(0, 4).map(e => (
            <View key={e.id} style={s.empCard}>
              {e.imagen ? (
                <Image source={{ uri: e.imagen }} style={s.empAvatar} />
              ) : (
                <View style={[s.empAvatarPlaceholder, { backgroundColor: e.color }]}>
                  <Text style={s.empAvatarText}>{e.nombre[0]}</Text>
                </View>
              )}
              <Text style={s.empNombre} numberOfLines={1}>{e.nombre.split(' ')[0]}</Text>
              <Text style={s.empNegocio} numberOfLines={1}>{e.negocio}</Text>
              <Text style={s.empRating}>⭐ {e.calificacion}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center', width: '80%', gap: 10 },
  modalEmoji: { fontSize: 40 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0f4c20' },
  modalDesc: { fontSize: 14, color: '#4b7c5a', textAlign: 'center', lineHeight: 20 },
  modalBtn: { backgroundColor: '#16a34a', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 20, marginTop: 6 },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  modalClose: { color: '#86a892', fontSize: 13, marginTop: 4 },
  hero: { backgroundColor: '#0a2e12', paddingTop: 50, paddingBottom: 28, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, gap: 4 },
  heroSub: { fontSize: 11, color: '#4ade80', letterSpacing: 2, textTransform: 'uppercase' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#f0fdf4' },
  heroDesc: { fontSize: 16, color: '#86a892', marginBottom: 12 },
  searchBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a5c2a', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  searchBtnText: { color: '#86a892', fontSize: 14 },
  adBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef9c3', margin: 16, borderRadius: 14, padding: 12, gap: 10, borderWidth: 1, borderColor: '#fbbf24' },
  adEmoji: { fontSize: 28 },
  adInfo: { flex: 1 },
  adLabel: { fontSize: 9, fontWeight: '700', color: '#86a892', letterSpacing: 1 },
  adTitle: { fontSize: 13, fontWeight: '700', color: '#0f4c20' },
  adDesc: { fontSize: 12, color: '#4b7c5a' },
  adBtn: { backgroundColor: '#fbbf24', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  adBtnText: { fontSize: 13, fontWeight: '700', color: '#0a2e12' },
  section: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0f4c20', marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  verTodos: { fontSize: 13, color: '#16a34a', fontWeight: '600' },
  featuredCard: { backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', overflow: 'hidden', elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  featuredImg: { width: 100, height: 90 },
  featuredImgPlaceholder: { width: 100, alignItems: 'center', justifyContent: 'center', height: 90 },
  featuredImgText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  featuredBody: { flex: 1, padding: 14, gap: 4 },
  featuredName: { fontSize: 16, fontWeight: '700', color: '#0f4c20' },
  featuredSub: { fontSize: 13, color: '#4b7c5a' },
  featuredDesc: { fontSize: 12, color: '#86a892' },
  topCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  topMedal: { fontSize: 20 },
  topDot: { width: 10, height: 10, borderRadius: 5 },
  topNombre: { flex: 1, fontSize: 14, fontWeight: '600', color: '#0f4c20' },
  topRating: { fontSize: 13, fontWeight: '700', color: '#0f4c20' },
  empCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', width: 110, elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, gap: 4 },
  empAvatar: { width: 48, height: 48, borderRadius: 24 },
  empAvatarPlaceholder: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  empAvatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  empNombre: { fontSize: 12, fontWeight: '700', color: '#0f4c20' },
  empNegocio: { fontSize: 11, color: '#86a892', textAlign: 'center' },
  empRating: { fontSize: 12, fontWeight: '600', color: '#0f4c20' },
});