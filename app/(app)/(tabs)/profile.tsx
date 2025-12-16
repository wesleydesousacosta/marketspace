import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  
  // Puxa o whatsapp salvo nos metadados ou inicia vazio
  const [whatsapp, setWhatsapp] = useState(user?.unsafeMetadata?.whatsapp as string || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!isLoaded || !user) return;

    setIsSaving(true);
    try {
      // A MÁGICA: Salvamos o dado direto no objeto do usuário no Clerk
      await user.update({
        unsafeMetadata: {
          whatsapp: whatsapp,
        },
      });
      
      Alert.alert("Sucesso", "Perfil atualizado! Seus próximos anúncios usarão este contato.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>WhatsApp Padrão para Vendas</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            value={whatsapp}
            onChangeText={setWhatsapp}
            placeholder="(DD) 99999-9999"
            keyboardType="phone-pad"
          />
        </View>
        <Text style={styles.helperText}>
          Este número será preenchido automaticamente quando você criar um novo anúncio.
        </Text>

        <TouchableOpacity 
          style={styles.saveBtn} 
          onPress={handleSaveProfile}
          disabled={isSaving}
        >
          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Salvar Dados</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut()}>
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666' },
  
  form: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 2 },
  label: { fontWeight: 'bold', marginBottom: 10, color: '#333' },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', 
    borderWidth: 1, borderColor: '#DDD', borderRadius: 8, 
    paddingHorizontal: 10, height: 50, backgroundColor: '#FAFAFA' 
  },
  input: { flex: 1, fontSize: 16 },
  helperText: { fontSize: 12, color: '#888', marginTop: 8, marginBottom: 20 },
  
  saveBtn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: 'white', fontWeight: 'bold' },

  logoutBtn: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    marginTop: 30, gap: 8 
  },
  logoutText: { color: '#FF3B30', fontWeight: 'bold' }
});