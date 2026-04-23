// =================================================================
// PROJETO SIRIUS - API MOBILE DEDICADA (mobile_api.gs)
// =================================================================

/**
 * [MOBILE] Busca a ótica pelo Serial de forma ultra-rápida.
 * Retorna um payload enxuto apenas com o necessário para a tela do celular.
 */
function mobileFetchOticaForCQ(serial) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const serialLimpo = String(serial).trim().toUpperCase();
    if (!serialLimpo) throw new Error("Serial inválido.");

    const ssOticas = SpreadsheetApp.openById(CONFIG.planilhas.oticas);
    const sheetInv = ssOticas.getSheetByName("OTICAS");
    
    // Lê e objetifica a aba
    const data = sheetInv.getDataRange().getValues();
    const headers = data.shift();
    const dataInv = data.map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });

    const otica = dataInv.find(o => String(o.otica_serie).trim().toUpperCase() === serialLimpo);

    if (!otica) return { success: false, message: "Ótica não encontrada no inventário." };
    if (otica.otica_ativo === 'Inativo') return { success: false, message: "Esta ótica consta como Inativa." };

    // Resolve as descrições de forma leve (sem carregar tudo)
    const lookups = getSpecificLookupData_(['OTICA_REFERENCIA', 'OTICA_TIPO', 'FABRICANTES']);
    
    const refDesc = lookups.OTICA_REFERENCIA?.get(String(otica.otica_referencia_id))?.otica_referencia_descricao || 'N/D';
    const tipoDesc = lookups.OTICA_TIPO?.get(String(otica.otica_tipo_id))?.otica_tipo_descricao || 'N/D';
    const fabDesc = lookups.FABRICANTES?.get(String(otica.fabricante_id))?.fabricante_descricao || 'N/D';

    // Payload Otimizado
    return {
      success: true,
      data: {
        id: otica.otica_id,
        serie: otica.otica_serie,
        titulo: `${refDesc} - ${tipoDesc}`,
        subtitulo: `Fabricante: ${fabDesc}`
      }
    };

  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Busca um equipamento específico pela TAG ou Série.
 * Retorna apenas os dados essenciais para abrir a O.S. Corretiva.
 */
function mobileFindEquipamentoCorretiva(termoBusca) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const termo = String(termoBusca).trim().toUpperCase();
    if (!termo) throw new Error("Termo de busca vazio.");

    const ssEquip = SpreadsheetApp.openById(CONFIG.planilhas.equipamentos);
    const sheet = ssEquip.getSheetByName("EQUIPAMENTOS");
    
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const dataEquip = data.map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });

    // Busca exata por TAG, Série OU ID Interno (QR Code)
    const equip = dataEquip.find(e => 
      String(e.equipamento_tag).trim().toUpperCase() === termo || 
      String(e.serie).trim().toUpperCase() === termo ||
      String(e.equipamento_id).trim().toUpperCase() === termo
    );

    if (!equip) return { success: false, message: "Equipamento não encontrado pelo termo informado." };
    if (equip.equipamento_ativo === 'Inativo') return { success: false, message: "Este equipamento encontra-se Inativo." };

    // Busca o ID do técnico responsável (dono do equipamento) para auto-preencher se necessário
    let tecnicoId = equip.resp_geral_pri_id || '';

    return { 
      success: true, 
      data: {
        equipamento_id: equip.equipamento_id,
        equipamento_tag: equip.equipamento_tag,
        equipamento_descricaocompleta: equip.equipamento_descricaocompleta,
        cc_id: equip.cc_id,
        tecnico_responsavel_id: tecnicoId
      } 
    };

  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Salva a foto da falha na pasta configurada no CONFIG.
 */
function mobileUploadCorretivaPhoto(fileObject) {
  try {
    const FOLDER_ID = CONFIG.relatoriosCorretivaFolderId;
    const decodedData = Utilities.base64Decode(fileObject.data);
    const blob = Utilities.newBlob(decodedData, fileObject.mimeType, fileObject.fileName);
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);
    
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return {
      success: true,
      drive_id: file.getId(), // Importante retornar o ID puro
      fileUrl: file.getUrl(),
      fileName: fileObject.fileName
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}


/**
 * [MOBILE V2] Busca preventivas com lógica de Compliance (igual Desktop) 
 * e cálculos de progresso mensal para a barra de meta.
 */
function mobileFetchMinhasPreventivas(tecnicoAlvoId = null) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const userEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).trim().toLowerCase() === userEmail);
    if (!userObj) throw new Error("Usuário não localizado.");
    
    const meuUsuarioId = String(userObj.usuario_id);
    const idFiltro = tecnicoAlvoId ? String(tecnicoAlvoId) : meuUsuarioId;

    const todosEquipamentos = getCachedData_(SHEETS.EQUIPAMENTOS, CONFIG.planilhas.equipamentos) || [];
    const todosPlanos = getCachedData_("PLANOPREVENTIVO", CONFIG.planilhas.equipamentos) || [];
    const planoMap = new Map(todosPlanos.map(p => [String(p.planopreventivo_id), p]));
    
    const todasPeriodicidades = getCachedData_(SHEETS.PERIODICIDADE, CONFIG.planilhas.principal) || [];
    const periodMap = new Map(todasPeriodicidades.map(p => [String(p.periodicidade_id), parseInt(p.periodicidade_meses) || 0]));

    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const compAtual = hoje.getFullYear() * 12 + hoje.getMonth();

    const tarefas = [];
    const kpis = { validos: 0, venceMes: 0, vencidos: 0 };
    let totalAgendadoMes = 0;
    let totalRealizadoMes = 0;
    const tecnicosComDemanda = new Map();

    todosEquipamentos.forEach(eq => {
      if (eq.equipamento_ativo !== 'Ativo') return;
      
      const plano = eq.planopreventivo_id ? planoMap.get(String(eq.planopreventivo_id)) : null;
      const planoAtivo = plano && (String(plano.prev_ativo).toLowerCase() === 'ativo' || String(plano.prev_ativo).toLowerCase() === 'sim');
      if (!planoAtivo) return;

      const respId = String(eq.resp_prev_pri_id || '').trim();
      
      // Constrói lista de técnicos ativos para o dropdown
      if (respId && !tecnicosComDemanda.has(respId)) {
        const t = allUsers.find(u => String(u.usuario_id) === respId);
        if (t) tecnicosComDemanda.set(respId, t.usuario_nome);
      }

      // Filtra pelo técnico selecionado
      if (respId !== idFiltro) return;

      // --- LÓGICA DE COMPLIANCE (STATUS TÉCNICO) ---
      const meses = periodMap.get(String(plano.prev_periodicidade_id)) || 0;
      let dataBase = eq.prev_data_ultima_realizada ? parseDateSafe_(eq.prev_data_ultima_realizada) : parseDateSafe_(plano.prev_data_inicio_ciclo);
      
      let statusCompliance = "Vencido";
      let dataValidade = null;

      if (dataBase && meses > 0) {
        dataValidade = new Date(dataBase.getTime());
        dataValidade.setMonth(dataValidade.getMonth() + meses);
        const compValidade = dataValidade.getFullYear() * 12 + dataValidade.getMonth();
        
        // Verifica se já foi feita este mês
        let feitaEsteMes = false;
        if (eq.prev_data_ultima_realizada) {
          const dtU = parseDateSafe_(eq.prev_data_ultima_realizada);
          if (dtU && (dtU.getFullYear() * 12 + dtU.getMonth()) === compAtual) feitaEsteMes = true;
        }

        if (feitaEsteMes) statusCompliance = "Válido";
        else if (compValidade < compAtual) statusCompliance = "Vencido";
        else if (compValidade === compAtual) statusCompliance = "Vence este Mês";
        else statusCompliance = "Válido";
      }
      
      // Incrementa KPIs de conformidade
      if (statusCompliance === "Válido") kpis.validos++;
      else if (statusCompliance === "Vence este Mês") kpis.venceMes++;
      else kpis.vencidos++;

      // --- LÓGICA DE PROGRESSO MENSAL (PARA A BARRA) ---
      const dataProg = parseDateSafe_(eq.prev_data_programada);
      if (dataProg && (dataProg.getFullYear() * 12 + dataProg.getMonth()) === compAtual) {
        totalAgendadoMes++;
        // Se a última realizada também foi este mês, conta como meta batida
        const dtUltima = parseDateSafe_(eq.prev_data_ultima_realizada);
        if (dtUltima && (dtUltima.getFullYear() * 12 + dtUltima.getMonth()) === compAtual) {
          totalRealizadoMes++;
        }
      }

      tarefas.push({
        equipamento_id: eq.equipamento_id,
        tag: eq.equipamento_tag || 'S/TAG',
        serie: eq.serie || '-',
        descricao: eq.equipamento_descricaocompleta,
        tipo: eq.tipoequipamento_descricao,
        fabricante: eq.fabricante_descricao,
        modelo: eq.modelo_descricao,
        setor: eq.cc_descricao || 'N/D',
        status: statusCompliance,
        plano_id: plano.planopreventivo_id,
        mes_programado: dataProg ? `${dataProg.getFullYear()}-${String(dataProg.getMonth()+1).padStart(2,'0')}` : '',
        // --- NOVOS CAMPOS PARA O CARD DO MOBILE ---
        data_ultima: dataBase ? dataBase.toISOString() : '',
        data_vencimento: dataValidade ? dataValidade.toISOString() : ''
      });
    });

    return {
      success: true,
      data: {
        tarefas,
        kpis,
        progresso: { realizado: totalRealizadoMes, total: totalAgendadoMes },
        tecnicos: Array.from(tecnicosComDemanda.entries()).map(([id, nome]) => ({id, nome})).sort((a,b) => a.nome.localeCompare(b.nome)),
        meu_id: meuUsuarioId
      }
    };
  } catch (e) { return { success: false, error: e.message }; }
  finally { lock.releaseLock(); }
}

