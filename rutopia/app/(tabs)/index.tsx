import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  FlatList, Dimensions, StatusBar, TextInput, ImageBackground,
  SafeAreaView, Animated, Easing, Alert
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../../hooks/useFavorites';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SW } = Dimensions.get('window');

type Lugar = {
  id: string;
  nombre: string;
  municipio: string;
  categoria: string;
  rating: number;
  tiempo: string;
  descripcion: string;
  imagen: string;
  destacado?: boolean;
  emoji?: string;
};

// Datos de municipios con imágenes de alta calidad
const municipiosData = [
  { 
    id: 'todos', 
    nombre: 'Todos', 
    imagen: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#6366f1',
    gradient: ['#6366f1', '#8b5cf6'],
    emoji: '🗺️',
    descripcion: 'Explora todos los destinos',
    lugares: 12,
    destacado: false
  },
  { 
    id: 'Cajicá', 
    nombre: 'Cajicá', 
    imagen: 'https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#10b981',
    gradient: ['#10b981', '#34d399'],
    emoji: '🏔️',
    descripcion: 'Naturaleza y tradición',
    lugares: 4,
    destacado: true
  },
  { 
    id: 'Chía', 
    nombre: 'Chía', 
    imagen: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#fbbf24'],
    emoji: '🏛️',
    descripcion: 'Cultura e historia',
    lugares: 3,
    destacado: true
  },
  { 
    id: 'Tabio', 
    nombre: 'Tabio', 
    imagen: 'https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#ef4444',
    gradient: ['#ef4444', '#f97316'],
    emoji: '♨️',
    descripcion: 'Aventura y termalismo',
    lugares: 2,
    destacado: false
  },
];

const categorias = [
  { id: 'all', nombre: 'Todo', icono: 'apps-outline', color: '#6366f1', emoji: '🗺️', gradient: ['#6366f1', '#8b5cf6'] },
  { id: 'naturaleza', nombre: 'Naturaleza', icono: 'leaf-outline', color: '#10b981', emoji: '🌿', gradient: ['#10b981', '#34d399'] },
  { id: 'gastronomia', nombre: 'Gastronomía', icono: 'restaurant-outline', color: '#f59e0b', emoji: '🍽️', gradient: ['#f59e0b', '#fbbf24'] },
  { id: 'cultura', nombre: 'Cultura', icono: 'business-outline', color: '#8b5cf6', emoji: '🏛️', gradient: ['#8b5cf6', '#a78bfa'] },
  { id: 'aventura', nombre: 'Aventura', icono: 'bicycle-outline', color: '#ef4444', emoji: '🧗', gradient: ['#ef4444', '#f97316'] },
];

const lugares: Lugar[] = [
  {
    id: '1',
    nombre: 'Cerro de Valvanera',
    municipio: 'Cajicá',
    categoria: 'naturaleza',
    rating: 4.8,
    tiempo: '2h',
    descripcion: 'Mirador panorámico con vista a toda la Sabana Centro',
    imagen: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=800',
    destacado: true,
    emoji: '⛰️'
  },
  {
    id: '2',
    nombre: 'Restaurante La Sabana',
    municipio: 'Cajicá',
    categoria: 'gastronomia',
    rating: 4.6,
    tiempo: '1h',
    descripcion: 'Cocina campesina con productos frescos',
    imagen: 'https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&w=800',
    emoji: '🍲'
  },
  {
    id: '3',
    nombre: 'Parque Ecológico',
    municipio: 'Cajicá',
    categoria: 'naturaleza',
    rating: 4.4,
    tiempo: '1.5h',
    descripcion: 'Senderos naturales y zonas de descanso',
    imagen: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    emoji: '🌳'
  },
  {
    id: '4',
    nombre: 'Plaza de Chía',
    municipio: 'Chía',
    categoria: 'cultura',
    rating: 4.5,
    tiempo: '1.5h',
    descripcion: 'Centro histórico de Chía',
    imagen: 'https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=800',
    destacado: true,
    emoji: '🏘️'
  },
  {
    id: '5',
    nombre: 'Termas de Tabio',
    municipio: 'Tabio',
    categoria: 'aventura',
    rating: 4.7,
    tiempo: '3h',
    descripcion: 'Aguas termales naturales',
    imagen: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=800',
    emoji: '♨️'
  },
];

