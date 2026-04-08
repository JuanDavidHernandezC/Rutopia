import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const PLANES = [
  {
    id: 'gratis',
    nombre: 'Gratuito',
    precio: '$0',
    color: '#86a892',
    features: [
      { texto: 'Hasta 5 favoritos', ok: true },
      { texto: 'Explorar todos los lugares', ok: true },
      { texto: 'Ver emprendedores', ok: true },
      { texto: 'Anuncios cada 3 lugares', ok: false },
      { texto: 'Rutas exclusivas', ok: false },
      { texto: 'Modo sin publicidad', ok: false },
      { texto: 'Favoritos ilimitados', ok: false },
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    precio: '$9.900/mes',
    color: '#16a34a',
    destacado: true,
    features: [
      { texto: 'Favoritos ilimitados', ok: true },
      { texto: 'Sin publicidad', ok: true },
      { texto: 'Rutas exclusivas', ok: true },
      { texto: 'Acceso a todas las categorías', ok: true },
      { texto: 'Reseñas destacadas', ok: true },
      { texto: 'Badges especiales', ok: true },
      { texto: 'Soporte prioritario', ok: true },
    ],
  },
];

const EXTRAS = [
  { nombre: 'Categoría premium', precio: '$4.900', desc: 'Desbloquea una categoría completa' },
  { nombre: 'Pack rutas exclusivas', precio: '$9.900', desc: '10 rutas exclusivas de Sabana Centro' },
  { nombre: 'Reseña destacada', precio: '$2.900', desc: 'Tu reseña aparece primera' },
  { nombre: 'Badge especial', precio: '$1.900', desc: 'Badge de explorador en tu perfil' },
  { nombre: 'Sin anuncios 1 semana', precio: '$2.900', desc: 'Experiencia limpia por 7 días' },
];

export default function PlanesScreen() {
  const { usuario, activarPremium } = useApp();

  const handlePremium = () => {
    Alert.alert('Activar Premium', '¿Deseas activar el plan Premium?\n(Simulado para demo)', [
      { text: 'Cancelar', style: 'cancel' },
      { text: '¡Sí, activar!', onPress: () => {
        activarPremium();
        Alert.alert('🎉 ¡Bienvenido a Premium!', 'Ya tienes acceso a todas las funciones.', [
          { text: 'Continuar', onPress: () => router.back() }
        ]);
      }},
    ]);
  };

  const handleExtra = (nombre: string, precio: string) => {
    Alert.alert(`Comprar: ${nombre}`, `Precio: ${precio}\n\nMétodos de pago:\n💳 Tarjeta\n📱 Nequi\n🏦 PSE`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Pagar con Nequi', onPress: () => Alert.alert('✅ Simulado', 'En producción se integraría con Nequi/PSE') },
    ]);
  };

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      <View style={s.hero}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.heroTitle}>✨ Planes Rutopía</Text>
        <Text style={s.heroSub}>Elige el plan que mejor se adapte a ti</Text>
        {usuario?.plan === 'premium' && (
          <View style={s.activoBadge}><Text style={s.activoText}>⭐ Ya eres Premium</Text></View>
        )}
      </View>

      {/* Planes */}
      <View style={s.planesRow}>
        {PLANES.map(plan => (
          <View key={plan.id} style={[s.planCard, plan.destacado && s.planCardDestacado]}>
            {plan.destacado && <View style={s.popularBadge}><Text style={s.popularText}>MÁS POPULAR</Text></View>}
            <Text style={[s.planNombre, { color: plan.color }]}>{plan.nombre}</Text>
            <Text style={s.planPrecio}>{plan.precio}</Text>
            <View style={s.featuresList}>
              {plan.features.map((f, i) => (
                <View key={i} style={s.featureRow}>
                  <Ionicons name={f.ok ? 'checkmark-circle' : 'close-circle'} size={18} color={f.ok ? '#16a34a' : '#dc2626'} />
                  <Text style={[s.featureText, !f.ok && s.featureTextOff]}>{f.texto}</Text>
                </View>
              ))}
            </View>
            {plan.id === 'premium' && usuario?.plan !== 'premium' && (
              <TouchableOpacity style={s.planBtn} onPress={handlePremium}>
                <Text style={s.planBtnText}>Activar Premium</Text>
              </TouchableOpacity>
            )}
            {plan.id === 'premium' && usuario?.plan === 'premium' && (
              <View style={[s.planBtn, { backgroundColor: '#d1fae5' }]}>
                <Text style={[s.planBtnText, { color: '#16a34a' }]}>✓ Plan activo</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Compras adicionales */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>💰 Compras adicionales</Text>
        {EXTRAS.map((e, i) => (
          <TouchableOpacity key={i} style={s.extraCard} onPress={() => handleExtra(e.nombre, e.precio)}>
            <View style={s.extraInfo}>
              <Text style={s.extraNombre}>{e.nombre}</Text>
              <Text style={s.extraDesc}>{e.desc}</Text>
            </View>
            <View style={s.extraPrecioBox}>
              <Text style={s.extraPrecio}>{e.precio}</Text>
              <Text style={s.extraComprar}>Comprar</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Métodos de pago */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>💳 Métodos de pago aceptados</Text>
        <View style={s.pagosRow}>
          {['📱 Nequi', '💳 Tarjeta', '🏦 PSE', '🏪 Datafono'].map(p => (
            <View key={p} style={s.pagoChip}>
              <Text style={s.pagoText}>{p}</Text>
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
  hero: { backgroundColor: '#0a2e12', padding: 24, paddingTop: 56, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, gap: 6 },
  backBtn: { position: 'absolute', top: 50, left: 16 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#f0fdf4', textAlign: 'center' },
  heroSub: { fontSize: 13, color: '#4ade80', textAlign: 'center' },
  activoBadge: { backgroundColor: '#fbbf24', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, alignSelf: 'center', marginTop: 6 },
  activoText: { fontSize: 13, fontWeight: '700', color: '#0a2e12' },
  planesRow: { flexDirection: 'row', padding: 16, gap: 12 },
  planCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  planCardDestacado: { borderWidth: 2, borderColor: '#16a34a' },
  popularBadge: { backgroundColor: '#16a34a', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  popularText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  planNombre: { fontSize: 18, fontWeight: '800' },
  planPrecio: { fontSize: 22, fontWeight: '800', color: '#0f4c20' },
  featuresList: { gap: 7 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: 12, color: '#0f4c20', flex: 1 },
  featureTextOff: { color: '#86a892' },
  planBtn: { backgroundColor: '#16a34a', borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 6 },
  planBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  section: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0f4c20', marginBottom: 12 },
  extraCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  extraInfo: { flex: 1 },
  extraNombre: { fontSize: 14, fontWeight: '700', color: '#0f4c20' },
  extraDesc: { fontSize: 12, color: '#86a892', marginTop: 2 },
  extraPrecioBox: { alignItems: 'center' },
  extraPrecio: { fontSize: 15, fontWeight: '800', color: '#0f4c20' },
  extraComprar: { fontSize: 11, color: '#16a34a', fontWeight: '600' },
  pagosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pagoChip: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  pagoText: { fontSize: 13, fontWeight: '600', color: '#0f4c20' },
});