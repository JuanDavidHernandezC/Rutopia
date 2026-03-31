import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { router } from 'expo-router';

export default function PerfilScreen() {
  const { usuario, logout, favoritos, modoOscuro, setModoOscuro, notificaciones, setNotificaciones } = useApp();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      {/* Header perfil */}
      <View style={s.hero}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>{usuario?.nombre?.charAt(0)?.toUpperCase()}</Text>
        </View>
        <Text style={s.nombre}>{usuario?.nombre}</Text>
        <Text style={s.email}>{usuario?.email}</Text>
        <View style={[s.planBadge, usuario?.plan === 'premium' && s.planBadgePremium]}>
          <Text style={s.planText}>{usuario?.plan === 'premium' ? '⭐ Premium' : '🌱 Plan Gratuito'}</Text>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statNum}>{favoritos.length}</Text>
          <Text style={s.statLabel}>Favoritos</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statNum}>3</Text>
          <Text style={s.statLabel}>Visitas</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statNum}>1</Text>
          <Text style={s.statLabel}>Reseñas</Text>
        </View>
      </View>

      {/* Upgrade premium */}
      {usuario?.plan === 'gratuito' && (
        <TouchableOpacity style={s.upgradeBanner}>
          <Text style={s.upgradeText}>✨ Actualiza a Premium · Favoritos ilimitados · Sin anuncios</Text>
          <Text style={s.upgradePrice}>Desde $4.900/mes →</Text>
        </TouchableOpacity>
      )}

      {/* Configuración */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Configuración</Text>

        <View style={s.settingRow}>
          <Ionicons name="moon-outline" size={20} color="#16a34a" />
          <Text style={s.settingLabel}>Modo oscuro</Text>
          <Switch value={modoOscuro} onValueChange={setModoOscuro} trackColor={{ true: '#16a34a', false: '#d1fae5' }} thumbColor="#fff" />
        </View>

        <View style={s.settingRow}>
          <Ionicons name="notifications-outline" size={20} color="#16a34a" />
          <Text style={s.settingLabel}>Notificaciones</Text>
          <Switch value={notificaciones} onValueChange={setNotificaciones} trackColor={{ true: '#16a34a', false: '#d1fae5' }} thumbColor="#fff" />
        </View>
      </View>

      {/* Más opciones */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Más</Text>
        {[
          { icon: 'help-circle-outline', label: 'Ayuda y soporte' },
          { icon: 'information-circle-outline', label: 'Acerca de Rutopía' },
          { icon: 'star-outline', label: 'Valorar la app' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={s.menuRow}>
            <Ionicons name={item.icon as any} size={20} color="#16a34a" />
            <Text style={s.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#86a892" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={s.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  hero: { backgroundColor: '#0a2e12', alignItems: 'center', padding: 32, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, gap: 6 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  nombre: { fontSize: 22, fontWeight: '800', color: '#f0fdf4' },
  email: { fontSize: 13, color: '#4ade80' },
  planBadge: { backgroundColor: '#1a5c2a', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginTop: 4 },
  planBadgePremium: { backgroundColor: '#fbbf24' },
  planText: { fontSize: 12, fontWeight: '700', color: '#f0fdf4' },
  statsRow: { flexDirection: 'row', margin: 16, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 20, borderRightWidth: 1, borderRightColor: '#f0fdf4' },
  statNum: { fontSize: 24, fontWeight: '800', color: '#0f4c20' },
  statLabel: { fontSize: 12, color: '#86a892', marginTop: 2 },
  upgradeBanner: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fbbf24', borderRadius: 14, padding: 16 },
  upgradeText: { fontSize: 13, fontWeight: '700', color: '#0a2e12' },
  upgradePrice: { fontSize: 12, color: '#0a2e12', marginTop: 4, fontWeight: '600' },
  section: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#86a892', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, letterSpacing: 1, textTransform: 'uppercase' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12, borderTopWidth: 1, borderTopColor: '#f0fdf4' },
  settingLabel: { flex: 1, fontSize: 15, color: '#0f4c20', fontWeight: '500' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12, borderTopWidth: 1, borderTopColor: '#f0fdf4' },
  menuLabel: { flex: 1, fontSize: 15, color: '#0f4c20', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 16, marginTop: 20, backgroundColor: '#fee2e2', borderRadius: 14, padding: 16 },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#dc2626' },
});