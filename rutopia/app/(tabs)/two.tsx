import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LUGARES, useApp } from '../../context/AppContext';

const CATS = ['Todos', 'ecoturismo', 'gastronomia', 'cafes', 'cultura'];
const CAT_LABEL: Record<string, string> = { Todos: 'Todos', ecoturismo: '🌿 Eco', gastronomia: '🍽️ Gastro', cafes: '☕ Cafés', cultura: '🎭 Cultura' };

export default function ExplorarScreen() {
  const { esFavorito, toggleFavorito, favoritos, usuario } = useApp();
  const [busqueda, setBusqueda] = useState('');
  const [catActiva, setCatActiva] = useState('Todos');

  const filtrados = LUGARES.filter(l => {
    const matchBusqueda = l.nombre.toLowerCase().includes(busqueda.toLowerCase()) || l.categoria.includes(busqueda.toLowerCase());
    const matchCat = catActiva === 'Todos' || l.categoria === catActiva;
    return matchBusqueda && matchCat;
  });

  const handleFav = (id: string) => {
    if (!esFavorito(id) && favoritos.length >= 5 && usuario?.plan === 'gratuito') {
      Alert.alert('Límite alcanzado', '¿Quieres favoritos ilimitados?\nActualiza a Premium 🌟', [
        { text: 'Ahora no' }, { text: '¡Quiero Premium!', style: 'default' }
      ]);
      return;
    }
    toggleFavorito(id);
  };

  return (
    <View style={s.screen}>
      {/* Búsqueda */}
      <View style={s.searchWrap}>
        <Ionicons name="search" size={18} color="#86a892" />
        <TextInput style={s.searchInput} placeholder="Buscar lugares..." placeholderTextColor="#86a892" value={busqueda} onChangeText={setBusqueda} />
        {busqueda.length > 0 && <TouchableOpacity onPress={() => setBusqueda('')}><Ionicons name="close-circle" size={18} color="#86a892" /></TouchableOpacity>}
      </View>

      {/* Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catsRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {CATS.map(cat => (
          <TouchableOpacity key={cat} style={[s.chip, catActiva === cat && s.chipActive]} onPress={() => setCatActiva(cat)}>
            <Text style={[s.chipText, catActiva === cat && s.chipTextActive]}>{CAT_LABEL[cat]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {filtrados.map(lugar => (
          <TouchableOpacity key={lugar.id} style={s.card} onPress={() => router.push(`/lugar/${lugar.id}` as any)} activeOpacity={0.92}>
            {lugar.patrocinado && (
              <View style={s.sponsorBadge}><Text style={s.sponsorText}>⭐ Patrocinado</Text></View>
            )}
            <View style={[s.cardImg, { backgroundColor: lugar.color }]}>
              <Text style={s.cardImgText}>{lugar.categoria.toUpperCase()}</Text>
            </View>
            <View style={s.cardBody}>
              <View style={s.cardRow}>
                <Text style={s.cardName} numberOfLines={1}>{lugar.nombre}</Text>
                <TouchableOpacity onPress={() => handleFav(lugar.id)}>
                  <Ionicons name={esFavorito(lugar.id) ? 'heart' : 'heart-outline'} size={22} color={esFavorito(lugar.id) ? '#dc2626' : '#86a892'} />
                </TouchableOpacity>
              </View>
              <View style={s.cardRow}>
                <Text style={s.cardMun}>📍 {lugar.municipio}</Text>
                <Text style={s.cardDist}>🚗 {lugar.distancia}</Text>
              </View>
              <View style={s.cardRow}>
                <Text style={s.cardRating}>⭐ {lugar.calificacion}</Text>
                <Text style={s.cardHorario}>🕐 {lugar.horario.split(' ')[0]}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {filtrados.length === 0 && (
          <View style={s.empty}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={s.emptyText}>Sin resultados para "{busqueda}"</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a2e12', margin: 16, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, color: '#f0fdf4', fontSize: 15 },
  catsRow: { maxHeight: 48, marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#d1fae5', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  chipText: { fontSize: 13, color: '#4b7c5a', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  sponsorBadge: { position: 'absolute', top: 10, left: 10, zIndex: 1, backgroundColor: '#fbbf24', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  sponsorText: { fontSize: 11, fontWeight: '700', color: '#0a2e12' },
  cardImg: { height: 130, alignItems: 'center', justifyContent: 'center' },
  cardImgText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 1 },
  cardBody: { padding: 14, gap: 6 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 16, fontWeight: '700', color: '#0f4c20', flex: 1 },
  cardMun: { fontSize: 13, color: '#4b7c5a' },
  cardDist: { fontSize: 13, color: '#4b7c5a' },
  cardRating: { fontSize: 13, fontWeight: '600', color: '#0f4c20' },
  cardHorario: { fontSize: 12, color: '#86a892' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#86a892', textAlign: 'center' },
});