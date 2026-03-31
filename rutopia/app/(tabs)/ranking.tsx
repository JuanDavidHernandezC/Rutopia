import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LUGARES, EMPRENDEDORES } from '../../context/AppContext';

const MEDALLAS = ['🥇', '🥈', '🥉'];

export default function RankingScreen() {
  const [tab, setTab] = useState<'lugares' | 'emprendedores'>('lugares');

  const topLugares = [...LUGARES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 5);
  const topEmp = [...EMPRENDEDORES].sort((a, b) => b.calificacion - a.calificacion).slice(0, 5);

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>🏆 Ranking</Text>
        <Text style={s.heroSub}>Los mejores de Sabana Centro</Text>
      </View>

      <View style={s.tabs}>
        <TouchableOpacity style={[s.tabBtn, tab === 'lugares' && s.tabActive]} onPress={() => setTab('lugares')}>
          <Text style={[s.tabText, tab === 'lugares' && s.tabTextActive]}>🗺️ Lugares</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tabBtn, tab === 'emprendedores' && s.tabActive]} onPress={() => setTab('emprendedores')}>
          <Text style={[s.tabText, tab === 'emprendedores' && s.tabTextActive]}>👥 Emprendedores</Text>
        </TouchableOpacity>
      </View>

      <View style={s.list}>
        {(tab === 'lugares' ? topLugares : topEmp).map((item, i) => (
          <View key={item.id} style={[s.card, i === 0 && s.cardGold]}>
            <Text style={s.medalla}>{i < 3 ? MEDALLAS[i] : `#${i + 1}`}</Text>
            <View style={[s.avatar, { backgroundColor: item.color }]}>
              <Text style={s.avatarText}>
                {tab === 'lugares' ? (item as any).categoria[0].toUpperCase() : (item as any).nombre[0]}
              </Text>
            </View>
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
          </View>
        ))}
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
  tabs: { flexDirection: 'row', margin: 16, backgroundColor: '#d1fae5', borderRadius: 12, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#0a2e12' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#4b7c5a' },
  tabTextActive: { color: '#4ade80' },
  list: { paddingHorizontal: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  cardGold: { borderWidth: 2, borderColor: '#fbbf24' },
  medalla: { fontSize: 24, width: 36, textAlign: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#fff' },
  info: { flex: 1 },
  itemNombre: { fontSize: 15, fontWeight: '700', color: '#0f4c20' },
  itemSub: { fontSize: 12, color: '#4b7c5a', marginTop: 2 },
  ratingBox: { alignItems: 'center' },
  ratingNum: { fontSize: 18, fontWeight: '800', color: '#0f4c20' },
  ratingStar: { fontSize: 12 },
});