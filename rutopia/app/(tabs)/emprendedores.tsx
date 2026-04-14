import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EMPRENDEDORES, useApp } from '../../context/AppContext';

export default function EmprendedoresScreen() {
  const { t } = useApp();

  const contactar = (email: string, nombre: string, whatsapp: string, instagram: string) => {
    Alert.alert(`Contactar a ${nombre}`, '¿Cómo quieres contactarlo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: '📧 Email', onPress: () => Linking.openURL(`mailto:${email}`) },
      { text: '💬 WhatsApp', onPress: () => whatsapp && Linking.openURL(`https://wa.me/${whatsapp}`) },
      { text: '📸 Instagram', onPress: () => instagram && Linking.openURL(`https://instagram.com/${instagram}`) },
    ]);
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>{t.emprendedores}</Text>
        <Text style={s.heroSub}>Apoya el turismo local de Sabana Centro</Text>
      </View>

      <View style={s.list}>
        {EMPRENDEDORES.map(e => (
          <View key={e.id} style={s.card}>
            {e.imagen ? (
              <Image source={{ uri: e.imagen }} style={s.avatar} />
            ) : (
              <View style={[s.avatarPlaceholder, { backgroundColor: e.color }]}>
                <Text style={s.avatarText}>{e.nombre.charAt(0)}</Text>
              </View>
            )}
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
      
              <View style={s.redes}>
                <TouchableOpacity
                  style={[s.iconBtn, { backgroundColor: '#e0f2fe' }]}
                  onPress={() => Linking.openURL(`mailto:${e.email}`)}
                >
                  <Ionicons name="mail-outline" size={18} color="#0369a1" />
                </TouchableOpacity>

                {/* WHATSAPP */}
                {e.whatsapp && (
                  <TouchableOpacity
                    style={[s.iconBtn, { backgroundColor: '#dcfce7' }]}
                    onPress={() => Linking.openURL(`https://wa.me/${e.whatsapp}`)}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color="#16a34a" />
                  </TouchableOpacity>
                )}

                {/* INSTAGRAM */}
                {e.instagram && (
                  <TouchableOpacity
                    style={[s.iconBtn, { backgroundColor: '#fce7f3' }]}
                    onPress={() => Linking.openURL(`https://instagram.com/${e.instagram}`)}
                  >
                    <Ionicons name="logo-instagram" size={18} color="#db2777" />
                  </TouchableOpacity>
                )}
              </View>
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
  avatar: { width: 60, height: 60, borderRadius: 30, flexShrink: 0 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
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
  redes: {flexDirection: 'row', gap: 10, marginTop: 8,},
  iconBtn: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',},
});