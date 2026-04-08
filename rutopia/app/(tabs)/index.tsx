import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image, Dimensions, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LUGARES, EMPRENDEDORES, useApp } from '../../context/AppContext';

// Importación del logo
const LogoRutopia = require('../../assets/images/Rutopia.png');

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { usuario, t } = useApp();
  const [showPromo, setShowPromo] = useState(false);
  const top3 = [...LUGARES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 3);

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>

      {/* Pop-up Oferta */}
      <Modal visible={showPromo} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <LinearGradient colors={['#FF6B6B', '#F97316']} style={s.modalGradient}>
              <View style={s.modalIconCircle}>
                <Ionicons name="gift" size={40} color="#F97316" />
              </View>
              <Text style={s.modalTitle}>¡OFERTA RELÁMPAGO!</Text>
              <Text style={s.modalDesc}>Visita Café de Montaña hoy y obtén{'\n'}🍵 UN CAFÉ GRATIS 🍵</Text>
              <TouchableOpacity 
                style={s.modalBtn} 
                onPress={() => { setShowPromo(false); router.push('/lugar/4' as any); }}
              >
                <Text style={s.modalBtnText}>¡APROVECHAR AHORA! →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPromo(false)}>
                <Text style={s.modalClose}>Cerrar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Hero Section - Logo Mejorado */}
      <LinearGradient 
        colors={['#007CF0', '#00DFD8']} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}} 
        style={s.hero}
      >
        <View style={s.heroContent}>
          <View style={s.headerRow}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={s.heroSub}>🌎 SABANA CENTRO · COLOMBIA 🇨🇴</Text>
              <Text style={s.heroTitle}>{t.hola}, {usuario?.nombre?.split(' ')[0]}! 🎒</Text>
            </View>
            
            {/* Logo estilizado sin fondo cuadrado */}
            <Image 
              source={LogoRutopia} 
              style={s.logoHeader} 
              resizeMode="contain" 
            />
          </View>
          
          <Text style={s.heroDesc}>{t.dondeVamos}</Text>
          
          <TouchableOpacity style={s.searchBar} onPress={() => router.push('/(tabs)/two' as any)}>
            <Ionicons name="search-outline" size={20} color="#007CF0" />
            <Text style={s.searchBarText}>{t.buscar}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Banner Publicitario */}
      <View style={s.adBanner}>
        <View style={s.adBadge}>
          <Text style={s.adBadgeText}>⭐ PATROCINADO</Text>
        </View>
        <View style={s.adRow}>
          <View style={s.adTextContainer}>
            <Text style={s.adTitle}>🎯 AL CARBÓN — TABIO</Text>
            <Text style={s.adDesc}>Tour + cata de café desde $35.000</Text>
            <Text style={s.adPromo}>🚨 2x1 en postres hoy 🚨</Text>
          </View>
          <TouchableOpacity style={s.adBtn} onPress={() => router.push('/lugar/4' as any)}>
            <Text style={s.adBtnText}>VER →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurante destacado */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Ionicons name="star" size={22} color="#FBBF24" />
          <Text style={s.sectionTitle}>DESTACADO DEL DÍA</Text>
        </View>
        <TouchableOpacity style={s.featuredCard} onPress={() => router.push('/lugar/4' as any)}>
          {LUGARES[3].imagen ? (
            <Image source={{ uri: LUGARES[3].imagen }} style={s.featuredImg} />
          ) : (
            <LinearGradient colors={['#F97316', '#F59E0B']} style={s.featuredImgPlaceholder}>
              <Text style={s.featuredImgText}>🔥 CAFÉ 🔥</Text>
            </LinearGradient>
          )}
          <div style={s.featuredBody}>
            <Text style={s.featuredName}>Restaurante al Carbón</Text>
            <View style={s.featuredRow}>
              <Text style={s.featuredLocation}>📍 Tabio</Text>
              <View style={s.ratingBadge}>
                <Text style={s.ratingText}>⭐ 4.9</Text>
              </View>
            </View>
          </div>
        </TouchableOpacity>
      </View>

      {/* Top 3 Ranking */}
      <View style={s.section}>
        <View style={s.rowBetween}>
          <View style={s.sectionHeader}>
            <Ionicons name="trophy" size={22} color="#007CF0" />
            <Text style={s.sectionTitle}>{t.ranking}</Text>
          </View>
          <TouchableOpacity style={s.verTodosBtn} onPress={() => router.push('/(tabs)/ranking' as any)}>
            <Text style={s.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        {top3.map((lugar, i) => (
          <TouchableOpacity
            key={lugar.id}
            style={s.topCard}
            onPress={() => router.push(`/lugar/${lugar.id}` as any)}
            activeOpacity={0.8}
          >
            <Text style={s.topMedal}>{['🥇', '🥈', '🥉'][i]}</Text>
            <View style={s.topInfo}>
               <Text style={s.topNombre} numberOfLines={1}>{lugar.nombre}</Text>
               <Text style={s.topLoc}>Explorar destino</Text>
            </View>
            <View style={s.topRatingContainer}>
              <Text style={s.topRating}>⭐ {lugar.calificacion}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Emprendedores */}
      <View style={s.section}>
        <View style={s.rowBetween}>
          <View style={s.sectionHeader}>
            <Ionicons name="people" size={22} color="#00DFD8" />
            <Text style={s.sectionTitle}>{t.emprendedores}</Text>
          </View>
          <TouchableOpacity style={s.verTodosBtn} onPress={() => router.push('/(tabs)/emprendedores' as any)}>
            <Text style={s.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.empList}>
          {EMPRENDEDORES.slice(0, 4).map(e => (
            <TouchableOpacity key={e.id} style={s.empCard} activeOpacity={0.9}>
              {e.imagen ? (
                <Image source={{ uri: e.imagen }} style={s.empAvatar} />
              ) : (
                <LinearGradient colors={[e.color, e.color + 'CC']} style={s.empAvatarPlaceholder}>
                  <Text style={s.empAvatarText}>{e.nombre[0]}</Text>
                </LinearGradient>
              )}
              <Text style={s.empNombre} numberOfLines={1}>{e.nombre.split(' ')[0]}</Text>
              <Text style={s.empNegocio} numberOfLines={1}>{e.negocio}</Text>
              <View style={s.empRatingContainer}>
                <Text style={s.empRating}>⭐ {e.calificacion}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  
  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { borderRadius: 30, width: '85%', overflow: 'hidden', elevation: 20 },
  modalGradient: { padding: 30, alignItems: 'center' },
  modalIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  modalDesc: { fontSize: 16, color: '#FFFFFF', textAlign: 'center', marginVertical: 15, fontWeight: '600', lineHeight: 22 },
  modalBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 25, paddingVertical: 14, borderRadius: 15, shadowOpacity: 0.2 },
  modalBtnText: { color: '#F97316', fontWeight: '800', fontSize: 15 },
  modalClose: { color: '#FFFFFF', fontSize: 14, marginTop: 20, fontWeight: '500', opacity: 0.8 },
  
  // HERO - LOGO AJUSTADO
  hero: { paddingTop: 60, paddingBottom: 35, paddingHorizontal: 25, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 10 },
  heroContent: { gap: 2 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  logoHeader: { width: 85, height: 85, marginTop: -10 }, // Tamaño ajustado y un poco hacia arriba para equilibrar
  heroSub: { fontSize: 11, color: '#FFFFFF', letterSpacing: 1.2, fontWeight: '800', opacity: 0.9, marginBottom: 4 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', lineHeight: 32 },
  heroDesc: { fontSize: 16, color: '#FFFFFF', marginBottom: 18, opacity: 0.9, fontWeight: '500' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 14, gap: 10, elevation: 5 },
  searchBarText: { color: '#64748B', fontSize: 15, fontWeight: '600' },
  
  // AD BANNER
  adBanner: { backgroundColor: '#FFFFFF', margin: 25, borderRadius: 25, padding: 20, elevation: 8, borderLeftWidth: 8, borderLeftColor: '#FBBF24' },
  adBadge: { marginBottom: 8 },
  adBadgeText: { color: '#F59E0B', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  adRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adTextContainer: { flex: 1 },
  adTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  adDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  adPromo: { fontSize: 12, color: '#EF4444', fontWeight: '700', marginTop: 4 },
  adBtn: { backgroundColor: '#1E293B', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 },
  adBtnText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  
  // SECTIONS
  section: { paddingHorizontal: 25, marginTop: 10, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verTodosBtn: { backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  verTodos: { fontSize: 12, color: '#007CF0', fontWeight: '800' },
  
  // FEATURED CARD
  featuredCard: { backgroundColor: '#FFFFFF', borderRadius: 25, overflow: 'hidden', elevation: 5 },
  featuredImg: { width: '100%', height: 160 },
  featuredImgPlaceholder: { width: '100%', height: 160, alignItems: 'center', justifyContent: 'center' },
  featuredImgText: { color: '#FFFFFF', fontWeight: '900', fontSize: 20 },
  featuredBody: { padding: 18, gap: 6 },
  featuredName: { fontSize: 19, fontWeight: '800', color: '#1E293B' },
  featuredRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredLocation: { fontSize: 14, color: '#007CF0', fontWeight: '700' },
  ratingBadge: { backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#F59E0B' },
  
  // TOP RANKING
  topCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 12, elevation: 3 },
  topMedal: { fontSize: 26 },
  topInfo: { flex: 1 },
  topNombre: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  topLoc: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  topRatingContainer: { backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  topRating: { fontSize: 13, fontWeight: '800', color: '#F59E0B' },
  
  // EMPRENDEDORES
  empList: { paddingRight: 25, gap: 15 },
  empCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 15, alignItems: 'center', width: 130, elevation: 4, borderBottomWidth: 4, borderBottomColor: '#00DFD8' },
  empAvatar: { width: 65, height: 65, borderRadius: 32 },
  empAvatarPlaceholder: { width: 65, height: 65, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  empAvatarText: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  empNombre: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginTop: 5 },
  empNegocio: { fontSize: 11, color: '#007CF0', fontWeight: '700' },
  empRatingContainer: { backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 8 },
  empRating: { fontSize: 11, fontWeight: '800', color: '#F59E0B' },
});