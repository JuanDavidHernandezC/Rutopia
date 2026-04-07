import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { places, Place } from '../../constants/data';

const municipalities = ['Todos', 'Cajicá', 'Chía', 'Tabío'];

export default function Explore() {
  const [selectedMunicipality, setSelectedMunicipality] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = places.filter(place => {
    const matchesMunicipality = selectedMunicipality === 'Todos' || 
      place.location.includes(selectedMunicipality);
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMunicipality && matchesSearch;
  });

  const renderPlace = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={styles.placeCard}
      onPress={() => router.push(`/(tabs)/place-detail?id=${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.placeImage} />
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <View style={styles.placeLocation}>
          <Ionicons name="location-outline" size={14} color="#86a892" />
          <Text style={styles.placeLocationText}>{item.location}</Text>
        </View>
        <View style={styles.placeRating}>
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Text style={styles.placeRatingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#86a892" />
        <TextInput
          style={styles.searchInput}
          placeholder="Busca lugares, rutas, experiencias..."
          placeholderTextColor="#86a892"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtro por municipios */}
      <View style={styles.municipalitiesContainer}>
        <Text style={styles.sectionTitle}>Por municipio</Text>
        <FlatList
          data={municipalities}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.municipalityChip,
                selectedMunicipality === item && styles.municipalityChipActive,
              ]}
              onPress={() => setSelectedMunicipality(item)}
            >
              <Text
                style={[
                  styles.municipalityText,
                  selectedMunicipality === item && styles.municipalityTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
      </View>

      {/* Lista de lugares */}
      <FlatList
        data={filteredPlaces}
        renderItem={renderPlace}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron lugares</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  municipalitiesContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a2e12',
    marginBottom: 12,
  },
  municipalityChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  municipalityChipActive: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  municipalityText: {
    fontSize: 14,
    color: '#666',
  },
  municipalityTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: 100,
    height: 100,
  },
  placeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a2e12',
    marginBottom: 4,
  },
  placeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  placeLocationText: {
    fontSize: 12,
    color: '#86a892',
  },
  placeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  placeRatingText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#86a892',
  },
});