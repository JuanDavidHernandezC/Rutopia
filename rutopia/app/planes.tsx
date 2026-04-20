import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const PLANES_VIAJERO = [
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

const PLANES_EMPRENDEDOR = [
  {
    id: 'emp_gratis',
    nombre: 'Básico',
    precio: '$0',
    color: '#86a892',
    icon: '🌱',
    features: [
      { texto: 'Perfil del negocio', ok: true },
      { texto: 'Hasta 5 fotos del lugar', ok: true },
      { texto: 'Recibir reseñas', ok: true },
      { texto: 'Catálogo (máx. 5 productos)', ok: true },
      { texto: 'Publicar ofertas o eventos', ok: false },
      { texto: 'Estadísticas de visitas', ok: false },
      { texto: 'Catálogo ilimitado', ok: false },
      { texto: 'Responder reseñas', ok: false },
    ],
  },
  {
    id: 'emp_basico',
    nombre: 'Emprendedor',
    precio: '$19.900/mes',
    color: '#b45309',
    icon: '🚀',
    features: [
      { texto: 'Todo lo del plan Básico', ok: true },
      { texto: 'Catálogo ilimitado', ok: true },
      { texto: 'Publicar 2 ofertas/eventos al mes', ok: true },
      { texto: 'Estadísticas básicas de visitas', ok: true },
      { texto: 'Responder reseñas', ok: true },
      { texto: 'Reportar reseñas inapropiadas', ok: false },
      { texto: 'Eventos ilimitados', ok: false },
      { texto: 'Estadísticas avanzadas', ok: false },
    ],
  },
  {
    id: 'emp_pro',
    nombre: 'Pro',
    precio: '$39.900/mes',
    color: '#16a34a',
    icon: '⭐',
    destacado: true,
    features: [
      { texto: 'Todo lo del plan Emprendedor', ok: true },
      { texto: 'Eventos y ofertas ilimitados', ok: true },
      { texto: 'Estadísticas avanzadas', ok: true },
      { texto: 'Reportar reseñas inapropiadas', ok: true },
      { texto: 'Insignia "Negocio verificado"', ok: true },
      { texto: 'Soporte prioritario', ok: true },
      { texto: 'Acceso anticipado a funciones', ok: true },
    ],
  },
];

const EXTRAS_VIAJERO = [
  { nombre: 'Categoría premium', precio: '$4.900', desc: 'Desbloquea una categoría completa' },
  { nombre: 'Pack rutas exclusivas', precio: '$9.900', desc: '10 rutas exclusivas de Sabana Centro' },
  { nombre: 'Reseña destacada', precio: '$2.900', desc: 'Tu reseña aparece primera' },
  { nombre: 'Insignia especial', precio: '$1.900', desc: 'Insignia de explorador en tu perfil' },
  { nombre: 'Sin anuncios 1 semana', precio: '$2.900', desc: 'Experiencia limpia por 7 días' },
];

const EXTRAS_EMPRENDEDOR = [
  { nombre: 'Evento especial', precio: '$4.900', desc: 'Publica un evento extra ese mes' },
  { nombre: 'Fotos adicionales', precio: '$3.900', desc: 'Agrega 10 fotos más a tu galería' },
  { nombre: 'Reporte de reseña', precio: '$1.900', desc: 'Reporta una reseña inapropiada' },
  { nombre: 'Estadísticas mensuales', precio: '$5.900', desc: 'Informe detallado de visitas del mes' },
];

export default function PlanesScreen() {
  const { usuario, activarPremium } = useApp();
  const [tab, setTab] = useState<'viajero' | 'emprendedor'>('viajero');

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

  const handleEmpPlan = (nombre: string, precio: string) => {
    Alert.alert(`Activar plan ${nombre}`, `Precio: ${precio}\n(Simulado para demo)`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: '¡Activar!', onPress: () => Alert.alert('✅ Plan activado', `Tu plan ${nombre} está activo.`) },
    ]);
  };

  const handleExtra = (nombre: string, precio: string) => {
    Alert.alert(`Comprar: ${nombre}`, `Precio: ${precio}\n\nMétodos de pago:\n💳 Tarjeta\n📱 Nequi\n🏦 PSE`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Pagar con Nequi', onPress: () => Alert.alert('✅ Simulado', 'En producción se integraría con Nequi/PSE') },
    ]);
  };

  const isViajero = tab === 'viajero';

  return (
    <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={s.hero}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.heroTitle}>✨ Planes Rutopía</Text>
        <Text style={s.heroSub}>Elige el plan que mejor se adapte a ti</Text>
        {usuario?.plan === 'premium' && isViajero && (
          <View style={s.activoBadge}><Text style={s.activoText}>⭐ Ya eres Premium</Text></View>
        )}
      </View>

      {/* Toggle Viajero / Emprendedor */}
      <View style={s.toggleContainer}>
        <TouchableOpacity
          style={[s.toggleBtn, isViajero && s.toggleBtnActive]}
          onPress={() => setTab('viajero')}
        >
          <Text style={[s.toggleText, isViajero && s.toggleTextActive]}>🧳 Viajero</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, !isViajero && s.toggleBtnActive]}
          onPress={() => setTab('emprendedor')}
        >
          <Text style={[s.toggleText, !isViajero && s.toggleTextActive]}>🏪 Emprendedor</Text>
        </TouchableOpacity>
      </View>

      {/* ── VIAJERO ── */}
      {isViajero && (
        <>
          <View style={s.planesRow}>
            {PLANES_VIAJERO.map(plan => (
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

          <View style={s.section}>
            <Text style={s.sectionTitle}>💰 Compras adicionales</Text>
            {EXTRAS_VIAJERO.map((e, i) => (
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
        </>
      )}

      {/* ── EMPRENDEDOR ── */}
      {!isViajero && (
        <>
          <View style={s.empIntroBox}>
            <Text style={s.empIntroTitle}>Para negocios y emprendimientos</Text>
            <Text style={s.empIntroSub}>
              Gestiona tu catálogo, publica ofertas y conoce cuántas personas visitan tu perfil en Sabana Centro.
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.planesEmpRow}>
            {PLANES_EMPRENDEDOR.map(plan => (
              <View key={plan.id} style={[s.planEmpCard, plan.destacado && s.planCardDestacado]}>
                {plan.destacado && <View style={s.popularBadge}><Text style={s.popularText}>RECOMENDADO</Text></View>}
                <Text style={s.planEmpIcon}>{plan.icon}</Text>
                <Text style={[s.planNombre, { color: plan.color }]}>{plan.nombre}</Text>
                <Text style={s.planPrecio}>{plan.precio}</Text>
                <View style={s.featuresList}>
                  {plan.features.map((f, i) => (
                    <View key={i} style={s.featureRow}>
                      <Ionicons name={f.ok ? 'checkmark-circle' : 'close-circle'} size={16} color={f.ok ? '#16a34a' : '#dc2626'} />
                      <Text style={[s.featureText, !f.ok && s.featureTextOff]}>{f.texto}</Text>
                    </View>
                  ))}
                </View>
                {plan.id !== 'emp_gratis' && (
                  <TouchableOpacity
                    style={[s.planBtn, { backgroundColor: plan.color }]}
                    onPress={() => handleEmpPlan(plan.nombre, plan.precio)}
                  >
                    <Text style={s.planBtnText}>Activar {plan.nombre}</Text>
                  </TouchableOpacity>
                )}
                {plan.id === 'emp_gratis' && (
                  <View style={[s.planBtn, { backgroundColor: '#e5e7eb' }]}>
                    <Text style={[s.planBtnText, { color: '#6b7280' }]}>Plan actual</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={s.section}>
            <Text style={s.sectionTitle}>🛠️ Compras adicionales para tu negocio</Text>
            {EXTRAS_EMPRENDEDOR.map((e, i) => (
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
        </>
      )}

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

  // Toggle
  toggleContainer: { flexDirection: 'row', margin: 16, backgroundColor: '#dcfce7', borderRadius: 14, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  toggleBtnActive: { backgroundColor: '#0a2e12' },
  toggleText: { fontSize: 14, fontWeight: '700', color: '#4b7a57' },
  toggleTextActive: { color: '#f0fdf4' },

  // Planes viajero
  planesRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 12 },
  planCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 10, elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  planCardDestacado: { borderWidth: 2, borderColor: '#16a34a' },
  popularBadge: { backgroundColor: '#16a34a', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  popularText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  planNombre: { fontSize: 18, fontWeight: '800' },
  planPrecio: { fontSize: 20, fontWeight: '800', color: '#0f4c20' },
  featuresList: { gap: 7 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: 12, color: '#0f4c20', flex: 1 },
  featureTextOff: { color: '#86a892' },
  planBtn: { backgroundColor: '#16a34a', borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 6 },
  planBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Planes emprendedor
  empIntroBox: { marginHorizontal: 16, marginBottom: 12, backgroundColor: '#fff7ed', borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: '#b45309' },
  empIntroTitle: { fontSize: 15, fontWeight: '700', color: '#92400e', marginBottom: 4 },
  empIntroSub: { fontSize: 12, color: '#78350f', lineHeight: 18 },
  planesEmpRow: { paddingHorizontal: 16, paddingBottom: 8, gap: 12 },
  planEmpCard: { width: 220, backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 8, elevation: 3, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  planEmpIcon: { fontSize: 28 },

  // Extras
  section: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0f4c20', marginBottom: 12 },
  extraCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  extraInfo: { flex: 1 },
  extraNombre: { fontSize: 14, fontWeight: '700', color: '#0f4c20' },
  extraDesc: { fontSize: 12, color: '#86a892', marginTop: 2 },
  extraPrecioBox: { alignItems: 'center' },
  extraPrecio: { fontSize: 15, fontWeight: '800', color: '#0f4c20' },
  extraComprar: { fontSize: 11, color: '#16a34a', fontWeight: '600' },

  // Pagos
  pagosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pagoChip: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, elevation: 2, shadowColor: '#0f4c20', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  pagoText: { fontSize: 13, fontWeight: '600', color: '#0f4c20' },
});