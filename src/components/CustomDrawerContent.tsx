import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props: any) {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* Cabeçalho do Usuário */}
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: user?.imageUrl }} 
            style={styles.avatar} 
          />
          <Text style={styles.username}>{user?.fullName || 'Usuário'}</Text>
          <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        {/* Itens de Navegação Padrão (Início, etc) */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Botão de Sair no Rodapé */}
      <View style={styles.footer}>
        <DrawerItem
          label="Sair"
          icon={({ color }: any) => <Ionicons name="log-out-outline" size={22} color={color} />}
          onPress={handleSignOut}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userInfo: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 10 },
  username: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' },
  footer: { borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 20 },
});