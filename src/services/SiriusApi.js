// src/services/SiriusApi.js

// URL do seu Google Apps Script
const API_URL = 'https://script.google.com/a/macros/hsl.org.br/s/AKfycbwDokXchAYBvveC5gT90MeaUQqWjMFZp4HUrcl_liOHtkcCbWEm0PgMVSZQ0QVemDgr/exec';

/**
 * [FUN��O MESTRA] - O "Cora��o" da API
 * Substitui todos os 'fetch' repetitivos.
 * Gerencia Timeout (15s), Erros de Rede e JSON inv�lido.
 */
async function apiRequest(payload, timeout = 15000, token = null) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const headers = { 'Content-Type': 'text/plain;charset=utf-8' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(id);

    // NOVO: Parar de mascarar o erro HTTP
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: Servidor recusou a conexão.`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { success: false, error: "Servidor instável. Tente novamente." };
    }

  } catch (error) {
    // NOVO: Mostra o erro real se for um bloqueio do Google
    if (error.message.includes("Servidor recusou")) {
      console.warn("[API] Bloqueio do Google:", error.message);
      return { success: false, error: error.message }; 
    }

    if (error.name === 'AbortError') {
      return { success: false, error: "Tempo limite excedido." };
    }
    return { success: false, error: "Sem conexão com a internet." };
  }
}

export const SiriusApi = {
  
  // --- AUTENTICA��O ---
  async savePushToken(usuarioId, pushToken) {
    // Usa a fun��o mestra (veja como fica limpo)
    return await apiRequest({
      action: 'saveToken', 
      sheetName: 'USUARIOS',
      idFieldName: 'usuario_id',
      record: { usuario_id: usuarioId, expo_push_token: pushToken }
    });
  },

  async login(email, pushToken, accessToken) {
    return await apiRequest({
      action: 'login',
      email: email.trim().toLowerCase(),
      pushToken: pushToken || ''
    }, 15000, accessToken);
  },


  // Remove o token do backend para parar de receber notifica��es
  async removePushToken(usuarioId) {
    return await apiRequest({
      action: 'removeToken', 
      record: { usuario_id: usuarioId }
    });
  },

  // --- CHAMADOS ---
  // Esta fun��o precisa ser diferente pois � GET e retorna Array direto
  async getChamadosAbertos() {
    try {
      const url = `${API_URL}?mobile=true&action=getChamados`;
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 20000); // 20s

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) throw new Error("HTTP " + response.status);
      const json = await response.json();
      
      // Retorna a lista APENAS se for um array v�lido
      return Array.isArray(json) ? json : null; 
    } catch (error) {
      console.warn("Erro ao buscar chamados:", error.message);
      return null; // Retorna NULL para indicar erro, n�o lista vazia
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
      return null; // Retorna NULL para a UI saber que deu erro e n�o apagar as mensagens
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
      // Chamada GET ultra-r�pida
      const url = `${API_URL}?mobile=true&action=checkUpdate&lastTime=${lastTimestamp || 0}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { hasChanges: false }; // Na d�vida, diz que n�o mudou
    }
  },

  // --- NOVAS FUNES DO WEB APP ---
  async getHomeKPIs() {
    try {
      const url = `${API_URL}?mobile=true&action=getHomeKPIs`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar KPIs." };
    }
  },

  // --- NOVOS MÓDULOS ---
  async getMinhasPreventivas() {
    try {
      const url = `${API_URL}?mobile=true&action=getMinhasPreventivas`;
      const response = await fetch(url);
      const json = await response.json();
      // Garante um retorno seguro em caso de falha parcial
      if (json.success) {
        return { success: true, data: json.data || { tarefas: [], kpis: {} } };
      }
      return { success: false, error: json.error || "Erro desconhecido." };
    } catch (e) {
      return { success: false, error: "Falha de conexão ao buscar preventivas." };
    }
  },

  async findEquipamento(termo) {
    try {
      const url = `${API_URL}?mobile=true&action=findEquipamento&termo=${encodeURIComponent(termo)}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar equipamento." };
    }
  },

  async saveErroOperacao(payload) {
    return await apiRequest({ action: 'mobileSaveErroOperacao', dados: payload });
  },

  async getFalhas() {
    try {
      const url = `${API_URL}?mobile=true&action=getFalhas`;
      const response = await fetch(url);
      const json = await response.json();
      return json.success ? json.data : [];
    } catch (e) {
      return [];
    }
  },

  async saveCorretiva(corretivaData) {
    return await apiRequest({ action: 'mobileSaveCorretiva', payload: { corretivaData } });
  },

  // --- FOTOS E ANEXOS ---
  async uploadCorretivaPhoto(fileData) {
    return await apiRequest({ action: 'mobileUploadCorretivaPhoto', fileObject: fileData });
  },
  async addRelatorioToCorretiva(payload) {
    return await apiRequest({ action: 'addRelatorioToCorretiva', payload });
  },

  // --- ROTAS DE INSPEÇÃO ---
  async getRotasDoMes(ano, mes) {
    try {
      const url = `${API_URL}?mobile=true&action=mobileFetchRotasDoMes&ano=${ano}&mes=${mes}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar rotas." };
    }
  },
  async salvarExecucaoRotaEmLote(payload) {
    return await apiRequest({ action: 'salvarExecucaoRotaEmLote', payload });
  },

  // --- TREINAMENTOS ---
  async getTreinamentos() {
    try {
      const url = `${API_URL}?mobile=true&action=mobileFetchTreinamentos`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar treinamentos." };
    }
  },

  // --- SEPARAÇÃO DE PROTETORES (CQ) ---
  async getProtetoresParaSeparacao(mes, ano, tecnicoId) {
    try {
      const url = `${API_URL}?mobile=true&action=mobileGetProtetoresParaSeparacao&mes=${mes}&ano=${ano}&tecnicoId=${tecnicoId || ''}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar protetores." };
    }
  },
  async toggleSeparacaoProtetor(payload) {
    return await apiRequest({ action: 'mobileToggleSeparacaoProtetor', payload });
  },

  // --- PRESTADORES ---
  async buscaPrestadorTypeahead(termo) {
    try {
      const url = `${API_URL}?mobile=true&action=mobileBuscaPrestadorTypeahead&termo=${encodeURIComponent(termo)}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar prestadores." };
    }
  },
  async getHistoricoLiberacoes() {
    try {
      const url = `${API_URL}?mobile=true&action=mobileFetchHistoricoLiberacoes`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar histórico." };
    }
  },
  async salvarNovoPrestador(dados) {
    return await apiRequest({ action: 'mobileSalvarNovoPrestador', dados });
  },
  async registrarEEmitirLiberacao(dados) {
    return await apiRequest({ action: 'registrarEEmitirLiberacao', dados });
  },

  // --- EMPRÉSTIMOS ---
  async getEmprestimosAtivos() {
    try {
      const url = `${API_URL}?mobile=true&action=mobileFetchEmprestimosAtivos`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar empréstimos." };
    }
  },
  async buscarEquipamentoParaEmprestimo(termo) {
    try {
      const url = `${API_URL}?mobile=true&action=mobileBuscarEquipamentoParaEmprestimo&termo=${encodeURIComponent(termo)}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar equipamento." };
    }
  },
  async buscarEmprestimoParaDevolver(termo) {
    try {
      const url = `${API_URL}?mobile=true&action=mobileBuscarEmprestimoParaDevolver&termo=${encodeURIComponent(termo)}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar empréstimo." };
    }
  },
  async saveEmprestimo(dados) {
    return await apiRequest({ action: 'saveEmprestimo', dados });
  },
  async devolverEmprestimo(dados) {
    return await apiRequest({ action: 'devolverEmprestimo', dados });
  },

  // --- NÍVEL DE HÉLIO ---
  async getRMsParaHelio() {
    try {
      const url = `${API_URL}?mobile=true&action=mobileFetchRMsParaHelio`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar equipamentos de RM." };
    }
  },
  async saveHelioReadings(payload) {
    return await apiRequest({ action: 'saveHelioReadings', payload });
  },

  // --- ÓTICAS ---
  async getOticaForCQ(serial) {
    try {
      const url = `${API_URL}?mobile=true&action=mobileFetchOticaForCQ&serial=${encodeURIComponent(serial)}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar ótica." };
    }
  },
  async saveOticaTeste(formData) {
    return await apiRequest({ action: 'saveOticaTeste', formData });
  },

  // --- JORNADA / PRODUTIVIDADE ---
  async getJornadaProdutividade(ano, mes) {
    try {
      const url = `${API_URL}?mobile=true&action=mobileFetchJornadaProdutividade&ano=${ano}&mes=${mes}`;
      const response = await fetch(url);
      return await response.json();
    } catch (e) {
      return { success: false, error: "Falha ao buscar jornada." };
    }
  },
  async saveJornadaEvent(payload) {
    return await apiRequest({ action: 'saveJornadaEvent', payload });
  },
  async deleteJornadaEvent(id) {
    return await apiRequest({ action: 'deleteJornadaEvent', id });
  },

  // --- AÇÕES DE CHAMADOS ---
  async transferirChamado(dados) {
    return await apiRequest({ action: 'mobileTransferirChamado', dados });
  },
  async recusarChamado(dados) {
    return await apiRequest({ action: 'mobileRecusarChamado', dados });
  },
  async iniciarApoioTecnico(dados) {
    return await apiRequest({ action: 'mobileIniciarApoioTecnico', dados });
  }
};
