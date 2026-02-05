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

export async function verificarEscalonamentoGlobal(forceDownload = false) {
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

    // PROTEÇÃO CRÍTICA: Se vier null (erro de rede), ABORTA. 
    // Não sobrescreve o cache com vazio. Mantém o que tem lá.
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

    await Notifications.cancelAllScheduledNotificationsAsync();

    for (const c of chamados) {
      if (c.chamado_status !== 'Aberto') continue;
      if (!idsMeusSetores.includes(String(c.cc_id))) continue;

      const dataAbertura = new Date(c.chamado_dataabertura).getTime();
      if (isNaN(dataAbertura)) continue;

      const chamadoId = String(c.chamado_id);
      const diffMins = Math.floor((nowMs - dataAbertura) / 60000);

      // Campainha
      if (!chamadosJaNotificados.includes(chamadoId)) {
          if (diffMins < 15) {
              await dispararCampainha(c);
              novosNotificados.push(chamadoId);
              houveAlerta = true;
          }
      }

      // Escalonamento
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

async function dispararCampainha(chamado: any) {
    const totalRepeticoes = 15; 
    const intervaloSegundos = 3; 
    
    // Notificação Inicial (Com som e botão)
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🔔 NOVO CHAMADO!",
            body: `${chamado.cc_descricao}: ${chamado.chamado_descricaoproblema}`,
            data: { 
                screen: 'ChamadoDetalhe', 
                chamado_id: chamado.chamado_id,
                // AQUI ESTÁ O SEGREDO: Enviamos o objeto todo como string
                chamado_data: JSON.stringify(chamado) 
            },
            categoryIdentifier: 'CHAMADO_ACTION',
            sound: 'bell.wav',
            priority: Notifications.AndroidNotificationPriority.MAX,
            autoDismiss: true,
        },
        trigger: null,
    });

    // As repetições subsequentes (apenas vibração/som para insistência)
    // Não colocamos o botão em todas para não poluir a central
    for (let i = 1; i < totalRepeticoes; i++) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🔔 ATENÇÃO (Chamado Pendente)",
                body: "Toque para atender agora.",
                data: { screen: 'ChamadoDetalhe', chamado_id: chamado.chamado_id },
                sound: 'bell.wav',
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: { seconds: i * intervaloSegundos, channelId: 'campainha_v2' },
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
            // ADICIONE ESTA LINHA:
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