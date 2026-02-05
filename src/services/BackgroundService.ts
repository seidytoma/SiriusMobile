// src/services/BackgroundService.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { verificarEscalonamentoGlobal } from './ChamadosLogic';

const TASK_NAME = 'BACKGROUND_CHAMADOS_MONITOR';

// Define a tarefa
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log(`[Background] 🕒 Tarefa ${TASK_NAME} iniciada...`);
    
    // Chama a lógica centralizada
    const temDados = await verificarEscalonamentoGlobal(false); // false = respeita checkUpdate

    console.log(`[Background] Fim. Novos dados? ${temDados}`);
    return temDados 
        ? BackgroundFetch.BackgroundFetchResult.NewData 
        : BackgroundFetch.BackgroundFetchResult.NoData;

  } catch (err) {
    console.log("[Background] Erro:", err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Função para registrar (chamar no _layout ou index)
export async function registerBackgroundFetchAsync() {
  try {
      const status = await BackgroundFetch.getStatusAsync();
      console.log("[Background] Status do serviço:", status);

      if (status === BackgroundFetch.BackgroundFetchStatus.Restricted || status === BackgroundFetch.BackgroundFetchStatus.Denied) {
          console.log("[Background] Serviço negado ou restrito pelo usuário.");
          return;
      }

      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60 * 15, // 15 minutos (Mínimo do iOS/Android)
        stopOnTerminate: false,   // Android: continua após matar o app
        startOnBoot: true,        // Android: reinicia com o celular
      });
      console.log("[Background] Tarefa registrada com sucesso!");
  } catch (e) {
      console.log("[Background] Falha ao registrar:", e);
  }
}