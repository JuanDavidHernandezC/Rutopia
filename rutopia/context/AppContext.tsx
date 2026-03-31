import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── TIPOS ──────────────────────────────────────────
export interface Usuario {
  nombre: string;
  email: string;
  foto: string | null;
  plan: 'gratuito' | 'premium';
}

export interface Lugar {
  id: string;
  nombre: string;
  municipio: string;
  categoria: 'ecoturismo' | 'gastronomia' | 'cafes' | 'cultura';
  calificacion: number;
  descripcion: string;
  horario: string;
  distancia: string;
  color: string;
  patrocinado?: boolean;
  emprendedorId?: string;
}

export interface Emprendedor {
  id: string;
  nombre: string;
  negocio: string;
  categoria: string;
  descripcion: string;
  municipio: string;
  email: string;
  calificacion: number;
  color: string;
}

// ── DATOS ──────────────────────────────────────────
export const LUGARES: Lugar[] = [
  { id:'1', nombre:'Cerro de Valvanera', municipio:'Cajicá', categoria:'ecoturismo', calificacion:4.8, descripcion:'Mirador natural con vista panorámica a toda la Sabana de Bogotá. Ideal para senderismo, fotografía y amanecer espectacular.', horario:'Lun–Dom 5:00am–6:00pm', distancia:'12 km', color:'#16a34a', emprendedorId:'2' },
  { id:'2', nombre:'Cascadas de Tabio', municipio:'Tabio', categoria:'ecoturismo', calificacion:4.6, descripcion:'Serie de cascadas escondidas entre cafetales y vegetación nativa. Perfecto para ecoturismo y fotografía de naturaleza.', horario:'Lun–Dom 7:00am–5:00pm', distancia:'8 km', color:'#0284c7' },
  { id:'3', nombre:'Plaza de Chía', municipio:'Chía', categoria:'cultura', calificacion:4.5, descripcion:'Centro histórico con arquitectura colonial, mercado artesanal los fines de semana y gastronomía típica de la Sabana.', horario:'Lun–Dom 8:00am–8:00pm', distancia:'3 km', color:'#7c3aed' },
  { id:'4', nombre:'Café de Montaña', municipio:'Tabio', categoria:'cafes', calificacion:4.9, descripcion:'Finca cafetera con recorridos guiados, cata de café de origen y desayunos campesinos con vista a los cerros.', horario:'Mar–Dom 8:00am–4:00pm', distancia:'10 km', color:'#92400e', patrocinado:true, emprendedorId:'1' },
  { id:'5', nombre:'Mercado Campesino Cajicá', municipio:'Cajicá', categoria:'gastronomia', calificacion:4.7, descripcion:'Mercado tradicional con productos frescos, artesanías y comida típica. Se realiza cada sábado en la plaza principal.', horario:'Sábados 6:00am–2:00pm', distancia:'14 km', color:'#f59e0b' },
  { id:'6', nombre:'Hacienda Santa Bárbara', municipio:'Chía', categoria:'cultura', calificacion:4.4, descripcion:'Hacienda colonial del siglo XVII con tours históricos, jardines y restaurante de cocina criolla.', horario:'Mié–Dom 9:00am–5:00pm', distancia:'5 km', color:'#dc2626' },
  { id:'7', nombre:'Sendero Los Arrayanes', municipio:'Tabio', categoria:'ecoturismo', calificacion:4.3, descripcion:'Sendero ecológico de 4 km rodeado de árboles de arrayán centenarios. Fauna y flora nativa de los Andes.', horario:'Lun–Dom 6:00am–4:00pm', distancia:'9 km', color:'#16a34a' },
  { id:'8', nombre:'Restaurante El Fogón', municipio:'Cajicá', categoria:'gastronomia', calificacion:4.6, descripcion:'Cocina campesina auténtica de la Sabana. Especialidad en ajiaco santafereño y fritanga.', horario:'Lun–Dom 11:00am–8:00pm', distancia:'13 km', color:'#f59e0b', patrocinado:true },
];

