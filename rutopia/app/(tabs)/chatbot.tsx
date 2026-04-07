import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { places } from '../../constants/data';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const suggestions = [
  '¿Cómo llego al Cerro de Valvanera?',
  'Mejores lugares para comer en Cajicá',
  'Lugares para ir con niños',
  'Horarios de atención',
  '¿Qué hacer en Chía?',
  'Precios de entrada',
];

const chatbotResponses: { [key: string]: string } = {
  'como llegar al cerro de valvanera': 'Para llegar al Cerro de Valvanera en Cajicá, puedes tomar la ruta desde el parque principal hacia el norte. El acceso es por la vía que sube por la carrera 4. Puedes llegar en carro particular o tomar un taxi desde el centro. El ascenso es de aproximadamente 2 horas a pie. ¿Necesitas coordenadas de ubicación?',
  'mejores lugares para comer': 'Los mejores restaurantes en la zona son: 1. Restaurante La Sabana (comida tradicional colombiana), 2. Andrés Carne de Res (experiencia única en Chía), 3. Hacienda El Novillero (cocina gourmet). Todos tienen excelentes calificaciones. ¿Quieres más detalles de alguno?',
  'lugares para ir con niños': 'Excelentes opciones para niños: Parque Ecológico Cajicá (senderos y picnic), Puente del Común (historia y espacios abiertos), Laguna de Tabío (observación de aves y caminatas suaves). Todos son espacios seguros y familiares.',
  'horarios de atencion': 'Los horarios varían según el lugar. La mayoría de atractivos abren de 8:00 AM a 6:00 PM. Los restaurantes suelen atender de 12:00 PM a 10:00 PM. ¿Te interesa algún lugar en específico?',
  'que hacer en chia': 'En Chía puedes visitar: El Parque Principal (vida cultural), Puente del Común (monumento histórico), Hacienda Yerbabuena (museo de Bolívar) y Andrés Carne de Res (gastronomía y fiesta). ¿Quieres más detalles de alguno?',
  'precios de entrada': 'Los precios varían: Lugares naturales como el Cerro de Valvanera y Laguna de Tabío son gratis. Atractivos culturales como Hacienda Yerbabuena cuestan alrededor de $10,000. Restaurantes tienen precios desde $30,000 por persona. ¿Te interesa algún lugar específico?',
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual de Rutopía 🌿. ¿En qué puedo ayudarte hoy? Puedo ayudarte con ubicaciones, horarios, precios y recomendaciones de lugares en Cajicá, Chía y Tabío.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const getResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Buscar coincidencias exactas
    for (const [key, response] of Object.entries(chatbotResponses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    
    // Buscar lugares específicos
    const placeMatch = places.find(place => 
      lowerQuestion.includes(place.name.toLowerCase())
    );
    
    if (placeMatch) {
      return `📍 **${placeMatch.name}**\n\n${placeMatch.description}\n\n⏰ Horario: ${placeMatch.schedule || 'No especificado'}\n💰 Precio: ${placeMatch.price || 'No especificado'}\n⭐ Calificación: ${placeMatch.rating}\n\n¿Necesitas ayuda con algo más?`;
    }
    
    // Respuesta genérica
    return `Gracias por tu pregunta. Puedo ayudarte con:\n\n📍 Ubicación de lugares\n🍽️ Recomendaciones gastronómicas\n⏰ Horarios de atención\n💰 Precios de entrada\n👨‍👩‍👧 Lugares familiares\n\n¿Podrías ser más específico sobre lo que necesitas?`;
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      
      // Auto-scroll al final
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    setTimeout(() => sendMessage(), 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.isUser ? styles.userRow : styles.botRow]}>
      {!item.isUser && (
        <View style={styles.botAvatar}>
          <Ionicons name="leaf" size={20} color="#4ade80" />
        </View>
      )}
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
      </View>
      {item.isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#4ade80" />
          <Text style={styles.headerTitle}>Asistente Rutopía</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Sugerencias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsContainer}
        contentContainerStyle={styles.suggestionsContent}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => handleSuggestion(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu pregunta..."
          placeholderTextColor="#86a892"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0a2e12',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#4ade80',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: '#86a892',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  suggestionsContainer: {
    maxHeight: 50,
    marginBottom: 12,
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#4ade80',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#4ade80',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
});