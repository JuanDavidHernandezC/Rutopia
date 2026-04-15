import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image, Dimensions, Platform, SafeAreaView, Animated, Easing, Alert, Linking } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { LUGARES, EMPRENDEDORES, useApp } from '../../context/AppContext';

const LogoRutopia = require('../../assets/images/Rutopia.png');
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { usuario, t } = useApp();
  const [showPromo, setShowPromo] = useState(false);
  // Nuevo estado para el modal de contacto personalizado
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  
  // Función actualizada para abrir nuestro modal personalizado
  const contactarEmprendedor = (e: any) => {
    setSelectedEmp(e);
  };

  const animRank1 = useRef(new Animated.Value(0)).current;
  const animRank2 = useRef(new Animated.Value(0)).current;
  const animRank3 = useRef(new Animated.Value(0)).current;
  const empAnims = useRef(EMPRENDEDORES.map(() => new Animated.Value(0))).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  const top3 = [...LUGARES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 3);

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 2000);
    
    Animated.sequence([
      Animated.stagger(200, [
        Animated.spring(animRank2, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.spring(animRank1, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.spring(animRank3, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      Animated.stagger(100, empAnims.map(anim => 
        Animated.spring(anim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true })
      ))
    ]).start(() => {
      startFloating();
    });

    return () => clearTimeout(timer);
  }, []);

  const startFloating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getAnimationStyle = (anim: Animated.Value, delayFactor: number) => {
    const translateYEntry = anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const floatEffect = floatingAnim.interpolate({ 
      inputRange: [0, 1], 
      outputRange: [0, -6 * delayFactor] 
    });

    return {
      opacity: anim,
      transform: [
        { translateY: Animated.add(translateYEntry, floatEffect) },
        { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }
      ]
    };
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      
      {/* MODAL DE CONTACTO PERSONALIZADO (MÁS LLAMATIVO) */}
      <Modal visible={!!selectedEmp} transparent animationType="slide">
        <View style={s.contactOverlay}>
          <TouchableOpacity style={s.contactDismiss} onPress={() => setSelectedEmp(null)} />
          <View style={s.contactSheet}>
            <View style={s.contactHandle} />
            <Text style={s.contactTitle}>¡Conecta con {selectedEmp?.nombre}!</Text>
            <Text style={s.contactSub}>{selectedEmp?.negocio}</Text>
            
            <View style={s.contactOptions}>
              <TouchableOpacity 
                style={[s.contactOption, { borderLeftColor: '#25D366' }]} 
                onPress={() => { selectedEmp?.whatsapp && Linking.openURL(`https://wa.me/${selectedEmp.whatsapp}`); setSelectedEmp(null); }}
              >
                <View style={[s.contactIconBg, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                </View>
                <Text style={s.contactOptionText}>WhatsApp</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[s.contactOption, { borderLeftColor: '#E1306C' }]} 
                onPress={() => { selectedEmp?.instagram && Linking.openURL(`https://instagram.com/${selectedEmp.instagram}`); setSelectedEmp(null); }}
              >
                <View style={[s.contactIconBg, { backgroundColor: '#FCE7F3' }]}>
                  <Ionicons name="logo-instagram" size={24} color="#E1306C" />
                </View>
                <Text style={s.contactOptionText}>Instagram</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[s.contactOption, { borderLeftColor: '#007CF0' }]} 
                onPress={() => { Linking.openURL(`mailto:${selectedEmp?.email}`); setSelectedEmp(null); }}
              >
                <View style={[s.contactIconBg, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="mail" size={24} color="#007CF0" />
                </View>
                <Text style={s.contactOptionText}>Correo Electrónico</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={s.contactCancelBtn} onPress={() => setSelectedEmp(null)}>
              <Text style={s.contactCancelText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPromo} transparent animationType="fade">
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

      <LinearGradient colors={['#007CF0', '#00DFD8']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={s.hero}>
        <SafeAreaView>
          <View style={s.heroContent}>
            <View style={s.headerRow}>
              <View style={s.heroTextColumn}>
                <Text style={s.heroSub}>🌎 SABANA CENTRO · COLOMBIA 🇨🇴</Text>
                <Text style={s.heroTitle}>{t.hola},{'\n'}{usuario?.nombre?.split(' ')[0]}! 🎒</Text>
              </View>
              <View style={s.heroLogoColumn}>
                <Image source={LogoRutopia} style={s.logoHeader} resizeMode="contain" />
              </View>
            </View>
            <Text style={s.heroDesc}>{t.dondeVamos}</Text>
            <TouchableOpacity style={s.searchBar} onPress={() => router.push('/(tabs)/two' as any)}>
              <Ionicons name="search-outline" size={20} color="#007CF0" />
              <Text style={s.searchBarText}>{t.buscar}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={s.adBanner}>
        <View style={s.adBadge}><Text style={s.adBadgeText}>⭐ PATROCINADO</Text></View>
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

      <View style={s.section}>
        <View style={s.rowBetween}>
          <View style={s.sectionHeader}>
            <Ionicons name="trophy" size={22} color="#FBBF24" />
            <Text style={s.sectionTitle}>{t.ranking} TOP 3</Text>
          </View>
          <TouchableOpacity style={s.verTodosBtn} onPress={() => router.push('/(tabs)/ranking' as any)}>
            <Text style={s.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={s.podiumContainer}>
          <Animated.View style={[s.podiumSide, getAnimationStyle(animRank2, 0.8)]}>
            <TouchableOpacity onPress={() => router.push(`/lugar/${top3[1].id}` as any)} style={s.alignCenter}>
              <View style={s.avatarWrapper}>
                <Image source={{ uri: top3[1].imagen }} style={[s.podiumAvatar, { borderColor: '#CBD5E1' }]} />
                <View style={[s.podiumBadge, { backgroundColor: '#94A3B8' }]}><Text style={s.badgeText}>2</Text></View>
              </View>
              <Text style={s.podiumNameSmall} numberOfLines={1}>{top3[1].nombre}</Text>
              <View style={[s.ratingPill, { backgroundColor: '#F1F5F9' }]}>
                <Text style={[s.ratingPillText, { color: '#64748B' }]}>⭐ {top3[1].calificacion}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[s.podiumCenter, getAnimationStyle(animRank1, 1.2)]}>
            <TouchableOpacity onPress={() => router.push(`/lugar/${top3[0].id}` as any)} style={s.alignCenter}>
              <LinearGradient colors={['#FBBF24', '#D97706']} style={s.winnerHalo}>
                <Image source={{ uri: top3[0].imagen }} style={s.winnerAvatar} />
                <View style={s.winnerCrown}>
                  <Ionicons name="ribbon" size={20} color="white" />
                </View>
              </LinearGradient>
              <Text style={s.podiumNameMain} numberOfLines={1}>{top3[0].nombre}</Text>
              <View style={s.ratingPill}>
                <Text style={s.ratingPillText}>⭐ {top3[0].calificacion}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[s.podiumSide, getAnimationStyle(animRank3, 0.6)]}>
            <TouchableOpacity onPress={() => router.push(`/lugar/${top3[2].id}` as any)} style={s.alignCenter}>
              <View style={s.avatarWrapper}>
                <Image source={{ uri: top3[2].imagen }} style={[s.podiumAvatar, { borderColor: '#EDD5B3' }]} />
                <View style={[s.podiumBadge, { backgroundColor: '#CD7F32' }]}><Text style={s.badgeText}>3</Text></View>
              </View>
              <Text style={s.podiumNameSmall} numberOfLines={1}>{top3[2].nombre}</Text>
              <View style={[s.ratingPill, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[s.ratingPillText, { color: '#B45309' }]}>⭐ {top3[2].calificacion}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Ionicons name="star" size={22} color="#FBBF24" />
          <Text style={s.sectionTitle}>DESTACADO DEL DÍA</Text>
        </View>
        <TouchableOpacity style={s.featuredCard} onPress={() => router.push('/lugar/4' as any)}>
          <Image source={{ uri: LUGARES[3].imagen }} style={s.featuredImg} />
          <View style={s.featuredBody}>
            <Text style={s.featuredName}>Restaurante al Carbón</Text>
            <View style={s.featuredRow}>
              <Text style={s.featuredLocation}>📍 Tabio</Text>
              <View style={s.ratingBadge}><Text style={s.ratingText}>⭐ 4.9</Text></View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <View style={s.rowBetween}>
          <View style={s.sectionHeader}>
            <View style={s.iconCircleBg}>
              <Ionicons name="rocket" size={18} color="#00DFD8" />
            </View>
            <Text style={s.sectionTitle}>{t.emprendedores}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/emprendedores' as any)}>
            <Text style={s.verTodosLink}>Ver todos →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.empScrollContainer}>
          {EMPRENDEDORES.slice(0, 5).map((e, index) => (
            <Animated.View 
              key={e.id} 
              style={{
                opacity: empAnims[index],
                transform: [
                  { scale: empAnims[index] },
                  { translateY: empAnims[index].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
                ]
              }}
            >
              <TouchableOpacity 
                activeOpacity={0.9} 
                style={s.newEmpCard}
                onPress={() => router.push(`/emprendedor/${e.id}` as any)}
              >
                <View style={s.cardTopInfo}>
                  <View style={s.onlineDot} />
                  <View style={s.miniRatingBadge}>
                    <Ionicons name="star" size={10} color="#FBBF24" />
                    <Text style={s.miniRatingText}>{e.calificacion}</Text>
                  </View>
                </View>

                <View style={s.newEmpAvatarWrapper}>
                  <LinearGradient
                    colors={[e.color || '#007CF0', '#AC58F5']}
                    style={s.newEmpAvatarGradient}
                  >
                    {e.imagen ? (
                      <Image source={{ uri: e.imagen }} style={s.newEmpAvatarImg} />
                    ) : (
                      <Text style={s.newEmpAvatarInitial}>{e.nombre[0]}</Text>
                    )}
                  </LinearGradient>
                </View>

                <View style={s.newEmpInfoArea}>
                  <Text style={s.newEmpName} numberOfLines={1}>{e.nombre}</Text>
                  <View style={s.newEmpTag}>
                    <Text style={s.newEmpTagText} numberOfLines={1}>{e.negocio}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={s.connectBtn}
                  onPress={() => contactarEmprendedor(e)}
                >
                  <LinearGradient 
                    colors={['#007CF0', '#00DFD8']} 
                    start={{x:0, y:0}} end={{x:1, y:0}}
                    style={s.connectBtnGradient}
                  >
                    <Text style={s.connectBtnText}>Contactar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  alignCenter: { alignItems: 'center' },
  // ESTILOS NUEVOS PARA EL MODAL DE CONTACTO
  contactOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  contactDismiss: { flex: 1 },
  contactSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, elevation: 25, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20 },
  contactHandle: { width: 50, height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  contactTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', textAlign: 'center' },
  contactSub: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 25, fontWeight: '600' },
  contactOptions: { gap: 15, marginBottom: 25 },
  contactOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 15, borderRadius: 20, borderLeftWidth: 6 },
  contactIconBg: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  contactOptionText: { flex: 1, fontSize: 16, fontWeight: '800', color: '#1E293B' },
  contactCancelBtn: { backgroundColor: '#F1F5F9', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  contactCancelText: { color: '#64748B', fontWeight: '800', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { borderRadius: 30, width: '85%', overflow: 'hidden', elevation: 20 },
  modalGradient: { padding: 30, alignItems: 'center' },
  modalIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  modalDesc: { fontSize: 16, color: '#FFFFFF', textAlign: 'center', marginVertical: 15, fontWeight: '600', lineHeight: 22 },
  modalBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 25, paddingVertical: 14, borderRadius: 15 },
  modalBtnText: { color: '#F97316', fontWeight: '800', fontSize: 15 },
  modalClose: { color: '#FFFFFF', fontSize: 14, marginTop: 20, fontWeight: '500', opacity: 0.8 },
  hero: { paddingTop: Platform.OS === 'ios' ? 10 : 30, paddingBottom: 35, paddingHorizontal: 25, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 10 },
  heroContent: { gap: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, 
  heroTextColumn: { flex: 1, gap: 2 }, 
  heroLogoColumn: { marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
  logoHeader: { width: 110, height: 110 },
  heroSub: { fontSize: 11, color: '#FFFFFF', letterSpacing: 1.2, fontWeight: '800', opacity: 0.9, marginBottom: 4 },
  heroTitle: { fontSize: 30, fontWeight: '900', color: '#FFFFFF', lineHeight: 34 },
  heroDesc: { fontSize: 16, color: '#FFFFFF', marginBottom: 10, opacity: 0.9, fontWeight: '500' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 14, gap: 10, elevation: 5 },
  searchBarText: { color: '#64748B', fontSize: 15, fontWeight: '600' },
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
  section: { paddingHorizontal: 25, marginTop: 10, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  iconCircleBg: { backgroundColor: '#E0F2FE', padding: 8, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verTodosBtn: { backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  verTodosLink: { fontSize: 13, color: '#007CF0', fontWeight: '700' },
  verTodos: { fontSize: 12, color: '#007CF0', fontWeight: '800' },
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', height: 180, marginVertical: 15 },
  podiumSide: { flex: 1, alignItems: 'center' },
  podiumCenter: { flex: 1.3, alignItems: 'center', zIndex: 10 },
  avatarWrapper: { position: 'relative' },
  podiumAvatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 3 },
  podiumBadge: { position: 'absolute', bottom: -5, right: -5, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  badgeText: { color: 'white', fontSize: 12, fontWeight: '900' },
  winnerHalo: { width: 105, height: 105, borderRadius: 55, padding: 5, elevation: 12, shadowColor: '#F59E0B', shadowOpacity: 0.5, shadowRadius: 10 },
  winnerAvatar: { width: '100%', height: '100%', borderRadius: 50, borderWidth: 3, borderColor: 'white' },
  winnerCrown: { position: 'absolute', top: -15, alignSelf: 'center', backgroundColor: '#FBBF24', padding: 4, borderRadius: 12, borderWidth: 2, borderColor: 'white' },
  podiumNameMain: { marginTop: 12, fontWeight: '900', color: '#1E293B', fontSize: 15 },
  podiumNameSmall: { marginTop: 8, fontWeight: '700', color: '#64748B', fontSize: 12 },
  ratingPill: { backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 4 },
  ratingPillText: { fontSize: 11, fontWeight: '800', color: '#D97706' },
  featuredCard: { backgroundColor: '#FFFFFF', borderRadius: 25, overflow: 'hidden', elevation: 5 },
  featuredImg: { width: '100%', height: 160 },
  featuredBody: { padding: 18, gap: 6 },
  featuredName: { fontSize: 19, fontWeight: '800', color: '#1E293B' },
  featuredRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredLocation: { fontSize: 14, color: '#007CF0', fontWeight: '700' },
  ratingBadge: { backgroundColor: '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#F59E0B' },
  empScrollContainer: { paddingRight: 25, paddingVertical: 10, gap: 15 },
  newEmpCard: { width: 160, backgroundColor: 'white', borderRadius: 28, padding: 15, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTopInfo: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 8 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  miniRatingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  miniRatingText: { fontSize: 11, fontWeight: '800', color: '#B45309', marginLeft: 2 },
  newEmpAvatarWrapper: { padding: 4, borderRadius: 22, backgroundColor: '#F8FAFC', marginBottom: 10 },
  newEmpAvatarGradient: { width: 70, height: 70, borderRadius: 18, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  newEmpAvatarImg: { width: '100%', height: '100%' },
  newEmpAvatarInitial: { fontSize: 28, fontWeight: '900', color: 'white' },
  newEmpInfoArea: { alignItems: 'center', marginBottom: 12 },
  newEmpName: { fontSize: 15, fontWeight: '900', color: '#1E293B' },
  newEmpTag: { backgroundColor: '#E0F2FE', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20, marginTop: 4 },
  newEmpTagText: { fontSize: 10, color: '#0369A1', fontWeight: '800', textTransform: 'uppercase' },
  connectBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  connectBtnGradient: { paddingVertical: 8, alignItems: 'center' },
  connectBtnText: { color: 'white', fontSize: 12, fontWeight: '800' }
});