export const EMPRENDEDORES: Emprendedor[] = [
  { id:'1', nombre:'Ana María Rodríguez', negocio:'Café de Montaña', categoria:'Cafés', descripcion:'Productora de café de especialidad con 15 años de experiencia. Ofrece tours, talleres de catación y venta directa.', municipio:'Tabio', email:'ana@cafemontana.co', calificacion:4.9, color:'#92400e' },
  { id:'2', nombre:'Carlos Fonseca', negocio:'Finca El Paraíso', categoria:'Ecoturismo', descripcion:'Agroturismo familiar con cabañas ecológicas, huerta orgánica y experiencias rurales para familias y grupos.', municipio:'Cajicá', email:'carlos@fincaparaiso.co', calificacion:4.7, color:'#16a34a' },
  { id:'3', nombre:'Luz Stella Mora', negocio:'Artesanías Chía', categoria:'Cultura', descripcion:'Artesana con 20 años creando piezas en cerámica y tejido con diseños muiscas. Talleres para turistas.', municipio:'Chía', email:'luz@artesaniaschia.co', calificacion:4.5, color:'#7c3aed' },
  { id:'4', nombre:'Pedro Gutiérrez', negocio:'Sabores del Campo', categoria:'Gastronomía', descripcion:'Chef campesino especializado en cocina de autor con ingredientes de la Sabana. Cenas privadas y eventos.', municipio:'Tabio', email:'pedro@saborescampo.co', calificacion:4.8, color:'#f59e0b' },
  { id:'5', nombre:'Manuela Torres', negocio:'Yoga & Naturaleza', categoria:'Ecoturismo', descripcion:'Retiros de bienestar en medio de la naturaleza. Yoga, meditación y senderismo consciente en la Sabana.', municipio:'Cajicá', email:'manu@yoganaturaleza.co', calificacion:4.6, color:'#0284c7' },
];

// ── CONTEXTO ──────────────────────────────────────
interface AppState {
  usuario: Usuario | null;
  favoritos: string[];
  modoOscuro: boolean;
  notificaciones: boolean;
  login: (nombre: string, password: string) => boolean;
  logout: () => void;
  toggleFavorito: (id: string) => void;
  esFavorito: (id: string) => boolean;
  setModoOscuro: (v: boolean) => void;
  setNotificaciones: (v: boolean) => void;
  actualizarFoto: (uri: string) => void;
}

const AppContext = createContext<AppState>({} as AppState);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificaciones, setNotificaciones] = useState(true);

  useEffect(() => {
    AsyncStorage.multiGet(['@usuario','@favoritos','@oscuro','@notif']).then(pairs => {
      const [u, f, o, n] = pairs;
      if (u[1]) setUsuario(JSON.parse(u[1]));
      if (f[1]) setFavoritos(JSON.parse(f[1]));
      if (o[1]) setModoOscuro(JSON.parse(o[1]));
      if (n[1]) setNotificaciones(JSON.parse(n[1]));
    });
  }, []);

  const login = (nombre: string, password: string) => {
    if (nombre.trim().length < 2 || password.length < 4) return false;
    const u: Usuario = { nombre: nombre.trim(), email: `${nombre.toLowerCase()}@rutopia.co`, foto: null, plan: 'gratuito' };
    setUsuario(u);
    AsyncStorage.setItem('@usuario', JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUsuario(null);
    AsyncStorage.removeItem('@usuario');
  };

  const toggleFavorito = (id: string) => {
    const max = usuario?.plan === 'premium' ? Infinity : 5;
    const next = favoritos.includes(id)
      ? favoritos.filter(f => f !== id)
      : favoritos.length >= max ? favoritos : [...favoritos, id];
    setFavoritos(next);
    AsyncStorage.setItem('@favoritos', JSON.stringify(next));
  };

  const esFavorito = (id: string) => favoritos.includes(id);

  const actualizarFoto = (uri: string) => {
    if (!usuario) return;
    const u = { ...usuario, foto: uri };
    setUsuario(u);
    AsyncStorage.setItem('@usuario', JSON.stringify(u));
  };

  const guardarOscuro = (v: boolean) => { setModoOscuro(v); AsyncStorage.setItem('@oscuro', JSON.stringify(v)); };
  const guardarNotif = (v: boolean) => { setNotificaciones(v); AsyncStorage.setItem('@notif', JSON.stringify(v)); };

  return (
    <AppContext.Provider value={{ usuario, favoritos, modoOscuro, notificaciones, login, logout, toggleFavorito, esFavorito, setModoOscuro: guardarOscuro, setNotificaciones: guardarNotif, actualizarFoto }}>
      {children}
    </AppContext.Provider>
  );
}