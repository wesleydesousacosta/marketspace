import { useSSO, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert,
  Image, KeyboardAvoidingView, Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { useWarmUpBrowser } from '../../src/hooks/useWarmUpBrowser';

// Finaliza sessões pendentes no navegador
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  
  const { startSSOFlow } = useSSO();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Login com E-mail e Senha ---
  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      // Isso ativa a sessão e o _layout.tsx deve redirecionar automaticamente
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Erro", "E-mail ou senha incorretos.");
      setLoading(false);
    }
  };

  // --- Login com Google ---
  const onGoogleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      // O redirectUrl ajuda o Clerk a saber para onde voltar no app nativo
      const { createdSessionId, setActive: setGoogleActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      // Verifica se a sessão foi criada
      if (createdSessionId && setGoogleActive) {
        await setGoogleActive({ session: createdSessionId });
      } else {
        // Caso precise de passos extras (MFA, cadastro incompleto, etc)
        // Normalmente para Google simples isso não acontece
        setLoading(false);
      }
    } catch (err) {
      console.error("Erro OAuth:", err);
      setLoading(false);
    }
  }, []);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              autoCapitalize="none"
              value={email}
              placeholder="Digite seu e-mail"
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              value={password}
              placeholder="Digite sua senha"
              secureTextEntry={true}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={onSignInPress} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divisor */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>ou continue com</Text>
          <View style={styles.line} />
        </View>

        {/* Botão Google Estilizado */}
        <TouchableOpacity style={styles.googleBtn} onPress={onGoogleSignIn} disabled={loading}>
          <Image 
            source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }} 
            style={styles.googleIcon} 
          />
          <Text style={styles.googleBtnText}>Entrar com Google</Text>
        </TouchableOpacity>

        {/* Rodapé (Link para Cadastro) */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          {/* Você precisará criar a rota de cadastro ou usar o SignIn para ambos por enquanto */}
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  
  form: { marginBottom: 24 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    marginBottom: 16, 
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  
  loginBtn: { 
    backgroundColor: '#007AFF', 
    height: 56, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  loginBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  orText: { marginHorizontal: 16, color: '#888', fontSize: 14 },

  googleBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    height: 56, 
    borderRadius: 12,
    marginBottom: 16 
  },
  googleIcon: { width: 24, height: 24, marginRight: 12 },
  googleBtnText: { fontSize: 16, fontWeight: '600', color: '#333' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#007AFF', fontWeight: 'bold', fontSize: 14 }
});