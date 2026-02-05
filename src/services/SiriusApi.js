// src/services/SiriusApi.js

// URL do seu Google Apps Script
const API_URL = 'https://script.google.com/a/macros/hsl.org.br/s/AKfycbxNaSJzNEDCiUhEYakZ7MCXEXkJfFC3IDBvwAGq_cbm6B4hBcyJCnk53SlVnN60hsuX/exec';

/**
 * [FUNÇÃO MESTRA] - O "Coração" da API
 * Substitui todos os 'fetch' repetitivos.
 * Gerencia Timeout (15s), Erros de Rede e JSON inválido.
 */
async function apiRequest(payload, timeout = 15000) {
  try {
    // 1. Cria um contador de tempo (AbortController) para não travar o app
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    // 2. Faz a chamada
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Header padrão do GAS
      body: JSON.stringify(payload),
      signal: controller.signal // Liga o cronômetro
    });

    clearTimeout(id); // Para o cronômetro se deu certo

    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    // 3. Trata a resposta (blindagem contra erro HTML do Google)
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn("[API] Resposta não-JSON (Erro interno do Google):", text.substring(0, 50));
      return { success: false, error: "Servidor instável. Tente novamente." };
    }

  } catch (error) {
    // 4. Tratamento de erros específicos
    if (error.name === 'AbortError') {
      console.warn("[API] Timeout: A internet está muito lenta.");
      return { success: false, error: "Tempo limite excedido." };
    }
    console.warn("[API] Erro de Conexão:", error.message);
    return { success: false, error: "Sem conexão com a internet." };
  }
}

export const SiriusApi = {
  
  // --- AUTENTICAÇÃO ---
  async savePushToken(usuarioId, pushToken) {
    // Usa a função mestra (veja como fica limpo)
    return await apiRequest({
      action: 'saveToken', 
      sheetName: 'USUARIOS',
      idFieldName: 'usuario_id',
      record: { usuario_id: usuarioId, expo_push_token: pushToken }
    });
  },

  async login(email, pushToken) {
    return await apiRequest({
      action: 'login',
      email: email,
      pushToken: pushToken || ''
    });
  },


  // Remove o token do backend para parar de receber notificações
  async removePushToken(usuarioId) {
    return await apiRequest({
      action: 'removeToken', 
      record: { usuario_id: usuarioId }
    });
  },

  // --- CHAMADOS ---
  // Esta função precisa ser diferente pois é GET e retorna Array direto
  async getChamadosAbertos() {
    try {
      const url = `${API_URL}?mobile=true&action=getChamados`;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 20000); // 20s

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) throw new Error("HTTP " + response.status);
      const json = await response.json();
      
      // Retorna a lista APENAS se for um array válido
      return Array.isArray(json) ? json : null; 
    } catch (error) {
      console.warn("Erro ao buscar chamados:", error.message);
      return null; // Retorna NULL para indicar erro, não lista vazia
    }
  },

  async getSetores() {
    try {
      // GET leve para buscar lista de setores
      const response = await fetch(`${API_URL}?mobile=true&action=getSetores`);
      const json = await response.json();
      return json.success ? json.data : [];
    } catch (e) { return []; }
  },

  async saveResponsabilidades(idsSetores, userInfo) {
    const res = await apiRequest({
      action: 'saveResponsibilities',
      ids: idsSetores,
      user: userInfo
    });
    return res.success !== false;
  },

  async iniciarAtendimento(chamadoId, nomeTecnico) {
    return await apiRequest({
      action: 'iniciarAtendimento',
      id: chamadoId,
      tecnico: { name: nomeTecnico }
    });
  },

  async encerrarChamado(dados) {
    return await apiRequest({ action: 'encerrarChamado', dados: dados });
  },

  // --- CHAT (BLINDADO) ---
  async getComentarios(chamadoId) {
    try {
      const url = `${API_URL}?mobile=true&action=getComentarios&id=${chamadoId}`;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000); // 10s

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      const json = await response.json();
      return json.success ? json.messages : []; 
    } catch (e) {
      console.log("Erro Chat Sync:", e.message);
      return null; // Retorna NULL para a UI saber que deu erro e não apagar as mensagens
    }
  },
 
  async enviarComentario(chamadoId, usuarioNome, usuarioEmail, texto) {
    return await apiRequest({
      action: 'saveComentario',
      chamado_id: chamadoId,
      usuario_nome: usuarioNome,
      usuario_email: usuarioEmail,
      mensagem: texto
    });
  },

  // --- PRESETS ---
  async getUserPresets(usuarioId) {
    const res = await apiRequest({ action: 'managePresets', operation: 'get', userId: usuarioId });
    return res.success ? res.presets : {};
  },

  async saveUserPresets(usuarioId, presetsObj) {
    const res = await apiRequest({ action: 'managePresets', operation: 'save', userId: usuarioId, presets: presetsObj });
    return res.success === true;
  },

  // --- SMART POLLING (ECONOMIA DE DADOS) ---
  async checkUpdates(lastTimestamp) {
    try {
      // Chamada GET ultra-rápida
      const url = `${API_URL}?mobile=true&action=checkUpdate&lastTime=${lastTimestamp || 0}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { hasChanges: false }; // Na dúvida, diz que não mudou
    }
  }
};