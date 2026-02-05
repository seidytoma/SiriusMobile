import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as Notifications from 'expo-notifications';

// 1. O RootLayout APENAS fornece o Provider. 
// Ele NÃO pode usar o useAuth, pois ele "cria" o auth.
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}

// 2. Este componente interno JÁ ESTÁ dentro do Provider, então pode usar useAuth.
function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // --- LISTENER DE NOTIFICAÇÕES (Ouvido Global) ---
  useEffect(() => {
    // Escuta cliques na notificação ou nos botões de ação dela
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const actionId = response.actionIdentifier;
      const data = response.notification.request.content.data;
      
      // Se a notificação tem um ID de chamado vinculado
      if (data?.chamado_id) {
        
        // Verifica se o clique foi especificamente no botão "ATENDER"
        // (Definido no NotificationService.js como 'ATENDER')
        const shouldAutoStart = actionId === 'ATENDER';

        console.log(`[Notification] Ação: ${actionId}, AutoStart: ${shouldAutoStart}`);

        // Navega diretamente para a tela de detalhes
        router.push({
          pathname: "/(tabs)/chamados/[id]",
          params: { 
            id: data.chamado_id, 
            // Passamos o dado completo (JSON string) se tiver, para agilizar a UI (Optimistic)
            data: data.chamado_data ? data.chamado_data : undefined,
            // Flag mágica que o [id].tsx vai ler para rodar o handleAtender() sozinho
            autoStart: shouldAutoStart ? 'true' : 'false' 
          }
        });
      }
    });

    return () => subscription.remove();
  }, []);

  // --- PROTEÇÃO DE ROTAS (Auth Guard) ---
  useEffect(() => {
    if (isLoading) return;

    // Verifica se está tentando acessar as abas (área logada)
    const inAuthGroup = segments[0] === '(tabs)';

    if (!user && inAuthGroup) {
      // Se não tem usuário e tenta entrar no app, manda pro login
      router.replace('/login');
    } else if (user && !inAuthGroup) {
      // Se já tem usuário e está no login, manda pra home
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#003366' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  // Renderiza a rota atual (seja login ou tabs)
  return <Slot />;
}