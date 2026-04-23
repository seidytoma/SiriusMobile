import * as BackgroundFetch from 'expo-background-fetch'; // <--- NOVO
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager'; // <--- NOVO
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { registerForPushNotificationsAsync } from '../services/NotificationService';
import { SiriusApi } from '../services/SiriusApi';



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

  useEffect(() => {
    loadStorageData();
  }, []);

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
    // O pacote do Google Sign-In costuma retornar os dados dentro de um objeto "user"
    const email = googleUser?.user?.email || googleUser?.email;
    const photoUrl = googleUser?.user?.photo || googleUser?.picture;

    if (!email) {
      return { success: false, error: 'Não foi possível extrair o e-mail da conta Google.' };
    }

    try {
      // 1. Gera o Token (Silenciosamente)
      // Se falhar ou vier nulo, o app continua funcionando, apenas sem push.
      let pushToken = '';
      try {
        pushToken = await registerForPushNotificationsAsync() || '';
      } catch (tokenError) {
        console.log("Aviso: Falha ao obter Push Token (ignorado para prosseguir o login).", tokenError);
      }
      
      // 2. Faz o login enviando o token junto
      const response = await SiriusApi.login(email, pushToken);

      if (response?.success) {
        const userData = {
          ...response.user,
          photoUrl: photoUrl,
        };

        setUser(userData);
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(userData));

        // 3. SEGURANÇA EXTRA (Garante que salvou na planilha nos bastidores)
        if (pushToken && userData.id) {
            SiriusApi.savePushToken(userData.id, pushToken).catch(() => {
              // Falha silenciosa: não precisa assustar o usuário se isso falhar
            });
        }

        return { success: true };
      }

      // Retorna o erro REAL do servidor. Se for vazio, significa que o servidor nem reconheceu a rota 'login'
      return { success: false, error: response?.error || 'Servidor desatualizado. Realize uma "Nova Implantação" no Apps Script.' };

    } catch (error: any) {
      console.log("Erro Login:", error);
      Alert.alert("Erro", "Não foi possível realizar o login. Tente novamente.");
      return { success: false, error: error.message };
    }
  }

  // === SIGNOUT ROBUSTO (CORRIGIDO) ===
  async function signOut() {
    setIsLoading(true); // Bloqueia a UI durante o processo
    try {
      // 1. Limpa o Token no Backend (Para as notificações)
      if (user && user.id) {
        try {
           await SiriusApi.removePushToken(user.id);
           console.log("✅ Token removido do servidor.");
        } catch (e) {
           console.log("⚠️ Falha ao remover token do servidor (sem internet?), ignorando...");
        }
      }

      // 2. Limpa o Auth Nativo do Google (CORRIGE O LOOP NO LOGIN)
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          await GoogleSignin.revokeAccess(); // Remove permissão (garante popup de escolha)
          await GoogleSignin.signOut();      // Desloga da sessão nativa
          console.log("✅ Google SignOut nativo realizado.");
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
      
      // 5. Reseta estado visual (FINALMENTE)
      setUser(null);

    } catch (error) {
      console.log("Erro crítico ao sair:", error);
      setUser(null); // Força saída mesmo com erro
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
