import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp, LUGARES } from '../../context/AppContext';

export default function FavoritosScreen() {
  const { favoritos, toggleFavorito, usuario } = useApp();
  const lugares = LUGARES.filter(l => favoritos.includes(l.id));
  const isPremium = usuario?.plan === 'premium';

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>Mis Favoritos</Text>
        <Text style={s.heroSub}>{favoritos.length} {isPremium ? '∞' : `/ 5`} lugares guardados</Text>
      </View>

      {!isPremium && (
        <TouchableOpacity style={s.premiumBanner}>
          <Text style={s.premiumText}>✨ Actualiza a Premium — favoritos ilimitados</Text>
        </TouchableOpacity>
      )}

      <View style={s.list}>
        {lugares.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize: 50 }}>💚</Text>
            <Text style={s.emptyTitle}>Sin favoritos aún</Text>
            <Text style={s.emptyDesc}>Explora lugares y guarda los que más te gusten</Text>
            <TouchableOpacity style={s.btnExplorar} onPress={() => router.push('/(tabs)/two' as any)}>
              <Text style={s.btnExplorarText}>Explorar lugares</Text>
            </TouchableOpacity>
          </View>
        ) : (
          lugares.map(lugar => (
            <TouchableOpacity key={lugar.id} style={s.card} onPress={() => router.push(`/lugar/${lugar.id}` as any)} activeOpacity={0.9}>
              <View style={[s.cardImg, { backgroundColor: lugar.color }]}>
                <Text style={s.cardImgText}>{lugar.categoria.toUpperCase()}</Text>
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardName}>{lugar.nombre}</Text>
                <Text style={s.cardMun}>📍 {lugar.municipio} · 🚗 {lugar.distancia}</Text>
                <Text style={s.cardRating}>⭐ {lugar.calificacion}</Text>
              </View>
              <TouchableOpacity style={s.deleteBtn} onPress={() => {
                Alert.alert('Eliminar favorito', `¿Quitar "${lugar.nombre}" de favoritos?`, [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Eliminar', style: 'destructive', onPress: () => toggleFavorito(lugar.id) },
                ]);
              }}>
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  hero: { backgroundColor: '#0a2e12', padding: 24, paddingTop: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#f0fdf4' },
  heroSub: { fontSize: 13, color: '#4ade80', marginTop: 4 },
  premiumBanner: { margin: 16, backgroundColor: '#fbbf24', borderRadius: 12, padding: 12, alignItems: 'center' },
  premiumText: { fontSize: 13, fontWeight: '700', color: '#0a2e12' },
  list: { padding: 16, gap: 12 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0f4c20' },
  emptyDesc: { fontSize: 14, color: '#86a892', textAlign: 'center' },
  btnExplorar: { backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, marginTop: 8 },
  btnExplorarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', overflow: 'hidden', elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  cardImg: { width: 90, alignItems: 'center', justifyContent: 'center' },
  cardImgText: { color: '#fff', fontSize: 10, fontWeight: '700', textAlign: 'center', padding: 4 },
  cardBody: { flex: 1, padding: 12, gap: 4 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#0f4c20' },
  cardMun: { fontSize: 12, color: '#4b7c5a' },
  cardRating: { fontSize: 13, fontWeight: '600', color: '#0f4c20' },
  deleteBtn: { padding: 16, justifyContent: 'center' },
});