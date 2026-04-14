import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Usuario {
  nombre: string;
  email: string;
  foto: string | null;
  plan: 'gratuito' | 'premium';
}

export interface Resena {
  id: string;
  lugarId: string;
  usuario: string;
  texto: string;
  estrellas: number;
  fecha: string;
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
  imagen?: string; 
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
  whatsapp: string;   
  instagram: string;  
  calificacion: number;
  color: string;
  imagen?:string;
}

export const LUGARES: Lugar[] = [
  { id:'1', nombre:'Mirador la Cumbre', municipio:'Cajicá', categoria:'ecoturismo', calificacion:4.8, descripcion:'Mirador natural con vista panorámica. Ideal para senderismo, fotografía y amanecer espectacular.', horario:'Lun–Dom 5:00am–6:00pm', distancia:'12 km', color:'#16a34a', imagen:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/66/4d/93/mirador-la-cumbre.jpg?w=900&h=-1&s=1' },
  { id:'2', nombre:'Termales el Zipa', municipio:'Tabio', categoria:'ecoturismo', calificacion:4.6, descripcion:'Serie de piscinas termales. Perfecto para ecoturismo y compartir en familia.', horario:'Lun–Dom 7:00am–5:00pm', distancia:'8 km', color:'#0284c7', imagen:'https://termalesencundinamarca.com/assets/images/termalesdetabio08-1600x900.jpg' },
  { id:'3', nombre:'Centro Comercial Centro Chía', municipio:'Chía', categoria:'cultura', calificacion:4.5, descripcion:'Centro comercial con arquitectura colonial, tiendas variadas y cine, perfecto para los fines de semana y hacer planes nuevos.', horario:'Lun–Dom 8:00am–8:00pm', distancia:'3 km', color:'#7c3aed', imagen:'https://obycon.com/wp-content/uploads/2022/02/Parque-Centro-Chia-2.jpg' },
  { id:'4', nombre:'Restaurante al Carbón', municipio:'Tabio', categoria:'gastronomia', calificacion:4.5, descripcion:'Restaurante para pasar tiempo con tu familia y puedes reservar para tus eventos especiales.', horario:'Mar–Dom 8:00am–6:00pm', distancia:'10 km', color:'#92400e',imagen:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZu792j3oT1zHasTeo3pJNZFQhAmvykTQO5Q&s', patrocinado:true, emprendedorId:'4' },
  { id:'5', nombre:'Lililu Pasteleria', municipio:'Cajicá', categoria:'cafes', calificacion:4.7, descripcion:'Cafe y panaderia con excelente atencion al cliente, bebidas artesanales y tortas para pasar un rato muy dulce.', horario:'Lun-Dom 8:00am–6:00pm', distancia:'14 km', color:'#f59e0b', imagen:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/3a/89/07/deliciosa-pasteleria.jpg?w=900&h=500&s=1', emprendedorId:'1' },
  { id:'6', nombre:'Centro Histórico', municipio:'Chía', categoria:'cultura', calificacion:4.4, descripcion:'Centro comercial que contiene tiendas, jardines y restaurantes, lugar ideal para conocer nuevos emprendimientos y emprendedores.', horario:'Mié–Dom 9:00am–5:00pm', distancia:'5 km', color:'#dc2626', imagen:'https://thumbs.dreamstime.com/b/colombia-chia-uno-de-las-puertas-acceso-al-centro-hist%C3%B3rico-june-esta-vieja-puerta-representa-la-entrada-%C3%A1rea-peatonal-sabida-150764829.jpg' },
  { id:'7', nombre:'Capillas de Carrón', municipio:'Tabio', categoria:'ecoturismo', calificacion:4.3, descripcion:'Sendero ecológico para caminar, montar biciclite y ahcer deporte, rodeado de naturaleza y subidas que representan un reto.', horario:'Lun–Dom 00:00am–12:00pm', distancia:'9 km', color:'#16a34a', imagen:'https://s1.wklcdn.com/image_191/5749668/61329894/40823542.700x525.jpg' },
  { id:'8', nombre:'Restaurante El Tambor', municipio:'Cajicá', categoria:'gastronomia', calificacion:4.6, descripcion:'Cocina campesina auténtica de la Sabana. Especialidad en atencion al cliente y comida al aire libre.', horario:'Lun–Dom 11:00am–8:00pm', distancia:'13 km', color:'#f59e0b', imagen:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/69/be/24/img-20161009-215214-largejpg.jpg?w=900&h=-1&s=1' , patrocinado:true },
];

export const EMPRENDEDORES: Emprendedor[] = [
  { id:'1', nombre:'Ana María Rodríguez', negocio:'Café Lililu', categoria:'Cafés', descripcion:'Productora de café de especialidad con 5 años de experiencia. Ofrece increible sabor en sus bebidas y en tu vida.', municipio:'Cajicá', email:'ana@cafemontana.co', whatsapp:'573001234567',instagram:'cafelililu', calificacion:4.9, color:'#92400e' },
  { id:'2', nombre:'Carlos Fonseca', negocio:'Finca El Paraíso', categoria:'Ecoturismo', descripcion:'Agroturismo familiar con cabañas ecológicas, huerta orgánica y experiencias rurales para familias y grupos.', municipio:'Cajicá', email:'carlos@fincaparaiso.co',  whatsapp:'573001234567',instagram:'cafelililu', calificacion:4.7, color:'#16a34a' },
  { id:'3', nombre:'Luz Stella Mora', negocio:'Artesanías Chía', categoria:'Cultura', descripcion:'Artesana con 20 años creando piezas en cerámica y tejido con diseños muiscas. Talleres para turistas.', municipio:'Chía', email:'luz@artesaniaschia.co', calificacion:4.5,  whatsapp:'573001234567',instagram:'cafelililu', color:'#7c3aed' },
  { id:'4', nombre:'Pedro Gutiérrez', negocio:'Al Carbon', categoria:'Gastronomía', descripcion:'Chef campesino especializado en cocina de autor con ingredientes de la Sabana. Cenas privadas y eventos.', municipio:'Tabio', email:'pedro@saborescampo.co',  whatsapp:'573001234567',instagram:'cafelililu', calificacion:4.8, color:'#f59e0b' },
  { id:'5', nombre:'Manuela Torres', negocio:'Yoga & Naturaleza', categoria:'Ecoturismo', descripcion:'Retiros de bienestar en medio de la naturaleza. Yoga, meditación y senderismo consciente en la Sabana.', municipio:'Cajicá', email:'manu@yoganaturaleza.co',  whatsapp:'573001234567',instagram:'cafelililu', calificacion:4.6, color:'#0284c7' },
];

// ── TRADUCCIONES ────────────────────────────────────
export type Idioma = 'es' | 'en' | 'fr' | 'pt';

export const T: Record<Idioma, Record<string, string>> = {
  es: {
    inicio: 'Inicio', explorar: 'Explorar', emprendedores: 'Emprendedores',
    favoritos: 'Favoritos', ranking: 'Ranking', perfil: 'Perfil',
    dondeVamos: '¿A dónde vamos hoy?', buscar: 'Buscar lugares...',
    destacados: 'Destinos destacados', configuracion: 'Configuración',
    modoOscuro: 'Modo oscuro', notificaciones: 'Notificaciones',
    idioma: 'Idioma', cerrarSesion: 'Cerrar sesión', ayuda: 'Ayuda y soporte',
    acercaDe: 'Acerca de Rutopía', valorar: 'Valorar la app',
    misReseñas: 'Mis reseñas', premium: 'Ver planes Premium',
    guardar: 'Guardar', guardado: 'Guardado', verMapa: 'Ver en Google Maps',
    escribeResena: 'Escribe tu reseña...', publicar: 'Publicar reseña',
    reseñas: 'Reseñas', tuResena: 'Tu calificación',
    hola: 'Hola', planGratis: 'Plan Gratuito', planPremium: 'Premium',
    estadisticas: 'Estadísticas', visitas: 'Visitas', reseñasNum: 'Reseñas',
  },
  en: {
    inicio: 'Home', explorar: 'Explore', emprendedores: 'Entrepreneurs',
    favoritos: 'Favorites', ranking: 'Ranking', perfil: 'Profile',
    dondeVamos: 'Where are we going today?', buscar: 'Search places...',
    destacados: 'Featured Destinations', configuracion: 'Settings',
    modoOscuro: 'Dark mode', notificaciones: 'Notifications',
    idioma: 'Language', cerrarSesion: 'Sign out', ayuda: 'Help & support',
    acercaDe: 'About Rutopía', valorar: 'Rate the app',
    misReseñas: 'My reviews', premium: 'View Premium plans',
    guardar: 'Save', guardado: 'Saved', verMapa: 'View on Google Maps',
    escribeResena: 'Write your review...', publicar: 'Post review',
    reseñas: 'Reviews', tuResena: 'Your rating',
    hola: 'Hello', planGratis: 'Free Plan', planPremium: 'Premium',
    estadisticas: 'Statistics', visitas: 'Visits', reseñasNum: 'Reviews',
  },
  fr: {
    inicio: 'Accueil', explorar: 'Explorer', emprendedores: 'Entrepreneurs',
    favoritos: 'Favoris', ranking: 'Classement', perfil: 'Profil',
    dondeVamos: 'Où allons-nous aujourd\'hui?', buscar: 'Rechercher...',
    destacados: 'Destinations vedettes', configuracion: 'Paramètres',
    modoOscuro: 'Mode sombre', notificaciones: 'Notifications',
    idioma: 'Langue', cerrarSesion: 'Déconnexion', ayuda: 'Aide',
    acercaDe: 'À propos de Rutopía', valorar: 'Évaluer l\'app',
    misReseñas: 'Mes avis', premium: 'Plans Premium',
    guardar: 'Sauvegarder', guardado: 'Sauvegardé', verMapa: 'Voir sur Google Maps',
    escribeResena: 'Écrivez votre avis...', publicar: 'Publier',
    reseñas: 'Avis', tuResena: 'Votre note',
    hola: 'Bonjour', planGratis: 'Plan gratuit', planPremium: 'Premium',
    estadisticas: 'Statistiques', visitas: 'Visites', reseñasNum: 'Avis',
  },
  pt: {
    inicio: 'Início', explorar: 'Explorar', emprendedores: 'Empreendedores',
    favoritos: 'Favoritos', ranking: 'Ranking', perfil: 'Perfil',
    dondeVamos: 'Para onde vamos hoje?', buscar: 'Buscar lugares...',
    destacados: 'Destinos em destaque', configuracion: 'Configurações',
    modoOscuro: 'Modo escuro', notificaciones: 'Notificações',
    idioma: 'Idioma', cerrarSesion: 'Sair', ayuda: 'Ajuda e suporte',
    acercaDe: 'Sobre o Rutopía', valorar: 'Avaliar o app',
    misReseñas: 'Minhas avaliações', premium: 'Ver planos Premium',
    guardar: 'Salvar', guardado: 'Salvo', verMapa: 'Ver no Google Maps',
    escribeResena: 'Escreva sua avaliação...', publicar: 'Publicar',
    reseñas: 'Avaliações', tuResena: 'Sua nota',
    hola: 'Olá', planGratis: 'Plano Gratuito', planPremium: 'Premium',
    estadisticas: 'Estatísticas', visitas: 'Visitas', reseñasNum: 'Avaliações',
  },
};

// ── CONTEXTO ────────────────────────────────────────
interface AppState {
  usuario: Usuario | null;
  favoritos: string[];
  resenas: Resena[];
  modoOscuro: boolean;
  notificaciones: boolean;
  idioma: Idioma;
  t: Record<string, string>;
  login: (nombre: string, password: string) => boolean;
  logout: () => void;
  toggleFavorito: (id: string) => void;
  esFavorito: (id: string) => boolean;
  setModoOscuro: (v: boolean) => void;
  setNotificaciones: (v: boolean) => void;
  setIdioma: (v: Idioma) => void;
  actualizarFoto: (uri: string) => void;
  agregarResena: (r: Omit<Resena, 'id' | 'fecha' | 'usuario'>) => void;
  getResenasPorLugar: (lugarId: string) => Resena[];
  activarPremium: () => void;
}

const AppContext = createContext<AppState>({} as AppState);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificaciones, setNotificaciones] = useState(true);
  const [idioma, setIdiomaState] = useState<Idioma>('es');

  useEffect(() => {
    AsyncStorage.multiGet(['@usuario','@favoritos','@oscuro','@notif','@idioma','@resenas']).then(pairs => {
      const [u,f,o,n,i,r] = pairs;
      if (u[1]) setUsuario(JSON.parse(u[1]));
      if (f[1]) setFavoritos(JSON.parse(f[1]));
      if (o[1]) setModoOscuro(JSON.parse(o[1]));
      if (n[1]) setNotificaciones(JSON.parse(n[1]));
      if (i[1]) setIdiomaState(JSON.parse(i[1]));
      if (r[1]) setResenas(JSON.parse(r[1]));
    });
  }, []);

  const login = (nombre: string, password: string) => {
    if (nombre.trim().length < 2 || password.length < 4) return false;
    const u: Usuario = { nombre: nombre.trim(), email: `${nombre.toLowerCase().replace(' ','')}@rutopia.co`, foto: null, plan: 'gratuito' };
    setUsuario(u);
    AsyncStorage.setItem('@usuario', JSON.stringify(u));
    return true;
  };

  const logout = () => { setUsuario(null); AsyncStorage.removeItem('@usuario'); };

  const activarPremium = () => {
    if (!usuario) return;
    const u = { ...usuario, plan: 'premium' as const };
    setUsuario(u);
    AsyncStorage.setItem('@usuario', JSON.stringify(u));
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
  const setIdioma = (v: Idioma) => { setIdiomaState(v); AsyncStorage.setItem('@idioma', JSON.stringify(v)); };

  const agregarResena = (r: Omit<Resena, 'id' | 'fecha' | 'usuario'>) => {
    const nueva: Resena = {
      ...r,
      id: Date.now().toString(),
      usuario: usuario?.nombre ?? 'Anónimo',
      fecha: new Date().toLocaleDateString('es-CO'),
    };
    const next = [nueva, ...resenas];
    setResenas(next);
    AsyncStorage.setItem('@resenas', JSON.stringify(next));
  };

  const getResenasPorLugar = (lugarId: string) => resenas.filter(r => r.lugarId === lugarId);

  return (
    <AppContext.Provider value={{
      usuario, favoritos, resenas, modoOscuro, notificaciones, idioma,
      t: T[idioma],
      login, logout, toggleFavorito, esFavorito,
      setModoOscuro: guardarOscuro, setNotificaciones: guardarNotif,
      setIdioma, actualizarFoto, agregarResena, getResenasPorLugar, activarPremium,
    }}>
      {children}
    </AppContext.Provider>
  );
}