// ─── PULSING DOT ──────────────────────────────────────────────────────────────
function PulsingDot({ color }: { color: string }) {
  const sc = useRef(new Animated.Value(1)).current;
  const op = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(sc, { toValue: 2.5, duration: 900, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
        Animated.timing(op, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(sc, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(op, { toValue: 1, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(800),
    ])).start();
  }, []);
  return (
    <View style={{ width: 8, height: 8, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: color, transform: [{ scale: sc }], opacity: op }} />
      <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color }} />
    </View>
  );
}

// ─── MUNICIPIO CARD HORIZONTAL MODERNA ────────────────────────────────────────
function MunicipioCard({ item, selected, onPress }: { item: typeof municipiosData[0]; selected: boolean; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 200,
      friction: 7,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 7,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <ImageBackground
          source={{ uri: item.imagen }}
          style={styles.municipioCard}
          imageStyle={styles.municipioCardImage}
          onLoadStart={() => setImageLoaded(false)}
          onLoadEnd={() => setImageLoaded(true)}
        >
          <LinearGradient
            colors={selected ? 
              ['rgba(0,0,0,0.2)', `rgba(0,0,0,0.85)`] : 
              ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.75)']
            }
            style={styles.municipioCardGradient}
          >
            {/* Badge de destacado */}
            {item.destacado && !selected && (
              <View style={styles.featuredBadge}>
                <LinearGradient
                  colors={item.gradient}
                  style={styles.featuredBadgeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="star" size={10} color="#fff" />
                  <Text style={styles.featuredBadgeText}>Popular</Text>
                </LinearGradient>
              </View>
            )}
            
            {/* Indicador de selección */}
            {selected && (
              <View style={styles.selectedOverlay}>
                <LinearGradient
                  colors={['rgba(16,185,129,0.9)', 'rgba(5,150,105,0.9)']}
                  style={styles.selectedOverlayGradient}
                >
                  <Ionicons name="checkmark-circle" size={32} color="#fff" />
                  <Text style={styles.selectedText}>Seleccionado</Text>
                </LinearGradient>
              </View>
            )}
            
            {/* Contenido principal */}
            <View style={styles.municipioCardContent}>
              <View style={styles.municipioHeader}>
                <Text style={styles.municipioEmoji}>{item.emoji}</Text>
                <View style={styles.lugaresCount}>
                  <Text style={styles.lugaresCountText}>{item.lugares}</Text>
                  <Text style={styles.lugaresCountLabel}>lugares</Text>
                </View>
              </View>
              
              <Text style={styles.municipioName}>{item.nombre}</Text>
              <Text style={styles.municipioDescription}>{item.descripcion}</Text>
              
              <View style={styles.municipioFooter}>
                <View style={styles.exploreButton}>
                  <Text style={styles.exploreButtonText}>
                    {selected ? '✓ Explorando' : 'Explorar'}
                  </Text>
                  {!selected && (
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  )}
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('todos');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Hook de favoritos
  const { toggleFavorite, isFavorite, favorites } = useFavorites();

  // Limpiar datos corruptos de AsyncStorage (solo una vez al inicio)
  useEffect(() => {
    const cleanFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('@Rutopia:favorites');
        if (stored) {
          const parsed = JSON.parse(stored);
          // Verificar si los datos son válidos
          if (!Array.isArray(parsed)) {
            console.log('🗑️ Datos corruptos detectados, limpiando...');
            await AsyncStorage.removeItem('@Rutopia:favorites');
          }
        }
      } catch (error) {
        console.error('Error limpiando datos:', error);
      }
    };
    cleanFavorites();
  }, []);

  // Log para debugging
  useEffect(() => {
    console.log('📊 Total de favoritos actual:', favorites.length);
    favorites.forEach(fav => {
      console.log('   -', fav.nombre, '(ID:', fav.id, ')');
    });
  }, [favorites]);

  const lugaresFiltrados = lugares.filter(lugar => {
    const matchMunicipio = municipioSeleccionado === 'todos' || lugar.municipio === municipioSeleccionado;
    const matchCategoria = categoriaSeleccionada === 'all' || lugar.categoria === categoriaSeleccionada;
    const matchSearch = searchQuery === '' || 
                       lugar.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       lugar.municipio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMunicipio && matchCategoria && matchSearch;
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={12} color="#fbbf24" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const handleToggleFavorite = async (item: Lugar) => {
    console.log('🔄 Toggle favorito:', item.nombre, 'ID:', item.id);
    
    const lugarFavorito = {
      id: item.id,
      nombre: item.nombre,
      municipio: item.municipio,
      categoria: item.categoria,
      rating: item.rating,
      tiempo: item.tiempo,
      descripcion: item.descripcion,
      imagen: item.imagen,
      emoji: item.emoji || '📍'
    };
    
    try {
      const result = await toggleFavorite(lugarFavorito);
      console.log('Resultado toggle:', result);
      
      if (result) {
        Alert.alert('❤️ Agregado', `${item.nombre} ha sido agregado a favoritos`);
      } else {
        Alert.alert('💔 Eliminado', `${item.nombre} ha sido eliminado de favoritos`);
      }
    } catch (error) {
      console.error('Error en toggleFavorite:', error);
      Alert.alert('Error', 'No se pudo completar la acción');
    }
  };

  const renderLugarCard = ({ item }: { item: Lugar }) => {
    const isFav = isFavorite(item.id);
    
    return (
      <TouchableOpacity
        style={styles.lugarCard}
        onPress={() => router.push(`/(tabs)/place-detail?id=${item.id}`)}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: item.imagen }}
          style={styles.cardImage}
          imageStyle={styles.cardImageStyle}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.cardGradient}
          >
            {/* Botón de favorito */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite(item);
              }}
            >
              <LinearGradient
                colors={isFav ? ['#ef4444', '#dc2626'] : ['#334155', '#1e293b']}
                style={styles.favoriteButtonGradient}
              >
                <Ionicons 
                  name={isFav ? "heart" : "heart-outline"} 
                  size={18} 
                  color={isFav ? "#fff" : "#94a3b8"} 
                />
              </LinearGradient>
            </TouchableOpacity>

            {item.destacado && (
              <View style={styles.destacadoBadge}>
                <Ionicons name="star" size={10} color="#fff" />
                <Text style={styles.destacadoText}>Destacado</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.nombre}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.descripcion}
              </Text>
              <View style={styles.cardFooter}>
                <View style={styles.cardMeta}>
                  <Ionicons name="location-outline" size={10} color="#e2e8f0" />
                  <Text style={styles.cardMetaText}>{item.municipio}</Text>
                  <View style={styles.metaDivider} />
                  <Ionicons name="time-outline" size={10} color="#e2e8f0" />
                  <Text style={styles.cardMetaText}>{item.tiempo}</Text>
                </View>
                {renderRating(item.rating)}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1a" />

      {/* Header animado */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={['#0a0f1a', '#0f172a']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerGreeting}>Rutopía</Text>
              <Text style={styles.headerLocation}>Sabana Centro</Text>
            </View>
            <TouchableOpacity style={styles.headerProfile}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.profileGradient}
              >
                <Ionicons name="person-outline" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Header Principal */}
        <LinearGradient
          colors={['#0a0f1a', '#0f172a', '#1e293b']}
          style={styles.mainHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Descubre</Text>
              <Text style={styles.location}>Sabana Centro</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.profileIconGradient}
              >
                <Ionicons name="person" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#10b981" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar lugares, municipios..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#10b981" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* Hero Section */}
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={{ uri: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
              style={styles.heroGradient}
            >
              <Text style={styles.heroTitle}>Explora lo mejor</Text>
              <Text style={styles.heroSubtitle}>
                Descubre los lugares más increíbles de la Sabana Centro
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.heroButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.heroButtonText}>Ver rutas recomendadas</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Municipios Section - Tarjetas horizontales modernas */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.sectionIconBg}
              >
                <Ionicons name="location-outline" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Municipios</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Selecciona tu destino</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.municipiosScroll}
            contentContainerStyle={styles.municipiosContainer}
            decelerationRate="fast"
            snapToInterval={SW * 0.7 + 16}
            snapToAlignment="start"
          >
            {municipiosData.map((mun, index) => (
              <View key={mun.id} style={styles.municipioCardWrapper}>
                <MunicipioCard
                  item={mun}
                  selected={municipioSeleccionado === mun.id}
                  onPress={() => setMunicipioSeleccionado(mun.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.sectionIconBg}
              >
                <Ionicons name="grid-outline" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Categorías</Text>
            </View>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categorias.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategoriaSeleccionada(cat.id)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={categoriaSeleccionada === cat.id ? cat.gradient : ['#1e293b', '#1e293b']}
                  style={[
                    styles.categoryCard,
                    categoriaSeleccionada === cat.id && styles.categoryCardActive
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.categoryEmojiLarge}>{cat.emoji}</Text>
                  <Text style={[
                    styles.categoryName,
                    categoriaSeleccionada === cat.id && styles.categoryNameActive
                  ]}>
                    {cat.nombre}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lugares List */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWithIcon}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.sectionIconBg}
              >
                <Ionicons name="restaurant-outline" size={18} color="#fff" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>
                {municipioSeleccionado === 'todos' ? 'Todos los lugares' : `Lugares en ${municipioSeleccionado}`}
              </Text>
            </View>
            <Text style={styles.resultCount}>{lugaresFiltrados.length} lugares</Text>
          </View>

          {lugaresFiltrados.length > 0 ? (
            <FlatList
              data={lugaresFiltrados}
              renderItem={renderLugarCard}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#334155" />
              <Text style={styles.emptyStateTitle}>No encontramos resultados</Text>
              <Text style={styles.emptyStateText}>
                Intenta con otros filtros o palabras clave
              </Text>
            </View>
          )}
        </View>

        {/* Chatbot CTA */}
        <TouchableOpacity 
          style={styles.chatCta} 
          onPress={() => router.push('/(tabs)/chatbot')} 
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.chatGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.chatLeft}>
              <View style={styles.chatIcon}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
                <View style={styles.chatDot}>
                  <PulsingDot color="#fff" />
                </View>
              </View>
              <View>
                <Text style={styles.chatTitle}>Asistente IA</Text>
                <Text style={styles.chatSub}>¿Qué quieres visitar hoy?</Text>
              </View>
            </View>
            <View style={styles.chatArrow}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
    letterSpacing: 1,
  },
  headerLocation: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainHeader: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
    letterSpacing: 1,
  },
  location: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  profileIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  heroWrapper: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  heroImage: {
    height: 220,
    width: '100%',
  },
  heroImageStyle: {
    borderRadius: 24,
  },
  heroGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#e2e8f0',
    marginBottom: 20,
    lineHeight: 20,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  heroButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  heroButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  // Municipios Scroll Horizontal
  municipiosScroll: {
    flexGrow: 0,
  },
  municipiosContainer: {
    paddingRight: 20,
    gap: 16,
  },
  municipioCardWrapper: {
    width: SW * 0.7,
    height: 280,
  },
  municipioCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  municipioCardImage: {
    borderRadius: 24,
  },
  municipioCardGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  featuredBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  selectedOverlayGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  municipioCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  municipioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  municipioEmoji: {
    fontSize: 48,
  },
  lugaresCount: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  lugaresCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  lugaresCountLabel: {
    fontSize: 9,
    color: '#94a3b8',
  },
  municipioName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 'auto',
    marginBottom: 4,
  },
  municipioDescription: {
    fontSize: 13,
    color: '#e2e8f0',
    marginBottom: 16,
  },
  municipioFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exploreButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  // Categories
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContainer: {
    gap: 12,
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 22,
    minWidth: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardActive: {
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryEmojiLarge: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  categoryNameActive: {
    color: '#fff',
  },
  resultCount: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  // Lugares Cards
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  lugarCard: {
    width: (SW - 56) / 2,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardImage: {
    flex: 1,
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 14,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  favoriteButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  destacadoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  destacadoText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContent: {
    gap: 6,
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardDescription: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardMetaText: {
    fontSize: 9,
    color: '#cbd5e1',
  },
  metaDivider: {
    width: 1,
    height: 8,
    backgroundColor: '#475569',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  chatCta: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 8,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
  },
  chatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  chatIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chatDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.3,
  },
  chatSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: 2,
  },
  chatArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});