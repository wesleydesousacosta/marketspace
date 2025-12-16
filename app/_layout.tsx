import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDbMigrations } from '../src/db/client'; // <--- Importe o hook novo

// Cache de token para persistir sessão
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_SEU_CLERK_KEY_AQUI';

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  // Roda as migrações do Drizzle automaticamente
  const { success, error } = useDbMigrations();

  useEffect(() => {
    console.log("DB Migration:", success ? "Success" : "Failed", error ? error : "");
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(app)';

    if (isSignedIn && !inTabsGroup) {
      router.replace('/(app)/(tabs)');
    } else if (!isSignedIn) {
      router.replace('/(auth)/login');
    } 
  }, [isSignedIn, isLoaded]);

  // Enquanto o banco não estiver pronto ou o Clerk carregando, mostra loading
  if (!isLoaded || !success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}