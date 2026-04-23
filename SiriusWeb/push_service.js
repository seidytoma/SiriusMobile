// =================================================================
// PROJETO SIRIUS - SERVIÇO DE PUSH NOTIFICATIONS (push_service.gs)
// =================================================================

const EXPO_API_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Envia notificação Push via Expo.
 */
function sendPushToUser(usuarioId, titulo, corpo, dadosExtras = {}) {
  try {
    // 1. Busca o Token (Modo Robusto - Direto na Planilha para evitar erro de cache)
    const token = getUserPushToken_Direto(usuarioId);
    
    if (!token) {
      Logger.log(`[PUSH FAIL] Usuário ${usuarioId} sem token.`);
      return { sent: false };
    }

    if (!token.startsWith('ExponentPushToken') && !token.startsWith('ExpoPushToken')) {
      return { sent: false, reason: 'invalid_token' };
    }

    // 2. Payload (CORRIGIDO O CHANNEL ID)
    const payload = {
      to: token,
      title: titulo,
      body: corpo,
      data: dadosExtras, 
      sound: 'default',
      priority: 'high',         // Acorda o Android
      channelId: 'campainha_v2', // <--- CORREÇÃO CRÍTICA: Deve ser igual ao do App
      _displayInForeground: true
    };

    // 3. Envio
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify([payload]), // Expo exige Array
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(EXPO_API_URL, options);
    Logger.log(`[PUSH] Enviado para ${usuarioId}: ${response.getContentText()}`);
    return { sent: true };

  } catch (e) {
    Logger.log(`[PUSH ERROR] ${e.message}`);
    return { sent: false, error: e.message };
  }
}

/**
 * Busca simples e direta para garantir que funcione agora
 */
/**
 * Busca o token do usuário garantindo a busca pelo NOME da coluna.
 */
function getUserPushToken_Direto(usuarioId) {
  try {
    // CORREÇÃO: Usa o ID explícito da configuração global (Code.gs)
    // Se CONFIG não estiver acessível, substitua pelo ID da planilha de usuários.
    const ssId = typeof CONFIG !== 'undefined' ? CONFIG.planilhas.usuarios : "14cwCMBL3PqRiLwGJ_sr7Hy1sBbVrUIFxwjp7DrB8wUs";
    const ss = SpreadsheetApp.openById(ssId); 
    const sheet = ss.getSheetByName("USUARIOS");
    
    // Obtém todos os dados
    const data = sheet.getDataRange().getValues();
    
    // 1. Identifica os índices das colunas pelo cabeçalho (linha 0)
    const headers = data[0];
    const idxId = headers.indexOf('usuario_id');
    const idxToken = headers.indexOf('expo_push_token');

    // Validação de segurança: Se não achar as colunas pelo nome, para tudo.
    if (idxId === -1 || idxToken === -1) {
      Logger.log("ERRO CRÍTICO: Colunas 'usuario_id' ou 'expo_push_token' não encontradas pelo nome.");
      return null;
    }

    // 2. Itera procurando o usuário (começa do 1 para pular cabeçalho)
    for (let i = 1; i < data.length; i++) {
      // Converte para String e remove espaços para garantir o "match"
      if (String(data[i][idxId]).trim() === String(usuarioId).trim()) {
        return data[i][idxToken]; // Retorna o token encontrado nesta linha
      }
    }
    
    return null; // Usuário não encontrado
  } catch (e) {
    Logger.log("Erro ao buscar token: " + e.message);
    return null;
  }
}
