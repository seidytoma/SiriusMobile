import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuração de como o app se comporta com notificação recebida com app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    // 1. CANAL PADRÃO (Informações gerais)
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Geral',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#003366',
    });

    // 2. CANAL URGENTE (Vibração mais longa)
    await Notifications.setNotificationChannelAsync('urgente', {
      name: 'Urgente (SLA em risco)',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 200, 500], // Vibra, para, vibra
      lightColor: '#FF9500',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });

    // 3. CANAL CRÍTICO (Vibração Insistente/Agressiva)
    await Notifications.setNotificationChannelAsync('critico', {
      name: 'CRÍTICO (Ação Imediata)',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default', 
      enableVibrate: true,
      // Padrão "SOS": Curto, Curto, Curto, Longo, Longo, Longo
      vibrationPattern: [0, 100, 100, 100, 100, 100, 100, 500, 200, 500, 200, 500], 
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true, // Tenta furar o "Não Perturbe"
    });

    // 4. CANAL CAMPAINHA (Novo Chamado)
    await Notifications.setNotificationChannelAsync('campainha_v2', {
      name: 'Novo Chamado (Toque)',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'bell.wav', 
      enableVibrate: true,
      vibrationPattern: [0, 500, 500, 500],
    });
  }

  // --- REGISTRO DE AÇÕES (BOTÕES NA NOTIFICAÇÃO) ---
  // Isso permite que o botão "Atender" apareça na notificação
  await Notifications.setNotificationCategoryAsync('CHAMADO_ACTION', [
    {
      identifier: 'ATENDER',
      buttonTitle: '🚀 INICIAR ATENDIMENTO',
      options: {
        opensAppToForeground: true, // Abre o app para garantir a execução da lógica (Optimistic UI)
      },
    },
  ]);

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return null;
    }

    const projectId = "c3430655-cf00-422c-a9d0-e74896b9545d"; 
    
    try {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.log('Erro ao pegar token:', e);
    }
  }

  return token;
}

// Função auxiliar para notificações locais de escalonamento
export async function sendLocalEscalationNotification(title, body, level, data = {}) {
  let channelId = 'default';
  if (level === 2) channelId = 'urgente';
  if (level === 3) channelId = 'critico';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { ...data, screen: 'ChamadoDetalhe' },
      categoryIdentifier: 'CHAMADO_ACTION', // <--- VINCULA O BOTÃO AQUI
      sound: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
      color: level === 3 ? '#D32F2F' : '#003366',
      sticky: level === 3, // No Android, notificação crítica fica fixa até clicar
    },
    trigger: null, // Imediato
  });
}
