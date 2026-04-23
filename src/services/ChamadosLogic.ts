// src/services/ChamadosLogic.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { SiriusApi } from './SiriusApi';
import { sendLocalEscalationNotification } from './NotificationService';

const CACHE_CHAMADOS = '@Sirius:chamados_cache';
const CACHE_SETORES_IDS = '@Sirius:meus_setores_ids';
const CACHE_ALERT_HISTORY = '@Sirius:alert_history';
const CACHE_NOTIFICADOS = '@Sirius:chamados_notificados';
const CACHE_TIMESTAMP_SERVER = '@Sirius:last_server_timestamp';

// Configuração da "Campainha Infinita"
// 60 notificações * 5 segundos = 5 minutos de barulho ininterrupto.
// O ciclo é reiniciado pelo background fetch ou pela interação do usuário.
const RING_BATCH_COUNT = 60; 
const RING_INTERVAL_SEC = 5;

/**
 * Gera um ID único para cada "toque" da campainha, permitindo cancelamento cirúrgico.
 */
const getRingNotificationId = (chamadoId: string | number, index: number) => `ring_${chamadoId}_${index}`;

/**
 * Cancela especificamente a sequência de campainha de um chamado,
 * sem afetar alertas de escalonamento ou outros chamados.
 */
export async function stopRinging(chamadoId: string | number) {
    console.log(`[Logic] Parando campainha para chamado ${chamadoId}...`);
    for (let i = 0; i < RING_BATCH_COUNT; i++) {
        await Notifications.cancelScheduledNotificationAsync(getRingNotificationId(chamadoId, i));
    }
}

/**
 * "Soneca": Cancela o toque atual e reagenda para daqui a X minutos.
 * Usado quando o usuário abre o app mas não atende o chamado imediatamente.
 */
export async function snoozeRinging(chamadoId: string | number, chamadoData: any, delayMinutes = 2) {
    console.log(`[Logic] Soneca ativada para chamado ${chamadoId} por ${delayMinutes} min.`);
    await stopRinging(chamadoId);
    // Reagenda a sequência para começar no futuro
    await scheduleRingingBatch(chamadoData, delayMinutes * 60);
}

/**
 * Verifica novos chamados e agenda notificações.
 * @param forceDownload Se true, ignora o Smart Sync e baixa tudo.
 * @param globalRingingDelay Delay em segundos para o início da campainha (usado no AppState Active).
 */
export async function verificarEscalonamentoGlobal(forceDownload = false, globalRingingDelay = 0) {
  try {
    const idsStr = await AsyncStorage.getItem(CACHE_SETORES_IDS);
    const idsMeusSetores: string[] = idsStr ? JSON.parse(idsStr) : [];
    
    // --- SMART POLLING ---
    if (!forceDownload) {
       const lastTimeStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_SERVER);
       const lastTime = lastTimeStr ? parseInt(lastTimeStr) : 0;

       console.log(`[Logic] Perguntando ao servidor se há novidades desde: ${lastTime}`);
       const check = await SiriusApi.checkUpdates(lastTime); 
       
       if (!check.hasChanges && lastTime !== 0) {
           console.log("[Logic] Servidor diz: Nada novo.");
           return false;
       }
       
       if (check.serverTimestamp) {
           await AsyncStorage.setItem(CACHE_TIMESTAMP_SERVER, String(check.serverTimestamp));
       }
    }

    console.log("[Logic] Baixando lista completa de chamados...");
    const chamados = await SiriusApi.getChamadosAbertos();

    if (chamados === null) {
        console.log("[Logic] Erro na API. Mantendo cache anterior.");
        return false;
    }

    if (!Array.isArray(chamados)) return false;

    await AsyncStorage.setItem(CACHE_CHAMADOS, JSON.stringify(chamados));

    // --- NOTIFICAÇÕES ---
    const historyStr = await AsyncStorage.getItem(CACHE_ALERT_HISTORY);
    let history = historyStr ? JSON.parse(historyStr) : {};
    
    const notificadosStr = await AsyncStorage.getItem(CACHE_NOTIFICADOS);
    const chamadosJaNotificados: string[] = notificadosStr ? JSON.parse(notificadosStr) : [];
    let novosNotificados = [...chamadosJaNotificados];

    let houveAlerta = false;
    const nowMs = new Date().getTime();

    // Limpa TUDO para garantir que a gente reconstrua a "agenda" correta.
    // Isso garante que se o chamado foi atendido em outro lugar, ele para de tocar aqui.
    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const c of chamados) {
      if (c.chamado_status !== 'Aberto') continue;
      if (!idsMeusSetores.includes(String(c.cc_id))) continue;

      const dataAbertura = new Date(c.chamado_dataabertura).getTime();
      if (isNaN(dataAbertura)) continue;

      const chamadoId = String(c.chamado_id);
      const diffMins = Math.floor((nowMs - dataAbertura) / 60000);

      // --- CAMPAINHA INFINITA ---
      // Se o chamado é novo E é do meu setor, ele deve tocar.
      // A condição "não notificado" serve apenas para o banner inicial de "Novo Chamado".
      // O "loop" de barulho deve acontecer sempre que o chamado estiver Aberto.
      
      const isNew = !chamadosJaNotificados.includes(chamadoId);
      
      // Se for novo, manda o Banner Principal imediatamente (sem delay)
      if (isNew) {
          await dispararBannerInicial(c);
          novosNotificados.push(chamadoId);
          houveAlerta = true;
      }

      // Agenda a sequência de barulho (Loop)
      // Se globalRingingDelay > 0 (ex: app aberto), o barulho só começa depois.
      // Se o chamado é antigo mas ainda não foi atendido, ele continua tocando.
      await scheduleRingingBatch(c, globalRingingDelay);

      // --- ESCALONAMENTO (SLA) ---
      const tempoNivel1 = dataAbertura + (10 * 60 * 1000);
      const tempoNivel2 = dataAbertura + (20 * 60 * 1000);
      const tempoNivel3 = dataAbertura + (30 * 60 * 1000);

      if (tempoNivel1 > nowMs) await agendarFuturo(c, 1, (tempoNivel1 - nowMs)/1000);
      if (tempoNivel2 > nowMs) await agendarFuturo(c, 2, (tempoNivel2 - nowMs)/1000);
      if (tempoNivel3 > nowMs) {
          const delayInicial = (tempoNivel3 - nowMs)/1000;
          await agendarFuturo(c, 3, delayInicial);
          await agendarFuturo(c, 3, delayInicial + 120); 
          await agendarFuturo(c, 3, delayInicial + 240);
      }

      // --- LOG DE HISTÓRICO DE ALERTA ---
      const nivelRegistrado = history[chamadoId] || 0;
      let novoNivel = nivelRegistrado;

      if (diffMins >= 30) {
        if (nivelRegistrado < 3) {
            novoNivel = 3;
            sendLocalEscalationNotification("🔥 CRÍTICO (30min+)", `${c.cc_descricao}: SLA ESTOURADO!`, 3);
        }
        await agendarFuturo(c, 3, 60);
      }
      else if (diffMins >= 20 && diffMins < 30 && nivelRegistrado < 2) {
        novoNivel = 2;
        sendLocalEscalationNotification("🚨 URGENTE (20min)", `${c.cc_descricao}: Atrasado!`, 2);
      }
      else if (diffMins >= 10 && diffMins < 20 && nivelRegistrado < 1) {
        novoNivel = 1;
        sendLocalEscalationNotification("⚠️ Atenção (10min)", `${c.cc_descricao}: Aguardando.`, 1);
      }

      if (novoNivel > nivelRegistrado) {
        history[chamadoId] = novoNivel;
        houveAlerta = true;
      }
    }

    if (houveAlerta) await AsyncStorage.setItem(CACHE_ALERT_HISTORY, JSON.stringify(history));
    if (novosNotificados.length !== chamadosJaNotificados.length) await AsyncStorage.setItem(CACHE_NOTIFICADOS, JSON.stringify(novosNotificados));

    return true; 
  } catch (error) {
    console.log("Erro na lógica de chamados:", error);
    return false;
  }
}

