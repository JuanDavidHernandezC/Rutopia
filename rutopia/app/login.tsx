import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { login } = useApp();
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = () => {
    if (!nombre.trim() || !password) { Alert.alert('Completa todos los campos'); return; }
    setCargando(true);
    setTimeout(() => {
      const ok = login(nombre, password);
      if (!ok) { Alert.alert('Error', 'Nombre muy corto o contraseña menor a 4 caracteres'); setCargando(false); }
    }, 600);
  };

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.top}>
        {/* Logo Rutopía */}
        <View style={s.logoBox}>
          <Text style={s.logoIcon}>🗺️</Text>
        </View>
        <Text style={s.logoText}>Rutopía</Text>
        <Text style={s.logoSub}>Turismo sostenible · Sabana Centro</Text>
      </View>

      <View style={s.form}>
        <Text style={s.label}>Nombre de usuario</Text>
        <TextInput style={s.input} placeholder="Tu nombre" placeholderTextColor="#86a892" value={nombre} onChangeText={setNombre} autoCapitalize="words" />

        <Text style={s.label}>Contraseña</Text>
        <TextInput style={s.input} placeholder="Mínimo 4 caracteres" placeholderTextColor="#86a892" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={[s.btn, cargando && s.btnOff]} onPress={handleLogin} disabled={cargando}>
          <Text style={s.btnText}>{cargando ? 'Entrando...' : 'Ingresar a Rutopía'}</Text>
        </TouchableOpacity>

        <Text style={s.hint}>¿No tienes cuenta? Regístrate gratis</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0a2e12', justifyContent: 'center' },
  top: { alignItems: 'center', marginBottom: 40 },
  logoBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoIcon: { fontSize: 36 },
  logoText: { fontSize: 36, fontWeight: '800', color: '#f0fdf4', letterSpacing: 1 },
  logoSub: { fontSize: 13, color: '#4ade80', marginTop: 4, letterSpacing: 0.5 },
  form: { paddingHorizontal: 28 },
  label: { fontSize: 13, color: '#86a892', marginBottom: 6, marginTop: 16, fontWeight: '600', letterSpacing: 0.5 },
  input: { backgroundColor: '#1a5c2a', borderRadius: 12, padding: 14, fontSize: 15, color: '#f0fdf4', borderWidth: 1, borderColor: '#2d8a45' },
  btn: { backgroundColor: '#4ade80', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 28 },
  btnOff: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#0a2e12' },
  hint: { textAlign: 'center', color: '#4ade80', marginTop: 20, fontSize: 13 },
});