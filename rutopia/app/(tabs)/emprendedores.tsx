import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert, Image, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { EMPRENDEDORES, useApp } from '../../context/AppContext';

const CATEGORIAS = ['Gastronomía', 'Artesanías', 'Hospedaje', 'Turismo / Guías', 'Agricultura', 'Bienestar / Spa', 'Deportes / Aventura', 'Otro'];

type FormData = {
  nombreDueno: string;
  nombreNegocio: string;
  municipio: string;
  categoria: string;
  descripcion: string;
  email: string;
  whatsapp: string;
  instagram: string;
  direccion: string;
  horarios: string;
};

const FORM_INICIAL: FormData = {
  nombreDueno: '',
  nombreNegocio: '',
  municipio: '',
  categoria: '',
  descripcion: '',
  email: '',
  whatsapp: '',
  instagram: '',
  direccion: '',
  horarios: '',
};

export default function EmprendedoresScreen() {
  const { t } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormData>(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);

  const contactar = (email: string, nombre: string, whatsapp: string, instagram: string) => {
    Alert.alert(`Contactar a ${nombre}`, '¿Cómo quieres contactarlo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: '📧 Email', onPress: () => Linking.openURL(`mailto:${email}`) },
      { text: '💬 WhatsApp', onPress: () => whatsapp && Linking.openURL(`https://wa.me/${whatsapp}`) },
      { text: '📸 Instagram', onPress: () => instagram && Linking.openURL(`https://instagram.com/${instagram}`) },
    ]);
  };

  const set = (campo: keyof FormData, valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }));

  const validar = () => {
    if (!form.nombreDueno.trim()) return 'El nombre del dueño es obligatorio.';
    if (!form.nombreNegocio.trim()) return 'El nombre del negocio es obligatorio.';
    if (!form.municipio.trim()) return 'El municipio es obligatorio.';
    if (!form.categoria) return 'Selecciona una categoría.';
    if (!form.descripcion.trim()) return 'La descripción es obligatoria.';
    if (!form.email.trim() || !form.email.includes('@')) return 'Ingresa un correo válido.';
    return null;
  };

  const enviarFormulario = async () => {
    const error = validar();
    if (error) { Alert.alert('Campos incompletos', error); return; }

    setEnviando(true);

    const asunto = encodeURIComponent(`Inscripción Rutopía: ${form.nombreNegocio}`);
    const cuerpo = encodeURIComponent(
      `NUEVA SOLICITUD DE INSCRIPCIÓN - RUTOPÍA\n` +
      `==========================================\n\n` +
      `👤 DATOS DEL EMPRENDEDOR\n` +
      `Nombre: ${form.nombreDueno}\n` +
      `Correo: ${form.email}\n` +
      `WhatsApp: ${form.whatsapp || 'No indicado'}\n` +
      `Instagram: ${form.instagram ? '@' + form.instagram : 'No indicado'}\n\n` +
      `🏪 DATOS DEL NEGOCIO\n` +
      `Nombre: ${form.nombreNegocio}\n` +
      `Categoría: ${form.categoria}\n` +
      `Municipio: ${form.municipio}\n` +
      `Dirección: ${form.direccion || 'No indicada'}\n` +
      `Horarios: ${form.horarios || 'No indicados'}\n\n` +
      `📝 DESCRIPCIÓN\n` +
      `${form.descripcion}\n\n` +
      `==========================================\n` +
      `Enviado desde la app Rutopía`
    );

    const url = `mailto:sabanarutopia@gmail.com?subject=${asunto}&body=${cuerpo}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        setModalVisible(false);
        setForm(FORM_INICIAL);
        Alert.alert(
          '📬 ¡Listo!',
          'Se abrió tu app de correo con la solicitud lista. Solo presiona enviar y te contactaremos pronto.',
          [{ text: 'Entendido' }]
        );
      } else {
        Alert.alert('Sin app de correo', 'No se encontró una app de correo en tu dispositivo. Escríbenos directamente a sabanarutopia@gmail.com');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la app de correo. Escríbenos a sabanarutopia@gmail.com');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.screen} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={s.heroTitle}>{t.emprendedores}</Text>
          <Text style={s.heroSub}>Apoya el turismo local de Sabana Centro</Text>

          {/* Botón de inscripción */}
          <TouchableOpacity style={s.inscribirBtn} onPress={() => setModalVisible(true)}>
            <Ionicons name="storefront-outline" size={18} color="#0a2e12" />
            <Text style={s.inscribirText}>Inscribe tu negocio</Text>
            <Ionicons name="arrow-forward" size={16} color="#0a2e12" />
          </TouchableOpacity>
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
                  {e.whatsapp && (
                    <TouchableOpacity
                      style={[s.iconBtn, { backgroundColor: '#dcfce7' }]}
                      onPress={() => Linking.openURL(`https://wa.me/${e.whatsapp}`)}
                    >
                      <Ionicons name="logo-whatsapp" size={18} color="#16a34a" />
                    </TouchableOpacity>
                  )}
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

      {/* ── MODAL INSCRIPCIÓN ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <View style={s.modalBox}>
              {/* Header modal */}
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalTitle}>🏪 Inscribe tu negocio</Text>
                  <Text style={s.modalSub}>Únete a la red de Rutopía</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={s.modalClose}>
                  <Ionicons name="close" size={22} color="#0f4c20" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>

                {/* Sección: datos personales */}
                <Text style={s.seccion}>👤 Datos del emprendedor</Text>

                <Text style={s.label}>Nombre completo *</Text>
                <TextInput
                  style={s.input}
                  placeholder="Ej: María González"
                  value={form.nombreDueno}
                  onChangeText={v => set('nombreDueno', v)}
                />

                <Text style={s.label}>Correo electrónico *</Text>
                <TextInput
                  style={s.input}
                  placeholder="tu@correo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={v => set('email', v)}
                />

                <Text style={s.label}>WhatsApp</Text>
                <TextInput
                  style={s.input}
                  placeholder="57 300 000 0000"
                  keyboardType="phone-pad"
                  value={form.whatsapp}
                  onChangeText={v => set('whatsapp', v)}
                />

                <Text style={s.label}>Instagram</Text>
                <TextInput
                  style={s.input}
                  placeholder="@tu_negocio (sin @)"
                  autoCapitalize="none"
                  value={form.instagram}
                  onChangeText={v => set('instagram', v)}
                />

                {/* Sección: negocio */}
                <Text style={s.seccion}>🏪 Datos del negocio</Text>

                <Text style={s.label}>Nombre del negocio *</Text>
                <TextInput
                  style={s.input}
                  placeholder="Ej: Café La Sabana"
                  value={form.nombreNegocio}
                  onChangeText={v => set('nombreNegocio', v)}
                />

                <Text style={s.label}>Municipio *</Text>
                <TextInput
                  style={s.input}
                  placeholder="Ej: Tabio, Chía, Cajicá..."
                  value={form.municipio}
                  onChangeText={v => set('municipio', v)}
                />

                <Text style={s.label}>Categoría *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {CATEGORIAS.map(cat => (
                      <TouchableOpacity
                        key={cat}
                        style={[s.catChip, form.categoria === cat && s.catChipActive]}
                        onPress={() => set('categoria', cat)}
                      >
                        <Text style={[s.catChipText, form.categoria === cat && s.catChipTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                <Text style={s.label}>Dirección</Text>
                <TextInput
                  style={s.input}
                  placeholder="Calle, vereda o punto de referencia"
                  value={form.direccion}
                  onChangeText={v => set('direccion', v)}
                />

                <Text style={s.label}>Horarios de atención</Text>
                <TextInput
                  style={s.input}
                  placeholder="Ej: Lun–Vie 8am–6pm, Sáb 9am–3pm"
                  value={form.horarios}
                  onChangeText={v => set('horarios', v)}
                />

                <Text style={s.label}>Descripción del negocio *</Text>
                <TextInput
                  style={[s.input, s.inputMulti]}
                  placeholder="Cuéntanos qué ofreces, qué te hace especial, experiencias para los turistas..."
                  multiline
                  numberOfLines={4}
                  value={form.descripcion}
                  onChangeText={v => set('descripcion', v)}
                />

                <Text style={s.nota}>
                  📬 Al enviar, se abrirá tu app de correo con la solicitud lista para enviar a sabanarutopia@gmail.com
                </Text>

                <TouchableOpacity
                  style={[s.enviarBtn, enviando && { opacity: 0.6 }]}
                  onPress={enviarFormulario}
                  disabled={enviando}
                >
                  <Ionicons name="send" size={18} color="#fff" />
                  <Text style={s.enviarText}>{enviando ? 'Preparando...' : 'Enviar solicitud'}</Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f0fdf4' },
  hero: { backgroundColor: '#0a2e12', padding: 24, paddingTop: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, gap: 12 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#f0fdf4' },
  heroSub: { fontSize: 13, color: '#4ade80' },

  // Botón inscribir
  inscribirBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#4ade80', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 14, alignSelf: 'flex-start', marginTop: 4 },
  inscribirText: { fontSize: 14, fontWeight: '700', color: '#0a2e12', flex: 1 },

  // Cards emprendedores (igual que antes)
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
  redes: { flexDirection: 'row', gap: 10, marginTop: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 0 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0f4c20' },
  modalSub: { fontSize: 12, color: '#86a892', marginTop: 2 },
  modalClose: { backgroundColor: '#f0fdf4', borderRadius: 20, padding: 6 },

  // Formulario
  seccion: { fontSize: 13, fontWeight: '700', color: '#16a34a', backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginBottom: 12, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '600', color: '#0f4c20', marginBottom: 5 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1fae5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0f4c20', marginBottom: 12 },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  catChip: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#86a892', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  catChipActive: { backgroundColor: '#0a2e12', borderColor: '#0a2e12' },
  catChipText: { fontSize: 12, fontWeight: '600', color: '#4b7a57' },
  catChipTextActive: { color: '#4ade80' },
  nota: { fontSize: 11, color: '#86a892', textAlign: 'center', marginBottom: 14, lineHeight: 16 },
  enviarBtn: { backgroundColor: '#16a34a', borderRadius: 14, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  enviarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});