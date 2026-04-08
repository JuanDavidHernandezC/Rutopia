import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LUGARES, useApp } from '../../context/AppContext';
import { useState } from 'react';
import { ImageBackground } from 'react-native';

export default function LugarDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { esFavorito, toggleFavorito, favoritos, usuario, agregarResena, getResenasPorLugar, t } = useApp();
  const lugar = LUGARES.find(l => l.id === id);
  const [estrellas, setEstrellas] = useState(5);
  const [textoResena, setTextoResena] = useState('');

  const resenasGuardadas = lugar ? getResenasPorLugar(lugar.id) : [];
  const resenasIniciales = [
    { id:'0', lugarId: id ?? '', usuario:'Laura M.', texto:'¡Un lugar increíble! La vista es espectacular.', estrellas:5, fecha:'15/03/2026' },
    { id:'00', lugarId: id ?? '', usuario:'Andrés P.', texto:'Muy bien cuidado, ideal para familia.', estrellas:4, fecha:'20/03/2026' },
  ];
  const todasResenas = [...resenasGuardadas, ...resenasIniciales];

  const handlePublicar = () => {
    if (!textoResena.trim()) { Alert.alert('Escribe algo antes de publicar'); return; }
    agregarResena({ lugarId: lugar!.id, texto: textoResena.trim(), estrellas });
    setTextoResena('');
    setEstrellas(5);
    Alert.alert('✅ ¡Reseña publicada!', 'Gracias por tu opinión.');
  };

  if (!lugar) return (
    <View style={s.notFound}>
      <Text style={s.notFoundText}>Lugar no encontrado</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={s.back}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );

  const fav = esFavorito(lugar.id);

  const handleFav = () => {
    if (!fav && favoritos.length >= 5 && usuario?.plan === 'gratuito') {
      Alert.alert('Límite alcanzado', '¿Quieres favoritos ilimitados?\nActualiza a Premium 🌟', [
        { text: 'Ahora no' },
        { text: '¡Quiero Premium!', onPress: () => router.push('/planes' as any) },
      ]);
      return;
    }
    toggleFavorito(lugar.id);
  };

  const abrirMapa = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.nombre + ' ' + lugar.municipio + ' Colombia')}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>

      {/* Hero */}
      <View style={[s.hero, { backgroundColor: lugar.color }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={s.favBtn} onPress={handleFav}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={24} color={fav ? '#dc2626' : '#fff'} />
        </TouchableOpacity>
        <View style={s.heroContent}>
          <View style={s.catBadge}>
            <Text style={s.catText}>{lugar.categoria.toUpperCase()}</Text>
          </View>
          {lugar.patrocinado && (
            <View style={s.sponsorBadge}>
              <Text style={s.sponsorText}>⭐ Patrocinado</Text>
            </View>
          )}
        </View>
      </View>

      <View style={s.body}>

        {/* Info principal */}
        <View style={s.mainInfo}>
          <Text style={s.nombre}>{lugar.nombre}</Text>
          <View style={s.row}>
            <View style={s.ratingPill}>
              <Text style={s.ratingText}>⭐ {lugar.calificacion}</Text>
            </View>
            <Text style={s.municipio}>📍 {lugar.municipio}</Text>
            <Text style={s.distancia}>🚗 {lugar.distancia}</Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Descripción</Text>
          <Text style={s.desc}>{lugar.descripcion}</Text>
        </View>

        {/* Horario */}
        <View style={s.card}>
          <Text style={s.cardTitle}>🕐 Horario de atención</Text>
          <Text style={s.horario}>{lugar.horario}</Text>
        </View>

        {/* Botones acción */}
        <View style={s.actionsRow}>
          <TouchableOpacity style={s.btnMapa} onPress={abrirMapa}>
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={s.btnMapaText}>{t.verMapa}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btnFav, fav && s.btnFavActive]} onPress={handleFav}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#dc2626' : '#16a34a'} />
            <Text style={[s.btnFavText, fav && { color: '#dc2626' }]}>
              {fav ? t.guardado : t.guardar}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reseñas */}
        <View style={s.card}>
          <Text style={s.cardTitle}>💬 {t.reseñas}</Text>

          {/* Formulario nueva reseña */}
          <View style={s.resenaForm}>
            <Text style={s.resenaFormTitle}>{t.tuResena}</Text>
            <View style={s.starsRow}>
              {[1,2,3,4,5].map(star => (
                <TouchableOpacity key={star} onPress={() => setEstrellas(star)}>
                  <Text style={{ fontSize: 28 }}>{star <= estrellas ? '⭐' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={s.resenaInput}
              placeholder={t.escribeResena}
              placeholderTextColor="#86a892"
              value={textoResena}
              onChangeText={setTextoResena}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={s.resenaBtn} onPress={handlePublicar}>
              <Text style={s.resenaBtnText}>{t.publicar}</Text>
            </TouchableOpacity>
          </View>

          {/* Lista reseñas */}
          {todasResenas.length === 0 ? (
            <Text style={s.sinResenas}>Sé el primero en dejar una reseña</Text>
          ) : (
            todasResenas.map((r, i) => (
              <View key={i} style={s.review}>
                <View style={s.reviewHeader}>
                  <View style={s.reviewAvatar}>
                    <Text style={s.reviewAvatarText}>{r.usuario[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.reviewUser}>{r.usuario}</Text>
                    <Text style={s.reviewFecha}>{r.fecha}</Text>
                  </View>
                  <Text style={s.reviewStars}>{'⭐'.repeat(r.estrellas)}</Text>
                </View>
                <Text style={s.reviewText}>{r.texto}</Text>
              </View>
            ))
          )}
        </View>

      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { fontSize: 18, color: '#0f4c20' },
  back: { fontSize: 16, color: '#16a34a', fontWeight: '600' },
  hero: { height: 260, position: 'relative', justifyContent: 'flex-end' },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 8, zIndex: 1 },
  favBtn: { position: 'absolute', top: 50, right: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 8, zIndex: 1 },
  heroContent: { padding: 16, flexDirection: 'row', gap: 8 },
  catBadge: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  catText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sponsorBadge: { backgroundColor: '#fbbf24', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  sponsorText: { color: '#0a2e12', fontSize: 11, fontWeight: '700' },
  body: { padding: 16, gap: 14 },
  mainInfo: { gap: 8 },
  nombre: { fontSize: 26, fontWeight: '800', color: '#0f4c20' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  ratingPill: { backgroundColor: '#fef08a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  ratingText: { fontSize: 14, fontWeight: '700', color: '#0a2e12' },
  municipio: { fontSize: 13, color: '#4b7c5a', fontWeight: '500' },
  distancia: { fontSize: 13, color: '#4b7c5a' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8, elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0f4c20' },
  desc: { fontSize: 14, color: '#4b7c5a', lineHeight: 22 },
  horario: { fontSize: 15, color: '#16a34a', fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  btnMapa: { flex: 2, backgroundColor: '#0f4c20', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnMapaText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnFav: { flex: 1, backgroundColor: '#d1fae5', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnFavActive: { backgroundColor: '#fee2e2' },
  btnFavText: { color: '#16a34a', fontWeight: '700', fontSize: 14 },
  resenaForm: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 14, gap: 10 },
  resenaFormTitle: { fontSize: 14, fontWeight: '700', color: '#0f4c20' },
  starsRow: { flexDirection: 'row', gap: 4 },
  resenaInput: { backgroundColor: '#fff', borderRadius: 10, padding: 12, fontSize: 14, color: '#0f4c20', borderWidth: 1, borderColor: '#d1fae5', minHeight: 80, textAlignVertical: 'top' },
  resenaBtn: { backgroundColor: '#16a34a', borderRadius: 10, padding: 12, alignItems: 'center' },
  resenaBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sinResenas: { fontSize: 13, color: '#86a892', textAlign: 'center', paddingVertical: 12 },
  review: { borderTopWidth: 1, borderTopColor: '#f0fdf4', paddingTop: 10, gap: 6 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  reviewUser: { fontSize: 13, fontWeight: '700', color: '#0f4c20' },
  reviewFecha: { fontSize: 11, color: '#86a892' },
  reviewStars: { fontSize: 12 },
  reviewText: { fontSize: 13, color: '#4b7c5a', lineHeight: 19 },
});