/**
 * [MOBILE] Recebe o payload enxuto do celular e formata para o motor principal de Erro de Operação.
 * Salva a O.S. já com o status "Fechado".
 */
function mobileSaveErroOperacao(dados) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(e) { return { error: "Servidor ocupado processando outra OS. Tente novamente." }; }

  try {
    // 1. Monta o objeto Mestre (ERROOPERACAO)
    const master = {
      equipamento_id: dados.equipamento_id,
      usuario_id: dados.usuario_id,
      cc_id: dados.cc_id,
      errooperacao_status: 'Fechado' // Regra de negócio: pelo app já nasce e morre fechado
    };

    // 2. Monta o array de Itens (SERVICOERRO)
    const items = [{
      usuario_id: dados.usuario_id,
      servicoerro_descricao: dados.descricao,
      servicoerro_datahorainicio: dados.inicio, // Espera string ISO (Ex: "2026-04-15T14:30:00")
      servicoerro_datahorafim: dados.fim
    }];

    // 3. Chama o motor principal (que já lida com validação de conflito de agenda, IDs, datas e produtividade)
    const result = saveOrUpdateErroOperacao({ master: master, items: items });
    
    // Invalida cache de dashboards para atualizar as telas do web instantaneamente
    if (result.success) {
       invalidateSheetCache_("ERROOPERACAO", CONFIG.planilhas.errosOperacao);
    }
    
    return result;

  } catch (e) {
    Logger.log("Erro em mobileSaveErroOperacao: " + e.stack);
    return { error: e.message };
  } finally {
    lock.releaseLock();
  }
}


/**
 * [MOBILE] Busca rotas do mês vigente ATÉ O DIA DE HOJE.
 * Retorna lista de rotas pendentes/realizadas e KPIs de progresso do mês.
 */
function mobileFetchRotasDoMes(ano, mes) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const rotas = getCachedData_(SHEETS.CADASTRO_ROTAS, CONFIG.planilhas.rotas) || [];
    const execucoes = getCachedData_("EXECUCAO_ROTAS", CONFIG.planilhas.rotas) || [];
    const lookups = getSpecificLookupData_(['CENTROS']);
    const ccMap = lookups.CENTROS || new Map();

    const userEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).trim().toLowerCase() === userEmail);
    if (!userObj) throw new Error("Usuário não encontrado.");
    const tecnicoId = String(userObj.usuario_id);

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999); // Final do dia de hoje para não cortar rotas previstas para hoje

    // Se o mês/ano pedido for no futuro, retorna vazio e 0%
    const dataFiltro = new Date(ano, mes - 1, 1);
    if (dataFiltro.getFullYear() > hoje.getFullYear() || (dataFiltro.getFullYear() === hoje.getFullYear() && dataFiltro.getMonth() > hoje.getMonth())) {
        return { success: true, data: { rotas: [], kpis: { total: 0, realizadas: 0, percentual: 0 } } };
    }

    // Mapeia execuções do mês para busca rápida O(1)
    const execucoesMap = new Map();
    execucoes.forEach(ex => {
      if (ex.execucao_data_programada) {
        const dt = new Date(ex.execucao_data_programada);
        if (dt.getFullYear() === ano && (dt.getMonth() + 1) === mes) {
          const key = `${ex.rota_id}_${dt.toISOString().split('T')[0]}`;
          execucoesMap.set(key, ex);
        }
      }
    });

    // Pega só rotas ativas deste técnico
    const rotasValidas = rotas.filter(r => r.rota_ativa === 'Ativo' && r.periodicidade && String(r.usuario_id_padrao) === tecnicoId);

    let listaRotas = [];
    let kpiTotal = 0;
    let kpiRealizadas = 0;

    rotasValidas.forEach(rota => {
      const ccDesc = ccMap.get(String(rota.cc_id))?.cc_descricao || rota.cc_descricao || 'N/A';
      const datasProgramadas = calcularDatasProgramadas_(rota.periodicidade, ano, mes);
      
      datasProgramadas.forEach(data => {
        const dataProg = new Date(data);
        
        // REGRA DE OURO: Ignora rotas programadas para amanhã em diante
        if (dataProg > hoje) return;

        const dateStr = dataProg.toISOString().split('T')[0];
        const key = `${rota.rota_id}_${dateStr}`; // Mantém o underline apenas para a busca no mapa interno
        const execucao = execucoesMap.get(key);

        let status = "Pendente";
        let btnColor = "warning"; // Amarelo
        
        kpiTotal++; // Conta na meta do mês até hoje

        if (execucao && execucao.execucao_status === 'Realizada') {
            status = "Realizada";
            btnColor = "success";
            kpiRealizadas++;
        } else if (execucao && execucao.execucao_status === 'Cancelada') {
            status = "Cancelada";
            btnColor = "secondary";
            kpiRealizadas++; 
        } else if (dateStr < new Date().toISOString().split('T')[0]) {
            status = "Vencida";
            btnColor = "danger"; // Vermelho
        } else {
            status = "Hoje";
            btnColor = "primary"; // Azul
        }

        listaRotas.push({
            rota_id: rota.rota_id,
            chave_composta: `${rota.rota_id}|${dateStr}`, // <--- CORREÇÃO CRÍTICA AQUI: Usando o pipe |
            cc_descricao: ccDesc,
            data_programada: dateStr,
            status: status,
            btnColor: btnColor,
            execucao_id: execucao ? execucao.execucao_id : null
        });
      });
    });

    // Ordenação: Datas mais recentes primeiro (Hoje -> Ontem -> ...)
    listaRotas.sort((a, b) => new Date(b.data_programada) - new Date(a.data_programada));

    let percentual = kpiTotal > 0 ? Math.round((kpiRealizadas / kpiTotal) * 100) : 100;

    return { 
        success: true, 
        data: { 
            rotas: listaRotas, 
            kpis: { total: kpiTotal, realizadas: kpiRealizadas, percentual: percentual } 
        } 
    };

  } catch (e) {
    Logger.log("Erro em mobileFetchRotasDoMes: " + e.stack);
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}


