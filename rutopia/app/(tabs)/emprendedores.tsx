import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EMPRENDEDORES } from '../../context/AppContext';

export default function EmprendedoresScreen() {
  const contactar = (email: string, nombre: string) => {
    Alert.alert(`Contactar a ${nombre}`, `¿Cómo quieres contactarlo?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: '📧 Email', onPress: () => Linking.openURL(`mailto:${email}`) },
      { text: '💬 WhatsApp', onPress: () => Linking.openURL(`https://wa.me/573001234567`) },
    ]);
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>Emprendedores</Text>
        <Text style={s.heroSub}>Apoya el turismo local de Sabana Centro</Text>
      </View>

      <View style={s.list}>
        {EMPRENDEDORES.map((e, i) => (
          <View key={e.id} style={s.card}>
            <View style={[s.avatar, { backgroundColor: e.color }]}>
              <Text style={s.avatarText}>{e.nombre.charAt(0)}</Text>
            </View>
            <View style={s.info}>
              <View style={s.row}>
                <Text style={s.nombre}>{e.nombre}</Text>
                <Text style={s.rating}>⭐ {e.calificacion}</Text>
              </View>
              <Text style={s.negocio}>{e.negocio}</Text>
              <View style={s.row}>
                <View style={[s.catBadge, { backgroundColor: e.color + '22' }]}>
                  <Text style={[s.catText, { color: e.color }]}>{e.categoria}</Text>
                </View>
                <Text style={s.municipio}>📍 {e.municipio}</Text>
              </View>
              <Text style={s.desc} numberOfLines={2}>{e.descripcion}</Text>
              <TouchableOpacity style={s.btnContactar} onPress={() => contactar(e.email, e.nombre)}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0a2e12" />
                <Text style={s.btnContactarText}>Contactar</Text>
              </TouchableOpacity>
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
  list: { padding: 16, gap: 14 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', gap: 14, elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#fff' },
  info: { flex: 1, gap: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nombre: { fontSize: 15, fontWeight: '700', color: '#0f4c20', flex: 1 },
  rating: { fontSize: 13, fontWeight: '600', color: '#0f4c20' },
  negocio: { fontSize: 13, color: '#16a34a', fontWeight: '600' },
  catBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  catText: { fontSize: 11, fontWeight: '700' },
  municipio: { fontSize: 12, color: '#86a892' },
  desc: { fontSize: 12, color: '#4b7c5a', lineHeight: 18 },
  btnContactar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4ade80', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start', marginTop: 4 },
  btnContactarText: { fontSize: 13, fontWeight: '700', color: '#0a2e12' },
});