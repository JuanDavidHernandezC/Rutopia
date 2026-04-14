import { useState } from 'react';
import { 
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { login } = useApp();

  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleLogin = () => {
    if (!nombre.trim() || !password) {
      Alert.alert('Completa todos los campos');
      return;
    }

    setCargando(true);

    setTimeout(() => {
      const ok = login(nombre, password);
      if (!ok) {
        Alert.alert('Error', 'Datos inválidos');
        setCargando(false);
      }
    }, 600);
  };

  return (
    <KeyboardAvoidingView 
      style={s.screen} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      {/* HEADER */}
      <View style={s.top}>
        <View style={s.logoBox}>
          <Text style={s.logoIcon}>🗺️</Text>
        </View>
        <Text style={s.logoText}>Rutopía</Text>
        <Text style={s.logoSub}>Turismo sostenible · Sabana Centro</Text>
      </View>

      {/* FORM */}
      <View style={s.form}>
        <Text style={s.label}>Usuario</Text>
        <TextInput
          style={s.input}
          placeholder="Tu nombre"
          placeholderTextColor="#86a892"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={s.label}>Contraseña</Text>
        <TextInput
          style={s.input}
          placeholder="••••"
          placeholderTextColor="#86a892"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[s.btn, cargando && s.btnOff]} 
          onPress={handleLogin}
        >
          <Text style={s.btnText}>
            {cargando ? 'Entrando...' : 'Ingresar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMostrarModal(true)}>
          <Text style={s.hint}>Regístrate gratis</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 MODAL PRO */}
      <Modal
        visible={mostrarModal}
        transparent
        animationType="slide"
      >
        <TouchableOpacity 
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setMostrarModal(false)}
        >
          <TouchableOpacity 
            style={s.sheet}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={s.handle} />

            <Text style={s.title}>Crear cuenta</Text>

            {/* GOOGLE */}
            <TouchableOpacity 
              style={[s.socialBtn, { backgroundColor: '#d6a64c' }]}
              onPress={() => {
                setMostrarModal(false);
                Alert.alert('Google login (aquí conectas Firebase)');
              }}
            >
              <Text style={s.socialText}>🔴 Continuar con Google</Text>
            </TouchableOpacity>

            {/* FACEBOOK */}
            <TouchableOpacity 
              style={[s.socialBtn, { backgroundColor: '#1877f2' }]}
              onPress={() => {
                setMostrarModal(false);
                Alert.alert('Facebook login');
              }}
            >
              <Text style={[s.socialText, { color: '#fff' }]}>
                🔵 Continuar con Facebook
              </Text>
            </TouchableOpacity>

            {/* TELÉFONO */}
            <TouchableOpacity 
              style={[s.socialBtn, { backgroundColor: '#22c55e' }]}
              onPress={() => {
                setMostrarModal(false);
                Alert.alert('Registro con teléfono');
              }}
            >
              <Text style={[s.socialText, { color: '#fff' }]}>
                📱 Usar número de teléfono
              </Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0a2e12',
    justifyContent: 'center'
  },

  top: { alignItems: 'center', marginBottom: 40 },

  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logoIcon: { fontSize: 36 },
  logoText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  logoSub: { color: '#4ade80' },

  form: { paddingHorizontal: 28 },

  label: { color: '#86a892', marginTop: 15 },

  input: {
    backgroundColor: '#1a5c2a',
    padding: 14,
    borderRadius: 10,
    color: '#fff',
    marginTop: 5
  },

  btn: {
    backgroundColor: '#4ade80',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center'
  },

  btnOff: { opacity: 0.5 },

  btnText: { fontWeight: 'bold' },

  hint: {
    color: '#4ade80',
    textAlign: 'center',
    marginTop: 20
  },

  // 🔥 MODAL PRO
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end'
  },

  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },

  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },

  socialBtn: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    alignItems: 'center'
  },

  socialText: {
    fontWeight: '600'
  }
});