/**
 * [MOBILE] Busca todos os KPIs da Home em uma única requisição.
 * BLINDADA: Erros em um módulo não quebram a leitura dos demais.
 */
function mobileFetchHomeKPIs() {
  try {
    const userEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).toLowerCase().trim() === userEmail);
    if (!userObj) throw new Error("Usuário não encontrado.");
    
    const userName = userObj.usuario_nome;
    const userId = String(userObj.usuario_id);
    
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const mesRef = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}`;

    // 1. CORRETIVAS & ERROS
    const corretivas = getCachedData_("CORRETIVAS", CONFIG.planilhas.corretivas) || [];
    const countCorretivas = corretivas.filter(c => {
        if (String(c.usuario_criacao_nome).trim() !== String(userName).trim()) return false;
        const dt = parseDateSafe_(c.corretiva_datahoraabertura);
        return dt && dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
    }).length;

    const erros = getCachedData_("ERROOPERACAO", CONFIG.planilhas.errosOperacao) || [];
    const countErros = erros.filter(e => {
        if (String(e.usuario_nome).trim() !== String(userName).trim()) return false;
        const dt = parseDateSafe_(e.errooperacao_datahoraabertura);
        return dt && dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
    }).length;

    // 2. ROTAS
    let rTotal = 0; let rReal = 0;
    try {
        const rotas = getCachedData_(SHEETS.CADASTRO_ROTAS, CONFIG.planilhas.rotas) || [];
        const execucoes = getCachedData_("EXECUCAO_ROTAS", CONFIG.planilhas.rotas) || [];
        const rotasDoTecnico = rotas.filter(r => r.rota_ativa === 'Ativo' && String(r.usuario_id_padrao) === userId);
        
        rotasDoTecnico.forEach(rota => {
            const datas = calcularDatasProgramadas_(rota.periodicidade, anoAtual, mesAtual + 1);
            datas.forEach(d => {
                if (d <= hoje) {
                    rTotal++;
                    const key = `${rota.rota_id}_${d.toISOString().split('T')[0]}`;
                    const feita = execucoes.some(ex => `${ex.rota_id}_${new Date(ex.execucao_data_programada).toISOString().split('T')[0]}` === key && ex.execucao_status === 'Realizada');
                    if (feita) rReal++;
                }
            });
        });
    } catch(e) { Logger.log("Aviso: Falha ao ler KPIs de Rotas"); }

    // 3. PREVENTIVAS & 4. SEPARAÇÃO CQ
    const equipamentos = getCachedData_("EQUIPAMENTOS", CONFIG.planilhas.equipamentos) || [];
    let pTotal = 0; let pReal = 0;
    let sTotal = 0; let sReal = 0;

    // Tenta carregar a tabela volátil de protetores de forma segura
    const separadosSet = new Set();
    try {
        const ssCQ = SpreadsheetApp.openById(CONFIG.planilhas.controleQualidade);
        const sheetSep = ssCQ.getSheetByName("CQ_SEPARACAO_TEMP");
        if (sheetSep && sheetSep.getLastRow() > 1) {
            const dadosSep = objectifyRows(sheetSep.getDataRange().getValues());
            dadosSep.forEach(row => {
                if (row.mes_referencia === mesRef && row.status_separacao === 'Separado') {
                    separadosSet.add(String(row.equipamento_id));
                }
            });
        }
    } catch(e) { Logger.log("Aviso: Falha ao ler CQ_SEPARACAO_TEMP"); }

    equipamentos.forEach(eq => {
        if (eq.equipamento_ativo === 'Ativo' && String(eq.resp_prev_pri_id) === userId) {
            const dtProg = parseDateSafe_(eq.prev_data_programada);
            const isMesAtual = dtProg && dtProg.getMonth() === mesAtual && dtProg.getFullYear() === anoAtual;
            
            // Lógica Preventivas (KPI Antigo)
            if (isMesAtual) {
                pTotal++;
                const dtUltima = parseDateSafe_(eq.prev_data_ultima_realizada);
                if (dtUltima && dtUltima.getMonth() === mesAtual && dtUltima.getFullYear() === anoAtual) pReal++;
            }

            // Lógica Separação Protetores (KPI Novo)
            const isProtetor = String(eq.tipoequipamento_descricao).trim().toUpperCase() === 'PROTETOR RADIOLÓGICO';
            if (isProtetor && isMesAtual) {
                sTotal++;
                if (separadosSet.has(String(eq.equipamento_id))) sReal++;
            }
        }
    });

    // 5. CHAMADOS (Abertos e Concluídos no Mês)
    let cAbertos = 0; let cFechados = 0;
    try {
        const chamados = getCachedData_("CHAMADOS", CONFIG.planilhas.chamados) || [];
        chamados.forEach(c => {
            const isMeu = (String(c.tecnico_nome).trim() === String(userName).trim() || String(c.usuario_id) === userId);
            if (isMeu) {
                if (c.chamado_status === 'Aberto' || c.chamado_status === 'Em Atendimento') {
                    cAbertos++;
                } else if (c.chamado_status === 'Fechado' || c.chamado_status === 'Recusado') {
                    const dtFim = parseDateSafe_(c.chamado_fimatendimento);
                    if (dtFim && dtFim.getMonth() === mesAtual && dtFim.getFullYear() === anoAtual) {
                        cFechados++;
                    }
                }
            }
        });
    } catch(e) { Logger.log("Aviso: Falha ao ler KPIs de Chamados"); }

    return {
        success: true,
        data: {
            corretivas: countCorretivas,
            erros: countErros,
            rotas: `${rReal}/${rTotal}`,
            preventivas: pTotal > 0 ? `${pReal}/${pTotal}` : '0/0',
            separacao: `${sReal}/${sTotal}`,
            chamados: { abertos: cAbertos, fechados: cFechados } // <- NOVA CHAVE AQUI
        }
    };
  } catch (e) {
    Logger.log("Erro Crítico KPI Mobile: " + e.message);
    return { success: false, error: e.message };
  }
}


/**
 * [MOBILE] Busca a lista de treinamentos em vídeo e o status do usuário.
 */
function mobileFetchTreinamentos() {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const userEmail = Session.getActiveUser().getEmail().toLowerCase().trim();
    const usuarios = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = usuarios.find(u => String(u.usuario_email).toLowerCase().trim() === userEmail);
    const userId = userObj ? String(userObj.usuario_id) : null;

    const treinos = getCachedData_("TREINAMENTOS_MASTER", CONFIG.planilhas.treinamentos) || [];
    const participacoes = getCachedData_("TREINAMENTOS_PARTICIPACAO", CONFIG.planilhas.treinamentos) || [];

    // Mapeia quais o usuário já concluiu
    const concluidosSet = new Set();
    if (userId) {
       participacoes.forEach(p => {
         if (String(p.usuario_id) === userId && p.participacao_status === 'Concluído') {
            concluidosSet.add(String(p.treinamento_id));
         }
       });
    }

    // Filtra apenas os treinamentos ativos e que são do tipo 'Vídeo'
    const lista = treinos
      .filter(t => t.treinamento_ativo === 'Ativo' && t.treinamento_tipo === 'Vídeo')
      .map(t => ({
         id: t.treinamento_id,
         titulo: t.treinamento_titulo || 'Sem Título',
         duracao: t.treinamento_duracao_minutos || '0',
         url: t.treinamento_link_video || '',
         status: concluidosSet.has(String(t.treinamento_id)) ? 'Concluído' : 'Pendente'
      }));
      
    return { success: true, data: lista };
  } catch(e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

// =================================================================
// MÓDULO MOBILE: SEPARAÇÃO DE PROTETORES RADIOLÓGICOS (CQ)
// =================================================================

/**
 * [MOBILE] Busca a lista de protetores radiológicos para separação.
 * ATUALIZADO: Calcula o Status do CQ (Válido, Vencendo, Vencido) para os Cards de Filtro.
 */
function mobileGetProtetoresParaSeparacao(mes, ano, tecnicoId) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const ssCQ = SpreadsheetApp.openById(CONFIG.planilhas.controleQualidade);
    let sheetTemp = ssCQ.getSheetByName("CQ_SEPARACAO_TEMP");
    
    let separadosMap = new Map();
    const mesRef = `${ano}-${String(mes).padStart(2, '0')}`;
    
    if (sheetTemp && sheetTemp.getLastRow() > 1) {
        const dadosTemp = objectifyRows(sheetTemp.getDataRange().getValues());
        dadosTemp.forEach(row => {
            let rowMesStr = (row.mes_referencia instanceof Date) 
                ? `${row.mes_referencia.getFullYear()}-${String(row.mes_referencia.getMonth() + 1).padStart(2, '0')}`
                : String(row.mes_referencia).trim();

            if (rowMesStr === mesRef && row.status_separacao === 'Separado') {
                separadosMap.set(String(row.equipamento_id), row.separacao_id);
            }
        });
    }

    const todosEquipamentos = getCachedData_('EQUIPAMENTOS', CONFIG.planilhas.equipamentos) || [];
    const lookups = getSpecificLookupData_(['CENTROS', 'MODELOS', 'PERIODICIDADE']);
    
    const userEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userMap = new Map(allUsers.map(u => [String(u.usuario_id), u.usuario_nome]));
    const userObj = allUsers.find(u => String(u.usuario_email).toLowerCase().trim() === userEmail);
    const meuUsuarioId = userObj ? String(userObj.usuario_id) : null;

    let userAlvoId = tecnicoId;
    if (!userAlvoId || userAlvoId === 'MEU_USER') userAlvoId = meuUsuarioId;

    const listaParaSeparar = [];
    const tecnicosDoMesSet = new Set();
    const tecnicosDoMesList = [];
    
    // KPIs de Coleta
    let kpiTotal = 0;
    let kpiSeparados = 0;

    // KPIs de Status de CQ (Novos)
    let kpiValidos = 0;
    let kpiVencendo = 0;
    let kpiVencidos = 0;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const inicioProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    const dataFiltroFim = new Date(ano, mes, 0, 23, 59, 59);

    todosEquipamentos.forEach(eq => {
        if (eq.equipamento_ativo !== 'Ativo') return;
        if (String(eq.tipoequipamento_descricao).trim().toUpperCase() !== 'PROTETOR RADIOLÓGICO') return;
        
        const dtProg = eq.prev_data_programada ? parseDateSafe_(eq.prev_data_programada) : null;
        
        if (dtProg && dtProg <= dataFiltroFim) {
            const respId = String(eq.resp_prev_pri_id || '').trim();
            if (respId && !tecnicosDoMesSet.has(respId)) {
                tecnicosDoMesSet.add(respId);
                tecnicosDoMesList.push({ id: respId, nome: userMap.get(respId) || 'Técnico Desconhecido' });
            }

            if (userAlvoId && respId !== userAlvoId) return;
            
            kpiTotal++;
            const eqIdStr = String(eq.equipamento_id);
            const isSeparado = separadosMap.has(eqIdStr);
            if (isSeparado) kpiSeparados++;

            const ccDesc = lookups.CENTROS?.get(String(eq.cc_id))?.cc_descricao || eq.cc_descricao || 'N/D';
            const modDesc = lookups.MODELOS?.get(String(eq.modelo_id))?.modelo_descricao || eq.modelo_descricao || 'N/A';

            // Cálculo da Data de Vencimento do CQ
            let dataVencimento = null;
            if (eq.prev_data_ultima_realizada) {
              const dtUltima = parseDateSafe_(eq.prev_data_ultima_realizada);
              const perId = String(eq.planopreventivo_periodicidade_id || ''); 
              const meses = lookups.PERIODICIDADE?.get(perId)?.periodicidade_meses || 12;
              if (dtUltima) {
                dataVencimento = new Date(dtUltima.getTime());
                dataVencimento.setMonth(dataVencimento.getMonth() + parseInt(meses));
              }
            }

            const isAtrasado = dtProg.getFullYear() < ano || (dtProg.getFullYear() == ano && (dtProg.getMonth() + 1) < mes);

            // Lógica do Status do CQ
            let statusCQ = 'Vencido'; // Se não tiver data, assume vencido/pendente
            if (dataVencimento) {
                if (dataVencimento < hoje) {
                    statusCQ = 'Vencido';
                } else if (dataVencimento < inicioProximoMes) {
                    statusCQ = 'Vence este Mês';
                } else {
                    statusCQ = 'Válido';
                }
            }

            // Contabiliza pros Cards
            if (statusCQ === 'Válido') kpiValidos++;
            else if (statusCQ === 'Vence este Mês') kpiVencendo++;
            else kpiVencidos++;

            listaParaSeparar.push({
                equipamento_id: eqIdStr,
                tag: eq.equipamento_tag || 'S/ TAG',
                setor: ccDesc,
                modelo: modDesc,
                is_separado: isSeparado,
                is_atrasado: isAtrasado,
                cq_status: statusCQ, // Flag para o filtro funcionar
                vencimento_fmt: dataVencimento ? Utilities.formatDate(dataVencimento, "GMT-3", "dd/MM/yyyy") : 'Pendente'
            });
        }
    });

    listaParaSeparar.sort((a, b) => {
        if (a.setor === b.setor) return a.tag.localeCompare(b.tag);
        return a.setor.localeCompare(b.setor);
    });
    
    tecnicosDoMesList.sort((a, b) => a.nome.localeCompare(b.nome));

    return { 
        success: true, 
        data: {
            lista: listaParaSeparar,
            tecnicos: tecnicosDoMesList,
            meu_id: meuUsuarioId,
            kpis: { 
                total: kpiTotal, 
                separados: kpiSeparados,
                cq_validos: kpiValidos,
                cq_vencendo: kpiVencendo,
                cq_vencidos: kpiVencidos
            }
        }
    };
  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Toggle de Status na tabela volátil.
 * Lógica otimizada: Busca e exclui diretamente pelo ID do Equipamento.
 */
function mobileToggleSeparacaoProtetor(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000); 

  try {
    const { equipamento_id, mes, ano, novoStatus } = payload;
    const ssCQ = SpreadsheetApp.openById(CONFIG.planilhas.controleQualidade);
    const sheet = ssCQ.getSheetByName("CQ_SEPARACAO_TEMP");
    
    if (!sheet) throw new Error("Aba volátil não encontrada.");

    const mesRef = `${ano}-${String(mes).padStart(2, '0')}`;
    
    // Identifica o usuário logado para gravar quem separou
    const userEmail = Session.getActiveUser().getEmail().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).toLowerCase().trim() === userEmail);
    const usuarioId = userObj ? userObj.usuario_id : 'SISTEMA';

    // Lê a tabela para encontrar a linha do equipamento
    const data = sheet.getDataRange().getValues();
    const headers = data.shift(); // Remove o cabeçalho
    const idxEq = headers.indexOf('equipamento_id');
    
    let rowIndexEncontrado = -1;
    
    // Busca simples e direta apenas pelo ID do equipamento
    for (let i = 0; i < data.length; i++) {
        if (String(data[i][idxEq]).trim() === String(equipamento_id).trim()) {
            rowIndexEncontrado = i + 2; // +2 compensa o cabeçalho e o array base 0
            break;
        }
    }

    const isMarkingAsSeparado = (novoStatus === true || novoStatus === 'true');

    if (isMarkingAsSeparado) {
        // Se mandou marcar e não achou a linha, cria uma nova.
        if (rowIndexEncontrado === -1) {
            // O apóstrofo antes do mês garante que o Sheets grave como Texto puro
            sheet.appendRow([Utilities.getUuid(), equipamento_id, usuarioId, `'` + mesRef, new Date(), 'Separado']);
        }
    } else {
        // Se mandou DESMARCAR (Excluir) e achou a linha, deleta ela fisicamente!
        if (rowIndexEncontrado !== -1) {
            sheet.deleteRow(rowIndexEncontrado);
        }
    }

    SpreadsheetApp.flush();
    return { success: true };

  } catch (e) {
    Logger.log("Erro em mobileToggleSeparacaoProtetor: " + e.stack);
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}


