import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useState, useRef } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_GAP = 14;

// ─── DATA ────────────────────────────────────────────────────────────────────
const municipios = ['Todos', 'Cajicá', 'Chía', 'Tabio'];

const categorias = [
  { id: 'all',         label: 'Todo',        emoji: '🗺️' },
  { id: 'naturaleza',  label: 'Naturaleza',  emoji: '🌿' },
  { id: 'cultura',     label: 'Cultura',     emoji: '🏛️' },
  { id: 'gastronomia', label: 'Gastronomía', emoji: '🍽️' },
  { id: 'cafe',        label: 'Cafés',       emoji: '☕' },
  { id: 'aventura',    label: 'Aventura',    emoji: '🧗' },
];

type Lugar = {
  id: string;
  nombre: string;
  municipio: string;
  categoria: string;
  rating: string;
  tiempo: string;
  descripcion: string;
  color: string;
  accentColor: string;
  emoji: string;
};

const lugares: Lugar[] = [
  // ── CAJICÁ ──
  {
    id: '1',
    nombre: 'Cerro de Valvanera',
    municipio: 'Cajicá',
    categoria: 'naturaleza',
    rating: '4.8',
    tiempo: '2h aprox.',
    descripcion: 'Mirador natural con vista panorámica a toda la Sabana Centro',
    color: '#1a4731',
    accentColor: '#4ade80',
    emoji: '⛰️',
  },
  {
    id: '2',
    nombre: 'Restaurante La Sabana',
    municipio: 'Cajicá',
    categoria: 'gastronomia',
    rating: '4.6',
    tiempo: '1h aprox.',
    descripcion: 'Cocina tradicional colombiana con productos frescos de la región',
    color: '#3b1a05',
    accentColor: '#f59e0b',
    emoji: '🍲',
  },
  {
    id: '3',
    nombre: 'Parque Ecológico Cajicá',
    municipio: 'Cajicá',
    categoria: 'naturaleza',
    rating: '4.4',
    tiempo: '1.5h aprox.',
    descripcion: 'Reserva natural con senderos, aves y zonas de picnic familiar',
    color: '#14342b',
    accentColor: '#34d399',
    emoji: '🌳',
  },
  {
    id: '4',
    nombre: 'Mercado Artesanal',
    municipio: 'Cajicá',
    categoria: 'cultura',
    rating: '4.3',
    tiempo: '1h aprox.',
    descripcion: 'Artesanos locales con cerámica, textiles y productos de la Sabana',
    color: '#3b1f5e',
    accentColor: '#c084fc',
    emoji: '🎨',
  },
  // ── CHÍA ──
  {
    id: '5',
    nombre: 'Plaza de Chía',
    municipio: 'Chía',
    categoria: 'cultura',
    rating: '4.5',
    tiempo: '1.5h aprox.',
    descripcion: 'Centro histórico con gastronomía, artesanías y vida cultural local',
    color: '#4a1942',
    accentColor: '#f472b6',
    emoji: '🏘️',
  },
  {
    id: '6',
    nombre: 'Mercado Campesino',
    municipio: 'Chía',
    categoria: 'gastronomia',
    rating: '4.7',
    tiempo: 'Sábados AM',
    descripcion: 'Mercado local con productores directos, flores y gastronomía sabanera',
    color: '#1a3d2b',
    accentColor: '#4ade80',
    emoji: '🌻',
  },
  {
    id: '7',
    nombre: 'Lago Tierra Negra',
    municipio: 'Chía',
    categoria: 'naturaleza',
    rating: '4.4',
    tiempo: '2h aprox.',
    descripcion: 'Espejo de agua rodeado de humedales y aves migratorias',
    color: '#1e3a5f',
    accentColor: '#60a5fa',
    emoji: '🦢',
  },
  {
    id: '8',
    nombre: 'Café Jardín de Luna',
    municipio: 'Chía',
    categoria: 'cafe',
    rating: '4.8',
    tiempo: '1h aprox.',
    descripcion: 'Café boutique con especialidades de origen y terraza con vista al río',
    color: '#3d1e0f',
    accentColor: '#fb923c',
    emoji: '☕',
  },
  // ── TABIO ──
  {
    id: '9',
    nombre: 'Cascadas de Tabio',
    municipio: 'Tabio',
    categoria: 'naturaleza',
    rating: '4.6',
    tiempo: '3h aprox.',
    descripcion: 'Sendero ecológico con caídas de agua cristalina entre bosques nativos',
    color: '#1e3a5f',
    accentColor: '#60a5fa',
    emoji: '💧',
  },
  {
    id: '10',
    nombre: 'Café de Montaña',
    municipio: 'Tabio',
    categoria: 'cafe',
    rating: '4.9',
    tiempo: '1h aprox.',
    descripcion: 'Café de origen con vista espectacular a los cerros de la Sabana',
    color: '#3d1e0f',
    accentColor: '#fb923c',
    emoji: '☕',
  },
  {
    id: '11',
    nombre: 'Termas de Tabio',
    municipio: 'Tabio',
    categoria: 'aventura',
    rating: '4.7',
    tiempo: 'Medio día',
    descripcion: 'Aguas termales naturales en un entorno montañoso de la Sabana',
    color: '#1c3557',
    accentColor: '#38bdf8',
    emoji: '♨️',
  },
  {
    id: '12',
    nombre: 'Fonda Tabieña',
    municipio: 'Tabio',
    categoria: 'gastronomia',
    rating: '4.5',
    tiempo: '1h aprox.',
    descripcion: 'Gastronomía campesina auténtica: ajiaco, changua y fritanga sabanera',
    color: '#3b1a05',
    accentColor: '#f59e0b',
    emoji: '🍜',
  },
];

