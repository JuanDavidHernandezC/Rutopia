import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, ScrollView, Dimensions, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../../hooks/useFavorites';
import { router } from 'expo-router';

const { width: SW } = Dimensions.get('window');

export default function Favorites() {
  const { favorites, loading, removeFavorite } = useFavorites();

  console.log('📱 Pantalla de favoritos - cantidad:', favorites.length);

  const renderRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={12} color="#fbbf24" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const handleRemoveFavorite = async (id: string, nombre: string) => {
    Alert.alert(
      'Quitar de favoritos',
      `¿Deseas eliminar "${nombre}" de tus favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            const success = await removeFavorite(id);
            if (success) {
              console.log('✅ Eliminado de favoritos:', nombre);
            } else {
              Alert.alert('Error', 'No se pudo eliminar de favoritos');
            }
          }
        }
      ]
    );
  };

  const renderLugarCard = ({ item }: { item: any }) => {
    console.log('Renderizando tarjeta:', item.nombre);
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
            {/* Botón de quitar favorito */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(e) => {
                e.stopPropagation();
                handleRemoveFavorite(item.id, item.nombre);
              }}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.favoriteButtonGradient}
              >
                <Ionicons name="heart" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>{item.emoji || '📍'}</Text>
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient
          colors={['#0a0f1a', '#0f172a']}
          style={styles.loadingContainer}
        >
          <Text style={styles.loadingText}>Cargando tus favoritos...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0f1a', '#0f172a']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Favoritos</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          {favorites.length} {favorites.length === 1 ? 'lugar guardado' : 'lugares guardados'}
        </Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            renderItem={renderLugarCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
          />
        ) : (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              style={styles.emptyStateCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="heart-outline" size={80} color="#ef4444" />
              <Text style={styles.emptyStateTitle}>No tienes favoritos aún</Text>
              <Text style={styles.emptyStateText}>
                Explora lugares y toca el corazón ❤️ para guardar tus destinos favoritos
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/(tabs)/index')}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.exploreButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.exploreButtonText}>Explorar lugares</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1a',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0f1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '500',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 20,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  emptyStateCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});