// =================================================================
// MÓDULO MOBILE: PRESTADORES DE SERVIÇO (mobile_api.gs)
// =================================================================

/**
 * [MOBILE] Busca inteligente (Typeahead) para o formulário de liberação.
 * Retorna no máximo 15 resultados para manter a tela leve.
 */
function mobileBuscaPrestadorTypeahead(termo) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const termoBusca = String(termo).trim().toLowerCase();
    if (!termoBusca) return { success: true, data: [] };

    const prestadores = getCachedData_("PRESTADORES", CONFIG.planilhas.prestadores) || [];
    
    // Busca por Nome, CPF ou Fornecedor
    const resultados = prestadores.filter(p => {
        const nome = String(p.prestador_nome || '').toLowerCase();
        const cpf = String(p.prestador_cpf || '').toLowerCase();
        const forn = String(p.fornecedor_descricao || '').toLowerCase();
        
        return nome.includes(termoBusca) || cpf.includes(termoBusca) || forn.includes(termoBusca);
    }).slice(0, 15); // Limita a 15 resultados para performance mobile

    // Formata o payload de retorno
    const lista = resultados.map(p => ({
        id: p.prestador_id,
        nome: p.prestador_nome,
        cpf: p.prestador_cpf || 'S/ CPF',
        fornecedor: p.fornecedor_descricao || 'Empresa não informada',
        email: p.prestador_email || ''
    }));

    return { success: true, data: lista };
  } catch(e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Busca as liberações recentes para compor os cards da tela inicial do módulo.
 * Foca em exibir o que está válido hoje e nos últimos 5 dias.
 */
function mobileFetchHistoricoLiberacoes() {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const liberacoes = getCachedData_("LIBERACOES", CONFIG.planilhas.prestadores) || [];
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    
    const limitePassado = new Date(hoje);
    limitePassado.setDate(limitePassado.getDate() - 15); // Puxa os últimos 15 dias por segurança

    const listaCards = [];
    let kpiHoje = 0;

    liberacoes.forEach(lib => {
        if (!lib.liberacao_id) return;

        const dtInicio = parseDateSafe_(lib.prestador_datainicioliberacao);
        const dtFim = parseDateSafe_(lib.prestador_datafimliberacao);
        const dtRegistro = parseDateSafe_(lib.data_registro);

        if (!dtInicio || !dtFim || dtRegistro < limitePassado) return;

        // Limpa as horas para comparar apenas os dias
        dtInicio.setHours(0,0,0,0);
        dtFim.setHours(23,59,59,999);

        let status = "Encerrado";
        let statusColor = "secondary";

        if (hoje >= dtInicio && hoje <= dtFim) {
            status = "Ativo Hoje";
            statusColor = "success";
            kpiHoje++;
        } else if (hoje < dtInicio) {
            status = "Agendado";
            statusColor = "primary";
        }

        // Formatação de datas para exibição
        const strInicio = Utilities.formatDate(dtInicio, "GMT-3", "dd/MM/yyyy");
        const strFim = Utilities.formatDate(dtFim, "GMT-3", "dd/MM/yyyy");
        const periodoStr = (strInicio === strFim) ? strInicio : `${strInicio} a ${strFim}`;

        listaCards.push({
            id: lib.liberacao_id,
            prestador: lib.prestador_nome,
            fornecedor: lib.fornecedor_descricao,
            local: lib.prestador_local,
            periodo: periodoStr,
            status: status,
            statusColor: statusColor,
            timestamp: dtRegistro ? dtRegistro.getTime() : 0 // Para ordenação
        });
    });

    // Ordena: Primeiro os Ativos Hoje, depois Agendados, depois Encerrados (mais recentes primeiro)
    listaCards.sort((a, b) => {
        if (a.status === "Ativo Hoje" && b.status !== "Ativo Hoje") return -1;
        if (b.status === "Ativo Hoje" && a.status !== "Ativo Hoje") return 1;
        
        if (a.status === "Agendado" && b.status !== "Agendado") return -1;
        if (b.status === "Agendado" && a.status !== "Agendado") return 1;

        return b.timestamp - a.timestamp;
    });

    return { 
        success: true, 
        data: {
            lista: listaCards.slice(0, 30), // Limita aos 30 cards mais relevantes
            kpiAtivosHoje: kpiHoje
        }
    };
  } catch(e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Salva o novo cadastro de prestador vindo do celular.
 */
function mobileSalvarNovoPrestador(dados) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(e) { return { success: false, error: "Sistema ocupado. Tente novamente." }; }

  try {
    const ss = SpreadsheetApp.openById(CONFIG.planilhas.prestadores);
    const sheet = ss.getSheetByName("PRESTADORES");
    
    // Validação básica do CPF (se preenchido, remove formatação)
    const cpfLimpo = dados.cpf ? String(dados.cpf).replace(/\D/g, '') : '';
    
    const novoId = Utilities.getUuid();
    
    sheet.appendRow([
        novoId, 
        String(dados.nome).trim().toUpperCase(),
        cpfLimpo,
        String(dados.email).trim().toLowerCase(),
        String(dados.empresa).trim().toUpperCase(),
        new Date()
    ]);
    
    SpreadsheetApp.flush();
    invalidateSheetCache_("PRESTADORES", CONFIG.planilhas.prestadores);

    return { 
        success: true, 
        message: "Prestador cadastrado com sucesso!",
        novoPrestador: {
            id: novoId,
            nome: String(dados.nome).trim().toUpperCase(),
            cpf: cpfLimpo,
            fornecedor: String(dados.empresa).trim().toUpperCase(),
            email: String(dados.email).trim().toLowerCase()
        }
    };
  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

// =================================================================
// MÓDULO MOBILE: GESTÃO DE EMPRÉSTIMOS (mobile_api.gs)
// =================================================================

/**
 * [MOBILE] Busca apenas os empréstimos ativos (Não devolvidos) para a tela inicial.
 * Destaca os atrasados.
 */
function mobileFetchEmprestimosAtivos() {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    // Reaproveita a sua função nativa que já cruza e enriquece os dados perfeitamente!
    const todosEmprestimos = getEmprestimosTableData();
    if (todosEmprestimos.error) throw new Error(todosEmprestimos.error);

    // Filtra apenas os que não foram devolvidos
    const ativos = todosEmprestimos.filter(e => e.status !== 'Devolvido');

    let kpiAtrasados = 0;
    
    const listaMobile = ativos.map(e => {
        if (e.status === 'Atrasado') kpiAtrasados++;
        
        return {
            id: e.emprestimo_id,
            item: e.item_visual,
            destino: e.destino_visual,
            responsavel: e.responsavel_retirada_nome,
            status: e.status,
            dias: e.dias_decorridos,
            tag: e.equipamento_id ? 'Ativo' : 'Avulso'
        };
    });

    return { 
        success: true, 
        data: { lista: listaMobile, kpiAtrasados: kpiAtrasados } 
    };
  } catch(e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Busca um equipamento específico pela TAG para EMPRESTAR.
 * Valida se ele já não está emprestado.
 */
function mobileBuscarEquipamentoParaEmprestimo(termo) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const termoLimpo = String(termo).trim().toUpperCase();
    if (!termoLimpo) throw new Error("Termo vazio.");

    // Busca o equipamento
    const equipamentos = getCachedData_("EQUIPAMENTOS", CONFIG.planilhas.equipamentos) || [];
    const eq = equipamentos.find(e => 
      String(e.equipamento_tag).toUpperCase() === termoLimpo || 
      String(e.serie).toUpperCase() === termoLimpo ||
      String(e.equipamento_id) === termoLimpo
    );

    if (!eq) return { success: false, message: "Equipamento não localizado na base." };
    if (eq.equipamento_ativo !== 'Ativo') return { success: false, message: "Este equipamento consta como Inativo/Baixado." };

    // Verifica se já está emprestado
    const emprestimos = getCachedData_("EMPRESTIMOS", CONFIG.planilhas.emprestimos) || [];
    const ocupado = emprestimos.find(emp => String(emp.equipamento_id) === String(eq.equipamento_id) && emp.status !== 'Devolvido');
    
    if (ocupado) {
        return { success: false, message: `Equipamento já está emprestado para ${ocupado.responsavel_retirada_nome}.` };
    }

    return { 
        success: true, 
        data: {
            id: eq.equipamento_id,
            tag: eq.equipamento_tag,
            descricao: eq.equipamento_descricaocompleta
        } 
    };
  } catch(e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Busca um empréstimo ATIVO pela TAG do equipamento ou Nome do Item Avulso para DEVOLVER.
 */
function mobileBuscarEmprestimoParaDevolver(termo) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const termoLimpo = String(termo).trim().toUpperCase();
    if (!termoLimpo) throw new Error("Termo vazio.");

    // Reaproveita sua função enriquecida
    const todosEmprestimos = getEmprestimosTableData();
    if (todosEmprestimos.error) throw new Error(todosEmprestimos.error);

    // Tenta achar o empréstimo ativo por TAG (se for ativo) ou pelo Nome (se for avulso)
    const emp = todosEmprestimos.find(e => {
        if (e.status === 'Devolvido') return false;
        
        const isTagMatch = e.equipamento_id && (String(e.item_visual).toUpperCase().includes(termoLimpo) || String(e.equipamento_id) === termoLimpo); // A sua função getEmprestimosTableData já injeta a TAG na descrição? Se não, vamos buscar flexível.
        const isNomeMatch = String(e.item_visual).toUpperCase().includes(termoLimpo);
        
        return isTagMatch || isNomeMatch;
    });

    if (!emp) return { success: false, message: "Nenhum empréstimo pendente encontrado com este termo." };

    return { 
        success: true, 
        data: {
            id: emp.emprestimo_id,
            item: emp.item_visual,
            responsavel: emp.responsavel_retirada_nome,
            destino: emp.destino_visual,
            data_saida: emp.data_saida_fmt
        } 
    };
  } catch(e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Busca a lista de Ressonâncias Magnéticas de forma leve para o Select.
 */
function mobileFetchRMsParaHelio() {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const cache = CacheService.getScriptCache();
    const MRI_CACHE_KEY = 'HELIO_MRI_LIST_V2'; 
    let mriList;
    const cachedMriList = cache.get(MRI_CACHE_KEY);

    if (cachedMriList) {
      mriList = JSON.parse(cachedMriList);
    } else {
      const todosEquipamentos = getCachedData_("EQUIPAMENTOS", CONFIG.planilhas.equipamentos) || [];
      
      // Busca pelo termo na descrição do tipo, garantindo que pegue RMs
      mriList = todosEquipamentos
        .filter(eq => String(eq.tipoequipamento_descricao).toLowerCase().includes("ressonância") && eq.equipamento_ativo === 'Ativo')
        .map(eq => ({ 
            id: eq.equipamento_id, 
            tag: eq.equipamento_tag,
            nome: eq.equipamento_descricaocompleta
        }))
        .sort((a, b) => (a.tag || '').localeCompare(b.tag || ''));
        
      if(mriList.length > 0) {
          cache.put(MRI_CACHE_KEY, JSON.stringify(mriList), 21600); // 6 horas
      }
    }

    return { success: true, data: mriList };
  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}


// =================================================================
// MÓDULO MOBILE: GESTÃO DE CHAMADOS 
// =================================================================

// =================================================================
// WAPPERS SEGUROS PARA AÇÕES DE CHAMADOS (MOBILE)
// =================================================================

function mobileReceberChamado(chamadoId) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}
  
  try {
    const email = Session.getActiveUser().getEmail().toLowerCase().trim();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(x => String(x.usuario_email).toLowerCase().trim() === email);
    
    if (!userObj) return { success: false, error: "Seu usuário não foi encontrado no cadastro." };
    
    const tecnicoInfo = { name: userObj.usuario_nome, email: userObj.usuario_email };
    return receberChamado(chamadoId, tecnicoInfo, CONFIG.planilhas.chamados);
  } finally {
    lock.releaseLock();
  }
}

function mobileEncerrarChamado(dados) { return encerrarChamado(dados, CONFIG.planilhas.chamados); }
function mobileTransferirChamado(dados) { return transferirChamado(dados, CONFIG.planilhas.chamados); }
function mobileRecusarChamado(dados) { return recusarChamado(dados, CONFIG.planilhas.chamados); }
function mobileVerificarBloqueioApoio(chamadoId) { return verificarBloqueioApoio(chamadoId, CONFIG.planilhas.chamados); }
function mobileIniciarApoioTecnico(dados) { return iniciarApoioTecnico(dados, CONFIG.planilhas.chamados); }

/**
 * [MOBILE V3 - Pool de Setores] Salva as responsabilidades cirurgicamente.
 * Se marcar salas específicas: Atualiza apenas as SALAS. Deixa o SETOR vazio (Pool).
 * Se marcar o setor inteiro (sem salas): Atualiza o SETOR como Dono Global.
 */
function mobileSalvarResponsabilidades(payload) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch(e) { return { success: false, error: "Servidor ocupado. Tente novamente." }; }

  try {
    const email = Session.getActiveUser().getEmail().toLowerCase().trim();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).toLowerCase().trim() === email);
    if (!userObj) throw new Error("Usuário não encontrado.");
    
    const uid = String(userObj.usuario_id).trim();
    const unome = userObj.usuario_nome;
    const uemail = userObj.usuario_email;
    const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

    const ss = SpreadsheetApp.openById(CONFIG.planilhas.principal);
    
    // 1. Atualiza Centros de Custo (Setores)
    const sheetResp = ss.getSheetByName("RESPONSAVEIS_SETOR");
    const data = sheetResp.getDataRange().getDisplayValues();
    let mudouSetores = false;
    
    for (let i = 1; i < data.length; i++) {
        const rowId = String(data[i][0]).trim();
        
        if (payload.marcados.includes(rowId)) {
            // LÓGICA DE POOL: Ele marcou salas específicas deste setor?
            const marcouSalasEspecificas = payload.salas[rowId] && payload.salas[rowId].length > 0;
            
            if (marcouSalasEspecificas) {
                // Se marcou salas específicas, ele NÃO é o dono do setor todo.
                // Limpa o setor se ele era o dono antes.
                if (String(data[i][2]).trim() === uid) {
                    data[i][2] = ''; data[i][3] = ''; data[i][4] = ''; data[i][5] = '';
                    mudouSetores = true;
                }
            } else {
                // Assumiu o setor TODO (Líder/Dono Global)
                data[i][2] = uid;
                data[i][3] = unome;
                data[i][4] = uemail;
                data[i][5] = now;
                mudouSetores = true;
            }
        } else if (payload.desmarcados.includes(rowId)) {
            // Desmarcou o setor. Só limpa se o dono atual for EU.
            if (String(data[i][2]).trim() === uid) {
                data[i][2] = ''; data[i][3] = ''; data[i][4] = ''; data[i][5] = '';
                mudouSetores = true;
            }
        }
    }
    if (mudouSetores) sheetResp.getRange(1, 1, data.length, data[0].length).setValues(data);
    
    // 2. Atualiza as Salas (Sub-setores)
    const sheetSalas = ss.getSheetByName("RESPONSAVEIS_SALA");
    if (sheetSalas && sheetSalas.getLastRow() > 1) {
       const dataSalas = sheetSalas.getDataRange().getDisplayValues();
       let mudouSalas = false;
       
       for (let i = 1; i < dataSalas.length; i++) {
           const sCc = String(dataSalas[i][0]).trim();
           const sNome = String(dataSalas[i][1]).trim();
           
           if (payload.marcados.includes(sCc)) {
               // Setor marcado. Marcou essa sala específica?
               if (payload.salas[sCc] && payload.salas[sCc].includes(sNome)) {
                   dataSalas[i][2] = uid; dataSalas[i][3] = unome; dataSalas[i][4] = now;
                   mudouSalas = true;
               } else {
                   // Não marcou essa sala. Mas se o setor INTEIRO foi assumido, ele ganha a sala por herança!
                   const marcouSetorInteiro = !payload.salas[sCc] || payload.salas[sCc].length === 0;
                   if (marcouSetorInteiro) {
                        dataSalas[i][2] = uid; dataSalas[i][3] = unome; dataSalas[i][4] = now;
                        mudouSalas = true;
                   } else {
                       // Não marcou a sala, e marcou outras salas. Então limpa se era minha.
                       if (String(dataSalas[i][2]).trim() === uid) {
                           dataSalas[i][2] = ''; dataSalas[i][3] = ''; dataSalas[i][4] = '';
                           mudouSalas = true;
                       }
                   }
               }
           } else if (payload.desmarcados.includes(sCc)) {
               // Setor desmarcado. Limpa as salas dele que eram minhas.
               if (String(dataSalas[i][2]).trim() === uid) {
                   dataSalas[i][2] = ''; dataSalas[i][3] = ''; dataSalas[i][4] = '';
                   mudouSalas = true;
               }
           }
       }
       if (mudouSalas) sheetSalas.getRange(1, 1, dataSalas.length, dataSalas[0].length).setValues(dataSalas);
    }
    
    // 3. A MÁGICA: TRANSFERÊNCIA AUTOMÁTICA DA FILA DE CHAMADOS
    if (payload.marcados.length > 0) {
        try {
            const ssChamados = SpreadsheetApp.openById(CONFIG.planilhas.chamados);
            const sheetChamados = ssChamados.getSheetByName("CHAMADOS");
            
            if (sheetChamados && sheetChamados.getLastRow() > 1) {
                const chamadosData = sheetChamados.getDataRange().getValues();
                let chamadosAtualizados = false;

                const headers = chamadosData[0];
                const idxStatus = headers.indexOf('chamado_status');
                const idxCcId = headers.indexOf('cc_id');
                const idxSala = headers.indexOf('chamado_sala');
                const idxTecId = headers.indexOf('usuario_id');
                const idxTecNome = headers.indexOf('tecnico_nome');

                for (let i = 1; i < chamadosData.length; i++) {
                    const status = chamadosData[i][idxStatus];
                    
                    if (status === 'Aberto' || status === 'Em Atendimento') {
                        const cCcId = String(chamadosData[i][idxCcId]).trim();
                        const cSala = String(chamadosData[i][idxSala]).trim();
                        const tecnicoAtual = String(chamadosData[i][idxTecId]).trim();
                        
                        if (payload.marcados.includes(cCcId)) {
                            let devoAssumir = false;
                            
                            // Lógica de Transferência de Sala vs Setor
                            if (payload.salas[cCcId] && payload.salas[cCcId].length > 0) {
                                // Assumiu salas específicas. O chamado é dessa sala?
                                if (payload.salas[cCcId].includes(cSala)) devoAssumir = true;
                            } else {
                                // Assumiu o setor todo. Rouba todos os chamados do setor (com sala ou sem sala).
                                devoAssumir = true;
                            }
                            
                            // Se não era meu, agora é!
                            if (devoAssumir && tecnicoAtual !== uid) {
                                chamadosData[i][idxTecId] = uid;
                                chamadosData[i][idxTecNome] = unome;
                                chamadosAtualizados = true;
                            }
                        }
                    }
                }

                if (chamadosAtualizados) {
                    sheetChamados.getRange(1, 1, chamadosData.length, chamadosData[0].length).setValues(chamadosData);
                    invalidateSheetCache_("CHAMADOS", CONFIG.planilhas.chamados);
                    PropertiesService.getScriptProperties().setProperty('LAST_CHAMADOS_UPDATE', new Date().getTime().toString());
                }
            }
        } catch (errChamados) {
            Logger.log("Aviso: Falha ao transferir fila: " + errChamados.stack);
        }
    }

    SpreadsheetApp.flush();
    invalidateSheetCache_("CENTROS", CONFIG.planilhas.principal);
    
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [MOBILE] Busca os chamados ativos separados por "Meus" e "Equipe".
 * Payload ultra-otimizado apenas com os campos necessários para os Cards.
 */
function mobileFetchChamadosPainel() {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}

  try {
    const userEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).toLowerCase().trim() === userEmail);
    if (!userObj) throw new Error("Usuário não encontrado.");
    
    const meuNome = userObj.usuario_nome;
    
    const chamadosBrutos = getActiveChamados(CONFIG.planilhas.chamados);
    if (chamadosBrutos.error) throw new Error(chamadosBrutos.error);

    const meusChamados = [];
    const equipeChamados = [];

    chamadosBrutos.forEach(c => {
      // O cronômetro conta da Abertura se estiver "Aberto", ou do Início se estiver "Em Atendimento"
      let startTime = '';
      if (c.chamado_status === 'Aberto') {
          startTime = c.chamado_dataabertura ? new Date(c.chamado_dataabertura).toISOString() : '';
      } else {
          startTime = c.chamado_inicioatendimento ? new Date(c.chamado_inicioatendimento).toISOString() : (c.chamado_dataabertura ? new Date(c.chamado_dataabertura).toISOString() : '');
      }

      // Limpeza do nome do equipamento (Se for lixo, manda vazio para o front ocultar)
      let equipLimpo = c.equipamento_descricaocompleta || c.equipamento_tag || '';
      if (equipLimpo === 'Problema Geral' || equipLimpo === 'Equipamento Geral' || equipLimpo === 'Equipamento não especificado') {
          equipLimpo = '';
      }

      const cardData = {
        id: c.chamado_id,
        numero: c.chamado_numero || 'S/N',
        status: c.chamado_status,
        prioridade: c.chamado_prioridade || 'Normal',
        setor: c.cc_descricao || 'N/D',
        sala: c.chamado_sala || '',
        problema: c.chamado_descricaoproblema || '',
        equipamento: equipLimpo,
        tecnico: c.tecnico_nome || '',
        startTime: startTime,
        timestamp: new Date(c.chamado_dataabertura).getTime()
      };

      // Separação Lógica
      if (c.tecnico_nome === meuNome || (!c.tecnico_nome && c.usuario_id === String(userObj.usuario_id))) {
        meusChamados.push(cardData);
      } else {
        equipeChamados.push(cardData);
      }
    });

    const sortCards = (a, b) => {
        const weight = { 'Crítica': 4, 'Alta': 3, 'Normal': 2, 'Baixa': 1 };
        const pA = weight[a.prioridade] || 0;
        const pB = weight[b.prioridade] || 0;
        if (pA !== pB) return pB - pA;
        return a.timestamp - b.timestamp;
    };

    meusChamados.sort(sortCards);
    equipeChamados.sort(sortCards);

    return { success: true, data: { meus: meusChamados, equipe: equipeChamados, meuUserId: userObj.usuario_id } };

  } catch (e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}