/**
 * Envia apenas o Banner Visual e Sonoro inicial (Uma única vez por chamado)
 */
async function dispararBannerInicial(chamado: any) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🔔 NOVO CHAMADO!",
            body: `${chamado.cc_descricao}: ${chamado.chamado_descricaoproblema}`,
            data: { 
                screen: 'ChamadoDetalhe', 
                chamado_id: chamado.chamado_id,
                chamado_data: JSON.stringify(chamado) 
            },
            categoryIdentifier: 'CHAMADO_ACTION',
            sound: 'bell.wav',
            priority: Notifications.AndroidNotificationPriority.MAX,
            autoDismiss: true,
        },
        trigger: null, // Imediato
    });
}

/**
 * Agenda o lote de notificações repetitivas (Loop Infinito simulado)
 */
async function scheduleRingingBatch(chamado: any, startDelaySeconds: number) {
    const chamadoId = chamado.chamado_id;
    
    for (let i = 0; i < RING_BATCH_COUNT; i++) {
        // Cálculo do tempo: Delay Inicial + (Índice * Intervalo)
        // Ex: Delay 0 -> 0s, 5s, 10s...
        // Ex: Delay 120 -> 120s, 125s, 130s...
        const triggerSeconds = startDelaySeconds + (i * RING_INTERVAL_SEC);
        
        // Se o delay for muito curto (< 1s), o Android pode ignorar, então protegemos.
        // Mas se for 0 e i=0, queremos imediato? Não, o imediato é o Banner.
        // O loop começa um pouco depois para não encavalar o som.
        const safeSeconds = triggerSeconds < 1 ? 1 : triggerSeconds;

        await Notifications.scheduleNotificationAsync({
            identifier: getRingNotificationId(chamadoId, i),
            content: {
                title: "🔔 ATENÇÃO (Chamado Pendente)",
                body: "Toque para atender agora.",
                data: { screen: 'ChamadoDetalhe', chamado_id: chamadoId },
                sound: 'bell.wav', // Som de campainha
                priority: Notifications.AndroidNotificationPriority.HIGH,
                vibrate: [0, 500, 200, 500], // Vibração forte
            },
            trigger: { 
                seconds: safeSeconds, 
                channelId: 'campainha_v2' 
            },
        });
    }
}

async function agendarFuturo(chamado: any, level: number, seconds: number) {
    if (seconds < 1) seconds = 1;
    let title = level === 1 ? "⚠️ Atenção" : level === 2 ? "🚨 URGENTE" : "🔥 CRÍTICO";
    let body = level === 1 ? "10 min sem atendimento" : level === 2 ? "20 min sem atendimento" : "SLA ESTOURADO!";
    let channelId = level === 1 ? 'default' : level === 2 ? 'urgente' : 'critico';
    if (level === 3) body += " - AÇÃO IMEDIATA NECESSÁRIA";

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: `${chamado.cc_descricao}: ${body}`,
        data: { 
            screen: 'ChamadoDetalhe', 
            chamado_id: chamado.chamado_id,
            chamado_data: JSON.stringify(chamado) 
        },
        categoryIdentifier: 'CHAMADO_ACTION',
        sound: true, 
        priority: Notifications.AndroidNotificationPriority.MAX,
        color: level === 3 ? '#D32F2F' : undefined,
        sticky: level === 3, 
      },
      trigger: { seconds: seconds, channelId: channelId },
    });
}
