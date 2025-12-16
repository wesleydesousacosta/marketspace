import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FloatingButtonProps {
  href?: string; // Rota para onde vai navegar (padrão: /(app)/add)
}

export function FloatingButton({ href = '/(app)/add' }: FloatingButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8}
      onPress={() => router.push(href as any)}
    >
      <Ionicons name="add" size={32} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24, // Distância do fundo
    right: 24,  // Distância da direita
    width: 60,
    height: 60,
    borderRadius: 30, // Metade da largura para ficar redondo
    backgroundColor: '#007AFF', // Cor principal do App
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Garante que fique por cima de tudo
    
    // Sombras (iOS)
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    
    // Sombras (Android)
    elevation: 8,
  },
});