/**
 * [MOBILE] Polling ultra-rápido O(1).
 * Lê apenas o PropertiesService para dizer ao frontend se houve alguma alteração global na fila.
 */
function mobilePollNotificacoes(clientLastUpdate) {
  try {
    const serverTimeStr = PropertiesService.getScriptProperties().getProperty('LAST_CHAMADOS_UPDATE') || '0';
    const serverTime = parseInt(serverTimeStr);
    const clientTime = parseInt(clientLastUpdate || '0');

    return { 
        success: true, 
        hasUpdates: serverTime > clientTime, 
        newTimestamp: serverTimeStr 
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}


/**
 * [MOBILE] Busca a lista de setores de forma estruturada para o Accordion de Responsabilidades
 */
function mobileFetchResponsabilidadesMatriz() {
  try {
    const data = getSectorsResponsibilityStatus();
    if (data.error) throw new Error(data.error);
    
    // Precisamos também das salas para montar o seletor interno
    const ss = SpreadsheetApp.openById(CONFIG.planilhas.principal);
    const sheetSalas = ss.getSheetByName("SETOR_SALAS");
    const salas = sheetSalas && sheetSalas.getLastRow() > 1 ? objectifyRows(sheetSalas.getDataRange().getValues()) : [];

    const userEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).toLowerCase().trim() === userEmail);
    const meuId = userObj ? String(userObj.usuario_id) : '';

    const formatado = data.data.map(setor => {
        const setorSalas = salas.filter(s => String(s.cc_id) === String(setor.cc_id) && s.sala_ativo === 'Ativo').map(s => s.sala_nome);
        return {
            cc_id: setor.cc_id,
            cc_descricao: setor.cc_descricao,
            est_descricao: setor.est_descricao,
            is_meu: String(setor.responsavel_id) === meuId,
            tem_outro_dono: setor.responsavel_id && String(setor.responsavel_id) !== meuId,
            dono_nome: setor.responsavel_nome,
            salas: setorSalas
        };
    });

    return { success: true, lista: formatado };
  } catch (e) {
    return { success: false, error: e.message };
  }
}


