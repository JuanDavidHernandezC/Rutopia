export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  category: string;
  duration?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  schedule?: string;
  price?: string;
  emoji?: string;
  tiempo?: string;
  municipio?: string;
  categoria?: string;
  destacado?: boolean;
}

export const places: Place[] = [
  // CAJICÁ
  {
    id: '1',
    name: 'Cerro de Valvanera',
    description: 'Mirador natural con vista panorámica a toda la Sabana Centro. Ideal para senderismo, fotografía y conexión con la naturaleza.',
    image: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    location: 'Cajicá',
    category: 'Miradores',
    duration: '2h',
    emoji: '⛰️',
    tiempo: '2h',
    municipio: 'Cajicá',
    categoria: 'naturaleza',
    destacado: true,
  },
  {
    id: '2',
    name: 'Restaurante La Sabana',
    description: 'Cocina tradicional colombiana con productos frescos de la región. Ambiente familiar y los mejores ajiacos.',
    image: 'https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    location: 'Cajicá',
    category: 'Gastronomía',
    duration: '1-2h',
    emoji: '🍲',
    tiempo: '1-2h',
    municipio: 'Cajicá',
    categoria: 'gastronomia',
    destacado: false,
  },
  {
    id: '3',
    name: 'Parque Ecológico Cajicá',
    description: 'Reserva natural con senderos ecológicos, avistamiento de aves y zonas de picnic.',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    location: 'Cajicá',
    category: 'Parques',
    duration: '3h',
    emoji: '🌳',
    tiempo: '3h',
    municipio: 'Cajicá',
    categoria: 'naturaleza',
    destacado: false,
  },
  {
    id: '4',
    name: 'Plaza de Chía',
    description: 'Centro histórico con arquitectura colonial, rodeado de cafés y la icónica catedral.',
    image: 'https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    location: 'Chía',
    category: 'Cultural',
    duration: '1-2h',
    emoji: '🏛️',
    tiempo: '1-2h',
    municipio: 'Chía',
    categoria: 'cultura',
    destacado: true,
  },
  {
    id: '5',
    name: 'Termas de Tabio',
    description: 'Aguas termales naturales rodeadas de naturaleza. Relax y bienestar.',
    image: 'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    location: 'Tabio',
    category: 'Aventura',
    duration: '3h',
    emoji: '♨️',
    tiempo: '3h',
    municipio: 'Tabio',
    categoria: 'aventura',
    destacado: true,
  },
];

// Función para obtener todos los lugares en el formato que usa index.tsx
export const getAllLugares = () => {
  return places.map(place => ({
    id: place.id,
    nombre: place.name,
    municipio: place.municipio || place.location,
    categoria: place.categoria || place.category.toLowerCase(),
    rating: place.rating,
    tiempo: place.tiempo || place.duration || '1h',
    descripcion: place.description,
    imagen: place.image,
    destacado: place.destacado || false,
    emoji: place.emoji || '📍'
  }));
};

// Función para obtener un lugar por ID
export const getPlaceById = (id: string): Place | undefined => {
  return places.find(place => place.id === id);
};