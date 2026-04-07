import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Idioma, T } from '../../context/AppContext';
import { router } from 'expo-router';
import { useState } from 'react';

const IDIOMAS: { code: Idioma; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇨🇴' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export default function PerfilScreen() {
  const { usuario, logout, favoritos, resenas, modoOscuro, setModoOscuro,
          notificaciones, setNotificaciones, idioma, setIdioma, t } = useApp();
  const [showIdiomas, setShowIdiomas] = useState(false);
  const [showAcerca, setShowAcerca] = useState(false);

  const bg = modoOscuro ? '#0a2e12' : '#f0fdf4';
  const cardBg = modoOscuro ? '#1a5c2a' : '#fff';
  const txtPrimary = modoOscuro ? '#f0fdf4' : '#0f4c20';
  const txtSec = modoOscuro ? '#4ade80' : '#86a892';

  const misResenas = resenas.filter(r => r.usuario === usuario?.nombre);

  const handleLogout = () => {
    Alert.alert(t.cerrarSesion, '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  const handleValorar = () => {
    Alert.alert('⭐ Valorar Rutopía', '¿Cuántas estrellas le das?', [
      { text: '⭐⭐⭐⭐⭐ Excelente', onPress: () => Alert.alert('🎉 ¡Gracias!', 'Tu valoración nos ayuda mucho.') },
      { text: '⭐⭐⭐⭐ Muy buena' , onPress: () => Alert.alert('🙏 Gracias', '¡Seguimos mejorando!') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleAyuda = () => {
    Alert.alert('Ayuda y soporte', '¿Cómo podemos ayudarte?', [
      { text: '📧 Enviar email', onPress: () => Alert.alert('Email', 'soporte@rutopia.co') },
      { text: '💬 WhatsApp', onPress: () => Alert.alert('WhatsApp', '+57 300 123 4567') },
      { text: 'Cerrar', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView style={[s.screen, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>

      {/* Modal selección idioma */}
      <Modal visible={showIdiomas} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>{t.idioma}</Text>
            {IDIOMAS.map(lang => (
              <TouchableOpacity key={lang.code} style={[s.langRow, idioma === lang.code && s.langRowActive]}
                onPress={() => { setIdioma(lang.code); setShowIdiomas(false); }}>
                <Text style={s.langFlag}>{lang.flag}</Text>
                <Text style={s.langLabel}>{lang.label}</Text>
                {idioma === lang.code && <Ionicons name="checkmark-circle" size={20} color="#16a34a" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.modalClose} onPress={() => setShowIdiomas(false)}>
              <Text style={s.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal acerca de */}
      <Modal visible={showAcerca} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={{ fontSize: 50, textAlign: 'center' }}>🗺️</Text>
            <Text style={[s.modalTitle, { textAlign: 'center' }]}>Rutopía</Text>
            <Text style={s.acercaText}>Plataforma digital para promover el turismo sostenible en Sabana Centro — Chía, Tabio y Cajicá.</Text>
            <Text style={s.acercaText}>Conectamos viajeros con emprendimientos locales y atractivos culturales de la región.</Text>
            <Text style={[s.acercaText, { fontWeight: '700', color: '#16a34a' }]}>Versión 1.0.0</Text>
            <Text style={s.acercaText}>Desarrollado con el ❤️ en Colombia</Text>
            <TouchableOpacity style={s.modalClose} onPress={() => setShowAcerca(false)}>
              <Text style={s.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hero */}
      <View style={s.hero}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>{usuario?.nombre?.charAt(0)?.toUpperCase()}</Text>
        </View>
        <Text style={s.nombre}>{usuario?.nombre}</Text>
        <Text style={s.email}>{usuario?.email}</Text>
        <TouchableOpacity
          style={[s.planBadge, usuario?.plan === 'premium' && s.planBadgePremium]}
          onPress={() => router.push('/planes' as any)}>
          <Text style={s.planText}>
            {usuario?.plan === 'premium' ? '⭐ Premium' : `🌱 ${t.planGratis} · Mejorar →`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Estadísticas */}
      <View style={[s.statsRow, { backgroundColor: cardBg }]}>
        <View style={s.statBox}>
          <Text style={[s.statNum, { color: txtPrimary }]}>{favoritos.length}</Text>
          <Text style={[s.statLabel, { color: txtSec }]}>{t.favoritos}</Text>
        </View>
        <View style={s.statBox}>
          <Text style={[s.statNum, { color: txtPrimary }]}>3</Text>
          <Text style={[s.statLabel, { color: txtSec }]}>{t.visitas}</Text>
        </View>
        <View style={s.statBox}>
          <Text style={[s.statNum, { color: txtPrimary }]}>{misResenas.length}</Text>
          <Text style={[s.statLabel, { color: txtSec }]}>{t.reseñasNum}</Text>
        </View>
      </View>

      {/* Upgrade si es gratuito */}
      {usuario?.plan === 'gratuito' && (
        <TouchableOpacity style={s.upgradeBanner} onPress={() => router.push('/planes' as any)}>
          <Text style={s.upgradeText}>✨ {t.premium}</Text>
          <Text style={s.upgradeArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Configuración */}
      <View style={[s.section, { backgroundColor: cardBg }]}>
        <Text style={[s.sectionTitle, { color: txtSec }]}>{t.configuracion.toUpperCase()}</Text>

        <View style={s.settingRow}>
          <Ionicons name="moon-outline" size={20} color="#16a34a" />
          <Text style={[s.settingLabel, { color: txtPrimary }]}>{t.modoOscuro}</Text>
          <Switch value={modoOscuro} onValueChange={setModoOscuro}
            trackColor={{ true: '#16a34a', false: '#d1fae5' }} thumbColor="#fff" />
        </View>

        <View style={[s.settingRow, s.borderTop]}>
          <Ionicons name="notifications-outline" size={20} color="#16a34a" />
          <Text style={[s.settingLabel, { color: txtPrimary }]}>{t.notificaciones}</Text>
          <Switch value={notificaciones} onValueChange={setNotificaciones}
            trackColor={{ true: '#16a34a', false: '#d1fae5' }} thumbColor="#fff" />
        </View>

        <TouchableOpacity style={[s.settingRow, s.borderTop]} onPress={() => setShowIdiomas(true)}>
          <Ionicons name="language-outline" size={20} color="#16a34a" />
          <Text style={[s.settingLabel, { color: txtPrimary }]}>{t.idioma}</Text>
          <Text style={s.settingValue}>
            {IDIOMAS.find(l => l.code === idioma)?.flag} {IDIOMAS.find(l => l.code === idioma)?.label}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={txtSec} />
        </TouchableOpacity>
      </View>

      {/* Más opciones */}
      <View style={[s.section, { backgroundColor: cardBg }]}>
        <Text style={[s.sectionTitle, { color: txtSec }]}>MÁS</Text>

        <TouchableOpacity style={s.menuRow} onPress={handleAyuda}>
          <Ionicons name="help-circle-outline" size={20} color="#16a34a" />
          <Text style={[s.menuLabel, { color: txtPrimary }]}>{t.ayuda}</Text>
          <Ionicons name="chevron-forward" size={16} color={txtSec} />
        </TouchableOpacity>

        <TouchableOpacity style={[s.menuRow, s.borderTop]} onPress={() => setShowAcerca(true)}>
          <Ionicons name="information-circle-outline" size={20} color="#16a34a" />
          <Text style={[s.menuLabel, { color: txtPrimary }]}>{t.acercaDe}</Text>
          <Ionicons name="chevron-forward" size={16} color={txtSec} />
        </TouchableOpacity>

        <TouchableOpacity style={[s.menuRow, s.borderTop]} onPress={handleValorar}>
          <Ionicons name="star-outline" size={20} color="#16a34a" />
          <Text style={[s.menuLabel, { color: txtPrimary }]}>{t.valorar}</Text>
          <Ionicons name="chevron-forward" size={16} color={txtSec} />
        </TouchableOpacity>

        <TouchableOpacity style={[s.menuRow, s.borderTop]} onPress={() => router.push('/planes' as any)}>
          <Ionicons name="diamond-outline" size={20} color="#fbbf24" />
          <Text style={[s.menuLabel, { color: txtPrimary }]}>{t.premium}</Text>
          <Ionicons name="chevron-forward" size={16} color={txtSec} />
        </TouchableOpacity>
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={s.logoutText}>{t.cerrarSesion}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  hero: { backgroundColor: '#0a2e12', alignItems: 'center', padding: 32, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, gap: 6 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  nombre: { fontSize: 22, fontWeight: '800', color: '#f0fdf4' },
  email: { fontSize: 13, color: '#4ade80' },
  planBadge: { backgroundColor: '#1a5c2a', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 4 },
  planBadgePremium: { backgroundColor: '#fbbf24' },
  planText: { fontSize: 12, fontWeight: '700', color: '#f0fdf4' },
  statsRow: { flexDirection: 'row', margin: 16, borderRadius: 16, overflow: 'hidden', elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 20 },
  statNum: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  upgradeBanner: { marginHorizontal: 16, marginBottom: 8, backgroundColor: '#fbbf24', borderRadius: 14, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  upgradeText: { fontSize: 14, fontWeight: '700', color: '#0a2e12' },
  upgradeArrow: { fontSize: 18, fontWeight: '700', color: '#0a2e12' },
  section: { marginHorizontal: 16, marginTop: 14, borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  sectionTitle: { fontSize: 11, fontWeight: '700', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4, letterSpacing: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  settingValue: { fontSize: 13, color: '#86a892', marginRight: 4 },
  borderTop: { borderTopWidth: 1, borderTopColor: '#f0fdf415' },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 16, marginTop: 20, backgroundColor: '#fee2e2', borderRadius: 14, padding: 16 },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#dc2626' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f4c20', marginBottom: 8 },
  langRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 12 },
  langRowActive: { backgroundColor: '#f0fdf4' },
  langFlag: { fontSize: 24 },
  langLabel: { flex: 1, fontSize: 16, color: '#0f4c20', fontWeight: '500' },
  modalClose: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  modalCloseText: { fontSize: 15, fontWeight: '700', color: '#0f4c20' },
  acercaText: { fontSize: 14, color: '#4b7c5a', lineHeight: 22, textAlign: 'center' },
});