/**
 * [MOBILE] Busca a produtividade, horas lançadas e eventos do calendário do usuário logado.
 * Calcula KPIs proporcionalmente até o dia atual ("até o momento") se for o mês vigente.
 */
function mobileFetchJornadaProdutividade(ano, mes) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(5000); } catch(e) {}
  
  try {
    const userEmail = Session.getActiveUser().getEmail().trim().toLowerCase();
    const allUsers = getCachedData_("USUARIOS", CONFIG.planilhas.usuarios) || [];
    const userObj = allUsers.find(u => String(u.usuario_email).trim().toLowerCase() === userEmail);
    if (!userObj) throw new Error("Usuário não encontrado.");
    const uid = String(userObj.usuario_id);

    const mesIdx = parseInt(mes) - 1; // JS usa mês Base 0 (Jan = 0)
    const anoNum = parseInt(ano);
    const CARGA_DIARIA = 8.8; // Carga diária padrão do sistema

    const diasNoMes = new Date(anoNum, mesIdx + 1, 0).getDate();
    const hoje = new Date();
    
    // Inteligência "Até o momento": Se for mês atual, base de cálculo é até o dia de hoje.
    let diasBase = diasNoMes;
    if (anoNum === hoje.getFullYear() && mesIdx === hoje.getMonth()) {
        diasBase = hoje.getDate();
    } else if (anoNum > hoje.getFullYear() || (anoNum === hoje.getFullYear() && mesIdx > hoje.getMonth())) {
        diasBase = 0; // Mês no futuro
    }

    // 1. Busca Eventos (Ausências e Férias)
    const eventosRaw = getCachedData_("CALENDARIO_EVENTOS", CONFIG.planilhas.produtividade) || [];
    let diasAusenciaAteHoje = 0;
    let diasAusenciaTotalMes = 0;
    const eventosMobile = [];

    eventosRaw.forEach(ev => {
        if (String(ev.usuario_id) !== uid || !ev.data_inicio) return;
        const dt = new Date(ev.data_inicio);
        
        if (dt.getFullYear() === anoNum && dt.getMonth() === mesIdx) {
            const tipo = String(ev.tipo_evento).toLowerCase();
            const diaDoEvento = dt.getDate();

            const isAusencia = tipo.includes('férias') || tipo.includes('ferias') || 
                               tipo.includes('folga') || tipo.includes('ausência') || 
                               tipo.includes('atestado') || tipo.includes('falta');

            if (isAusencia) {
                diasAusenciaTotalMes++;
                if (diaDoEvento <= diasBase) diasAusenciaAteHoje++;
            }
            
            // Separa pro frontend montar a lista de cards
            eventosMobile.push({
                id: ev.evento_id,
                start: dt.toISOString(), // Mantém ISO para o front tratar fuso
                title: ev.tipo_evento,
                extendedProps: { tipo: ev.tipo_evento, descricao: ev.descricao || '' }
            });
        }
    });

    // 2. Busca Horas Lançadas (Produtividade)
    const servicosRaw = getCachedData_("SERVICOS_CONSOLIDADOS", CONFIG.planilhas.produtividade) || [];
    let horasLancadas = 0;

    servicosRaw.forEach(s => {
        if (String(s.usuario_id) !== uid) return;
        const rawDate = s.data_servico || s.hora_inicio;
        if (!rawDate) return;
        
        const dt = new Date(rawDate);
        if (dt.getFullYear() === anoNum && dt.getMonth() === mesIdx) {
            horasLancadas += parseFloat(s.duracao_horas || 0);
        }
    });

    // 3. Cálculos Exatos Solicitados
    const diasTrabalhados = Math.max(0, diasBase - diasAusenciaAteHoje);
    const horasTrabalhadas = diasTrabalhados * CARGA_DIARIA;
    
    let produtividade = 0;
    if (horasTrabalhadas > 0) produtividade = (horasLancadas / horasTrabalhadas) * 100;
    else if (horasLancadas > 0) produtividade = 100;

    return {
        success: true,
        data: {
            kpis: {
                diasTrabalhados: diasTrabalhados,
                ausencias: diasAusenciaTotalMes, // Exibe o total de ausências programadas no mês
                horasTrabalhadas: horasTrabalhadas.toFixed(1),
                horasLancadas: horasLancadas.toFixed(1),
                produtividade: produtividade.toFixed(1)
            },
            eventos: eventosMobile
        }
    };
  } catch(e) {
    return { success: false, error: e.message };
  } finally {
    lock.releaseLock();
  }
}

