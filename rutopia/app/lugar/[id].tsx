import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LUGARES, useApp } from '../../context/AppContext';

export default function LugarDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { esFavorito, toggleFavorito, favoritos, usuario } = useApp();
  const lugar = LUGARES.find(l => l.id === id);

  if (!lugar) return (
    <View style={s.notFound}>
      <Text style={s.notFoundText}>Lugar no encontrado</Text>
      <TouchableOpacity onPress={() => router.back()}><Text style={s.back}>← Volver</Text></TouchableOpacity>
    </View>
  );

  const fav = esFavorito(lugar.id);

  const handleFav = () => {
    if (!fav && favoritos.length >= 5 && usuario?.plan === 'gratuito') {
      Alert.alert('Límite alcanzado', '¿Quieres favoritos ilimitados?\nActualiza a Premium 🌟', [
        { text: 'Ahora no' }, { text: '¡Quiero Premium!' }
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
      {/* Imagen hero */}
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
            <Text style={s.btnMapaText}>Ver en Google Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btnFav, fav && s.btnFavActive]} onPress={handleFav}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#dc2626' : '#16a34a'} />
            <Text style={[s.btnFavText, fav && { color: '#dc2626' }]}>
              {fav ? 'Guardado' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reseñas simuladas */}
        <View style={s.card}>
          <Text style={s.cardTitle}>💬 Reseñas destacadas</Text>
          {[
            { user: 'Laura M.', texto: '¡Un lugar increíble! La vista es espectacular.', stars: 5 },
            { user: 'Andrés P.', texto: 'Muy bien cuidado, ideal para familia.', stars: 4 },
          ].map((r, i) => (
            <View key={i} style={s.review}>
              <View style={s.reviewHeader}>
                <View style={s.reviewAvatar}>
                  <Text style={s.reviewAvatarText}>{r.user[0]}</Text>
                </View>
                <Text style={s.reviewUser}>{r.user}</Text>
                <Text style={s.reviewStars}>{'⭐'.repeat(r.stars)}</Text>
              </View>
              <Text style={s.reviewText}>{r.texto}</Text>
            </View>
          ))}
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
  review: { borderTopWidth: 1, borderTopColor: '#f0fdf4', paddingTop: 10, gap: 6 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  reviewUser: { flex: 1, fontSize: 13, fontWeight: '700', color: '#0f4c20' },
  reviewStars: { fontSize: 12 },
  reviewText: { fontSize: 13, color: '#4b7c5a', lineHeight: 19 },
});