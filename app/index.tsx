import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();
    
  
  const handleStart = () => {
    (isLoaded && isSignedIn) 
    ? router.push('/(app)/(tabs)')
    : router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Imagem de Fundo Imersiva */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradiente para suavizar a transição e melhorar leitura */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)', '#000000']}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            
            {/* Animação do Texto Principal */}
            <Animated.View entering={FadeInDown.delay(100).duration(1000).springify()}>
              <View style={styles.iconContainer}>
                <Ionicons name="home" size={32} color="white" />
              </View>
              <Text style={styles.title}>
                Renove seu ambiente com <Text style={styles.highlight}>estilo</Text>
              </Text>
            </Animated.View>

            {/* Animação da Descrição */}
            <Animated.View entering={FadeInDown.delay(300).duration(1000).springify()}>
              <Text style={styles.subtitle}>
                O marketplace definitivo para comprar e vender móveis usados de qualidade. Economize, recicle e decore.
              </Text>
            </Animated.View>

            {/* Animação do Botão */}
            <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleStart}
                activeOpacity={0.9}
              >
                <Text style={styles.buttonText}>Começar Agora</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </Animated.View>
            
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  contentContainer: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 48,
    marginBottom: 16,
  },
  highlight: {
    color: '#4DA6FF', // Um azul claro para destacar
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: '90%',
  },
  button: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});