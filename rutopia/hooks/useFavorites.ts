import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@Rutopia:favorites';

export interface LugarFavorito {
  id: string;
  nombre: string;
  municipio: string;
  categoria: string;
  rating: number;
  tiempo: string;
  descripcion: string;
  imagen: string;
  emoji: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<LugarFavorito[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      console.log('📱 Cargando favoritos desde storage:', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        console.log('✅ Favoritos cargados:', parsed.length);
      } else {
        console.log('📭 No hay favoritos guardados');
        setFavorites([]);
      }
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: LugarFavorito[]) => {
    try {
      console.log('💾 Guardando favoritos:', newFavorites.length);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      console.log('✅ Favoritos guardados correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error saving favorites:', error);
      return false;
    }
  };

  const addFavorite = async (lugar: LugarFavorito) => {
    console.log('➕ Intentando agregar favorito:', lugar.nombre, 'ID:', lugar.id);
    const exists = favorites.some(fav => fav.id === lugar.id);
    
    if (!exists) {
      const newFavorites = [...favorites, lugar];
      const success = await saveFavorites(newFavorites);
      if (success) {
        console.log('✅ Favorito agregado. Total:', newFavorites.length);
      }
      return success;
    } else {
      console.log('⚠️ El lugar ya está en favoritos');
      return false;
    }
  };

  const removeFavorite = async (lugarId: string) => {
    console.log('➖ Intentando eliminar favorito ID:', lugarId);
    const exists = favorites.some(fav => fav.id === lugarId);
    
    if (exists) {
      const newFavorites = favorites.filter(fav => fav.id !== lugarId);
      const success = await saveFavorites(newFavorites);
      if (success) {
        console.log('✅ Favorito eliminado. Restantes:', newFavorites.length);
      }
      return success;
    } else {
      console.log('⚠️ El lugar no estaba en favoritos');
      return false;
    }
  };

  const isFavorite = (lugarId: string): boolean => {
    const isFav = favorites.some(fav => fav.id === lugarId);
    console.log(`🔍 Verificando ${lugarId}: ${isFav}`);
    return isFav;
  };

  const toggleFavorite = async (lugar: LugarFavorito) => {
    console.log('🔄 Toggle favorito:', lugar.nombre);
    const isFav = isFavorite(lugar.id);
    
    if (isFav) {
      const result = await removeFavorite(lugar.id);
      return !result;
    } else {
      const result = await addFavorite(lugar);
      return result;
    }
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};