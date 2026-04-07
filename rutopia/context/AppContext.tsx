import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalVisits: number;
  favoriteCategories: string[];
}

export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  category: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface AppContextType {
  user: User | null;
  favorites: string[];
  addFavorite: (placeId: string) => void;
  removeFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  updateUser: (user: Partial<User>) => void;
  places: Place[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadUserData();
    loadFavorites();
    loadPlaces();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Usuario por defecto
        const defaultUser: User = {
          id: '1',
          name: 'Carlos Pérez',
          email: 'carlos@example.com',
          avatar: 'https://via.placeholder.com/100',
          joinDate: '2024-01-15',
          totalVisits: 12,
          favoriteCategories: ['Naturaleza', 'Miradores'],
        };
        setUser(defaultUser);
        await AsyncStorage.setItem('user', JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadPlaces = async () => {
    // Importar lugares desde data.ts
    const { places: loadedPlaces } = await import('../constants/data');
    setPlaces(loadedPlaces);
  };

  const addFavorite = async (placeId: string) => {
    const newFavorites = [...favorites, placeId];
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFavorite = async (placeId: string) => {
    const newFavorites = favorites.filter(id => id !== placeId);
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (placeId: string) => {
    return favorites.includes(placeId);
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        updateUser,
        places,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};