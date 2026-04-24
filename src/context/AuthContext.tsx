import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native'; 
import * as SecureStore from 'expo-secure-store';
import * as BackgroundFetch from 'expo-background-fetch'; 
import * as TaskManager from 'expo-task-manager';       
import { useRouter, useSegments } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SiriusApi } from '../services/SiriusApi';
import { registerForPushNotificationsAsync } from '../services/NotificationService';

const USER_STORAGE_KEY = 'Sirius_user_data_v1';
const TASK_NAME = 'BACKGROUND_CHAMADOS_MONITOR';

// Usuário Hardcoded para DEV
const DEV_USER = { 
  id: "999", 
  name: "Henrique Dev", 
  email: "seidytoma@gmail.com",
  photoUrl: "https://github.com/github.png"
};

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  // 1. Configuração do Google Sign-In e Carga Inicial
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '269517653130-co21qc89mu9ssmi19l8qb5o26nh30esn.apps.googleusercontent.com',
      offlineAccess: true,
    });
    loadStorageData();
  }, []);

  // 2. Proteção de Rotas e Redirecionamento Automático
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!user && inAuthGroup) {
      // Se não há usuário e tenta entrar nas abas, vai para login
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      // Se já está logado e está fora das abas, vai para a Home
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  async function loadStorageData() {
    try {
      const storedUser = await SecureStore.getItemAsync(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Erro silencioso ao ler storage:', error);
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY).catch(() => {});
    } finally {
      setIsLoading(false);
    }
  }

  // --- LOGIN BACKDOOR (Modo Desenvolvedor) ---
  async function signInAsDev() {
    try {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500));
      
      setUser(DEV_USER);
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(DEV_USER));
      return { success: true };
    } catch (e) {
      console.log(e);
      return { success: false, error: "Erro no bypass" };
    } finally {
      setIsLoading(false);
    }
  }

  // --- LOGIN REAL (Google) ---
  async function signInWithGoogle(googleUser: any) {
    const email = googleUser.email;

    if (!email) {
      return { success: false, error: 'Email inválido do Google' };
    }

    try {
      const pushToken = await registerForPushNotificationsAsync();
      
      // Captura os tokens atuais do Google
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;

      // Envia o e-mail e o accessToken para o GAS
      const response = await SiriusApi.login(email, pushToken, accessToken);

      if (response?.success) {
        const userData = {
          ...response.user,
          photoUrl: googleUser.picture || googleUser.photo,
        };

        setUser(userData);
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(userData));

        if (pushToken && userData.usuario_id) {
            SiriusApi.savePushToken(userData.usuario_id, pushToken).catch(() => {});
        }

        return { success: true };
      }

      return { success: false, error: response?.error || 'E-mail não cadastrado no Sirius' };

    } catch (error: any) {
      console.log("Erro Login:", error);
      Alert.alert("Erro", "Não foi possível realizar o login. Tente novamente.");
      return { success: false, error: error.message };
    }
  }

  // === SIGNOUT ROBUSTO ===
  async function signOut() {
    setIsLoading(true);
    try {
      // 1. Limpa o Token no Backend
      if (user && user.usuario_id) {
        try {
           await SiriusApi.removePushToken(user.usuario_id);
        } catch (e) {}
      }

      // 2. Limpa o Auth Nativo do Google
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }
      } catch (e) {
        console.log("⚠️ Erro no Google SignOut nativo:", e);
      }

      // 3. Desregistra tarefas de Background
      try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
        if (isRegistered) {
          await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
        }
      } catch (e) {}

      // 4. Limpa dados locais
      await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      
      // 5. Reseta estado
      setUser(null);

    } catch (error) {
      console.log("Erro crítico ao sair:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signInAsDev, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