const highlighted: Lugar[] = [
  {
    id: 'h1',
    nombre: 'Ruta del Café',
    municipio: 'Tabio',
    categoria: 'cafe',
    rating: '4.9',
    tiempo: 'Todo el día',
    descripcion: 'Recorre las fincas cafeteras de Tabio y descubre el proceso del café de origen en la Sabana',
    color: '#3d1e0f',
    accentColor: '#fb923c',
    emoji: '☕',
  },
  {
    id: 'h2',
    nombre: 'Cascadas & Termas',
    municipio: 'Tabio',
    categoria: 'aventura',
    rating: '4.8',
    tiempo: 'Medio día',
    descripcion: 'Combina el sendero a las cascadas con un relajante baño en las aguas termales naturales',
    color: '#1a2e4a',
    accentColor: '#60a5fa',
    emoji: '💧',
  },
  {
    id: 'h3',
    nombre: 'Sabana Gourmet',
    municipio: 'Chía · Cajicá',
    categoria: 'gastronomia',
    rating: '4.7',
    tiempo: 'Sábados AM',
    descripcion: 'Mercados campesinos, fondas tradicionales y cafés boutique en los dos municipios más gastronómicos',
    color: '#1a3d2b',
    accentColor: '#4ade80',
    emoji: '🌻',
  },
];

// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
// We use Image with the logo from assets or an inline SVG via uri
// Since we can't reference project assets, we'll use an emoji-based logo placeholder
// that matches the brand identity, referencing the real logo via require in production.

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: string }) {
  const num = parseFloat(rating);
  return (
    <View style={sub.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={[sub.star, { opacity: i <= Math.round(num) ? 1 : 0.25 }]}>★</Text>
      ))}
      <Text style={sub.ratingNum}>{rating}</Text>
    </View>
  );
}

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const ref = useRef<FlatList>(null);

  return (
    <View>
      <FlatList
        ref={ref}
        data={highlighted}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          setActive(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
        }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.92} style={[hero.card, { width: SCREEN_WIDTH }]}>
            <View style={[hero.bg, { backgroundColor: item.color }]}>
              {/* Decorative circles */}
              <View style={[hero.circle, hero.circle1, { borderColor: item.accentColor + '30' }]} />
              <View style={[hero.circle, hero.circle2, { borderColor: item.accentColor + '20' }]} />

              <View style={hero.tag}>
                <Text style={hero.tagText}>{item.tiempo}</Text>
              </View>

              <Text style={hero.emoji}>{item.emoji}</Text>

              <View style={hero.content}>
                <View style={[hero.pill, { backgroundColor: item.accentColor + '22' }]}>
                  <Text style={[hero.pillText, { color: item.accentColor }]}>
                    {item.municipio}
                  </Text>
                </View>
                <Text style={hero.title}>{item.nombre}</Text>
                <Text style={hero.desc}>{item.descripcion}</Text>
                <View style={hero.footer}>
                  <StarRating rating={item.rating} />
                  <TouchableOpacity style={[hero.btn, { backgroundColor: item.accentColor }]}>
                    <Text style={hero.btnText}>Explorar →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={i => i.id}
      />

      {/* Dots */}
      <View style={hero.dots}>
        {highlighted.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => {
            ref.current?.scrollToIndex({ index: i, animated: true });
            setActive(i);
          }}>
            <View style={[hero.dot, i === active && hero.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function LugarCard({ item }: { item: Lugar }) {
  return (
    <TouchableOpacity activeOpacity={0.88} style={[card.wrap, { width: CARD_WIDTH }]}>
      <View style={[card.img, { backgroundColor: item.color }]}>
        <View style={[card.circle, { borderColor: item.accentColor + '25' }]} />
        <Text style={card.emoji}>{item.emoji}</Text>
        <View style={[card.badge, { backgroundColor: item.accentColor + '22' }]}>
          <Text style={[card.badgeText, { color: item.accentColor }]}>{item.tiempo}</Text>
        </View>
      </View>
      <View style={card.body}>
        <View style={card.row}>
          <Text style={card.name} numberOfLines={1}>{item.nombre}</Text>
          <View style={card.ratingChip}>
            <Text style={card.ratingText}>⭐ {item.rating}</Text>
          </View>
        </View>
        <Text style={card.desc} numberOfLines={2}>{item.descripcion}</Text>
        <View style={card.locRow}>
          <Text style={card.loc}>📍 {item.municipio}</Text>
          <Text style={[card.catTag, { color: item.accentColor }]}>
            {categorias.find(c => c.id === item.categoria)?.emoji}{' '}
            {categorias.find(c => c.id === item.categoria)?.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [municipioActivo, setMunicipioActivo] = useState('Todos');
  const [categoriaActiva, setCategoriaActiva] = useState('all');

  const lugaresFiltrados = lugares.filter(l => {
    const okMunicipio = municipioActivo === 'Todos' || l.municipio === municipioActivo;
    const okCategoria = categoriaActiva === 'all' || l.categoria === categoriaActiva;
    return okMunicipio && okCategoria;
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0a2416" />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ── STICKY HEADER ── */}
        <View style={s.header}>
          {/* Logo row */}
          <View style={s.logoRow}>
            <View style={s.logoMark}>
              <Text style={s.logoEmoji}>🌿</Text>
            </View>
            <View>
              <Text style={s.logoName}>Rutopía</Text>
              <Text style={s.logoSub}>Sabana Centro · Colombia</Text>
            </View>
            <TouchableOpacity style={s.notifBtn}>
              <Text style={s.notifIcon}>🔔</Text>
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <TouchableOpacity style={s.searchBar}>
            <Text style={s.searchIcon}>🔍</Text>
            <Text style={s.searchPlaceholder}>Busca lugares, rutas, experiencias…</Text>
          </TouchableOpacity>
        </View>

        {/* ── HERO CAROUSEL ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>✨ Rutas destacadas</Text>
        </View>
        <HeroCarousel />

        {/* ── CATEGORIAS ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Categorías</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
          <View style={s.catRow}>
            {categorias.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[s.catChip, categoriaActiva === c.id && s.catChipActive]}
                onPress={() => setCategoriaActiva(c.id)}
              >
                <Text style={s.catEmoji}>{c.emoji}</Text>
                <Text style={[s.catLabel, categoriaActiva === c.id && s.catLabelActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── MUNICIPIOS ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Por municipio</Text>
          <TouchableOpacity>
            <Text style={s.seeAll}>Ver mapa →</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.munScroll}>
          <View style={s.munRow}>
            {municipios.map(m => (
              <TouchableOpacity
                key={m}
                style={[s.munChip, municipioActivo === m && s.munChipActive]}
                onPress={() => setMunicipioActivo(m)}
              >
                <Text style={[s.munLabel, municipioActivo === m && s.munLabelActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── HORIZONTAL CARDS ── */}
        {lugaresFiltrados.length > 0 ? (
          <FlatList
            data={lugaresFiltrados}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.cardList}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
            renderItem={({ item }) => <LugarCard item={item} />}
            keyExtractor={i => i.id}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_GAP}
            snapToAlignment="start"
          />
        ) : (
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>🗺️</Text>
            <Text style={s.emptyText}>Sin resultados para esta combinación</Text>
            <TouchableOpacity onPress={() => { setMunicipioActivo('Todos'); setCategoriaActiva('all'); }}>
              <Text style={s.emptyReset}>Limpiar filtros</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── QUICK STATS ── */}
        <View style={s.statsRow}>
          {[
            { label: 'Municipios', value: '3', emoji: '🏘️' },
            { label: 'Destinos', value: '12+', emoji: '📍' },
            { label: 'Rutas', value: '8', emoji: '🗺️' },
          ].map(st => (
            <View key={st.label} style={s.statCard}>
              <Text style={s.statEmoji}>{st.emoji}</Text>
              <Text style={s.statValue}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const sub = StyleSheet.create({
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  star: { fontSize: 13, color: '#fbbf24' },
  ratingNum: { fontSize: 12, color: '#d1fae5', marginLeft: 4, fontWeight: '700' },
});

const hero = StyleSheet.create({
  card: { overflow: 'hidden' },
  bg: {
    margin: 0,
    minHeight: 300,
    padding: 24,
    paddingTop: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  circle1: {
    width: 280,
    height: 280,
    top: -80,
    right: -80,
  },
  circle2: {
    width: 180,
    height: 180,
    top: -30,
    right: 40,
  },
  tag: {
    position: 'absolute',
    top: 20,
    left: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: { color: '#fff', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  emoji: { fontSize: 64, marginBottom: 8 },
  content: { gap: 10 },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pillText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  desc: { fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 18 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  btn: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  btnText: { color: '#0a1a0e', fontSize: 13, fontWeight: '800' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  dot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: '#c4d4c8',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#16a34a',
  },
});

const card = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0f4c20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  img: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -40,
    right: -40,
    borderWidth: 1,
  },
  emoji: { fontSize: 52 },
  badge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },
  body: { padding: 14, gap: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0f2d1a',
    letterSpacing: -0.3,
  },
  ratingChip: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#15803d' },
  desc: { fontSize: 12, color: '#4b7c5a', lineHeight: 17 },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  loc: { fontSize: 11, color: '#6b9e7e' },
  catTag: { fontSize: 11, fontWeight: '700' },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f0fdf4' },
  scroll: { flex: 1 },

  // Header
  header: {
    backgroundColor: '#0a2416',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
    gap: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 22 },
  logoName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f0fdf4',
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 10,
    color: '#4ade80',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  notifBtn: {
    marginLeft: 'auto',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: { fontSize: 16 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },

  // Sections
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f2d1a',
    letterSpacing: -0.3,
  },
  seeAll: { fontSize: 13, color: '#16a34a', fontWeight: '700' },

  // Categories
  catScroll: { paddingLeft: 20 },
  catRow: { flexDirection: 'row', gap: 10, paddingRight: 20, paddingBottom: 4 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#d1fae5',
    shadowColor: '#0f4c20',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  catChipActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  catEmoji: { fontSize: 14 },
  catLabel: { fontSize: 13, color: '#2d6a44', fontWeight: '600' },
  catLabelActive: { color: '#fff' },

  // Municipios
  munScroll: { paddingLeft: 20 },
  munRow: { flexDirection: 'row', gap: 8, paddingRight: 20, paddingBottom: 4 },
  munChip: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: '#d1fae5',
  },
  munChipActive: {
    backgroundColor: '#0f2d1a',
    borderColor: '#0f2d1a',
  },
  munLabel: { fontSize: 13, color: '#2d6a44', fontWeight: '600' },
  munLabelActive: { color: '#f0fdf4' },

  // Card list
  cardList: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 4,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 14, color: '#4b7c5a', fontWeight: '600' },
  emptyReset: { fontSize: 13, color: '#16a34a', fontWeight: '700', marginTop: 4 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 28,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#0f4c20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  statEmoji: { fontSize: 22 },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f2d1a',
    letterSpacing: -0.5,
  },
  statLabel: { fontSize: 11, color: '#4b7c5a', fontWeight: '600' },
});
