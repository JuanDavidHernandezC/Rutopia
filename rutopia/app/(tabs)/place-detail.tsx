import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../hooks/useFavorites';
import { getPlaceById, getAllLugares } from '../../constants/data';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'María González',
      rating: 5,
      comment: 'Excelente lugar, muy recomendado. La vista es espectacular.',
      date: '2024-03-15',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      id: '2',
      userName: 'Juan Pérez',
      rating: 4,
      comment: 'Muy bonito, aunque el acceso es un poco difícil.',
      date: '2024-03-10',
      avatar: 'https://via.placeholder.com/40',
    },
  ]);

  // Obtener el lugar usando el ID
  const place = getPlaceById(id as string);
  const allLugares = getAllLugares();
  const lugarData = allLugares.find(l => l.id === id);
  
  console.log('📱 PlaceDetail - ID:', id);
  console.log('📱 Place encontrado:', place?.name);
  console.log('📱 LugarData encontrado:', lugarData?.nombre);
  
  const favorite = lugarData ? isFavorite(lugarData.id) : false;
  console.log('❤️ Es favorito:', favorite);

  if (!place || !lugarData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lugar no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFavorite = async () => {
    console.log('🔄 Toggle favorito desde detail:', lugarData.nombre);
    const result = await toggleFavorite({
      id: lugarData.id,
      nombre: lugarData.nombre,
      municipio: lugarData.municipio,
      categoria: lugarData.categoria,
      rating: lugarData.rating,
      tiempo: lugarData.tiempo,
      descripcion: lugarData.descripcion,
      imagen: lugarData.imagen,
      emoji: lugarData.emoji
    });
    
    if (result) {
      Alert.alert('✓ Agregado', `${lugarData.nombre} ha sido agregado a favoritos`);
    } else {
      Alert.alert('✗ Eliminado', `${lugarData.nombre} ha sido eliminado de favoritos`);
    }
  };

  const openMaps = () => {
    if (place.coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.latitude},${place.coordinates.longitude}`;
      Linking.openURL(url);
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${place.location}`;
      Linking.openURL(url);
    }
  };

  const submitReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      userName: 'Tú',
      rating: userRating,
      comment: userComment,
      date: new Date().toISOString().split('T')[0],
      avatar: 'https://via.placeholder.com/40',
    };
    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setUserComment('');
    setUserRating(5);
    Alert.alert('Gracias', 'Tu reseña ha sido publicada');
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#f59e0b"
          />
        ))}
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewUserName}>{item.userName}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        {renderStars(item.rating)}
        <Text style={styles.reviewComment}>{item.comment}</Text>
      </View>
    </View>
  );

  const hours = [
    { day: 'Lunes - Viernes', hours: place.schedule || '9:00 AM - 6:00 PM' },
    { day: 'Sábado', hours: '10:00 AM - 4:00 PM' },
    { day: 'Domingo', hours: 'Cerrado' },
  ];

  const photos = [
    place.image,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400',
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header con imagen */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: place.image }} style={styles.mainImage} />
        <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={28}
            color={favorite ? '#ef4444' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Información principal */}
      <View style={styles.content}>
        <Text style={styles.name}>{place.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color="#86a892" />
          <Text style={styles.location}>{place.location}</Text>
        </View>
        <View style={styles.ratingRow}>
          {renderStars(place.rating)}
          <Text style={styles.ratingText}>{place.rating} (128 reseñas)</Text>
        </View>
        <Text style={styles.category}>{place.category}</Text>
        <Text style={styles.description}>{place.description}</Text>

        {/* Información adicional */}
        {place.duration && (
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#4ade80" />
            <Text style={styles.infoLabel}>Duración:</Text>
            <Text style={styles.infoValue}>{place.duration}</Text>
          </View>
        )}
        
        {place.price && (
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color="#4ade80" />
            <Text style={styles.infoLabel}>Precio:</Text>
            <Text style={styles.infoValue}>{place.price}</Text>
          </View>
        )}

        {/* Botón de mapa */}
        <TouchableOpacity style={styles.mapButton} onPress={openMaps}>
          <Ionicons name="map-outline" size={20} color="#fff" />
          <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
        </TouchableOpacity>

        {/* Horarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios</Text>
          {hours.map((item, index) => (
            <View key={index} style={styles.hourRow}>
              <Text style={styles.hourDay}>{item.day}</Text>
              <Text style={styles.hourTime}>{item.hours}</Text>
            </View>
          ))}
        </View>

        {/* Galería de fotos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Galería</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            {photos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.galleryImage} />
            ))}
          </ScrollView>
        </View>

        {/* Reseñas */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reseñas</Text>
            <TouchableOpacity onPress={() => setShowReviewModal(true)}>
              <Text style={styles.addReviewButton}>+ Agregar reseña</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </View>

      {/* Modal para agregar reseña */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReviewModal}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar reseña</Text>
            
            <Text style={styles.modalLabel}>Tu calificación</Text>
            <View style={styles.modalStars}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                  <Ionicons
                    name={star <= userRating ? 'star' : 'star-outline'}
                    size={32}
                    color="#f59e0b"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Tu comentario</Text>
            <TextInput
              style={styles.modalInput}
              value={userComment}
              onChangeText={setUserComment}
              placeholder="Escribe tu experiencia..."
              placeholderTextColor="#86a892"
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setShowReviewModal(false)}
              >
                <Text style={styles.cancelModalText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitModalButton]}
                onPress={submitReview}
              >
                <Text style={styles.submitModalText}>Publicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  backButtonTop: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a2e12',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#86a892',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  category: {
    backgroundColor: '#f0fdf4',
    color: '#4ade80',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  mapButton: {
    backgroundColor: '#4ade80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a2e12',
    marginBottom: 16,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  hourDay: {
    fontSize: 14,
    color: '#333',
  },
  hourTime: {
    fontSize: 14,
    color: '#86a892',
  },
  gallery: {
    flexDirection: 'row',
  },
  galleryImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#86a892',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a2e12',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelModalButton: {
    backgroundColor: '#f5f5f5',
  },
  submitModalButton: {
    backgroundColor: '#4ade80',
  },
  cancelModalText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitModalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});