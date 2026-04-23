// =================================================================
// PROJETO SIRIUS - CONFIGURAÇÃO CENTRALIZADA DO BACKEND (code.gs)
// =================================================================

const CONFIG = {
  planilhas: {
    principal: "1uPh-rc8sw5YpqdqyqBxQxbN7blLJujq4Ncvb9cX32F0",
    usuarios: "14cwCMBL3PqRiLwGJ_sr7Hy1sBbVrUIFxwjp7DrB8wUs",
    equipamentos: "11D8EIpa8pTo2eZt3snsnjUOU8xh2MXx-LWAVRCk1dMg",
    corretivas: "1BPO6TdKat4ZTMvF51KEdXYEpeBZzcPryl3Aa6KAC_WQ",
    preventivas: "1iE-Rkd5vTFlg5po8TjfRN_Suoe-YBYfZGuDd9x9RooM",
    errosOperacao: "1H4kTJM3TVLiJ2sHhdqYJmqkBwU0ueBS69M8_J-wCfPw",
    rotas: "1OKTqJlrsQG6GnKV067oa3w_KYzvtbKA0g-mLtp86iXs",
    treinamentos: "1WQTh91zuoEHeTqVz07ASA71eJdL-Gb8PMAn32Ebbw1Y",
    chamados: "17-xdjej0F17GuD8jrVlcKiHeW5HekBR2r8xe3RDSuqQ",
    aquisicoes: "1IFpBSJPxPXVq-At-cdDfkbGS3K3UNMeoLAVP2blT378",
    contratos: "1hmSEgG-Rq6Q1xvv21kH0ttp0fSVwYJlj1PDWEOmKL50",
    cartaSaida: "1COvBlz6OxMhSV0okqCo_UtUPeXVSG_9RBkV2oseyR38",
    helio: "13iTnscV4R_Gc7IAGimhkIWuNv8Pzt7rmLiHg4dqsP3E",
    produtividade: "1NVn4lxvjyuUeZuOesPgt3EqDAT4jFpQz9kLCgHM70vE",
    manuais: "1-rncvhgfBixCAbUAeLFZ_Ks7h6QCikiz_wZDf6qnQZ4",
    queixastecnicas: "1hAnmb-1W1U-uAsMjsqcHhVJQ0s3vENksZda9LXGW3CU",
    tecnovigilancia: "15F2SZVLQtWWxqSXNEMKthtNtgUhEmsVp_HK36dVfhgc",
    demonstracoes: "1zcdwIy44j2DsdFa8enCllALVh9UJJJe0Q-Ujv1xL6nc",
    controleQualidade: "1OYet9Y-1gvZBb7kB3iGLzLfV-eL8KCQ8M5rg5CpNhto",
    cqEquipamentos: "139_n87TIUftpw7g6EAZYT9sjCbfCCtDVcyG7Sn9NKeM",
    levantamentoRadiometrico: "1pfhKM2pmo2uohV-obIyk56KFViVr_Zi9VxG0Gd4y1_0",
    alvaras: "1uBlHnNvciemCdfHD4njOSj7FLYnPP7ukToxtMqdNn8g",
    oticas: "1DRuAm0IDsiGy1ulpLyj3DgbHj7pnkQyVGPW5nlWXj8M",
    reports: "1t5_Y4w9a3LprtHX9yciwkSFLxkumX7xAXnoNn-gPD5Q",
    emprestimos: "10ubeM1K91pxPGxVnmeUUAqb5cARbb81NlBH57vaNqpE",
    consignados: "1oI_PYULLzV6S-_YTfx2MnYqM2aciudtKalVcIStqi_Y",
    prestadores: "1uANaIXClA_12plyKjPwKjFEFpsFhXsim9-KIPA8-kpc",
    demandas: "17zzhmMryaWnFfkX163vEl-cAmD45LnrRSHBI17B1p6o",
    tco: "1sMCzuX65d1XTUJV0Tb_rnDrt-jA46fQLXgnfmMZlv0U"
  },
  manuaisFolderId: "1BX-mLGz7txO-4dgqBr-GDJ-mmaf4UWSM",
  cqReportsFolderId: "1SVKsYWyugwzAVl6FRRMxmUNUBvuZXhHe",
  cqEquipamentosReportsFolderId: "1juPNmtvPjR5RECQkmGxQmGsYtkFtNvig",
  levantamentoReportsFolderId: "1K0jGi4y4EalLYT_FHTTQKfDNv38xqMy7",
  alvarasReportsFolderId: "1e318-Q15Ow1ZDJcNqfRW4GeclXsq9MD-",
  relatoriosCorretivaFolderId: "16AKh8_RBkQuQhhM4Ji5NAmwjbEyoIQOz",
  preventivaReportsFolderId: "1oecCrJ91md0YyU2mNIvc3RupkG6HWWSk",
  instalacoesFolderId: "1QgiWtfmWOkIW0qepME9GTNvi1d9p0UQj",
  contractsFolderId: "1lQwgxz1ygCtPVNLmZLItWOxi2s18OhG1",
  reportsFolderId: "1YgUGcwKTkHpPPXKzWhXVnNhnwtinUSvo",
  preventivaConsignadosFolderId: "1UlApLthhFrL8VE-0YystioBQMLPkkHLT",
  valeConsignadosFolderId: "1CB45O2TKMZ8yACxAM47TMgVECenbTGDN",
  orccamentosFolderId: "1fOMkyAX_82w0dxHQUzf1NsEzmcron_QU",
  comprasFolderId: "1pqGm6CSQiK6F7Od3grPtzpPNkN7OHxc0",
  desativacaoFolderId: "1dpN5Rht54udsXqKp-81tRdcCB8aa008k",
  cartasSaidaFolderId: "1a5qDAEkDf8HchlKPuLuX1EAkXKngNQNB",
  demandasFolderId: "1M5z0-fC4P9WID6JK6B7opURcVqOSGXOY",

  status: {
    corretivaAberta: '1',
    preventivaProgramada: 'a3e8e7c1-2e6b-4b1f-8a0a-4c8d1f2a9b3d'
  }
};



function getGlobalConfig() {
  return CONFIG;
}

function getDropdownConfig() {
  return DROPDOWN_CONFIG;
}

// Abre a planilha principal de Cadastros
const ss = SpreadsheetApp.openById(CONFIG.planilhas.principal);


// Mapeamento completo dos nomes das abas
const SHEETS = {
  ESTABELECIMENTOS: "ESTABELECIMENTOS", UNIDADES: "UNIDADES", CENTROS: "CENTROS",
  TIPOS_EQUIPAMENTO: "TIPOS_EQUIPAMENTO", FORNECEDORES: "FORNECEDORES", FABRICANTES: "FABRICANTES",
  MODELOS: "MODELOS", DEPRECIACAO: "DEPRECIACAO",
  CLASSIFICACAO_RISCO: "CLASSIFICACAO_RISCO", CLASSIFICACAO_ELETRICA: "CLASSIFICACAO_ELETRICA",
  PERIODICIDADE: "PERIODICIDADE",
  CARGOS: "CARGOS", EQUIPES: "EQUIPES", ESCALAS: "ESCALAS", PERMISSOES: "PERMISSOES",
  RC_MODALIDADE: "RC_MODALIDADE", RC_STATUS: "RC_STATUS", RC_CONTACONTABIL: "RC_CONTACONTABIL",
  RC_PEP: "RC_PEP", RC_COMPRADOR: "RC_COMPRADOR", STATUSCORRETIVA: "STATUSCORRETIVA",
  FALHAS: "FALHAS",
  CAUSAS: "CAUSAS",
  ACOES: "AÇÕES",
  LOGS: "LOGS",
  EQUIPAMENTOS: "EQUIPAMENTOS",
  INSTALACOES: "INSTALACOES",
  CHAMADOS: "CHAMADOS",
  CORRETIVAS: "CORRETIVAS",
  TIPOPLANO: "TIPOPLANO",
  PLANOPREVENTIVO: "PLANOPREVENTIVO",
  CADASTROCHECKLISTINSPECAO: "CADASTROCHECKLISTINSPECAO",
  CADASTROCHECKLISTSEGELET: "CADASTROCHECKLISTSEGELET",
  CADASTROCHECKLISTCALIBRACAO_MASTER: "CADASTROCHECKLISTCALIBRACAO_MASTER",
  CADASTROCHECKLISTCALIBRACAO_ITENS: "CADASTROCHECKLISTCALIBRACAO_ITENS",
  GRANDEZAS: "GRANDEZAS",
  STATUSPREVENTIVA: "STATUSPREVENTIVA",
  STATUSOPERACIONAL: "STATUSOPERACIONAL",
  TIPO_PROPRIEDADE: "TIPO_PROPRIEDADE",
  CADASTRO_ROTAS: "CADASTRO_ROTAS",
  TREINAMENTOS_MASTER: "TREINAMENTOS_MASTER",
  TREINAMENTOS_PARTICIPACAO: "TREINAMENTOS_PARTICIPACAO",
  QUIZ_PERGUNTAS: "QUIZ_PERGUNTAS",
  QUIZ_ALTERNATIVAS: "QUIZ_ALTERNATIVAS",
  TRILHAS_MASTER: "TRILHAS_MASTER",
  TRILHAS_TREINAMENTOS: "TRILHAS_TREINAMENTOS",
  PADRAO_GRANDEZAS: "PADRAO_GRANDEZAS",
  PREVENTIVAS: "PREVENTIVAS",
  PREVENTIVA_PADROES_UTILIZADOS: "PREVENTIVA_PADROES_UTILIZADOS",
  CONTRATO_ADVOGADOS: "CONTRATO_ADVOGADOS",
  MANUAIS: "MANUAIS",
  SERVICOS_CONSOLIDADOS: "SERVICOS_CONSOLIDADOS",
  CALENDARIO_JORNADA: "CALENDARIO_JORNADA",
  QUEIXAS_TECNICAS: "QUEIXAS_TECNICAS",
  QUEIXAS_HISTORICO: "QUEIXAS_HISTORICO",
  STATUS_QUEIXA: "STATUS_QUEIXA",
  CAUSA_RAIZ_ISHIKAWA: "CAUSA_RAIZ_ISHIKAWA",
  ALERTAS_ANVISA_MASTER: "ALERTAS_ANVISA_MASTER",
  ALERTAS_ANVISA_ACOES: "ALERTAS_ANVISA_ACOES",
  DEMONSTRACOES_MASTER: "DEMONSTRACOES_MASTER",
  DEMONSTRACOES_EQUIPAMENTOS: "DEMONSTRACOES_EQUIPAMENTOS",
  DEMONSTRACOES_AVALIACOES: "DEMONSTRACOES_AVALIACOES",
  CADASTRO_JUSTIFICATIVAS: "CADASTRO_JUSTIFICATIVAS",
  CATALOGO_ITENS: "CATALOGO_ITENS",
  ESTOQUE_ENTRADAS: "ESTOQUE_ENTRADAS",
  ESTOQUE_CONSUMO: "ESTOQUE_CONSUMO",
  NF_ITENS: "NF_ITENS",
  CORRETIVAS_RELATORIOS: "CORRETIVAS_RELATORIOS",
  PREVENTIVAS_RELATORIOS: "PREVENTIVAS_RELATORIOS",
  NF: "NF",
  ACESSORIOS: "ACESSORIOS",
  TIPO_ACESSORIO: "TIPO_ACESSORIO",
  OTICAS: "OTICAS",
  OTICA_TESTE: "OTICA_TESTE",
  OTICA_REPARO: "OTICA_REPARO",
  OTICA_CONTRATO: "OTICA_CONTRATO",
  OTICA_TIPO: "OTICA_TIPO",
  OTICA_ESPECIALIDADE: "OTICA_ESPECIALIDADE",
  OTICA_ANGULACAO: "OTICA_ANGULACAO",
  OTICA_COMPRIMENTO: "OTICA_COMPRIMENTO",
  OTICA_DIAMETRO: "OTICA_DIAMETRO",
  OTICA_REFERENCIA: "OTICA_REFERENCIA",
  MOTIVOS_REJEICAO_QA: "MOTIVOS_REJEICAO_QA",
  METAS_INDICADORES: "METAS_INDICADORES"
  
};

// --- MAPA DE BUSCA DE DESCRIÇÕES (LOOKUP)
const LOOKUP_MAP = {
  'fabricante_id': { sheetName: SHEETS.FABRICANTES, idField: 'fabricante_id', descField: 'fabricante_descricao' },
  'est_id': { sheetName: SHEETS.ESTABELECIMENTOS, idField: 'est_id', descField: 'est_descricao' },
  'equipe_id': { sheetName: SHEETS.EQUIPES, idField: 'equipe_id', descField: 'equipe_descricao' },
  'cargo_id': { sheetName: SHEETS.CARGOS, idField: 'cargo_id', descField: 'cargo_descricao' },
  'tipoequipamento_id': { sheetName: SHEETS.TIPOS_EQUIPAMENTO, idField: 'tipoequipamento_id', descField: 'tipoequipamento_descricao' },
  'modelo_id': { sheetName: SHEETS.MODELOS, idField: 'modelo_id', descField: 'modelo_descricao' },
  'un_id': { sheetName: SHEETS.UNIDADES, idField: 'un_id', descField: 'un_descricao' },
  'fornecedor_id': {
    sheetName: SHEETS.FORNECEDORES,
    spreadsheetId: CONFIG.planilhas.principal,
    idField: 'fornecedor_id',
    descField: 'fornecedor_descricao'
  },
  'depreciacao_id': { sheetName: SHEETS.DEPRECIACAO, idField: 'depreciacao_id', descField: 'depreciacao_descricao' },
  'risco_id': { sheetName: SHEETS.CLASSIFICACAO_RISCO, idField: 'risco_id', descField: 'risco_descricao' },
  'eletrica_id': { sheetName: SHEETS.CLASSIFICACAO_ELETRICA, idField: 'eletrica_id', descField: 'eletrica_descricao' },
  'equipamento_id': {
    sheetName: SHEETS.EQUIPAMENTOS,
    spreadsheetId: CONFIG.planilhas.equipamentos,
    idField: 'equipamento_id',
    descField: 'equipamento_descricaocompleta'
  },
  'falha_id': {
    sheetName: SHEETS.FALHAS,
    idField: 'falha_id',
    descField: 'falha_descricao'
  },
  'causa_id': {
    sheetName: SHEETS.CAUSAS,
    idField: 'causa_id',
    descField: 'causa_descricao'
  },
  'acao_id': {
    sheetName: SHEETS.ACOES,
    idField: 'acao_id',
    descField: 'acao_descricao'
  },
  'usuario_id': {
    sheetName: "USUARIOS",
    spreadsheetId: CONFIG.planilhas.usuarios, // ATUALIZADO 
    idField: 'usuario_id',
    descField: 'usuario_nome',
  },
  'periodicidade_id': { sheetName: SHEETS.PERIODICIDADE, idField: 'periodicidade_id', descField: 'periodicidade_descricao' },
  'tipoplano_id': { sheetName: SHEETS.TIPOPLANO, idField: 'tipoplano_id', descField: 'tipoplano_descricao' },
  'cadastrochecklistcalibracao_master_id': { sheetName: SHEETS.CADASTROCHECKLISTCALIBRACAO_MASTER, idField: 'cadastrochecklistcalibracao_master_id', descField: 'cadastrochecklistcalibracao_master_descricao' },
  'statusoperacional_id': {
    sheetName: SHEETS.STATUSOPERACIONAL,
    idField: 'statusoperacional_id',
    descField: 'statusoperacional_descricao'
  },
  'tipopropriedade_id': {
    sheetName: SHEETS.TIPO_PROPRIEDADE,
    idField: 'tipopropriedade_id',
    descField: 'tipopropriedade_descricao'
  },
  'cc_id': {
    sheetName: SHEETS.CENTROS,
    idField: 'cc_id',
    descField: 'cc_descricao'
  },
  'statuscorretiva_id': {
    sheetName: SHEETS.STATUSCORRETIVA,
    idField: 'statuscorretiva_id',
    descField: 'statuscorretiva_descricao'
  },
  'usuario_id_padrao': {
    sheetName: "USUARIOS",
    spreadsheetId: CONFIG.planilhas.usuarios,
    idField: 'usuario_id',
    descField: 'usuario_nome_padrao',    // Campo de DESTINO (em CADASTRO_ROTAS)
    sourceDescField: 'usuario_nome'      // Campo de ORIGEM (em USUARIOS)
  },
  'status_contrato_id': {
    sheetName: "CONTRATOS_STATUS",
    spreadsheetId: "1hmSEgG-Rq6Q1xvv21kH0ttp0fSVwYJlj1PDWEOmKL50",
    idField: 'status_contrato_id',
    descField: 'status_contrato_descricao'
  },
  'advogado_responsavel_id': {
    sheetName: SHEETS.CONTRATO_ADVOGADOS,
    idField: 'contrato_advogado_id',
    descField: 'contrato_advogado_nome'
  },
  'usuario_upload_id': {
    sheetName: "USUARIOS",
    spreadsheetId: CONFIG.planilhas.usuarios,
    idField: 'usuario_id',
    descField: 'usuario_upload_nome',
    sourceDescField: 'usuario_nome'
  },
  'status_processo_id': {
    sheetName: "PROCESSOS_STATUS",
    spreadsheetId: CONFIG.planilhas.contratos,
    idField: 'status_processo_id',
    descField: 'status_processo_descricao'
  },
  'rc_status_id': { sheetName: SHEETS.RC_STATUS, idField: 'rc_status_id', descField: 'rc_status_descricao' },
  'contrato_id': {
    sheetName: "CONTRATOS",
    spreadsheetId: CONFIG.planilhas.contratos,
    idField: 'contrato_id',
    descField: 'contrato_objeto'
  },
  'rc_contacontabil_id': {
    sheetName: SHEETS.RC_CONTACONTABIL,
    spreadsheetId: CONFIG.planilhas.principal,
    idField: 'rc_contacontabil_id',
    descField: 'rc_contacontabil_descricao'
  },
  'rc_pep_id': {
    sheetName: SHEETS.RC_PEP,
    spreadsheetId: CONFIG.planilhas.principal,
    idField: 'rc_pep_id',
    descField: 'rc_pep_descricao'
  },
  'item_catalogo_id': {
    sheetName: SHEETS.CATALOGO_ITENS,
    spreadsheetId: CONFIG.planilhas.aquisicoes,
    idField: 'item_catalogo_id',
    descField: 'item_descricao',
    sourceDescField: 'item_descricao'
  },
  'otica_tipo_id': { sheetName: SHEETS.OTICA_TIPO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_tipo_id', descField: 'otica_tipo_descricao' },
  'otica_especialidade_id': { sheetName: SHEETS.OTICA_ESPECIALIDADE, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_especialidade_id', descField: 'otica_especialidade_descricao' },
  'otica_angulacao_id': { sheetName: SHEETS.OTICA_ANGULACAO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_angulacao_id', descField: 'otica_angulacao_descricao' },
  'otica_diametro_id': { sheetName: SHEETS.OTICA_DIAMETRO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_diametro_id', descField: 'otica_diametro_descricao' },
  'otica_comprimento_id': { sheetName: SHEETS.OTICA_COMPRIMENTO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_comprimento_id', descField: 'otica_comprimento_descricao' },
  'otica_referencia_id': { sheetName: SHEETS.OTICA_REFERENCIA, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_referencia_id', descField: 'otica_referencia_descricao' }
};

const LOOKUP_SOURCE_SHEETS = new Set(Object.values(LOOKUP_MAP).map(config => config.sheetName));

// --- CONFIGURAÇÃO DE VERIFICAÇÃO DE DUPLICIDADE (CORRIGIDO) ---
const UNIQUE_CHECKS_CONFIG = {
  [SHEETS.ESTABELECIMENTOS]: [['est_descricao']],
  [SHEETS.UNIDADES]: [['un_descricao']],
  [SHEETS.CENTROS]: [['cc_codigosap']],
  [SHEETS.TIPOS_EQUIPAMENTO]: [['tipoequipamento_descricao']],
  [SHEETS.FORNECEDORES]: [['fornecedor_descricao'], ['fornecedor_cnpj']],
  [SHEETS.FABRICANTES]: [['fabricante_descricao']],
  [SHEETS.MODELOS]: [['modelo_descricao', 'fabricante_id']],
  [SHEETS.STATUSCADASTROATIVO]: [['status_descricao']],
  [SHEETS.DEPRECIACAO]: [['depreciacao_descricao']],
  [SHEETS.CLASSIFICACAO_RISCO]: [['risco_descricao']],
  [SHEETS.CLASSIFICACAO_ELETRICA]: [['eletrica_descricao']],
  [SHEETS.TENSAO]: [['tensao_descricao']],
  [SHEETS.PERIODICIDADE]: [['periodicidade_descricao']],
  [SHEETS.CARGOS]: [['cargo_descricao']],
  [SHEETS.EQUIPES]: [['equipe_descricao']],
  [SHEETS.ESCALAS]: [['escala_descricao', 'equipe_id']],
  [SHEETS.RC_MODALIDADE]: [['rc_modalidade_descricao']],
  [SHEETS.RC_STATUS]: [['rc_status_descricao']],
  [SHEETS.RC_CONTACONTABIL]: [['rc_contacontabil_numero']],
  [SHEETS.RC_PEP]: [['rc_pep_numero']],
  [SHEETS.RC_COMPRADOR]: [['rc_comprador_nome']],
  [SHEETS.STATUSCORRETIVA]: [['statuscorretiva_descricao']],
  [SHEETS.FALHAS]: [['falha_descricao']],
  [SHEETS.CAUSAS]: [['causa_descricao']],
  [SHEETS.ACOES]: [['acao_descricao']],
  [SHEETS.EQUIPAMENTOS]: [['equipamento_tag'], ['serie', 'modelo_id'], ['patrimonio']],
  [SHEETS.CORRETIVAS]: [],
  [SHEETS.TIPOPLANO]: [['tipoplano_descricao']],
  [SHEETS.GRANDEZAS]: [['grandeza_descricao']],
  [SHEETS.STATUSPREVENTIVA]: [['statuspreventiva_descricao']],
  [SHEETS.CADASTROCHECKLISTCALIBRACAO_MASTER]: [['cadastrochecklistcalibracao_master_descricao']],
  [SHEETS.STATUSOPERACIONAL]: [['statusoperacional_descricao']],
  [SHEETS.TIPO_PROPRIEDADE]: [['tipopropriedade_descricao']],
  [SHEETS.CADASTRO_ROTAS]: [['rota_descricao', 'cc_id']],
  [SHEETS.TREINAMENTOS_MASTER]: [['treinamento_titulo']],
  [SHEETS.TRILHAS_MASTER]: [['trilha_titulo']],
  [SHEETS.CONTRATO_ADVOGADOS]: [['contrato_advogado_nome']],
  [SHEETS.CATALOGO_PECAS]: [['peca_descricao'], ['peca_ref']],
  [SHEETS.PRESTADORES]: [['prestador_cpf', 'fornecedor_id']]

};

// --- CONFIGURAÇÃO DE VERIFICAÇÃO DE DEPENDÊNCIAS (CORRIGIDO) ---
const DEPENDENCY_CONFIG = {
  [SHEETS.FABRICANTES]: [{ sheetName: SHEETS.MODELOS, fkField: 'fabricante_id', childEntityLabel: 'Modelos' }],
  [SHEETS.ESTABELECIMENTOS]: [{ sheetName: SHEETS.EQUIPES, fkField: 'est_id', childEntityLabel: 'Equipes' }, { sheetName: SHEETS.RC_PEP, fkField: 'est_id', childEntityLabel: 'Projetos (PEP)' }],
  [SHEETS.EQUIPES]: [{ sheetName: SHEETS.ESCALAS, fkField: 'equipe_id', childEntityLabel: 'Escalas' }],
  [SHEETS.CARGOS]: [{ sheetName: SHEETS.PERMISSOES, fkField: 'cargo_id', childEntityLabel: 'Permissões' }]
};


// =================================================================
// FUNÇÃO PRINCIPAL PARA SERVIR A INTERFACE E API (ATUALIZADA)
// =================================================================
function doGet(e) {
  const params = e.parameter;

  // -----------------------------------------------------------
  // 1. ROTA MOBILE (API JSON)
  // -----------------------------------------------------------
  if (params.mobile === 'true') {
    let result = {};
    // ... dentro do if (params.mobile === 'true') ...

    if (params.action === 'checkUpdate') {
      // O App envia o timestamp da última vez que ele baixou dados
      const result = checkDataVersion(params.lastTime);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
  
    // ... (restante dos ifs: getChamados, etc)
    if (params.action === 'getChamados') {
      result = getActiveChamados(CONFIG.planilhas.chamados);
    } 
    else if (params.action === 'getSetores') {
      result = getSectorsResponsibilityStatus();
    }
    // [NOVO] Busca mensagens do chat para o mobile
    else if (params.action === 'getComentarios') {
      result = getChatMessages(params.id, CONFIG.planilhas.chamados);
    }
    else if (params.action === 'getHomeKPIs') {
      result = mobileFetchHomeKPIs();
    }
    else if (params.action === 'getMinhasPreventivas') {
      result = mobileFetchMinhasPreventivas();
    }
    else if (params.action === 'findEquipamento') {
      result = mobileFindEquipamentoCorretiva(params.termo);
    }
    else if (params.action === 'getFalhas') {
      result = getSingleDropdown('falhas');
    }
    else if (params.action === 'mobileFetchRotasDoMes') {
      result = mobileFetchRotasDoMes(parseInt(params.ano), parseInt(params.mes));
    }
    else if (params.action === 'mobileFetchTreinamentos') {
      result = mobileFetchTreinamentos();
    }
    else if (params.action === 'mobileGetProtetoresParaSeparacao') {
      result = mobileGetProtetoresParaSeparacao(parseInt(params.mes), parseInt(params.ano), params.tecnicoId);
    }
    else if (params.action === 'mobileBuscaPrestadorTypeahead') {
      result = mobileBuscaPrestadorTypeahead(params.termo);
    }
    else if (params.action === 'mobileFetchHistoricoLiberacoes') {
      result = mobileFetchHistoricoLiberacoes();
    }
    else if (params.action === 'mobileFetchEmprestimosAtivos') {
      result = mobileFetchEmprestimosAtivos();
    }
    else if (params.action === 'mobileBuscarEquipamentoParaEmprestimo') {
      result = mobileBuscarEquipamentoParaEmprestimo(params.termo);
    }
    else if (params.action === 'mobileBuscarEmprestimoParaDevolver') {
      result = mobileBuscarEmprestimoParaDevolver(params.termo);
    }
    else if (params.action === 'mobileFetchRMsParaHelio') {
      result = mobileFetchRMsParaHelio();
    }
    else if (params.action === 'mobileFetchOticaForCQ') {
      result = mobileFetchOticaForCQ(params.serial);
    }
    else if (params.action === 'mobileFetchJornadaProdutividade') {
      result = mobileFetchJornadaProdutividade(parseInt(params.ano), parseInt(params.mes));
    }

    

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // -----------------------------------------------------------
  // 2. [LEGADO] ROTAS WEB (HTML) - Mantém lógica original
  // -----------------------------------------------------------
  if (params.action === 'aprovar_rc' || params.action === 'reprovar_rc') {
      return handleEmailAction(params);
  }

  if (params.action === 'getImage' && params.fileId) {
    try {
      const file = DriveApp.getFileById(params.fileId);
      const blob = file.getBlob();
      return ContentService.createHtmlOutput(`<img src="data:${file.getMimeType()};base64,${Utilities.encodeBase64(blob.getBytes())}" style="width:100%;">`);
    } catch (error) {
      return ContentService.createTextOutput("Imagem não encontrada.");
    }
  }

  // -----------------------------------------------------------
  // 3. ROTA WEB APP DEDICADO (MOBILE-FIRST PWA)
  // -----------------------------------------------------------
  if (params.view === 'mobile') {
      return HtmlService.createTemplateFromFile('mobile')
          .evaluate()
          .setTitle('Sirius Mobile')
          .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
  }

  // -----------------------------------------------------------
  // 4. ROTA DESKTOP (SPA PRINCIPAL)
  // -----------------------------------------------------------
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Sirius - Engenharia Clínica')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);


}



// =================================================================
// PROJETO SIRIUS - BACKEND (Code.gs) - ATUALIZAÇÃO DO LOGIN
// =================================================================

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const params = JSON.parse(e.postData.contents);
    
    // --- ROTA: LOGIN ---
    if (params.action === 'login') {
      const emailLogin = params.email ? params.email.trim().toLowerCase() : '';
      const pushToken = params.pushToken || '';
      if (!emailLogin) throw new Error("E-mail não informado.");

      const ssUsuarios = SpreadsheetApp.openById(CONFIG.planilhas.usuarios);
      const sheet = ssUsuarios.getSheetByName("USUARIOS");
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      const idxEmail = headers.indexOf('usuario_email');
      const idxId = headers.indexOf('usuario_id');
      const idxNome = headers.indexOf('usuario_nome');
      const idxToken = headers.indexOf('expo_push_token');

      let usuario = data.find(row => row[idxEmail] && String(row[idxEmail]).trim().toLowerCase() === emailLogin);

      if (usuario) {
        if (pushToken && idxToken !== -1) {
          const rowNum = data.indexOf(usuario) + 2;
          sheet.getRange(rowNum, idxToken + 1).setValue(pushToken);
        }
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          user: { id: String(usuario[idxId]), name: usuario[idxNome], email: emailLogin }
        })).setMimeType(ContentService.MimeType.JSON);
      }
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "E-mail não cadastrado." })).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTA: CHAT (SALVAR COMENTÁRIO) ---
    if (params.action === 'saveComentario') {
      const result = sendChatMessage(params, CONFIG.planilhas.chamados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTA: GERENCIAR PRESETS DE SETORES ---
    if (params.action === 'managePresets') {
      // params: { operation: 'get'|'save', userId: '...', presets: {} }
      const result = manageUserPresets(params.operation, params.userId, params.presets);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTA: INICIAR ATENDIMENTO ---
    if (params.action === 'iniciarAtendimento') {
      const result = receberChamado(params.id, params.tecnico, CONFIG.planilhas.chamados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTA: ENCERRAR CHAMADO ---
    if (params.action === 'encerrarChamado') {
      const result = encerrarChamado(params.dados, CONFIG.planilhas.chamados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTAS DE CONFIGURAÇÃO E TOKENS ---
    if (params.action === 'saveToken') {
      const result = updateRecord('USUARIOS', params.record, CONFIG.planilhas.usuarios, 'usuario_id');
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    if (params.action === 'saveResponsibilities') {
      const result = saveTechnicianResponsibilities(params.ids, params.user);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    // ... (outros ifs existentes: login, saveComentario, iniciarAtendimento, etc)

    // --- ROTA: REMOVER TOKEN (LOGOUT) ---
    if (params.action === 'removeToken') {
      // Reutiliza a lógica de update, mas enviando string vazia para o token
      // IMPORTANTE: Certifique-se que o campo 'expo_push_token' existe na aba USUARIOS
      const result = updateRecord('USUARIOS', { 
          usuario_id: params.record.usuario_id, 
          expo_push_token: "" // Limpa o token
      }, CONFIG.planilhas.usuarios, 'usuario_id');
      
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTA: SALVAR/LER GRUPOS DE SETORES (PRESETS) ---
    if (params.action === 'managePresets') {
      // Chama a função que criamos no chamados_api.gs
      const result = manageUserPresets(params.operation, params.userId, params.presets);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTA: SALVAR ERRO DE OPERAÇÃO (MOBILE) ---
    if (params.action === 'mobileSaveErroOperacao') {
      const result = mobileSaveErroOperacao(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // --- ROTA: SALVAR CORRETIVA (MOBILE) ---
    if (params.action === 'mobileSaveCorretiva') {
      const result = saveCorretivaUnified(params.payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'mobileUploadCorretivaPhoto') {
      const result = mobileUploadCorretivaPhoto(params.fileObject);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'addRelatorioToCorretiva') {
      const result = addRelatorioToCorretiva(params.payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'salvarExecucaoRotaEmLote') {
      const result = salvarExecucaoRotaEmLote(params.payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'mobileToggleSeparacaoProtetor') {
      const result = mobileToggleSeparacaoProtetor(params.payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'mobileSalvarNovoPrestador') {
      const result = mobileSalvarNovoPrestador(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'registrarEEmitirLiberacao') {
      const result = registrarEEmitirLiberacao(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'saveEmprestimo') {
      const result = saveEmprestimo(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'devolverEmprestimo') {
      const result = devolverEmprestimo(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'saveHelioReadings') {
      const result = saveHelioReadings(params.payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'saveOticaTeste') {
      const result = saveOticaTeste(params.formData);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'saveJornadaEvent') {
      const result = saveJornadaEvent(params.payload);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'deleteJornadaEvent') {
      const result = deleteJornadaEvent(params.id);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'mobileTransferirChamado') {
      const result = mobileTransferirChamado(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'mobileRecusarChamado') {
      const result = mobileRecusarChamado(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (params.action === 'mobileIniciarApoioTecnico') {
      const result = mobileIniciarApoioTecnico(params.dados);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    // ... (logo depois vem o return final padrão: return ContentService.createTextOutput...)
    
    return ContentService.createTextOutput(JSON.stringify({status: 'ok'})).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.message})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getUserProfile() {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const scriptUrl = ScriptApp.getService().getUrl();
    const nameFromEmail = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Perfil padrão (Fallback) caso não encontre na planilha
    // Usamos o próprio email como ID temporário para não quebrar a lógica de salvamento
    const defaultProfile = { 
        id: userEmail, 
        role: 'solicitante', 
        email: userEmail, 
        name: nameFromEmail, 
        scriptUrl: scriptUrl 
    };

    const ssUsuarios = SpreadsheetApp.openById(CONFIG.planilhas.usuarios);
    const sheetUsuarios = ssUsuarios.getSheetByName("USUARIOS");

    if (!sheetUsuarios) {
      Logger.log(`Aba USUARIOS não encontrada. Retornando perfil padrão.`);
      return defaultProfile;
    }

    const range = sheetUsuarios.getDataRange();
    const values = range.getValues();
    if (values.length < 2) return defaultProfile;

    const headers = values.shift();
    const emailColIndex = headers.indexOf('usuario_email');
    const nameColIndex = headers.indexOf('usuario_nome');
    const idColIndex = headers.indexOf('usuario_id'); 
    const statusColIndex = headers.indexOf('usuario_ativo');
    const adminColIndex = headers.indexOf('usuario_admin'); // <--- LÊ A NOVA COLUNA

    if (emailColIndex === -1 || idColIndex === -1) {
      Logger.log(`Colunas usuario_email ou usuario_id não encontradas.`);
      return defaultProfile;
    }

    const usuarioEncontrado = values.find(row => row[emailColIndex] && String(row[emailColIndex]).trim().toLowerCase() === userEmail.toLowerCase());

    if (usuarioEncontrado && (!statusColIndex || usuarioEncontrado[statusColIndex] === 'Ativo')) {
      const isAdmin = adminColIndex !== -1 && String(usuarioEncontrado[adminColIndex]).trim().toLowerCase() === 'sim';
      
      return { 
          id: String(usuarioEncontrado[idColIndex]), 
          role: 'tecnico', 
          isAdmin: isAdmin, // <--- REPASSA A FLAG PARA O FRONTEND
          email: userEmail, 
          name: usuarioEncontrado[nameColIndex] || nameFromEmail, 
          scriptUrl: scriptUrl 
      };
    } else {
      return defaultProfile; 
    }
  } catch (e) {
    Logger.log(`Erro crítico em getUserProfile: ${e.stack}`);
    // Retorno de emergência
    return { 
        id: Session.getActiveUser().getEmail(), 
        role: 'solicitante', 
        email: Session.getActiveUser().getEmail(), 
        name: 'Usuário (Erro)', 
        scriptUrl: '' 
    };
  }
}

// --- FUNÇÕES DE API (CHAMADAS PELO FRONTEND) ---
function getRecords(sheetName, spreadsheetId) {
  try {
    const activeSpreadsheet = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : ss;
    const sheet = activeSpreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error(`Aba "${sheetName}" não encontrada.`);

    const dataRange = sheet.getDataRange();
    if (dataRange.getNumRows() <= 1) return [];

    const data = dataRange.getDisplayValues();
    const headers = data.shift().map(header => header.trim());
    return data.map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
  } catch (e) {
    Logger.log(e.stack);
    return { error: e.message };
  }
}


function addRecord(sheetName, recordObject, spreadsheetId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const activeSpreadsheet = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : ss;
    const sheet = activeSpreadsheet.getSheetByName(sheetName);

    // Verifica se a planilha foi encontrada
    if (!sheet) {
      throw new Error(`Aba "${sheetName}" não encontrada na planilha.`);
    }

    const uniqueChecks = UNIQUE_CHECKS_CONFIG[sheetName];
    if (uniqueChecks) {
      const duplicateError = checkForDuplicates(sheet, recordObject, uniqueChecks);
      if (duplicateError) return { error: duplicateError };
    }

    // ===== INÍCIO DA OTIMIZAÇÃO =====
    // 1. Descobre quais lookups são necessários com base nos dados recebidos
    const requiredLookups = new Set();
    for (const key in recordObject) {
      if (LOOKUP_MAP[key] && recordObject[key]) {
        requiredLookups.add(LOOKUP_MAP[key].sheetName);
      }
    }
    // Garante que lookups necessários para lógicas especiais também sejam carregados
    if (sheetName === SHEETS.EQUIPAMENTOS) {
      ['TIPOS_EQUIPAMENTO', 'MODELOS', 'FABRICANTES'].forEach(l => requiredLookups.add(l));
    }
    
    // 2. Busca APENAS os lookups necessários (agora otimizado)
    const lookupData = getSpecificLookupData_(Array.from(requiredLookups));
    // ===== FIM DA OTIMIZAÇÃO =====

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const idColumnHeader = headers[0]; // Primeira coluna é sempre o ID

    // --- Preenchimento de descrições via Lookup ---
    for (const idKey in LOOKUP_MAP) {
      if (recordObject.hasOwnProperty(idKey)) {
        const config = LOOKUP_MAP[idKey];
        const selectedId = recordObject[idKey];
        if (selectedId && String(selectedId).length > 0) {
          if (lookupData[config.sheetName] && lookupData[config.sheetName].has(selectedId)) {
            const lookedUpRow = lookupData[config.sheetName].get(selectedId);
            const sourceField = config.sourceDescField || config.descField;
            recordObject[config.descField] = lookedUpRow[sourceField];
          }
        }
      }
    }

    // Garante que MODELOS tenham fabricante_descricao
    if (sheetName === SHEETS.MODELOS && recordObject.fabricante_id && lookupData.FABRICANTES) {
      const fabricante = lookupData.FABRICANTES.get(recordObject.fabricante_id);
      if (fabricante) {
        recordObject.fabricante_descricao = fabricante.fabricante_descricao;
      }
    }

    // --- LÓGICA ESPECIAL PARA EQUIPAMENTOS ---
    if (sheetName === SHEETS.EQUIPAMENTOS) {
      if (!recordObject.equipamento_tag || !recordObject.tipoequipamento_id) {
        throw new Error("TAG e Tipo do Equipamento são obrigatórios.");
      }
      if (lookupData.TIPOS_EQUIPAMENTO) {
        const tipoRow = lookupData.TIPOS_EQUIPAMENTO.get(recordObject.tipoequipamento_id);
        recordObject.tipoequipamento_descricao = tipoRow ? tipoRow.tipoequipamento_descricao : '';
      }
      if (recordObject.modelo_id && lookupData.MODELOS) {
        const modeloRow = lookupData.MODELOS.get(recordObject.modelo_id);
        if (modeloRow) {
          recordObject.modelo_descricao = modeloRow.modelo_descricao;
          if (modeloRow.fabricante_id && lookupData.FABRICANTES) {
            const fabricanteRow = lookupData.FABRICANTES.get(modeloRow.fabricante_id);
            recordObject.fabricante_id = modeloRow.fabricante_id;
            recordObject.fabricante_descricao = fabricanteRow ? fabricanteRow.fabricante_descricao : '';
          }
        }
      }
      recordObject.equipamento_descricaocompleta = `${recordObject.equipamento_tag || ''} ${recordObject.tipoequipamento_descricao || ''} ${recordObject.fabricante_descricao || ''} ${recordObject.modelo_descricao || ''} Série: ${recordObject.serie || ''}`.trim();
    }

    // --- LÓGICA ESPECIAL PARA CORRETIVAS ---
    if (sheetName === SHEETS.CORRETIVAS) {
      const isDerivacaoAutomatica = recordObject.equipamento_descricaocompleta && String(recordObject.equipamento_descricaocompleta).includes('[PENDENTE');

      if (!recordObject.equipamento_id && !isDerivacaoAutomatica) {
        throw new Error("É obrigatório selecionar um equipamento para abrir uma Ordem de Serviço.");
      }
      
      if (recordObject.equipamento_id) {
        const ssEquip = SpreadsheetApp.openById(CONFIG.planilhas.equipamentos);
        const equipSheet = ssEquip.getSheetByName(SHEETS.EQUIPAMENTOS);
        const equipFullData = findRowById_(equipSheet, recordObject.equipamento_id, 'equipamento_id');

        if (equipFullData && equipFullData.rowData) {
          const equipRow = equipFullData.rowData;
          recordObject.equipamento_tag = equipRow.equipamento_tag || ''; 
          recordObject.equipamento_descricaocompleta = equipRow.equipamento_descricaocompleta || 'Descrição não encontrada';
          recordObject.cc_id = equipRow.cc_id;
          recordObject.est_id = equipRow.est_id;

          let ccDesc = '';
          if (lookupData.CENTROS && equipRow.cc_id) {
             const ccRow = lookupData.CENTROS.get(String(equipRow.cc_id));
             ccDesc = ccRow ? ccRow.cc_descricao : '';
          } else if (equipRow.cc_id) {
             const ccInfo = findRowById_(ss.getSheetByName(SHEETS.CENTROS), equipRow.cc_id, 'cc_id');
             ccDesc = ccInfo ? ccInfo.rowData.cc_descricao : '';
          }
          recordObject.cc_descricao = ccDesc;
        }
      }
    }

    // --- LÓGICA ESPECIAL PARA MANUAIS ---
    if (sheetName === SHEETS.MANUAIS) {
      const currentUser = _getCurrentUserInfo();
      const currentUserId = currentUser && currentUser.id ? currentUser.id : null;
      if (currentUserId) {
        recordObject['usuario_upload_id'] = currentUserId;

        const ssUsuarios = SpreadsheetApp.openById(CONFIG.planilhas.usuarios);
        const usuariosSheet = ssUsuarios.getSheetByName("USUARIOS");
        const userInfo = findRowById_(usuariosSheet, currentUserId, 'usuario_id');

        if (userInfo) {
          recordObject['usuario_upload_nome'] = currentUser ? currentUser.nome : 'Não encontrado';
          // Lógica de pontos removida (agora é cálculo dinâmico)
        }
      }
      recordObject['data_upload'] = new Date();
    }

    const newId = generateUUID();
    recordObject[idColumnHeader] = newId;

    const statusHeader = headers.find(h => h.endsWith('_ativo'));
    if (statusHeader && !recordObject.hasOwnProperty(statusHeader)) {
      recordObject[statusHeader] = 'Ativo';
    }

    const timezone = Session.getScriptTimeZone();
    const nowFormatted = Utilities.formatDate(new Date(), timezone, 'dd/MM/yyyy HH:mm:ss');
    headers.forEach(header => {
      // Injeta timestamp completo em campos de criação e na abertura de OS
      if (header.endsWith('_datacriacao') || header.endsWith('_data_cadastro') || header.endsWith('_datahoraabertura')) {
        if (!recordObject[header]) recordObject[header] = nowFormatted;
      }
      if (header.endsWith('_datamodificacao')) recordObject[header] = nowFormatted;
    });

    const newRow = headers.map(header => {
      let val = recordObject[header] !== undefined ? recordObject[header] : "";
      // FORÇA FORMATO TEXTO em datas e IDs para evitar arredondamentos e perdas de segundos pelo Sheets
      if (val !== "" && (header.includes('data') || header.includes('hora') || ['item_ref', 'peca_ref', 'serie', 'equipamento_tag', 'patrimonio', 'nf_numero'].includes(header))) {
        val = "'" + String(val).trim();
      }
      return val;
    });
    sheet.appendRow(newRow);

    // --- CRIAÇÃO DA INSTALAÇÃO (EQUIPAMENTOS) ---
    if (sheetName === SHEETS.EQUIPAMENTOS) {
      try {
        const ssInst = SpreadsheetApp.openById(CONFIG.planilhas.equipamentos);
        const sheetInst = ssInst.getSheetByName("INSTALACOES");
        
        if (sheetInst) {
             sheetInst.appendRow([
                Utilities.getUuid(),           // A: instalacao_id
                newId,                         // B: equipamento_id
                new Date(),                    // C: instalacao_data_registro
                'Pendente',                    // D: instalacao_status
                '',                            // E: usuario_responsavel_id
                '',                            // F: usuario_responsavel_nome
                '',                            // G: instalacao_data_conclusao
                '',                            // H: instalacao_observacao
                '',                            // I: instalacao_doc_id
                ''                             // J: instalacao_doc_url
             ]);
             Logger.log("Registro de instalação criado com sucesso para o equipamento: " + newId);
        } else {
             Logger.log("ERRO CRÍTICO: Aba INSTALACOES não encontrada.");
        }
      } catch (errInst) {
        Logger.log("Erro ao criar registro de instalação automática: " + errInst.message);
      }
    }

    

    SpreadsheetApp.flush();

    invalidateSheetCache_(sheetName, spreadsheetId || CONFIG.planilhas.principal); 

    writeAuditLog('CRIAÇÃO', sheetName, newId, recordObject[headers[1]]);

    if (LOOKUP_SOURCE_SHEETS.has(sheetName)) {
      clearLookupCache_(sheetName);
    }

    const uniqueChecksForAdd = UNIQUE_CHECKS_CONFIG[sheetName];
    if (uniqueChecksForAdd) {
      uniqueChecksForAdd.flat().forEach(colName => clearUniqueValueCache_(sheetName, colName));
    }
    clearRowIndexCache_(sheetName);

    const allDropdownSheetNames = new Set(Object.values(DROPDOWN_CONFIG).map(config => config.sheetName));
    if (allDropdownSheetNames.has(sheetName)) {
      CacheService.getScriptCache().remove('ALL_DROPDOWN_DATA_V2');
    }

    return { success: true, message: "Registro adicionado com sucesso!", newId: newId };

  } catch (e) {
    Logger.log(`Erro em addRecord (${sheetName}): ${e.stack}`);
    return { error: e.message };
  } finally {
    lock.releaseLock();
  }
}


function updateRecord(sheetName, recordObject, spreadsheetId, idFieldName) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const activeSpreadsheet = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : ss;
    const sheet = activeSpreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error(`Aba "${sheetName}" não encontrada.`);

    const idColumnHeader = idFieldName;
    if (!idColumnHeader || !recordObject[idColumnHeader]) {
      throw new Error(`ID principal ("${idFieldName}") não encontrado nos dados do formulário.`);
    }
    const recordId = recordObject[idColumnHeader];

    // --- Verificação de duplicidade ---
    const uniqueChecks = UNIQUE_CHECKS_CONFIG[sheetName];
    if (uniqueChecks) {
      const duplicateError = checkForDuplicates(sheet, recordObject, uniqueChecks, recordId, idColumnHeader);
      if (duplicateError) return { error: duplicateError };
    }

    const existingRecordInfo = findRowById_(sheet, recordId, idColumnHeader);
    if (!existingRecordInfo) {
      Logger.log(`CRITICAL: Tentativa de update falhou. ID ${recordId} na coluna ${idColumnHeader} não foi encontrado em ${sheetName}.`);
      throw new Error("Registro original não encontrado. A linha pode ter sido deletada.");
    }

    // --- Otimização de Lookup ---
    const requiredLookups = new Set();
    const allKeys = new Set([...Object.keys(existingRecordInfo.rowData), ...Object.keys(recordObject)]);
    allKeys.forEach(key => {
      if (LOOKUP_MAP[key] && (recordObject[key] || existingRecordInfo.rowData[key])) {
        requiredLookups.add(LOOKUP_MAP[key].sheetName);
      }
    });
    // Removemos a carga forçada de EQUIPAMENTOS daqui para fazer a busca cirúrgica abaixo
    
    const lookupData = getSpecificLookupData_(Array.from(requiredLookups));
    const headers = existingRecordInfo.headers;

    // --- Preenchimento de descrições via Lookup ---
    for (const idKey in LOOKUP_MAP) {
      if (recordObject.hasOwnProperty(idKey)) {
        const config = LOOKUP_MAP[idKey];
        const selectedId = recordObject[idKey];
        if (selectedId && String(selectedId).length > 0) {
          if (lookupData[config.sheetName] && lookupData[config.sheetName].has(selectedId)) {
            const lookedUpRow = lookupData[config.sheetName].get(selectedId);
            const sourceField = config.sourceDescField || config.descField;
            recordObject[config.descField] = lookedUpRow[sourceField];
          }
        }
      }
    }

    // CORREÇÃO: Garante que MODELOS tenham fabricante_descricao
    if (sheetName === SHEETS.MODELOS && recordObject.fabricante_id && lookupData.FABRICANTES) {
      const fabricante = lookupData.FABRICANTES.get(recordObject.fabricante_id);
      if (fabricante) {
        recordObject.fabricante_descricao = fabricante.fabricante_descricao;
      }
    }

    // --- Lógica especial para EQUIPAMENTOS ---
    if (sheetName === SHEETS.EQUIPAMENTOS) {
      // (Mantém a lógica existente para montar a descrição completa)
      if (recordObject.modelo_id && lookupData.MODELOS) {
        const modeloRow = lookupData.MODELOS.get(recordObject.modelo_id);
        if (modeloRow) {
          recordObject.modelo_descricao = modeloRow.modelo_descricao;
          if (modeloRow.fabricante_id && lookupData.FABRICANTES) {
            const fabricanteRow = lookupData.FABRICANTES.get(modeloRow.fabricante_id);
            recordObject.fabricante_id = modeloRow.fabricante_id;
            recordObject.fabricante_descricao = fabricanteRow ? fabricanteRow.fabricante_descricao : '';
          }
        }
      }
      if (recordObject.tipoequipamento_id && lookupData.TIPOS_EQUIPAMENTO) {
        const tipoRow = lookupData.TIPOS_EQUIPAMENTO.get(recordObject.tipoequipamento_id);
        recordObject.tipoequipamento_descricao = tipoRow ? tipoRow.tipoequipamento_descricao : '';
      }
      // Se alterou o CC, atualiza a descrição
      if (recordObject.cc_id && lookupData.CENTROS) {
        const ccRow = lookupData.CENTROS.get(recordObject.cc_id);
        recordObject.cc_descricao = ccRow ? ccRow.cc_descricao : '';
      }

      recordObject.equipamento_descricaocompleta = `${recordObject.equipamento_tag || existingRecordInfo.rowData.equipamento_tag || ''} ${recordObject.tipoequipamento_descricao || existingRecordInfo.rowData.tipoequipamento_descricao || ''} ${recordObject.fabricante_descricao || existingRecordInfo.rowData.fabricante_descricao || ''} ${recordObject.modelo_descricao || existingRecordInfo.rowData.modelo_descricao || ''} Série: ${recordObject.serie || existingRecordInfo.rowData.serie || ''}`.trim();
    }

    // --- [CORREÇÃO] BUSCA CIRÚRGICA PARA CORRETIVAS/PROCESSOS ---
    // Se estivermos editando uma OS ou Processo e o equipamento mudou, buscamos os dados completos
    if ((sheetName === SHEETS.CORRETIVAS || sheetName === 'PROCESSOS' || sheetName === 'ERROOPERACAO') && recordObject.equipamento_id) {
        // Verifica se o ID do equipamento mudou ou se os campos dependentes estão vazios
        if (String(recordObject.equipamento_id) !== String(existingRecordInfo.rowData.equipamento_id) || !existingRecordInfo.rowData.cc_id) {
             const ssEquip = SpreadsheetApp.openById(CONFIG.planilhas.equipamentos);
             const equipSheet = ssEquip.getSheetByName(SHEETS.EQUIPAMENTOS);
             const equipFullData = findRowById_(equipSheet, recordObject.equipamento_id, 'equipamento_id');

             if (equipFullData && equipFullData.rowData) {
                 const equipRow = equipFullData.rowData;
                 recordObject.equipamento_tag = equipRow.equipamento_tag || '';
                 recordObject.equipamento_descricaocompleta = equipRow.equipamento_descricaocompleta || '';
                 recordObject.cc_id = equipRow.cc_id;
                 recordObject.est_id = equipRow.est_id;

                 // Busca descrição do CC (Centros são leves, podemos buscar pontualmente se não estiver no lookup)
                 if (lookupData.CENTROS && equipRow.cc_id) {
                    const ccRow = lookupData.CENTROS.get(String(equipRow.cc_id));
                    recordObject.cc_descricao = ccRow ? ccRow.cc_descricao : '';
                 } else if (equipRow.cc_id) {
                    const ccInfo = findRowById_(ss.getSheetByName(SHEETS.CENTROS), equipRow.cc_id, 'cc_id');
                    recordObject.cc_descricao = ccInfo ? ccInfo.rowData.cc_descricao : '';
                 }
             }
        }
    }

    const timezone = Session.getScriptTimeZone();
    const nowFormatted = Utilities.formatDate(new Date(), timezone, 'dd/MM/yyyy HH:mm:ss');
    headers.forEach(header => {
      if (header.endsWith('_datamodificacao')) recordObject[header] = nowFormatted;
    });

    // Mescla os dados
    const finalRecordObject = { ...existingRecordInfo.rowData, ...recordObject };
    const updatedRow = headers.map(h => {
      let val = finalRecordObject[h] !== undefined ? finalRecordObject[h] : "";
      // Força formato de texto
      if (val !== "" && ['item_ref', 'peca_ref', 'serie', 'equipamento_tag', 'patrimonio', 'nf_numero'].includes(h)) {
        val = "'" + String(val).trim();
      }
      return val;
    });

    sheet.getRange(existingRecordInfo.rowIndex, 1, 1, headers.length).setValues([updatedRow]);


    SpreadsheetApp.flush();

    // Força o sistema a reler a planilha na próxima consulta
    invalidateSheetCache_(sheetName, spreadsheetId || CONFIG.planilhas.principal);

    writeAuditLog('ATUALIZAÇÃO', sheetName, recordId, finalRecordObject[headers[1]]);

    if (LOOKUP_SOURCE_SHEETS.has(sheetName)) {
      clearLookupCache_(sheetName);
    }

    const uniqueChecksForUpdate = UNIQUE_CHECKS_CONFIG[sheetName];
    if (uniqueChecksForUpdate) {
      uniqueChecksForUpdate.flat().forEach(colName => clearUniqueValueCache_(sheetName, colName));
    }
    clearRowIndexCache_(sheetName);

    const allDropdownSheetNames = new Set(Object.values(DROPDOWN_CONFIG).map(config => config.sheetName));
    if (allDropdownSheetNames.has(sheetName)) {
      CacheService.getScriptCache().remove('ALL_DROPDOWN_DATA_V2');
    }

    return { success: true, message: "Registro atualizado com sucesso!", updatedId: recordId };
  } catch (e) {
    Logger.log(`Erro em updateRecord (${sheetName}): ${e.stack}`);
    return { error: e.message };
  } finally {
    lock.releaseLock();
  }
}



function checkForDuplicates(sheet, recordObject, checkGroups, recordIdToIgnore = null, idColumnHeader = null) {
  // Otimização: Verifica colunas únicas individuais usando cache primeiro
  for (const group of checkGroups) {
    if (group.length === 1) { // Só otimiza para checagens de coluna única
      const fieldName = group[0];
      const newValue = recordObject[fieldName] ? String(recordObject[fieldName]).trim().toLowerCase() : '';
      if (newValue === '') continue; // Não verifica valores vazios

      const uniqueSet = getUniqueValueSet_(sheet, fieldName);

      if (uniqueSet.has(newValue)) {
        // Duplicado encontrado no cache. Agora verifica se é o próprio registro sendo editado.
        if (recordIdToIgnore && idColumnHeader) {
          // Precisa ler a linha original para ter certeza que não é ela mesma
          const existingRecordInfo = findRowById_(sheet, recordIdToIgnore, idColumnHeader);
          // Verifica se o registro antigo existe E se o valor na coluna específica é igual ao novo valor
          if (existingRecordInfo && existingRecordInfo.rowData.hasOwnProperty(fieldName) &&
            String(existingRecordInfo.rowData[fieldName]).trim().toLowerCase() === newValue) {
            continue; // É o mesmo registro, ignora a "duplicidade"
          }
        }
        // Se não for o mesmo registro (ou se for adição), retorna erro
        return `Já existe um registro com ${fieldName} igual a '${recordObject[fieldName]}'.`;
      }
    }
  }

  // Fallback: Leitura completa para checagens de grupo (MANTIDO, pois cache é complexo para grupos)
  // ou se a checagem individual não encontrou (garantia extra)
  Logger.log(`checkForDuplicates: Realizando leitura completa para grupos ou fallback em ${sheet.getName()}`);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return null; // Retorna nulo se não houver dados
  const headers = data.shift();
  const idColumnIndex = idColumnHeader ? headers.indexOf(idColumnHeader) : headers.findIndex(h => h.endsWith("_id"));

  for (const existingRow of data) {
    if (recordIdToIgnore && idColumnIndex !== -1) {
      if (String(existingRow[idColumnIndex]) == String(recordIdToIgnore)) {
        continue;
      }
    }

    const existingRecord = headers.reduce((obj, header, i) => { if (header) obj[header] = existingRow[i]; return obj; }, {});

    for (const group of checkGroups) {
      // Pula grupos de coluna única que já foram checados pelo cache
      if (group.length === 1) continue;

      const isDuplicate = group.every(fieldName => {
        let newValue = recordObject[fieldName] ? String(recordObject[fieldName]).trim().toLowerCase() : '';
        let existingValue = existingRecord[fieldName] ? String(existingRecord[fieldName]).trim().toLowerCase() : '';
        
        // --- BLINDAGEM DE MÁSCARA ---
        // Se o campo for CPF ou CNPJ, removemos toda a pontuação para comparar
        if (fieldName.includes('cpf') || fieldName.includes('cnpj')) {
            newValue = newValue.replace(/\D/g, '');
            existingValue = existingValue.replace(/\D/g, '');
        }
        // ---------------------------

        // Importante: Só considera duplicado se o NOVO valor NÃO for vazio E for igual ao existente
        return newValue !== '' && newValue === existingValue;
      });

      if (isDuplicate) {
        const fieldNames = group.join(' e ');
        const fieldValues = group.map(f => `'${recordObject[f]}'`).join(' e ');
        return `Já existe um registro com ${fieldNames} igual a ${fieldValues}.`;
      }
    }
  }

  return null; // Nenhuma duplicidade encontrada
}

function checkDependencies(sheetName, recordId) {
  try {
    const dependencies = DEPENDENCY_CONFIG[sheetName];
    if (!dependencies || dependencies.length === 0) {
      return { hasDependencies: false };
    }

    let dependencyMessages = [];

    dependencies.forEach(dep => {
      const childSheet = ss.getSheetByName(dep.sheetName);
      if (!childSheet) return;

      const headers = childSheet.getRange(1, 1, 1, childSheet.getLastColumn()).getValues()[0];
      const fkIndex = headers.indexOf(dep.fkField);
      if (fkIndex === -1) return;

      // 1. Define o range para APENAS a coluna da chave estrangeira
      const fkColumnRange = childSheet.getRange(2, fkIndex + 1, childSheet.getLastRow() - 1, 1);

      // 2. Usa TextFinder para encontrar TODAS as ocorrências do ID
      const textFinder = fkColumnRange.createTextFinder(String(recordId))
        .matchEntireCell(true);
      const foundCells = textFinder.findAll();
      const count = foundCells.length; // O número de células encontradas é a contagem

      if (count > 0) {
        dependencyMessages.push(`${count} ${dep.childEntityLabel}`);
      }
    });

    if (dependencyMessages.length > 0) {
      const message = "Este item está associado a: " + dependencyMessages.join(', ') + ".";
      return { hasDependencies: true, message: message };
    }

    return { hasDependencies: false };

  } catch (e) {
    Logger.log(`Erro em checkDependencies: ${e.stack}`);
    return { error: e.message };
  }
}


function getRecordWithDetails(sheetName, recordId, spreadsheetId) {
  try {
    const activeSpreadsheet = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : ss;
    const parentSheet = activeSpreadsheet.getSheetByName(sheetName);
    if (!parentSheet) throw new Error(`Aba "${sheetName}" não encontrada.`);

    const parentHeaders = parentSheet.getRange(1, 1, 1, parentSheet.getLastColumn()).getValues()[0];
    const idColumnHeader = parentHeaders[0];

    const parentInfo = findRowById_(parentSheet, recordId, idColumnHeader);
    if (!parentInfo) throw new Error("Registro principal não encontrado.");

    const parentRecord = parentInfo.rowData;
    const children = {};
    const dependencies = DEPENDENCY_CONFIG[sheetName];

    if (dependencies) {
      dependencies.forEach(dep => {
        const childSheet = ss.getSheetByName(dep.sheetName);
        if (!childSheet) return;
        const childData = childSheet.getDataRange().getValues();
        const childHeaders = childData.shift();
        const fkIndex = childHeaders.indexOf(dep.fkField);
        if (fkIndex === -1) return;
        const relatedChildren = childData
          .filter(row => row[fkIndex] == recordId)
          .map(row => ({ id: row[0], description: row[1] }));
        if (relatedChildren.length > 0) {
          children[dep.childEntityLabel] = relatedChildren;
        }
      });
    }

    let history = [];
    if (sheetName === SHEETS.EQUIPAMENTOS) {
      const equipmentIdClean = String(recordId).trim(); // Limpa o ID principal para comparação

      // 1. Busca Histórico de Corretivas (OTIMIZADO COM TEXTFINDER)
      const ssCorretivas = SpreadsheetApp.openById(CONFIG.planilhas.corretivas);
      const corretivasSheet = ssCorretivas.getSheetByName("CORRETIVAS");
      if (corretivasSheet && corretivasSheet.getLastRow() > 1) {
        const headers = corretivasSheet.getRange(1, 1, 1, corretivasSheet.getLastColumn()).getValues()[0];
        const eqIdColIndex = headers.indexOf('equipamento_id');
        if (eqIdColIndex !== -1) {
          const eqIdColRange = corretivasSheet.getRange(2, eqIdColIndex + 1, corretivasSheet.getLastRow() - 1, 1);
          const foundCells = eqIdColRange.createTextFinder(equipmentIdClean).matchEntireCell(true).findAll();

          for (const cell of foundCells) {
            const rowNum = cell.getRow();
            const rowValues = corretivasSheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
            const os = headers.reduce((obj, header, i) => { obj[header] = rowValues[i]; return obj; }, {});

            // Lógica original do forEach movida para dentro do loop do TextFinder
            history.push({
              id: os.corretiva_id,
              os_number: os.corretiva_numero,
              type: 'Corretiva',
              date: os.corretiva_datahoraabertura,
              status: os.statuscorretiva_descricao,
              description: os.falha_descricao || 'Não especificado'
            });
          }
        }
      }

      // 2. Busca Histórico de Preventivas (OTIMIZADO COM TEXTFINDER)
      const ssPreventivas = SpreadsheetApp.openById(CONFIG.planilhas.preventivas);
      const preventivasSheet = ssPreventivas.getSheetByName("PREVENTIVAS");
      if (preventivasSheet && preventivasSheet.getLastRow() > 1) {
        const headers = preventivasSheet.getRange(1, 1, 1, preventivasSheet.getLastColumn()).getValues()[0];
        const eqIdColIndex = headers.indexOf('equipamento_id');
        if (eqIdColIndex !== -1) {
          const eqIdColRange = preventivasSheet.getRange(2, eqIdColIndex + 1, preventivasSheet.getLastRow() - 1, 1);
          const foundCells = eqIdColRange.createTextFinder(equipmentIdClean).matchEntireCell(true).findAll();

          for (const cell of foundCells) {
            const rowNum = cell.getRow();
            const rowValues = preventivasSheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
            const os = headers.reduce((obj, header, i) => { obj[header] = rowValues[i]; return obj; }, {});

            // Lógica original do forEach movida para dentro do loop do TextFinder
            history.push({
              id: os.preventiva_id,
              os_number: os.preventiva_numero,
              type: 'Preventiva',
              date: os.preventiva_dataprogramada,
              status: os.statuspreventiva_descricao,
              description: 'Plano de Manutenção Preventiva'
            });
          }
        }
      }

      history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return { success: true, parent: parentRecord, children: children, history: history };

  } catch (e) {
    Logger.log(`Erro em getRecordWithDetails: ${e.stack}`);
    return { error: e.message };
  }
}

function objectifyRows(data) {
  if (!data || data.length === 0) return [];
  const headers = data[0]; // Não remove o cabeçalho do array original
  const dataRows = data.slice(1);

  return dataRows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      // Mantém a lógica de conversão de data para compatibilidade
      obj[header] = row[i] instanceof Date ? row[i].toISOString() : row[i];
    });
    return obj;
  });
}



function writeAuditLog(action, entity, recordId, details) {
  return; // <--- Apenas esta linha. O sistema ignora o resto.
  
  // O código abaixo fica inativo, evitando o peso no banco de dados:
  /*
  try {
    const logsSheet = ss.getSheetByName(SHEETS.LOGS);
    const timestamp = new Date();
    const user = Session.getActiveUser().getEmail();
    const cleanDetails = details ? String(details).substring(0, 200) : '';
    logsSheet.appendRow([timestamp, user, action, entity, recordId, cleanDetails]);
  } catch (e) {
    Logger.log(`Falha ao escrever no log de auditoria: ${e.stack}`);
  }
  */
}

/**
 * @private
 * Converte um array 2D de dados de uma planilha em um array de objetos.
 * @param {Array<Array<any>>} data - O array 2D, com a primeira linha sendo os cabeçalhos.
 * @returns {Array<Object>} Um array de objetos de linha.
 */
function objectifyData_(data) {
  if (!data || data.length < 2) return [];
  const headers = data.shift();
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}


/**
 * @private
 * [V2 - CORRIGIDO] Cria um índice {id: rowIndex} para uma planilha, salva no cache E RETORNA O ÍNDICE.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet O objeto da planilha.
 * @param {string} idColumnHeader O nome da coluna de ID.
 * @returns {Map<string, number>} O mapa do índice recém-criado.
 */
function buildAndCacheRowIndex_(sheet, idColumnHeader) {
  const sheetName = sheet.getName();
  Logger.log(`Construindo índice para a planilha "${sheetName}" (ID Col: ${idColumnHeader})...`);
  const index = new Map();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return index; // Retorna mapa vazio se a planilha só tiver cabeçalho

  const headers = data.shift();
  const idColumnIndex = headers.indexOf(idColumnHeader);

  if (idColumnIndex !== -1) {
    data.forEach((row, i) => {
      const id = row[idColumnIndex];
      // Garante que o ID não seja nulo ou vazio
      if (id !== null && id !== undefined && id !== "") {
        index.set(String(id), i + 2); // Armazena o ID como string e o número da linha real (i + 2)
      }
    });
  } else {
    Logger.log(`AVISO: buildAndCacheRowIndex_ não encontrou a coluna de ID "${idColumnHeader}" na planilha "${sheetName}".`);
  }

  const cache = CacheService.getScriptCache();
  const CACHE_KEY = 'INDEX_' + sheetName;
  try {
    cache.put(CACHE_KEY, JSON.stringify(Array.from(index.entries())), 3600); // Salva por 1 hora
    Logger.log(`Índice para "${sheetName}" com ${index.size} entradas foi salvo no cache.`);
  } catch (e) {
    Logger.log(`Não foi possível salvar o índice de ${sheetName} no cache. Erro: ${e.message}`);
  }
  return index; // <<< CORREÇÃO: Retorna o índice construído
}

/**
 * @private
 * Limpa o cache de índice de uma planilha específica.
 * @param {string} sheetName O nome da planilha.
 */
function clearRowIndexCache_(sheetName) {
  try {
    const cache = CacheService.getScriptCache();
    const CACHE_KEY = 'INDEX_' + sheetName;
    cache.remove(CACHE_KEY);
    Logger.log(`Cache de índice para a planilha "${sheetName}" foi limpo.`);
  } catch (e) {
    Logger.log(`Falha ao tentar limpar o cache de índice para ${sheetName}: ${e.message}`);
  }
}

/**
* @private
* Limpa o cache de valores únicos para uma coluna específica.
* @param {string} sheetName O nome da planilha.
* @param {string} columnName O nome da coluna única.
*/
function clearUniqueValueCache_(sheetName, columnName) {
  try {
    const cache = CacheService.getScriptCache();
    const CACHE_KEY = `UNIQUE_${sheetName}_${columnName}`;
    cache.remove(CACHE_KEY);
    Logger.log(`Cache de valores únicos para "${sheetName}.${columnName}" limpo.`);
  } catch (e) {
    Logger.log(`Falha ao limpar cache de valores únicos para ${sheetName}.${columnName}: ${e.message}`);
  }
}

/**
* @private
* Obtém (ou constrói e cacheia) um Set de valores únicos para uma coluna.
* @param {GoogleAppsScript.Spreadsheet.Sheet} sheet O objeto Sheet.
* @param {string} columnName O nome da coluna.
* @returns {Set<string>} Um Set com os valores únicos (como strings minúsculas e sem espaços).
*/
function getUniqueValueSet_(sheet, columnName) {
  const sheetName = sheet.getName();
  const CACHE_KEY = `UNIQUE_${sheetName}_${columnName}`;
  const cache = CacheService.getScriptCache();
  const cachedData = cache.get(CACHE_KEY);

  if (cachedData) {
    try {
      return new Set(JSON.parse(cachedData));
    } catch (e) { Logger.log(`Cache inválido para ${CACHE_KEY}. Reconstruindo...`); }
  }

  Logger.log(`Construindo cache de valores únicos para "${sheetName}.${columnName}"...`);
  const uniqueValues = new Set();
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return uniqueValues; // Vazio ou só cabeçalho

  const headers = data.shift();
  const colIndex = headers.indexOf(columnName);

  if (colIndex !== -1) {
    data.forEach(row => {
      const value = row[colIndex];
      if (value !== null && value !== undefined && value !== "") {
        uniqueValues.add(String(value).trim().toLowerCase());
      }
    });
  } else { Logger.log(`AVISO: Coluna "${columnName}" não encontrada em "${sheetName}" para cache único.`); }

  try {
    // Limite de tamanho do cache (90KB para segurança)
    const jsonData = JSON.stringify(Array.from(uniqueValues));
    if (jsonData.length < 90000) {
      cache.put(CACHE_KEY, jsonData, 3600); // Salva por 1 hora
      Logger.log(`Cache de valores únicos para "${sheetName}.${columnName}" (${uniqueValues.size} entradas) salvo.`);
    } else {
      Logger.log(`AVISO: Cache de valores únicos para "${sheetName}.${columnName}" é muito grande (${jsonData.length} bytes) e não foi salvo.`);
    }
  } catch (e) { Logger.log(`Erro ao salvar cache de valores únicos para ${sheetName}.${columnName}: ${e.message}`); }

  return uniqueValues;
}

// --- FUNÇÕES UTILITÁRIAS ---
function generateUUID() {
  return Utilities.getUuid();
}


/**
 * VERSÃO HÍBRIDA: Tenta achar o dado no cache de dados primeiro.
 * Se falhar, usa o método tradicional de índice de linhas.
 * Retorna { rowIndex, rowData, headers }
 */
function findRowById_(sheet, id, idColumnHeader) {
  if (!sheet || !id) return null;
  
  const sheetName = sheet.getName();
  const ssId = sheet.getParent().getId();
  const idString = String(id);

  // 1. TENTATIVA RÁPIDA: Cache de Dados (Memória)
  // Tenta pegar os dados completos sem ir ao disco
  const cachedData = getCachedData_(sheetName, ssId);
  
  if (cachedData && cachedData.length > 0) {
    // Encontra o índice no array (base 0)
    const arrayIndex = cachedData.findIndex(row => String(row[idColumnHeader]) === idString);
    
    if (arrayIndex !== -1) {
      // Cálculo do rowIndex real na planilha:
      // arrayIndex + 2 (1 pelo base-0 array, +1 porque a planilha tem cabeçalho na linha 1)
      const rowIndex = arrayIndex + 2;
      
      // Pega os headers do próprio objeto em cache (chaves do objeto)
      const headers = Object.keys(cachedData[0]);
      
      return {
        rowIndex: rowIndex,
        rowData: cachedData[arrayIndex],
        headers: headers
      };
    }
  }

  // 2. FALLBACK: Método Tradicional (Leitura de Disco)
  // Só executa se o cache estiver vazio ou o ID não estiver nele (ex: acabou de ser criado e cache ainda não atualizou)
  Logger.log(`[findRowById_] ID ${id} não encontrado no cache de dados. Usando busca física em ${sheetName}.`);
  
  const indexCache = buildAndCacheRowIndex_(sheet, idColumnHeader);
  const rowIndex = indexCache.get(idString);
  
  if (rowIndex) {
    return getRowDataByIndex_(sheet, rowIndex);
  }
  
  return null;
}

/**
 * @private
 * Helper para buscar os dados de uma linha específica pelo seu número de linha (rowIndex).
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet O objeto da planilha.
 * @param {number} rowIndex O número da linha (base 1) a ser buscada.
 * @returns {object|null} Objeto com { rowIndex, rowData, headers } ou null.
 */
function getRowDataByIndex_(sheet, rowIndex) {
  try {
    // Lê o cabeçalho e a linha de dados em duas chamadas (eficiente)
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    // Valida se a linha pedida existe
    if (rowIndex > sheet.getLastRow()) {
      Logger.log(`Erro em getRowDataByIndex_: Tentativa de ler linha ${rowIndex}, mas a planilha só tem ${sheet.getLastRow()} linhas.`);
      return null;
    }
    const rowValues = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];

    const rowData = headers.reduce((obj, header, i) => {
      const cellValue = rowValues[i];
      // Converte datas para ISO string para consistência
      obj[header] = cellValue instanceof Date ? cellValue.toISOString() : cellValue;
      return obj;
    }, {});

    return { rowIndex, rowData, headers };
  } catch (e) {
    Logger.log(`Erro em getRowDataByIndex_ (linha ${rowIndex}): ${e.stack}`);
    return null; // Retorna nulo se a linha não puder ser lida
  }
}

function getLookupDataAsMaps_() {
  const allLookups = {};
  for (const key in LOOKUP_MAP) {
    const config = LOOKUP_MAP[key];
    const sheet = ss.getSheetByName(config.sheetName);
    if (sheet && sheet.getLastRow() > 1) {
      const data = sheet.getDataRange().getValues();
      const headers = data.shift();
      const idIndex = headers.indexOf(config.idField);
      if (idIndex === -1) continue;
      if (!allLookups[config.sheetName]) {
        allLookups[config.sheetName] = new Map();
      }
      data.forEach(row => {
        const id = row[idIndex];
        const rowData = headers.reduce((obj, header, i) => {
          obj[header] = row[i];
          return obj;
        }, {});
        allLookups[config.sheetName].set(id, rowData);
        allLookups[config.sheetName].set(String(id), rowData); // Adiciona a versão string também
      });
    }
  }
  return allLookups;
}

// =================================================================
// INÍCIO DO NOVO BLOCO DE LÓGICA DE DROPDOWNS OTIMIZADA
// =================================================================

// CONFIGURAÇÃO CENTRAL DE DROPDOWNS - Fica fora das funções para ser reutilizada.
const DROPDOWN_CONFIG = {
  estabelecimentos: { sheetName: SHEETS.ESTABELECIMENTOS, spreadsheetId: CONFIG.planilhas.principal, idField: 'est_id', textField: 'est_descricao' },
  unidades: { sheetName: SHEETS.UNIDADES, spreadsheetId: CONFIG.planilhas.principal, idField: 'un_id', textField: 'un_descricao', returnData: 'full' },
  fabricantes: { sheetName: SHEETS.FABRICANTES, spreadsheetId: CONFIG.planilhas.principal, idField: 'fabricante_id', textField: 'fabricante_descricao' },
  modelos: { sheetName: SHEETS.MODELOS, spreadsheetId: CONFIG.planilhas.principal, idField: 'modelo_id', textField: 'modelo_descricao', returnData: 'full' },
  cargos: { sheetName: SHEETS.CARGOS, spreadsheetId: CONFIG.planilhas.principal, idField: 'cargo_id', textField: 'cargo_descricao' },
  equipes: { sheetName: SHEETS.EQUIPES, spreadsheetId: CONFIG.planilhas.principal, idField: 'equipe_id', textField: 'equipe_descricao' },
  escalas: { 
      sheetName: SHEETS.ESCALAS, 
      spreadsheetId: CONFIG.planilhas.principal, 
      idField: 'escala_id', 
      textField: 'escala_descricao',
      returnData: 'full' // Importante para pegarmos o equipe_id e fazer o filtro em cascata
  },
  tipos_equipamento: { sheetName: SHEETS.TIPOS_EQUIPAMENTO, spreadsheetId: CONFIG.planilhas.principal, idField: 'tipoequipamento_id', textField: 'tipoequipamento_descricao', returnData: 'full' },
  centros: { sheetName: SHEETS.CENTROS, spreadsheetId: CONFIG.planilhas.principal, idField: 'cc_id', textField: 'cc_descricao', returnData: 'full' },
  fornecedores: { sheetName: SHEETS.FORNECEDORES, spreadsheetId: CONFIG.planilhas.principal, idField: 'fornecedor_id', textField: 'fornecedor_descricao' },
  depreciacao: { sheetName: SHEETS.DEPRECIACAO, spreadsheetId: CONFIG.planilhas.principal, idField: 'depreciacao_id', textField: 'depreciacao_descricao', returnData: 'full' },
  classificacao_risco: { sheetName: SHEETS.CLASSIFICACAO_RISCO, spreadsheetId: CONFIG.planilhas.principal, idField: 'risco_id', textField: 'risco_descricao' },
  classificacao_eletrica: { sheetName: SHEETS.CLASSIFICACAO_ELETRICA, spreadsheetId: CONFIG.planilhas.principal, idField: 'eletrica_id', textField: 'eletrica_descricao' },
  statuscorretiva: { sheetName: SHEETS.STATUSCORRETIVA, spreadsheetId: CONFIG.planilhas.principal, idField: 'statuscorretiva_id', textField: 'statuscorretiva_descricao' },
  falhas: { sheetName: SHEETS.FALHAS, spreadsheetId: CONFIG.planilhas.principal, idField: 'falha_id', textField: 'falha_descricao' },
  causas: { sheetName: SHEETS.CAUSAS, spreadsheetId: CONFIG.planilhas.principal, idField: 'causa_id', textField: 'causa_descricao' },
  acoes: { sheetName: SHEETS.ACOES, spreadsheetId: CONFIG.planilhas.principal, idField: 'acao_id', textField: 'acao_descricao' },
  periodicidade: { sheetName: SHEETS.PERIODICIDADE, spreadsheetId: CONFIG.planilhas.principal, idField: 'periodicidade_id', textField: 'periodicidade_descricao' },
  statuspreventiva: { sheetName: SHEETS.STATUSPREVENTIVA, spreadsheetId: CONFIG.planilhas.principal, idField: 'statuspreventiva_id', textField: 'statuspreventiva_descricao' },
  statusoperacional: { sheetName: SHEETS.STATUSOPERACIONAL, spreadsheetId: CONFIG.planilhas.principal, idField: 'statusoperacional_id', textField: 'statusoperacional_descricao' },
  tipopropriedade: { sheetName: SHEETS.TIPO_PROPRIEDADE, spreadsheetId: CONFIG.planilhas.principal, idField: 'tipopropriedade_id', textField: 'tipopropriedade_descricao' },
  tipoplano: { sheetName: SHEETS.TIPOPLANO, spreadsheetId: CONFIG.planilhas.principal, idField: 'tipoplano_id', textField: 'tipoplano_descricao', returnData: 'full' },
  cadastrochecklistcalibracao_master: { 
      sheetName: "CADASTROCHECKLISTCALIBRACAO_MASTER", 
      spreadsheetId: CONFIG.planilhas.principal, 
      idField: 'cadastrochecklistcalibracao_master_id', 
      textField: 'cadastrochecklistcalibracao_master_descricao' 
  },
  cadastrochecklistinspecao_master: { // NOVO
      sheetName: "CADASTROCHECKLISTINSPECAO_MASTER", 
      spreadsheetId: CONFIG.planilhas.principal, 
      idField: 'checklist_inspecao_master_id', 
      textField: 'checklist_inspecao_descricao' 
  },
  cadastrochecklistsegelet_master: { // NOVO
      sheetName: "CADASTROCHECKLISTSEGELET_MASTER", 
      spreadsheetId: CONFIG.planilhas.principal, 
      idField: 'checklist_segelet_master_id', 
      textField: 'checklist_segelet_master_descricao' 
  },
  grandezas: { sheetName: SHEETS.GRANDEZAS, spreadsheetId: CONFIG.planilhas.principal, idField: 'grandeza_id', textField: 'grandeza_descricao' },
  usuarios: {
    sheetName: "USUARIOS",
    spreadsheetId: CONFIG.planilhas.usuarios,
    idField: 'usuario_id',
    textField: 'usuario_nome',
    returnData: 'full'
  },
  motivos_cancelamento: { sheetName: "MOTIVOS_CANCELAMENTO", spreadsheetId: CONFIG.planilhas.rotas, idField: 'motivo_id', textField: 'motivo_descricao' },
  rc_modalidade: { sheetName: SHEETS.RC_MODALIDADE, spreadsheetId: CONFIG.planilhas.principal, idField: 'rc_modalidade_id', textField: 'rc_modalidade_descricao' },
  rc_status: { sheetName: SHEETS.RC_STATUS, spreadsheetId: CONFIG.planilhas.principal, idField: 'rc_status_id', textField: 'rc_status_descricao' },
  rc_contacontabil: { sheetName: SHEETS.RC_CONTACONTABIL, spreadsheetId: CONFIG.planilhas.principal, idField: 'rc_contacontabil_id', textField: 'rc_contacontabil_descricao', returnData: 'full' },
  rc_pep: { sheetName: SHEETS.RC_PEP, spreadsheetId: CONFIG.planilhas.principal, idField: 'rc_pep_id', textField: 'rc_pep_descricao', returnData: 'full' },
  rc_comprador: { sheetName: SHEETS.RC_COMPRADOR, spreadsheetId: CONFIG.planilhas.principal, idField: 'rc_comprador_id', textField: 'rc_comprador_nome' },
  contratos_status: {
    sheetName: "CONTRATOS_STATUS",
    spreadsheetId: "1hmSEgG-Rq6Q1xvv21kH0ttp0fSVwYJlj1PDWEOmKL50",
    idField: 'status_contrato_id',
    textField: 'status_contrato_descricao',
    returnData: 'full' // Retorna o objeto completo para uso futuro
  },
  processos_status: { // <-- ADICIONE ESTE BLOCO
    sheetName: "PROCESSOS_STATUS",
    spreadsheetId: CONFIG.planilhas.contratos, // ID da planilha de Contratos
    idField: 'status_processo_id',
    textField: 'status_processo_descricao',
    returnData: 'full'
  },
  advogados: {
    sheetName: SHEETS.CONTRATO_ADVOGADOS,
    spreadsheetId: CONFIG.planilhas.principal,
    idField: 'contrato_advogado_id',
    textField: 'contrato_advogado_nome',
    returnData: 'full'
  },
  status_queixa: {
    sheetName: SHEETS.STATUS_QUEIXA,
    spreadsheetId: CONFIG.planilhas.queixastecnicas,
    idField: 'status_qt_id',
    textField: 'status_qt_descricao'
  },
  causas_raiz: {
    sheetName: SHEETS.CAUSA_RAIZ_ISHIKAWA,
    spreadsheetId: CONFIG.planilhas.principal, // Fica na planilha de Cadastros
    idField: 'causa_raiz_id',
    textField: 'causa_raiz_descricao',
    returnData: 'full' // Importante para podermos filtrar por categoria no frontend
  },
  justificativas: {
    sheetName: SHEETS.CADASTRO_JUSTIFICATIVAS,
    spreadsheetId: CONFIG.planilhas.principal,
    idField: 'justificativa_id',
    textField: 'justificativa_descricao'
  },
  catalogo_pecas: {
    sheetName: SHEETS.CATALOGO_PECAS,
    spreadsheetId: CONFIG.planilhas.aquisicoes, // Está na planilha de Requisições
    idField: 'peca_id',
    textField: 'peca_descricao', // O que o usuário verá no select
    returnData: 'full' // Retorna o objeto todo (para pegarmos a 'peca_ref' também)
  },
  tipos_acessorio: { sheetName: "TIPO_ACESSORIO", spreadsheetId: CONFIG.planilhas.equipamentos, idField: 'tipoacessorio_id', textField: 'tipoacessorio_descricao' },
  otica_tipos: { sheetName: SHEETS.OTICA_TIPO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_tipo_id', textField: 'otica_tipo_descricao' },
  otica_especialidades: { sheetName: SHEETS.OTICA_ESPECIALIDADE, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_especialidade_id', textField: 'otica_especialidade_descricao' },
  otica_angulacoes: { sheetName: SHEETS.OTICA_ANGULACAO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_angulacao_id', textField: 'otica_angulacao_descricao' },
  otica_diametros: { sheetName: SHEETS.OTICA_DIAMETRO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_diametro_id', textField: 'otica_diametro_descricao' },
  otica_comprimentos: { sheetName: SHEETS.OTICA_COMPRIMENTO, spreadsheetId: CONFIG.planilhas.oticas, idField: 'otica_comprimento_id', textField: 'otica_comprimento_descricao' },
  otica_referencias: { 
    sheetName: "OTICA_REFERENCIA", // Nome exato da aba na planilha de Óticas
    spreadsheetId: CONFIG.planilhas.oticas, 
    idField: 'otica_referencia_id', 
    textField: 'otica_referencia_descricao' 
  },
  motivos_rejeicao_qa: { // <--- ADICIONE ESTE BLOCO
      sheetName: "MOTIVOS_REJEICAO_QA", 
      spreadsheetId: CONFIG.planilhas.principal, 
      idField: 'motivo_id', 
      textField: 'motivo_descricao' 
  },
  cq_tipo_teste: { 
      sheetName: 'CQ_TIPO_TESTE', 
      spreadsheetId: CONFIG.planilhas.cqEquipamentos, 
      idField: 'cq_tipo_teste_id', 
      textField: 'cq_tipo_teste_descricao' 
  }
  
  
};


/**
 * VERSÃO 5 (CACHE UNIFICADO): Carrega todos os dropdowns usando o sistema central de cache.
 * Muito mais rápido e evita duplicidade de dados na memória do servidor.
 */
function getAllDropdownData() {
  // Tenta ler o cache unificado específico de dropdowns primeiro (se existir lógica legada)
  // Mas aqui vamos focar em reconstruir a partir do cache de dados brutos para garantir consistência.
  
  const finalData = {};
  
  // Itera sobre a configuração de dropdowns
  for (const key in DROPDOWN_CONFIG) {
    try {
      const config = DROPDOWN_CONFIG[key];
      
      // 1. Pega os dados BRUTOS do cache central (ou lê da planilha e cacheia)
      const rawData = getCachedData_(config.sheetName, config.spreadsheetId);
      
      // 2. Processa (Filtra ativos e formata) em memória RAM
      // Descobre coluna de status dinamicamente
      const sampleRow = rawData[0] || {};
      const statusField = Object.keys(sampleRow).find(k => k.endsWith('_ativo'));

      const activeRecords = rawData.filter(r => !statusField || r[statusField] === 'Ativo');

      if (config.returnData === 'full') {
        finalData[key] = activeRecords;
      } else {
        finalData[key] = activeRecords.map(r => ({
          id: r[config.idField],
          text: r[config.textField]
        })).sort((a, b) => String(a.text || '').localeCompare(String(b.text || '')));
      }
      
    } catch (e) {
      Logger.log(`Erro ao carregar dropdown ${key}: ${e.message}`);
      finalData[key] = [];
    }
  }

  return finalData;
}

/**
 * VERSÃO CORRIGIDA (CIRÚRGICA): Busca e retorna os dados de UMA ÚNICA fonte de dropdown.
 * @param {string} sourceKey A chave da fonte de dados (ex: 'fabricantes').
 * @returns {object} Um objeto com { success: true, data: [...] } ou { error: '...' }.
 */
function getSingleDropdown(sourceKey) {
  try {
    const config = DROPDOWN_CONFIG[sourceKey];
    if (!config) {
      return { error: `Fonte de dados '${sourceKey}' não encontrada na configuração.` };
    }

    const ss = SpreadsheetApp.openById(config.spreadsheetId);
    const sheet = ss.getSheetByName(config.sheetName);
    let dataToReturn = [];

    if (sheet && sheet.getLastRow() > 1) {
      if (sourceKey === 'centros') {
        Logger.log(sheet.getDataRange().getValues()[0]); // Loga apenas a linha de cabeçalho para 'centros'
      }
      const records = objectifyRows(sheet.getDataRange().getValues());
      const statusField = Object.keys(records[0] || {}).find(k => k.endsWith('_ativo'));
      const activeRecords = records.filter(r => !statusField || r[statusField] === 'Ativo');

      if (config.returnData === 'full') {
        dataToReturn = activeRecords;
      } else {
        const idField = config.idField;
        const textField = config.textField;
        dataToReturn = activeRecords
          .map(r => ({ id: r[idField], text: r[textField] }))
          .sort((a, b) => String(a.text || '').localeCompare(String(b.text || '')));
      }
    }

    return { success: true, data: dataToReturn };

  } catch (e) {
    Logger.log(`Erro em getSingleDropdown para '${sourceKey}': ${e.stack}`);
    return { error: e.message };
  }
}


/**
 * VERSÃO OTIMIZADA (MEMORY-BASED): Busca opções para dropdown usando cache.
 * Resolve o problema de lentidão em grandes volumes de dados.
 */
function getDropdownOptions(options) {
  try {
    const { source, term, spreadsheetId, fornecedor_id } = options; 
    if (!source) throw new Error("A fonte de dados (source) não foi especificada.");

    // Mapeamento de colunas (Mantido da versão anterior)
    const configMap = {
      'EQUIPAMENTOS': { idCol: 'equipamento_id', textCol: 'equipamento_descricaocompleta', extraCols: ['cc_descricao', 'tipoequipamento_id'] },
      'TIPOS_EQUIPAMENTO': { idCol: 'tipoequipamento_id', textCol: 'tipoequipamento_descricao' },
      'FABRICANTES': { idCol: 'fabricante_id', textCol: 'fabricante_descricao' },
      'MODELOS': { idCol: 'modelo_id', textCol: 'modelo_descricao' },
      'RC': { idCol: 'rc_id', textCol: 'rc_descricao', extraCols: ['rc_numero', 'rc_status', 'cc_id'] },
      'CONTRATOS': { idCol: 'contrato_id', textCol: 'contrato_objeto', extraCols: ['cw', 'fornecedor_id'] },
      'CATALOGO_ITENS': { idCol: 'item_catalogo_id', textCol: 'item_descricao', extraCols: ['item_ref', 'fornecedor_id', 'item_tipo', 'rc_contacontabil_id', 'rc_pep_id'] },
      'CATALOGO_PECAS': { idCol: 'item_catalogo_id', textCol: 'item_descricao', extraCols: ['item_ref', 'fornecedor_id', 'item_tipo', 'rc_contacontabil_id', 'rc_pep_id'] }

    };

    const sheetName = (source === 'CATALOGO_PECAS' || source === 'CATALOGO_ITENS') ? 'CATALOGO_ITENS' : source;
    const config = configMap[source] || configMap['CATALOGO_ITENS'];
    
    // 1. CARREGA DADOS DA MEMÓRIA (CACHE) - A grande mudança
    const allData = getCachedData_(sheetName, spreadsheetId);
    
    if (!allData || allData.length === 0) return { results: [] };

    // 2. FILTRAGEM EM MEMÓRIA (Extremamente rápida)
    const searchTerm = term ? term.trim().toLowerCase() : '';
    const results = [];
    
    // Descobre o nome da coluna de status dinamicamente se existir
    const sampleRow = allData[0];
    const statusCol = Object.keys(sampleRow).find(k => k.endsWith('_ativo')) || 'item_ativo';

    for (const row of allData) {
        // Filtro de Status (Apenas Ativos)
        if (row[statusCol] && row[statusCol] !== 'Ativo') continue;

        // Filtro de Fornecedor (se aplicável)
        if (fornecedor_id && String(row.fornecedor_id) !== String(fornecedor_id)) continue;

        // Filtro de Texto (Busca)
        if (searchTerm) {
            const textVal = String(row[config.textCol] || '').toLowerCase();
            // Busca também no ID ou Referência se existirem, para ser mais útil
            const idVal = String(row[config.idCol] || '').toLowerCase();
            const refVal = row.item_ref ? String(row.item_ref).toLowerCase() : '';
            
            if (!textVal.includes(searchTerm) && !idVal.includes(searchTerm) && !refVal.includes(searchTerm)) {
                continue;
            }
        }

        // Monta o objeto de resultado
        const resultObj = {
            id: row[config.idCol],
            text: row[config.textCol]
        };

        if (config.extraCols) {
            config.extraCols.forEach(col => {
                if (row[col] !== undefined) resultObj[col] = row[col];
            });
        }

        results.push(resultObj);

        // Limite de resultados para não travar o frontend (Select2)
        if (results.length >= 50) break; 
    }

    return { results: results };

  } catch (e) {
    Logger.log(`Erro em getDropdownOptions: ${e.stack}`);
    return { error: e.message };
  }
}

function recalculateAllResidualValues() {
  try {
    Logger.log("Iniciando recálculo de valores residuais...");
    const equipmentSheet = SpreadsheetApp.openById(CONFIG.planilhas.equipamentos).getSheetByName("EQUIPAMENTOS");
    const depreciationSheet = ss.getSheetByName(SHEETS.DEPRECIACAO);
    const equipmentData = equipmentSheet.getDataRange().getValues();
    const depreciationData = depreciationSheet.getDataRange().getValues();
    const eqHeaders = equipmentData.shift();
    const depHeaders = depreciationData.shift();
    const depIdIndex = depHeaders.indexOf('depreciacao_id');
    const depRateIndex = depHeaders.indexOf('depreciacao_taxa');
    const depreciationMap = depreciationData.reduce((map, row) => {
      map[row[depIdIndex]] = parseFloat(row[depRateIndex]);
      return map;
    }, {});
    const valAquisicaoIndex = eqHeaders.indexOf('equipamento_valoraquisicao');
    const dataAquisicaoIndex = eqHeaders.indexOf('equipamento_dataaquisicao');
    const depreciacaoIdIndex = eqHeaders.indexOf('depreciacao_id');
    const valResidualIndex = eqHeaders.indexOf('equipamento_valorresidual');
    if (valAquisicaoIndex === -1 || dataAquisicaoIndex === -1 || depreciacaoIdIndex === -1 || valResidualIndex === -1) {
      throw new Error("Uma ou mais colunas necessárias não foram encontradas na planilha de Equipamentos.");
    }
    const hoje = new Date();
    const newResidualValues = [];
    equipmentData.forEach(row => {
      const valorAquisicao = parseFloat(row[valAquisicaoIndex]);
      const dataAquisicao = new Date(row[dataAquisicaoIndex]);
      const depreciacaoId = row[depreciacaoIdIndex];
      let valorResidualCalculado = row[valResidualIndex];
      if (valorAquisicao && dataAquisicao.valueOf() && depreciacaoId && depreciationMap[depreciacaoId]) {
        const taxaAnual = depreciationMap[depreciacaoId];
        const diffTime = Math.abs(hoje - dataAquisicao);
        const idadeAnos = diffTime / (1000 * 60 * 60 * 24 * 365.25);
        const depreciacaoTotal = valorAquisicao * (taxaAnual / 100) * idadeAnos;
        const novoValor = valorAquisicao - depreciacaoTotal;
        valorResidualCalculado = Math.max(0, novoValor).toFixed(2);
      }
      newResidualValues.push([valorResidualCalculado]);
    });
    if (newResidualValues.length > 0) {
      equipmentSheet.getRange(2, valResidualIndex + 1, newResidualValues.length, 1).setValues(newResidualValues);
      Logger.log(`${newResidualValues.length} valores residuais foram recalculados e atualizados com sucesso.`);
    }
  } catch (e) {
    Logger.log(`ERRO ao recalcular valores residuais: ${e.stack}`);
  }
}

// =================================================================
// FUNÇÃO DE OTIMIZAÇÃO COM CACHE (VERSÃO FINAL E CORRIGIDA)
// =================================================================
function getLookupDataWithCache_() {
  const cache = CacheService.getScriptCache();
  const allLookups = {};

  for (const key in LOOKUP_MAP) {
    const config = LOOKUP_MAP[key];
    const sheetName = config.sheetName;

    if (allLookups[sheetName]) continue; // Já carregou esta tabela

    const specificData = getSpecificLookupData_([sheetName]);
    if (specificData[sheetName]) {
      allLookups[sheetName] = specificData[sheetName];
    }
  }

  Logger.log('Dados de lookup carregados com sucesso (via cache unificado).');
  return allLookups;
}

/**
 * VERSÃO OTIMIZADA (LITE MODE): Busca dados de lookup.
 * Para tabelas pesadas (EQUIPAMENTOS), usa modo leve para economizar memória.
 */
function getSpecificLookupData_(sheetNamesArray, spreadsheetIdOverride = null) {
  const requestedLookups = {};

  if (!sheetNamesArray || !Array.isArray(sheetNamesArray) || sheetNamesArray.length === 0) return {};

  sheetNamesArray.forEach(sheetName => {
    let config = Object.values(LOOKUP_MAP).find(c => c.sheetName === sheetName);
    
    if (!config) {
       const dropdownKey = Object.keys(DROPDOWN_CONFIG).find(k => DROPDOWN_CONFIG[k].sheetName === sheetName);
       if (dropdownKey) {
           config = { 
               sheetName: sheetName, 
               idField: DROPDOWN_CONFIG[dropdownKey].idField,
               descField: DROPDOWN_CONFIG[dropdownKey].textField, // Importante pegar o campo de texto
               spreadsheetId: DROPDOWN_CONFIG[dropdownKey].spreadsheetId 
           };
       } else {
           Logger.log(`[Lookup Cache] AVISO: Configuração não encontrada para ${sheetName}.`);
           return;
       }
    }

    const ssId = spreadsheetIdOverride || config.spreadsheetId || CONFIG.planilhas.principal;

    // --- OTIMIZAÇÃO CRÍTICA PARA EQUIPAMENTOS ---
    if (sheetName === 'EQUIPAMENTOS') {
       // Usa o modo LITE: carrega apenas ID e Descrição Completa
       requestedLookups[sheetName] = getLiteLookupMap_(sheetName, ssId, config.idField, config.descField);
    } 
    else {
       // Modo Padrão (Cache Full) para tabelas menores (Status, Marcas, etc)
       const allData = getCachedData_(sheetName, ssId);
       const sheetMap = new Map();
       allData.forEach(row => {
          const id = row[config.idField];
          if (id !== undefined && id !== null && id !== '') {
            sheetMap.set(String(id), row);
          }
       });
       requestedLookups[sheetName] = sheetMap;
    }
  });

  return requestedLookups;
}

/**
 * @private
 * Limpa o cache de uma tabela de lookup, incluindo todos os seus chunks.
 * @param {string} sheetName O nome da planilha.
 */
function clearLookupCache_(sheetName) {
  try {
    const cache = CacheService.getScriptCache();
    const CACHE_KEY_BASE = 'LOOKUP_' + sheetName;
    const chunkCountStr = cache.get(`${CACHE_KEY_BASE}_chunks`);

    if (chunkCountStr != null) {
      const chunkCount = parseInt(chunkCountStr);
      const keysToRemove = [`${CACHE_KEY_BASE}_chunks`];
      for (let i = 0; i < chunkCount; i++) {
        keysToRemove.push(`${CACHE_KEY_BASE}_${i}`);
      }
      cache.removeAll(keysToRemove);
      Logger.log(`Cache (com ${keysToRemove.length} chaves) para a tabela "${sheetName}" foi limpo.`);
    }
  } catch (e) {
    Logger.log(`Falha ao tentar limpar o cache para ${sheetName}: ${e.message}`);
  }
}

function testarDropdownEquipamentos() {
  const dropdownData = getDropdownData();
  Logger.log(dropdownData.equipamentos);
}

/**
 * ATENÇÃO: Esta é uma função de uso único para preencher a descrição
 * completa de todos os equipamentos já existentes.
 * Rode-a apenas uma vez pelo editor de scripts.
 */
function preencherDescricoesAntigas() {
  const sheet = SpreadsheetApp.openById(CONFIG.planilhas.equipamentos).getSheetByName("EQUIPAMENTOS");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const descCompletaIndex = headers.indexOf('equipamento_descricaocompleta');
  if (descCompletaIndex === -1) {
    SpreadsheetApp.getUi().alert('Coluna "equipamento_descricaocompleta" não encontrada na planilha de Equipamentos.');
    return;
  }

  const lookupData = getLookupDataWithCache_();

  const colIndexes = {
    tag: headers.indexOf('equipamento_tag'),
    tipoId: headers.indexOf('tipoequipamento_id'),
    modeloId: headers.indexOf('modelo_id'),
    serie: headers.indexOf('serie')
  };

  const newData = data.map(row => {
    try {
      const tipoInfo = lookupData[SHEETS.TIPOS_EQUIPAMENTO]?.get(row[colIndexes.tipoId]);
      const modeloInfo = lookupData[SHEETS.MODELOS]?.get(row[colIndexes.modeloId]);
      const fabricanteInfo = modeloInfo ? lookupData[SHEETS.FABRICANTES]?.get(modeloInfo.fabricante_id) : null;

      const tag = row[colIndexes.tag] || 'N/D';
      const tipo = tipoInfo?.tipoequipamento_descricao || 'N/D';
      const fabricante = fabricanteInfo?.fabricante_descricao || 'N/D';
      const modelo = modeloInfo?.modelo_descricao || 'N/D';
      const serie = row[colIndexes.serie] || 'N/D';

      const descCompleta = `${tag} ${tipo} ${fabricante} ${modelo} Série: ${serie}`;
      row[descCompletaIndex] = descCompleta; // Coloca a descrição na coluna correta
    } catch (e) {
      // Ignora erros em linhas individuais
    }
    return row;
  });

  // Salva todos os dados atualizados de volta na planilha
  sheet.getRange(2, 1, newData.length, newData[0].length).setValues(newData);
  SpreadsheetApp.getUi().alert('Concluído! Todas as descrições de equipamentos foram atualizadas.');
}




function updateRecordStatus(sheetName, recordId, newStatus, spreadsheetId) {
  const lock = LockService.getScriptLock(); // <<< ADICIONADO
  lock.waitLock(20000); // <<< ADICIONADO

  try { // <<< TRY ADICIONADO >>>
    const activeSpreadsheet = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : ss;
    const sheet = activeSpreadsheet.getSheetByName(sheetName);
    if (!sheet) throw new Error(`Aba "${sheetName}" não encontrada.`);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const idColumnHeader = headers[0];
    const statusColumnHeader = headers.find(h => h.endsWith('_ativo'));
    if (!statusColumnHeader) {
      throw new Error(`Nenhuma coluna de status (terminada em '_ativo') foi encontrada em "${sheetName}".`);
    }

    const recordInfo = findRowById_(sheet, recordId, idColumnHeader);
    if (!recordInfo) throw new Error("Registro não encontrado para atualização de status.");

    const statusColumnIndex = headers.indexOf(statusColumnHeader) + 1;
    sheet.getRange(recordInfo.rowIndex, statusColumnIndex).setValue(newStatus);

    // --- Lógica de Status Operacional ---
    if (sheetName === SHEETS.EQUIPAMENTOS && newStatus === 'Inativo') {
      const statusOpColHeader = 'statusoperacional_id';
      const statusOpColIndex = headers.indexOf(statusOpColHeader);
      const statusOpDescColIndex = headers.indexOf('statusoperacional_descricao'); // <<< ADICIONADO AQUI

      if (statusOpColIndex !== -1) {
        // Usar getSpecificLookupData_ para otimizar a busca do status 'Desativado'
        const statusOpLookup = getSpecificLookupData_([SHEETS.STATUSOPERACIONAL]);
        if (statusOpLookup[SHEETS.STATUSOPERACIONAL]) {
          const todosStatusOp = Array.from(statusOpLookup[SHEETS.STATUSOPERACIONAL].values());
          const statusDesativado = todosStatusOp.find(s => s.statusoperacional_descricao === 'Desativado');

          if (statusDesativado) {
            sheet.getRange(recordInfo.rowIndex, statusOpColIndex + 1).setValue(statusDesativado.statusoperacional_id);
            // <<< CORREÇÃO AQUI >>>
            if (statusOpDescColIndex !== -1) {
              sheet.getRange(recordInfo.rowIndex, statusOpDescColIndex + 1).setValue('Desativado');
            }
          }
        }
      }
    }
    // --- Fim da Lógica de Status Operacional ---

    // --- Atualiza Data de Modificação ---
    const modDateHeader = headers.find(h => h.endsWith('_datamodificacao'));
    if (modDateHeader) {
      const modDateColIndex = headers.indexOf(modDateHeader) + 1;
      sheet.getRange(recordInfo.rowIndex, modDateColIndex).setValue(new Date());
    }

    writeAuditLog('MUDANÇA DE STATUS', sheetName, recordId, `Status alterado para ${newStatus}`);

    // === ADICIONE ESTA LINHA AQUI ===
    // Garante que o item suma da lista ou mude de cor imediatamente
    invalidateSheetCache_(sheetName, spreadsheetId || CONFIG.planilhas.principal);
    // ================================

    // Limpa caches relevantes
    // Limpa caches de valores únicos relevantes
    const uniqueChecksForUpdate = UNIQUE_CHECKS_CONFIG[sheetName];
    if (uniqueChecksForUpdate) {
      uniqueChecksForUpdate.flat().forEach(colName => clearUniqueValueCache_(sheetName, colName));
    }
    clearRowIndexCache_(sheetName);
    if (LOOKUP_SOURCE_SHEETS.has(sheetName)) {
      clearLookupCache_(sheetName);
    }
    const allDropdownSheetNames = new Set(Object.values(DROPDOWN_CONFIG).map(config => config.sheetName));
    if (allDropdownSheetNames.has(sheetName)) {
      CacheService.getScriptCache().remove('ALL_DROPDOWN_DATA_V2');
      Logger.log(`Cache principal de dropdowns invalidado devido à alteração de status em ${sheetName}.`);
    }

    return { success: true };

  } catch (e) { // <<< CATCH ADICIONADO >>>
    Logger.log(`Erro em updateRecordStatus: ${e.stack}`);
    return { error: e.message };
  } finally { // <<< FINALLY ADICIONADO >>>
    lock.releaseLock();
  }
}






/**
 * VERSÃO HÍBRIDA FINAL COM JOIN VIRTUAL E FILTRAGEM ROBUSTA: 
 * - EQUIPAMENTOS: Usa Matrix Mode + JOIN com PLANOPREVENTIVO + Filtros Map.
 * - OUTROS: Usa Object Mode (Legado).
 */
function getRecordsServerSide(options) {
  try {
    const { sheetName, spreadsheetId, start, length, search, order, filters } = options;

    // ==========================================================================================
    // ROTA 1: MODO TURBO COM JOIN (Apenas para EQUIPAMENTOS)
    // ==========================================================================================
    if (sheetName === 'EQUIPAMENTOS') {
      // 1. Busca Matriz de Equipamentos
      let matrixEquip = getFastMatrixData_("EQUIPAMENTOS", spreadsheetId);
      
      // 2. Busca Matriz de Planos Preventivos (Para fazer o Join)
      let matrixPlanos = getFastMatrixData_("PLANOPREVENTIVO", spreadsheetId);

      if (!matrixEquip || matrixEquip.length < 2) {
         return { draw: options.draw, recordsTotal: 0, recordsFiltered: 0, data: [], stats: null };
      }

      // --- PREPARAÇÃO DO JOIN (Mapa de Planos) ---
      // Cria um mapa dos Planos Ativos: ID do Equipamento -> Dados do Plano
      const planoMap = new Map();
      if (matrixPlanos && matrixPlanos.length > 1) {
          const hPlanos = matrixPlanos[0];
          const colEqIdPlano = hPlanos.indexOf('equipamento_id');
          const colAtivoPlano = hPlanos.indexOf('prev_ativo');
          
          // Mapeia colunas do plano que queremos injetar no equipamento
          const colsToInject = [
              'planopreventivo_id', 'prev_tipoplano_id', 'prev_periodicidade_id', 
              'prev_contratado', 'prev_ativo', 'prev_tecnico_padrao_id', 
              'prev_duracao_estimada', 'prev_fornecedor_id',
              'prev_checklist_inspecao_id', 'prev_checklist_segelet_id', 'prev_checklist_calib_id',
              'prev_data_inicio_ciclo' // <--- Adicionado conforme solicitado
          ];
          
          const mapIndices = {};
          colsToInject.forEach(c => mapIndices[c] = hPlanos.indexOf(c));

          // Itera sobre os planos e guarda o ATIVO de cada equipamento
          for(let i=1; i<matrixPlanos.length; i++) {
              const row = matrixPlanos[i];
              // Verifica status do plano de forma robusta
              const status = String(row[colAtivoPlano] || '').toLowerCase().trim();
              if (status === 'ativo' || status === 'sim') {
                  const eqId = String(row[colEqIdPlano]);
                  
                  // Cria objeto com os dados do plano
                  const planoData = {};
                  colsToInject.forEach(col => {
                      planoData[col] = row[mapIndices[col]];
                  });
                  
                  planoMap.set(eqId, planoData);
              }
          }
      }

      const headers = matrixEquip[0];
      let dataRows = matrixEquip.slice(1); 
      const recordsTotal = dataRows.length;

      // Mapa de Índices de Equipamentos (Header -> Index)
      const colMap = new Map();
      headers.forEach((h, i) => colMap.set(h, i));

      // Índices chave para filtros comuns
      const idxId = colMap.get('equipamento_id');
      const idxAtivo = colMap.get('equipamento_ativo');
      const idxStatusOp = colMap.get('statusoperacional_descricao');
      const idxDataAq = colMap.get('equipamento_dataaquisicao');
      const idxTag = colMap.get('equipamento_tag');
      const idxValor = colMap.get('equipamento_valoraquisicao');
      const idxBackup = colMap.get('e_um_backup');

      // 3. FILTRAGEM VIA ÍNDICE
      if (filters || (search && search.value)) {
         dataRows = dataRows.filter(row => {
            const rowEqId = String(row[idxId]);
            // Recupera dados do plano para este equipamento (se houver)
            const planoData = planoMap.get(rowEqId) || {};

            // A. Filtros Globais (Search Box)
            if (search && search.value) {
               const term = search.value.toLowerCase();
               // Busca no equipamento OU nos dados do plano injetado
               const rowStr = row.join(' ').toLowerCase();
               // Otimização: Busca nos valores do plano apenas se tiver plano
               const planoStr = planoData ? Object.values(planoData).join(' ').toLowerCase() : '';
               
               if (!rowStr.includes(term) && !planoStr.includes(term)) return false;
            }

            // B. Filtros Específicos (Vindos do Frontend)
            if (filters) {
               // B1. Filtro de Cards (Status do Equipamento Inteligente)
               if (filters.status_card && filters.status_card !== '') {
                   const st = String(filters.status_card).trim().toLowerCase();
                   
                   // Pega os índices dinamicamente
                   const idxJustificativa = colMap.get('prev_justificativa_atraso');
                   
                   // Pega os valores da linha atual
                   const statusOpRaw = String(row[idxStatusOp] || '').trim();
                   const justificativaPrev = idxJustificativa !== undefined ? String(row[idxJustificativa] || '').trim().toLowerCase() : '';
                   const ativo = String(row[idxAtivo] || '').trim();

                   // Lógica de Status Dinâmico (Idêntica aos Cards)
                   let statusCalculado = 'Em Operação';
                   
                   if (statusOpRaw === 'Em Manutenção') {
                       statusCalculado = 'Em Manutenção';
                   } else if (justificativaPrev.includes('não localizado') || justificativaPrev.includes('nao localizado')) {
                       statusCalculado = 'Não Localizado';
                   }

                   // Se o status calculado não for o que o usuário clicou no card, esconde a linha
                   if (statusCalculado.toLowerCase() !== st) {
                       return false;
                   }
               }

               // B2. Filtros de Data
               if (filters.data_inicio || filters.data_fim) {
                   const valData = row[idxDataAq];
                   if (!valData) return false;
                   const dtRow = new Date(valData);
                   if (isNaN(dtRow.getTime())) return false;
                   
                   if (filters.data_inicio && dtRow < new Date(filters.data_inicio)) return false;
                   if (filters.data_fim) {
                       const dtFim = new Date(filters.data_fim);
                       dtFim.setHours(23, 59, 59, 999);
                       if (dtRow > dtFim) return false;
                   }
               }

               // B3. Filtros Dropdown Genéricos (Atualizado para Múltipla Escolha)
               for (const [key, val] of Object.entries(filters)) {
                  // Pula chaves especiais e valores vazios (incluindo arrays vazios do Multi-select)
                  if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0) || ['status_card', 'data_inicio', 'data_fim'].includes(key)) continue;
                  
                  // Transforma o filtro em um array de strings minúsculas para comparação fluida
                  const valArray = Array.isArray(val) ? val.map(v => String(v).toLowerCase()) : [String(val).toLowerCase()];

                  // Se for filtro de PLANO (começa com prev_), verifica no objeto do plano mapeado
                  if (key.startsWith('prev_')) {
                      const rowVal = String(planoData[key] || '').toLowerCase();
                      if (!valArray.includes(rowVal)) return false; // Esconde a linha se não estiver na lista selecionada
                  } 
                  // Se for filtro de EQUIPAMENTO, verifica na linha da matriz usando o índice
                  else {
                      const targetIdx = colMap.get(key);
                      if (targetIdx !== undefined) {
                         const rowVal = String(row[targetIdx]).toLowerCase();
                         if (!valArray.includes(rowVal)) return false; // Esconde a linha se não estiver na lista selecionada
                      }
                  }
               }

               // B4. Filtro Customizado (Matriz: Sem Responsável Primário)
               if (filters.somente_sem_resp_geral === 'Sim') {
                   const idxRespPri = colMap.get('resp_geral_pri_id');
                   if (idxRespPri !== undefined) {
                       const valRespPri = String(row[idxRespPri] || '').trim();
                       // Se tiver ALGUM texto (um ID), descartamos a linha, pois queremos os VAZIOS
                       if (valRespPri !== '') return false;
                   }
               }

               
            }
            return true;
         });
      }

      const recordsFiltered = dataRows.length;

      // 4. STATS DINÂMICOS (Recálculo rápido para atualizar os cards de acordo com o filtro)
      let stats = { totalCount: 0, byStatus: {}, totalValue: 0, averageAgeYears: 0, totalAgeMonths: 0, validAgeCount: 0 };
      const hoje = new Date();

      dataRows.forEach(row => {
          const rowEqId = String(row[idxId]);
          const planoData = planoMap.get(rowEqId) || {};
          const ativo = String(row[idxAtivo] || '').trim();

          if (ativo === 'Ativo') {
              stats.totalCount++;

              const statusOpRaw = String(row[idxStatusOp] || '').trim();
              const justificativaPrev = String(planoData.prev_justificativa_atraso || '').trim().toLowerCase();

              let statusCalculado = 'Em Operação';
              if (statusOpRaw === 'Em Manutenção') {
                  statusCalculado = 'Em Manutenção';
              } else if (justificativaPrev.includes('não localizado') || justificativaPrev.includes('nao localizado')) {
                  statusCalculado = 'Não Localizado';
              }
              stats.byStatus[statusCalculado] = (stats.byStatus[statusCalculado] || 0) + 1;

              const valAqStr = String(row[idxValor] || '0').replace(/\./g, '').replace(',', '.');
              const valAq = parseFloat(valAqStr);
              if (!isNaN(valAq)) stats.totalValue += valAq;

              const valData = row[idxDataAq];
              if (valData) {
                  const dtRow = new Date(valData);
                  if (!isNaN(dtRow.getTime())) {
                      let meses = (hoje.getFullYear() - dtRow.getFullYear()) * 12;
                      meses -= dtRow.getMonth();
                      meses += hoje.getMonth();
                      if (meses > 0) {
                          stats.totalAgeMonths += meses;
                          stats.validAgeCount++;
                      }
                  }
              }
          }
      });
      stats.averageAgeYears = stats.validAgeCount > 0 ? (stats.totalAgeMonths / stats.validAgeCount / 12) : 0;

      // 5. ORDENAÇÃO
      if (order && order.length > 0) {
          const colName = order[0].column;
          const dir = order[0].dir === 'asc' ? 1 : -1;
          
          // Ordenação por coluna de equipamento
          const colIdx = colMap.get(colName);
          if (colIdx !== undefined) {
             dataRows.sort((a, b) => {
                const vA = a[colIdx] || '', vB = b[colIdx] || '';
                // Tenta numérico
                const numA = parseFloat(String(vA).replace(',','.'));
                const numB = parseFloat(String(vB).replace(',','.'));
                if(!isNaN(numA) && !isNaN(numB)) return (numA - numB) * dir;
                return String(vA).localeCompare(String(vB)) * dir;
             });
          }
      }

      // 6. PAGINAÇÃO E MERGE FINAL
      let limit = parseInt(length);
      if (limit === -1) limit = recordsFiltered;
      const startIdx = parseInt(start);
      
      const pageDataRows = dataRows.slice(startIdx, startIdx + limit);
      
      const finalData = pageDataRows.map(row => {
          // Cria objeto base do equipamento
          let obj = {};
          headers.forEach((h, i) => obj[h] = row[i]);
          
          // INJETA DADOS DO PLANO NO OBJETO FINAL
          const plano = planoMap.get(String(obj.equipamento_id));
          if (plano) {
              // Copia todas as propriedades do plano para o objeto do equipamento
              Object.assign(obj, plano);
          } else {
              // Se não tem plano, garante que os campos prev_ existam mas vazios (para não quebrar Datatables)
              obj.prev_ativo = 'Inativo';
              obj.prev_contratado = 'Não';
              obj.prev_tipoplano_id = '';
              obj.prev_periodicidade_id = '';
              // ... outros campos se necessário
          }
          return obj;
      });

      return {
        draw: parseInt(options.draw),
        recordsTotal: recordsTotal,
        recordsFiltered: recordsFiltered,
        data: finalData,
        stats: stats
      };
    }

    // ==========================================================================================
    // ROTA 2: MODO CLÁSSICO (Mantido para outras tabelas - Corretivas, Chamados, etc)
    // ==========================================================================================
    
    // 1. Carrega dados como OBJETOS (Cache Antigo)
    let data = getCachedData_(sheetName, spreadsheetId);
    
    if (!data || data.length === 0) {
       return { draw: options.draw, recordsTotal: 0, recordsFiltered: 0, data: [], stats: null };
    }

    if (sheetName === 'CORRETIVAS') {
        // 1. Busca URLs dos Relatórios para criar o Atalho
        const relatoriosData = getCachedData_(SHEETS.CORRETIVAS_RELATORIOS, CONFIG.planilhas.corretivas);
        const relatoriosMap = new Map();
        
        if (relatoriosData) {
            relatoriosData.forEach(r => {
                if(r.drive_url) relatoriosMap.set(String(r.corretiva_id), r.drive_url);
            });
        }



        // 2. Injeta os dados extras
        const cacheEquip = getCachedData_('EQUIPAMENTOS', CONFIG.planilhas.equipamentos);
        const equipMap = new Map(cacheEquip.map(e => [String(e.equipamento_id), e]));

        data.forEach(row => {
             const urlRelatorio = relatoriosMap.get(String(row.corretiva_id));
             row.link_relatorio_atalho = urlRelatorio || '';

             if (row.equipamento_id) {
                 const eq = equipMap.get(String(row.equipamento_id));
                 if (eq) {
                     row._temp_tipo_id = eq.tipoequipamento_id;
                     row._temp_fab_id = eq.fabricante_id;
                     if (!row.est_id) row.est_id = eq.est_id; 
                     
                     // Injetando as descrições separadas para permitir a formatação visual em 2 linhas
                     row.tipoequipamento_descricao = eq.tipoequipamento_descricao || '';
                     row.fabricante_descricao = eq.fabricante_descricao || '';
                     row.modelo_descricao = eq.modelo_descricao || '';
                 }
             }
        });
    }

    const recordsTotal = data.length;

    // Filtragem Clássica (Objeto)
    if (filters) {
       if (filters.responsavel) {
           const respKey = Object.keys(data[0]).find(k => k === 'usuario_nome' || k === 'tecnico_nome') || 'usuario_nome';
           const filterResp = String(filters.responsavel).toLowerCase().trim();
           data = data.filter(row => String(row[respKey] || '').toLowerCase() === filterResp);
       }
       
       // Filtro de Data Genérico
       if (filters.data_inicio || filters.data_fim) {
             const dtInicio = filters.data_inicio ? new Date(filters.data_inicio) : null;
             const dtFim = filters.data_fim ? new Date(filters.data_fim) : null;
             if (dtFim) dtFim.setHours(23, 59, 59, 999);
             
             let dateCol = 'data_criacao';
             if (sheetName === 'CORRETIVAS') dateCol = 'corretiva_datahoraabertura';
             else if (sheetName === 'CHAMADOS') dateCol = 'chamado_data'; 
             
             if (data.length > 0 && (data[0][dateCol] !== undefined)) {
                 data = data.filter(row => {
                     if (!row[dateCol]) return false;
                     const dtRow = new Date(row[dateCol]); 
                     if (isNaN(dtRow.getTime())) return false;
                     return (!dtInicio || dtRow >= dtInicio) && (!dtFim || dtRow <= dtFim);
                 });
             }
       }

       if (sheetName === 'CORRETIVAS') {
           if (filters.est_id) data = data.filter(row => String(row.est_id) === String(filters.est_id));
           if (filters.cc_id) data = data.filter(row => String(row.cc_id) === String(filters.cc_id));
           if (filters.tipo_id) data = data.filter(row => String(row._temp_tipo_id) === String(filters.tipo_id));
           if (filters.fab_id) data = data.filter(row => String(row._temp_fab_id) === String(filters.fab_id));
           if (filters.tecnico_id) data = data.filter(row => String(row.usuario_id) === String(filters.tecnico_id));
           if (filters.origem) {
               const buscaContratada = filters.origem === 'Externa' ? 'Sim' : 'Não';
               data = data.filter(row => String(row.corretiva_contratada) === buscaContratada);
           }
           
       }

       // Outros filtros genéricos
       Object.keys(filters).forEach(key => {
            if (['status_card', 'data_inicio', 'data_fim', 'responsavel', 'status', 'origem', 'est_id', 'tipo_id', 'fab_id', 'tecnico_id'].includes(key)) return;
            
            const filterVal = String(filters[key]).toLowerCase().trim();
            if (!filterVal) return; 

            if (key === 'equipamento_tag') {
                 data = data.filter(row => {
                     const tag = String(row.equipamento_tag || '').toLowerCase();
                     const patri = String(row.patrimonio || '').toLowerCase();
                     return tag.includes(filterVal) || patri.includes(filterVal);
                 });
            } else if (data[0] && data[0].hasOwnProperty(key)) {
                 data = data.filter(row => String(row[key] || '').toLowerCase().includes(filterVal));
            }
       });
    }

    if (search && search.value) {
       const term = search.value.toLowerCase().trim();
       data = data.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(term)));
    }

    
    let stats2 = null;

    // Stats para Corretivas
    if (sheetName === 'CORRETIVAS') {
           stats2 = { 'TOTAL': data.length };
           for (let i = 0; i < data.length; i++) {
               const row = data[i];
               if (row.statuscorretiva_descricao) {
                   const st = String(row.statuscorretiva_descricao).trim();
                   stats2[st] = (stats2[st] || 0) + 1;
               }
           }

           // AGORA SIM aplicamos o filtro de Status apenas para a Tabela
           if (filters.status && filters.status !== 'todos') {
               if (filters.status === 'ativas_default') {
                   data = data.filter(row => {
                       const st = String(row.statuscorretiva_descricao || '').toLowerCase().trim();
                       return st !== 'concluída' && st !== 'concluida' && st !== 'cancelada';
                   });
               } else {
                   const filterStatus = String(filters.status).toLowerCase().trim();
                   data = data.filter(row => String(row.statuscorretiva_descricao || '').toLowerCase() === filterStatus);
               }
           }
    }

    const recordsFiltered2 = data.length;

    // --- NOVA LÓGICA: INJETAR NOME DO FORNECEDOR NO CATÁLOGO DE ESTOQUE ---
    if (sheetName === 'CATALOGO_ITENS' || sheetName === 'CATALOGO_PECAS') {
        const cacheForn = getCachedData_('FORNECEDORES', CONFIG.planilhas.principal);
        if (cacheForn) {
            const fornMap = new Map(cacheForn.map(f => [String(f.fornecedor_id), f.fornecedor_descricao]));
            data.forEach(row => {
                if (row.fornecedor_id) {
                    row.fornecedor_descricao = fornMap.get(String(row.fornecedor_id)) || '';
                } else {
                    row.fornecedor_descricao = '';
                }
            });
        }
    }
    // ----------------------------------------------------------------------

    if (order && order.length > 0) {
       const colName = order[0].column;
       const dir = order[0].dir === 'asc' ? 1 : -1;
       
       data.sort((a, b) => {
           let vA = a[colName];
           let vB = b[colName];

           if (vA === undefined || vA === null) vA = '';
           if (vB === undefined || vB === null) vB = '';

           vA = String(vA).trim();
           vB = String(vB).trim();

           // Verificação ESTRITA para números (evita que textos como "005-205" sejam lidos como matemática)
           const isNumericA = /^[-]?\d+([.,]\d+)?$/.test(vA);
           const isNumericB = /^[-]?\d+([.,]\d+)?$/.test(vB);

           if (isNumericA && isNumericB) {
               const numA = parseFloat(vA.replace(/\./g, '').replace(',', '.'));
               const numB = parseFloat(vB.replace(/\./g, '').replace(',', '.'));
               return (numA - numB) * dir;
           }

           // Ordenação alfanumérica inteligente (entende que "Item 2" vem antes de "Item 10")
           return vA.localeCompare(vB, undefined, { numeric: true, sensitivity: 'base' }) * dir;
       });
    }

    const pageData = data.slice(start, start + length);
    
    // === MÁGICA DE EXIBIÇÃO DE ACESSÓRIOS NA TABELA ===
    // Inserido logo após o slice (pageData) e antes do return
    if (sheetName === 'CORRETIVAS' && pageData.length > 0) {
        const acessoriosCache = getCachedData_("ACESSORIOS", CONFIG.planilhas.equipamentos) || [];
        
        pageData.forEach(row => {
            if (row.acessorio_id && String(row.acessorio_id).trim() !== '') {
                // Procura o acessório na memória
                const ac = acessoriosCache.find(a => String(a.acessorio_id || a.id) === String(row.acessorio_id));
                if (ac) {
                    // Substitui dinamicamente os valores apenas para a visualização na tabela
                    row.equipamento_tag = `🔌 ` + (ac.acessorio_tag || ac.tag || 'S/TAG');
                    row.equipamento_descricaocompleta = `[Acessório] ${ac.tipoacessorio_descricao || ac.descricao || ''} ${ac.acessorio_modelo || ''}`;
                    row.serie = ac.acessorio_serie || ac.serie || '';
                }
            }
        });
    }
    // ====================================================

    return {
        draw: parseInt(options.draw) || 0,
        recordsTotal: recordsTotal, // Total antes do filtro
        recordsFiltered: recordsFiltered2, // Total após filtro
        data: pageData, // <--- Aqui o pageData já vai com a mágica aplicada
        stats: stats2
    };

  } catch (e) {
    Logger.log(`ERRO getRecordsServerSide: ${e.message}`);
    return { error: e.message, draw: options.draw, recordsTotal: 0, recordsFiltered: 0, data: [] };
  }
}


/**
 * FORÇA a limpeza do cache principal de dropdowns no servidor.
 * Use esta função apenas para forçar a recarga dos dados após uma mudança na lógica.
 */
function forceClearDropdownCache() {
  try {
    const cache = CacheService.getScriptCache();
    const CACHE_KEY = 'ALL_DROPDOWN_DATA_V2';

    // Tenta encontrar o número de "pedaços" (chunks) do cache
    const chunkCountStr = cache.get(`${CACHE_KEY}_chunks`);

    if (chunkCountStr) {
      const chunkCount = parseInt(chunkCountStr, 10);
      const keysToRemove = [`${CACHE_KEY}_chunks`];
      for (let i = 0; i < chunkCount; i++) {
        keysToRemove.push(`${CACHE_KEY}_${i}`);
      }
      cache.removeAll(keysToRemove);
      const message = `O cache do servidor (composto por ${keysToRemove.length} chaves) foi limpo com sucesso! Por favor, recarregue a página da aplicação.`;
      Logger.log(message);
      SpreadsheetApp.getUi().alert(message);
    } else {
      // Se não encontrar, tenta remover a chave principal caso não esteja usando chunks
      cache.remove(CACHE_KEY);
      const message = 'Nenhum cache em pedaços foi encontrado, mas a chave principal foi removida. Por favor, recarregue a aplicação.';
      Logger.log(message);
      SpreadsheetApp.getUi().alert(message);
    }
  } catch (e) {
    const errorMessage = `Ocorreu um erro ao tentar limpar o cache: ${e.message}`;
    Logger.log(errorMessage);
    SpreadsheetApp.getUi().alert(errorMessage);
  }
}

function setApiKey_() {
  const apiKey = ""; // <<<<<<< COLOQUE SUA CHAVE AQUI
  PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', apiKey);
  Logger.log("Chave de API do Gemini foi salva com sucesso!");
}

/**
 * Busca o ID e o nome do usuário do Sirius atualmente logado.
 * @returns {object|null} Um objeto com {id, nome} ou null se não encontrado.
 */
function getCurrentSiriusUser() {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    const ssUsuarios = SpreadsheetApp.openById(CONFIG.planilhas.usuarios);
    const sheetUsuarios = ssUsuarios.getSheetByName("USUARIOS");
    if (!sheetUsuarios) return null;

    const data = sheetUsuarios.getDataRange().getValues();
    const headers = data.shift();
    const emailColIndex = headers.indexOf('usuario_email');
    const idColIndex = headers.indexOf('usuario_id');
    const nomeColIndex = headers.indexOf('usuario_nome'); // Adicionado para buscar o nome

    if (emailColIndex === -1 || idColIndex === -1 || nomeColIndex === -1) return null;

    const usuarioRow = data.find(row => row[emailColIndex] && row[emailColIndex].toLowerCase() === userEmail.toLowerCase());

    if (usuarioRow) {
      return {
        id: usuarioRow[idColIndex],
        nome: usuarioRow[nomeColIndex]
      };
    }

    return null;

  } catch (e) {
    Logger.log("Erro ao buscar usuário Sirius: " + e.message);
    return null;
  }
}











function getColumnLetter(colIndex) {
  let temp, letter = '';
  // Corrige a lógica para colIndex baseado em 1 (como vindo de lastColumn)
  let column = colIndex;
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = Math.floor((column - temp - 1) / 26);
  }
  return letter ? letter : 'A';
}












// =================================================================
// SISTEMA DE CACHE DE ALTA PERFORMANCE (Chunked Cache)
// =================================================================

/**
 * Lê todos os dados de uma planilha, usando cache se disponível.
 * Se não estiver no cache, lê da planilha e salva no cache.
 */
function getCachedData_(sheetName, spreadsheetId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = `DATA_${spreadsheetId || CONFIG.planilhas.principal}_${sheetName}`;
  
  // 1. Tenta ler do cache (metadados)
  const meta = cache.get(cacheKey);
  
  if (meta) {
    const { chunks } = JSON.parse(meta);
    const chunkKeys = Array.from({ length: chunks }, (_, i) => `${cacheKey}_${i}`);
    const cachedChunks = cache.getAll(chunkKeys);
    
    // Reconstrói o JSON
    let jsonString = '';
    let complete = true;
    for (const key of chunkKeys) {
      if (!cachedChunks[key]) {
        complete = false;
        break;
      }
      jsonString += cachedChunks[key];
    }
    
    if (complete) {
      Logger.log(`[CACHE HIT] Dados de ${sheetName} carregados da memória.`);
      return JSON.parse(jsonString);
    }
  }

  // 2. Se não estiver no cache (ou estiver incompleto), lê da planilha
  Logger.log(`[CACHE MISS] Lendo ${sheetName} diretamente da planilha...`);
  const ssTarget = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : ss;
  const sheet = ssTarget.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = objectifyRows(sheet.getDataRange().getValues());
  
  // 3. Salva no cache para as próximas chamadas (valide por 15 minutos)
  try {
    const jsonString = JSON.stringify(data);
    const chunkSize = 90000; // Limite seguro (max 100kb)
    const numChunks = Math.ceil(jsonString.length / chunkSize);
    const cacheObj = {};
    
    // Salva metadados
    cacheObj[cacheKey] = JSON.stringify({ chunks: numChunks, timestamp: new Date().getTime() });
    
    // Salva pedaços
    for (let i = 0; i < numChunks; i++) {
      cacheObj[`${cacheKey}_${i}`] = jsonString.substring(i * chunkSize, (i + 1) * chunkSize);
    }
    
    cache.putAll(cacheObj, 900); // 15 minutos
    Logger.log(`[CACHE SAVE] ${sheetName} salvo em ${numChunks} chunks.`);
  } catch (e) {
    Logger.log(`Erro ao salvar cache de ${sheetName}: ${e.message}`);
  }
  
  return data;
}

/**
 * NOVA FUNÇÃO: Cache de Matriz Pura (Via Expressa)
 * Usa 60% menos memória que a versão original.
 * Uso exclusivo para: getRecordsServerSide
 */
function getFastMatrixData_(sheetName, spreadsheetId) {
  const cache = CacheService.getScriptCache();
  // Usamos um prefixo diferente na chave para não conflitar com o cache antigo
  const cacheKey = `MATRIX_${spreadsheetId || CONFIG.planilhas.principal}_${sheetName}`;
  
  // 1. Tenta ler do cache
  const meta = cache.get(cacheKey);
  if (meta) {
    const { chunks } = JSON.parse(meta);
    const chunkKeys = Array.from({ length: chunks }, (_, i) => `${cacheKey}_${i}`);
    const cachedChunks = cache.getAll(chunkKeys);
    
    let jsonString = '';
    let complete = true;
    for (const key of chunkKeys) {
      if (!cachedChunks[key]) { complete = false; break; }
      jsonString += cachedChunks[key];
    }
    
    if (complete) return JSON.parse(jsonString); // Retorna [[header, header], [val, val]...]
  }

  // 2. Lê da Planilha (Se não estiver no cache)
  const ssTarget = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : ss;
  const sheet = ssTarget.getSheetByName(sheetName);
  if (!sheet) return [];
  
  // Pega a matriz bruta (muito rápido)
  const data = sheet.getDataRange().getValues();
  
  // Otimização: Converte datas para string ISO aqui para evitar problemas de JSON
  const headers = data[0];
  // Detecta colunas de data (heurística simples ou configuração)
  // Para segurança, varremos tudo, mas em matriz é rápido V8
  for(let i=1; i<data.length; i++) {
    for(let j=0; j<headers.length; j++) {
      if (data[i][j] instanceof Date) {
        data[i][j] = data[i][j].toISOString();
      }
    }
  }

  // 3. Salva no Cache (Chunked)
  try {
    const jsonString = JSON.stringify(data);
    const chunkSize = 95000;
    const numChunks = Math.ceil(jsonString.length / chunkSize);
    const cacheObj = {};
    
    cacheObj[cacheKey] = JSON.stringify({ chunks: numChunks });
    for (let i = 0; i < numChunks; i++) {
      cacheObj[`${cacheKey}_${i}`] = jsonString.substring(i * chunkSize, (i + 1) * chunkSize);
    }
    cache.putAll(cacheObj, 900); // 15 minutos
  } catch (e) {
    console.log("Erro ao salvar cache Matrix: " + e.message);
  }
  
  return data;
}

function invalidateSheetCache_(sheetName, spreadsheetId) {
  const cache = CacheService.getScriptCache();
  const id = spreadsheetId || CONFIG.planilhas.principal;
  
  // 1. Limpa Cache Antigo (Objetos) - Para manter compatibilidade
  const keyObj = `DATA_${id}_${sheetName}`;
  const metaObj = cache.get(keyObj);
  if (metaObj) {
    const chunks = JSON.parse(metaObj).chunks;
    const keys = [keyObj];
    for (let i = 0; i < chunks; i++) keys.push(`${keyObj}_${i}`);
    cache.removeAll(keys);
  }
  
  // 2. Limpa Cache Novo (Matriz) - Para a listagem rápida
  const keyMatrix = `MATRIX_${id}_${sheetName}`;
  const metaMatrix = cache.get(keyMatrix);
  if (metaMatrix) {
    const chunks = JSON.parse(metaMatrix).chunks;
    const keys = [keyMatrix];
    for (let i = 0; i < chunks; i++) keys.push(`${keyMatrix}_${i}`);
    cache.removeAll(keys);
  }
  
  Logger.log(`[CACHE CLEAR] Todos os caches (Obj e Matrix) invalidados para ${sheetName}.`);
}

function FORCE_CLEAR_CACHE() {
  const cache = CacheService.getScriptCache();
  
  // Limpa chaves principais de dados
  const sheets = ['EQUIPAMENTOS', 'PLANOPREVENTIVO', 'PREVENTIVAS', 'PERIODICIDADE'];
  const ids = [
    CONFIG.planilhas.equipamentos, 
    CONFIG.planilhas.principal, 
    CONFIG.planilhas.preventivas
  ];

  sheets.forEach(sheet => {
    ids.forEach(id => {
      const key = `DATA_${id}_${sheet}`;
      cache.remove(key); // Remove a chave mestre
      // Tenta remover chunks (pedaços)
      for(let i=0; i<20; i++) {
        cache.remove(`${key}_${i}`);
      }
    });
  });

  Logger.log("Cache limpo com força bruta!");
}



/**
 * @private
 * Lê APENAS as colunas de ID e Descrição de uma tabela pesada para criar um mapa leve.
 * Usado para tabelas grandes como EQUIPAMENTOS para evitar erro de memória.
 */
function getLiteLookupMap_(sheetName, spreadsheetId, idField, descField) {
  const cache = CacheService.getScriptCache();
  const CACHE_KEY = `LITE_MAP_${sheetName}`;
  const cached = cache.get(CACHE_KEY);

  if (cached) {
    return new Map(JSON.parse(cached));
  }

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return new Map();

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return new Map();

  // Lê apenas o cabeçalho para achar os índices
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idIndex = headers.indexOf(idField);
  const descIndex = headers.indexOf(descField);

  if (idIndex === -1 || descIndex === -1) return new Map();

  // Lê a planilha inteira, mas processa linha a linha para montar o map leve
  // Nota: Ler apenas duas colunas específicas via API é complexo se elas não forem adjacentes,
  // então lemos os valores (que é rápido) e filtramos na memória IMEDIATAMENTE.
  const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
  
  const liteMapArray = [];
  const resultMap = new Map();

  data.forEach(row => {
    const id = String(row[idIndex]);
    const desc = String(row[descIndex]);
    if (id) {
      // Monta um objeto mínimo simulando o rowData completo, mas só com o necessário
      const miniObj = {};
      miniObj[idField] = id;
      miniObj[descField] = desc;
      
      resultMap.set(id, miniObj);
      liteMapArray.push([id, miniObj]); // Salva como array de pares para o JSON
    }
  });

  // Salva no cache (com chunking simplificado se necessário, mas o lite map deve caber)
  try {
    const jsonStr = JSON.stringify(liteMapArray);
    if (jsonStr.length < 95000) {
      cache.put(CACHE_KEY, jsonStr, 900); // 15 minutos
    } else {
      // Se ainda assim for grande, apenas não cacheia (fallback para leitura direta)
      // ou implementa chunking aqui também. Para 20k linhas só com ID/Nome, deve caber ou quase.
      Logger.log(`Aviso: LiteMap para ${sheetName} excedeu 100kb. Não cacheado.`);
    }
  } catch(e) {
    Logger.log("Erro ao cachear LiteMap: " + e.message);
  }

  return resultMap;
}












/**
 * FUNÇÃO DE EMERGÊNCIA: LIMPEZA TOTAL DE CACHE
 * Executar manualmente pelo editor sempre que alterar dados direto na planilha.
 */
function LIMPAR_CACHE_GLOBAL() {
  const cache = CacheService.getScriptCache();
  const keysToRemove = [];

  Logger.log("Iniciando varredura de caches...");

  // 1. Chaves Estáticas Principais
  keysToRemove.push('ALL_DROPDOWN_DATA_V2');
  keysToRemove.push('ALL_DROPDOWN_DATA_V2_chunks');

  // 2. Lista de Abas Críticas (Adicione mais se criar novas abas)
  // Tenta pegar da constante global SHEETS, se não conseguir, usa lista manual
  let abas = [];
  try {
    abas = Object.values(SHEETS);
  } catch (e) {
    abas = [
      'EQUIPAMENTOS', 'PREVENTIVAS', 'CORRETIVAS', 'USUARIOS', 
      'PLANOPREVENTIVO', 'PREVENTIVA_SERVICOS', 'PREVENTIVA_PADROES_UTILIZADOS',
      'PERIODICIDADE', 'TIPOPLANO', 'FORNECEDORES', 'ESTABELECIMENTOS', 'CENTROS'
    ];
  }

  // 3. Lista de IDs de Planilhas (Para as chaves compostas)
  let ids = [];
  try {
    ids = Object.values(CONFIG.planilhas);
  } catch (e) {
    // Se der erro, pega pelo menos a principal e a de preventivas do contexto atual
    ids = ["1uPh-rc8sw5YpqdqyqBxQxbN7blLJujq4Ncvb9cX32F0", "1iE-Rkd5vTFlg5po8TjfRN_Suoe-YBYfZGuDd9x9RooM", "11D8EIpa8pTo2eZt3snsnjUOU8xh2MXx-LWAVRCk1dMg"];
  }

  // 4. Gera todas as permutações de chaves possíveis
  abas.forEach(aba => {
    // Chaves simples (Índices e Lookups)
    keysToRemove.push(`INDEX_${aba}`);
    keysToRemove.push(`LITE_MAP_${aba}`);
    keysToRemove.push(`LOOKUP_${aba}`);
    keysToRemove.push(`LOOKUP_${aba}_chunks`);
    
    // Chaves de Valores Únicos (Unique Checks)
    // Como não sabemos a coluna, vamos tentar limpar as genéricas se existirem
    // (O sistema usa UNIQUE_NOMEABA_NOMECOLUNA, difícil prever todas, mas o mais crítico é o DATA)

    // Chaves compostas com ID da Planilha (DATA e MATRIX)
    ids.forEach(id => {
      keysToRemove.push(`DATA_${id}_${aba}`);
      keysToRemove.push(`MATRIX_${id}_${aba}`);
    });
  });

  // 5. Expansão de Chunks (Pedaços)
  // O sistema divide dados grandes em pedaços (_0, _1, _2...). 
  // Vamos gerar chaves cegas para os primeiros 50 pedaços de cada chave principal encontrada.
  const allKeysExpanded = [];
  
  keysToRemove.forEach(key => {
    allKeysExpanded.push(key); // A chave mestre/metadados
    for (let i = 0; i < 50; i++) {
      allKeysExpanded.push(`${key}_${i}`);
    }
  });

  // 6. Execução da Limpeza em Lotes (Batch)
  // A API do Google permite remover um array de chaves.
  // Faremos em lotes de 500 para segurança.
  let count = 0;
  while (allKeysExpanded.length > 0) {
    const batch = allKeysExpanded.splice(0, 500);
    cache.removeAll(batch);
    count += batch.length;
  }

  Logger.log(`CONCLUÍDO. Aproximadamente ${count} chaves de cache foram verificadas/removidas.`);
  return "Cache limpo com sucesso. Recarregue a aplicação.";
}


/**
 * Realiza a edição em massa de um campo específico para múltiplos registros.
 * OTIMIZAÇÃO: Usa RangeList para escrever em células não contíguas de uma só vez.
 * * @param {string} sheetName - Nome da aba (ex: 'EQUIPAMENTOS')
 * @param {string} spreadsheetId - ID da planilha
 * @param {Array<string>} ids - Array com os IDs dos registros a serem alterados
 * @param {string} fieldName - Nome da coluna (header) a ser alterada
 * @param {any} newValue - O novo valor a ser aplicado
 */
function bulkUpdateRecords(sheetName, spreadsheetId, ids, fieldName, newValue) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const ssTarget = SpreadsheetApp.openById(spreadsheetId || CONFIG.planilhas.principal);
    const sheet = ssTarget.getSheetByName(sheetName);
    if (!sheet) throw new Error(`Aba ${sheetName} não encontrada.`);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const idColIndex = headers.indexOf(sheetName === 'EQUIPAMENTOS' ? 'equipamento_id' : headers[0]);

    if (idColIndex === -1) throw new Error(`Coluna de ID não encontrada.`);

    // 1. Preparar o mapa de atualizações (campo -> novo valor)
    const updates = {};
    updates[fieldName] = newValue;

    // =======================================================
    // LÓGICA DE INTEGRIDADE RELACIONAL (CASCATA DE LOOKUPS)
    // =======================================================
    if (sheetName === 'EQUIPAMENTOS') {
        const lookupsToFetch = [];
        if (fieldName === 'cc_id') lookupsToFetch.push('CENTROS', 'ESTABELECIMENTOS', 'UNIDADES');
        if (fieldName === 'modelo_id') lookupsToFetch.push('MODELOS', 'FABRICANTES');
        if (fieldName === 'tipoequipamento_id') lookupsToFetch.push('TIPOS_EQUIPAMENTO');
        if (fieldName === 'fornecedor_id') lookupsToFetch.push('FORNECEDORES');

        if (lookupsToFetch.length > 0) {
            const lookupData = getSpecificLookupData_(lookupsToFetch);
            
            // Cascata do Centro de Custo
            if (fieldName === 'cc_id' && lookupData.CENTROS) {
                const ccInfo = lookupData.CENTROS.get(String(newValue));
                if (ccInfo) {
                    updates['cc_descricao'] = ccInfo.cc_descricao || '';
                    updates['est_id'] = ccInfo.est_id || '';
                    updates['un_id'] = ccInfo.unidadenegocio_id || ccInfo.un_id || '';

                    // Busca as descrições dos níveis superiores para injetar na planilha
                    if (lookupData.ESTABELECIMENTOS && updates['est_id']) {
                        const estInfo = lookupData.ESTABELECIMENTOS.get(String(updates['est_id']));
                        updates['est_descricao'] = estInfo ? estInfo.est_descricao : '';
                    }
                    if (lookupData.UNIDADES && updates['un_id']) {
                        const unInfo = lookupData.UNIDADES.get(String(updates['un_id']));
                        updates['un_descricao'] = unInfo ? unInfo.un_descricao : '';
                    }
                } else if (newValue === '') { // Se limpar o campo
                    updates['cc_descricao'] = ''; updates['est_id'] = ''; updates['un_id'] = '';
                    updates['est_descricao'] = ''; updates['un_descricao'] = '';
                }
            }
            // Cascata de Modelo
            else if (fieldName === 'modelo_id' && lookupData.MODELOS) {
                const modInfo = lookupData.MODELOS.get(String(newValue));
                if (modInfo) {
                    updates['modelo_descricao'] = modInfo.modelo_descricao || '';
                    updates['fabricante_id'] = modInfo.fabricante_id || '';
                    if (lookupData.FABRICANTES) {
                        const fabInfo = lookupData.FABRICANTES.get(String(modInfo.fabricante_id));
                        updates['fabricante_descricao'] = fabInfo ? fabInfo.fabricante_descricao : '';
                    }
                }
            }
            // Cascata de Tipo
            else if (fieldName === 'tipoequipamento_id' && lookupData.TIPOS_EQUIPAMENTO) {
                const tipoInfo = lookupData.TIPOS_EQUIPAMENTO.get(String(newValue));
                if (tipoInfo) updates['tipoequipamento_descricao'] = tipoInfo.tipoequipamento_descricao || '';
            }
            // Cascata de Fornecedor
            else if (fieldName === 'fornecedor_id' && lookupData.FORNECEDORES) {
                const fornInfo = lookupData.FORNECEDORES.get(String(newValue));
                if (fornInfo) updates['fornecedor_descricao'] = fornInfo.fornecedor_descricao || '';
            }
        }
    }

    // 2. Mapear IDs para números de linha da planilha
    const dataIds = sheet.getRange(2, idColIndex + 1, sheet.getLastRow() - 1, 1).getValues().flat().map(String);
    const targetIdsSet = new Set(ids.map(String));
    
    const rowsToUpdateIndices = [];
    for (let i = 0; i < dataIds.length; i++) {
        if (targetIdsSet.has(dataIds[i])) rowsToUpdateIndices.push(i + 2); // +2 pois array é base 0 e planilha tem cabeçalho
    }

    if (rowsToUpdateIndices.length === 0) {
        return { success: true, message: "Nenhum registro encontrado para atualizar." };
    }

    // Adiciona o Timestamp de modificação no pacote de atualizações
    const modColIndex = headers.indexOf(sheetName.toLowerCase() + '_datamodificacao') !== -1 
        ? headers.indexOf(sheetName.toLowerCase() + '_datamodificacao') 
        : headers.indexOf('datamodificacao');
    
    if (modColIndex !== -1) {
        updates[headers[modColIndex]] = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
    }

    // =======================================================
    // EXECUÇÃO DA ATUALIZAÇÃO (RANGELIST OU MEMÓRIA COMPLETA)
    // =======================================================
    const keysToUpdate = Object.keys(updates);
    
    // Verificação Crítica: Se a alteração afeta a Descrição Completa, não podemos usar RangeList,
    // pois a descrição final depende da TAG e Série únicas de CADA LINHA.
    const afetaDescricao = sheetName === 'EQUIPAMENTOS' && ['modelo_id', 'fabricante_id', 'tipoequipamento_id'].includes(fieldName);

    if (afetaDescricao) {
        // Via Lenta/Segura: Lê a planilha inteira, processa em memória e salva de uma vez
        const dataRange = sheet.getDataRange().getValues();
        
        for (let rIdx of rowsToUpdateIndices) {
            const arrIdx = rIdx - 1; // Índice base-0 para o array
            
            // Injeta as atualizações básicas (IDs e descrições curtas)
            keysToUpdate.forEach(k => {
                const cIdx = headers.indexOf(k);
                if (cIdx !== -1) dataRange[arrIdx][cIdx] = updates[k];
            });
            
            // Reconstrói dinamicamente a Descrição Completa
            const tag = dataRange[arrIdx][headers.indexOf('equipamento_tag')] || '';
            const tipo = dataRange[arrIdx][headers.indexOf('tipoequipamento_descricao')] || '';
            const fab = dataRange[arrIdx][headers.indexOf('fabricante_descricao')] || '';
            const mod = dataRange[arrIdx][headers.indexOf('modelo_descricao')] || '';
            const serie = dataRange[arrIdx][headers.indexOf('serie')] || '';
            
            dataRange[arrIdx][headers.indexOf('equipamento_descricaocompleta')] = `${tag} ${tipo} ${fab} ${mod} Série: ${serie}`.trim();
        }
        sheet.getRange(1, 1, dataRange.length, headers.length).setValues(dataRange);

    } else {
        // Via Rápida: Usando RangeList (Perfeito para Setores, Status, Fornecedores)
        keysToUpdate.forEach(colName => {
            const cIndex = headers.indexOf(colName);
            if (cIndex !== -1) {
                const rangesA1 = rowsToUpdateIndices.map(rIdx => sheet.getRange(rIdx, cIndex + 1).getA1Notation());
                sheet.getRangeList(rangesA1).setValue(updates[colName]);
            }
        });
    }

    SpreadsheetApp.flush();
    invalidateSheetCache_(sheetName, spreadsheetId);
    
    // Limpa caches de listas únicas, se necessário
    if (UNIQUE_CHECKS_CONFIG[sheetName]) {
        UNIQUE_CHECKS_CONFIG[sheetName].flat().forEach(col => clearUniqueValueCache_(sheetName, col));
    }

    return { success: true, message: `${rowsToUpdateIndices.length} registros atualizados com sucesso!` };

  } catch (e) {
    Logger.log(`Erro em bulkUpdateRecords: ${e.stack}`);
    return { error: e.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * [OMNIBOX SIRIUS] Busca ultrarrápida (em memória) por Equipamentos e Acessórios simultaneamente.
 * Retorna os dados formatados para o Select2 do formulário de O.S.
 */
function searchAtivosOmnibox(searchTerm) {
  try {
    const term = String(searchTerm || '').toLowerCase().trim();
    const limit = 30; 
    const results = [];

    // Lemos os dados do Cache
    const equips = getCachedData_(SHEETS.EQUIPAMENTOS, CONFIG.planilhas.equipamentos) || [];
    
    // COMO ACABAMOS DE MEXER NA ABA ACESSORIOS, FORÇAMOS A LEITURA FRESCA PARA NÃO DAR ERRO DE CACHE
    let acessorios = getCachedData_("ACESSORIOS", CONFIG.planilhas.equipamentos);
    if (!acessorios || acessorios.length === 0) {
        // Se o cache estiver vazio ou falhar, lê direto da planilha para garantir
        const ssEq = SpreadsheetApp.openById(CONFIG.planilhas.equipamentos);
        const sheetAc = ssEq.getSheetByName("ACESSORIOS");
        if (sheetAc) acessorios = objectifyRows(sheetAc.getDataRange().getValues());
    }

    // 1. Varredura de EQUIPAMENTOS
    for (let i = 0; i < equips.length; i++) {
        const eq = equips[i];
        
        if (eq.equipamento_ativo !== 'Ativo') continue;

        const searchable = `${eq.equipamento_tag} ${eq.equipamento_descricaocompleta} ${eq.serie}`.toLowerCase();
        
        if (searchable.includes(term)) {
            results.push({
                id: eq.equipamento_id,
                // Aqui removemos a repetição da TAG. Usamos só a descrição completa.
                text: `[EQP] ${eq.equipamento_descricaocompleta || eq.equipamento_tag || 'Equipamento'}`,
                tipo_ativo: 'EQUIPAMENTO',
                equipamento_id: eq.equipamento_id,
                acessorio_id: null,
                est_id: eq.est_id,
                cc_id: eq.cc_id
            });
            if (results.length >= limit) break;
        }
    }

    // 2. Varredura de ACESSÓRIOS
    if (results.length < limit && acessorios && acessorios.length > 0) {
        for (let i = 0; i < acessorios.length; i++) {
            const ac = acessorios[i];
            
            // Só exibe acessórios que estão Ativos (Coluna L do seu print)
            if (ac.acessorio_ativo !== 'Ativo') continue;
            
            // Mapeamento CRAVADO no seu print
            const acId = ac.acessorio_id || '';
            const acTag = ac.acessorio_tag || '';
            const acDesc = ac.tipoacessorio_descricao || '';
            const acMod = ac.acessorio_modelo || '';
            const acSerie = ac.acessorio_serie || '';
            const eqPaiId = ac.equipamento_id || '';

            // Monta a string de busca com tudo que importa
            const searchable = `${acTag} ${acDesc} ${acMod} ${acSerie}`.toLowerCase();
            
            if (searchable.includes(term)) {
                // Busca o equipamento Pai
                const parentEq = equips.find(e => String(e.equipamento_id) === String(eqPaiId));
                const parentTag = parentEq ? parentEq.equipamento_tag : 'Sem Vínculo Ativo';

                results.push({
                    id: `ACS_${acId}`, 
                    // Mostra a TAG, Descrição e Modelo bonitinhos no dropdown
                    text: `[ACS] ${acTag} | ${acDesc} ${acMod} (Pai: ${parentTag})`,
                    tipo_ativo: 'ACESSORIO',
                    equipamento_id: eqPaiId, // Manda o ID do pai para puxar Setor
                    acessorio_id: acId,      // Salva o ID real da peça
                    est_id: parentEq ? parentEq.est_id : '',
                    cc_id: parentEq ? parentEq.cc_id : ''
                });
                
                if (results.length >= limit) break;
            }
        }
    }

    return { success: true, results: results };

  } catch (e) {
    Logger.log("Erro na busca Omnibox: " + e.stack);
    return { success: false, error: e.message };
  }
}


/**
 * Analisa todo o banco de dados do projeto Sirius.
 * Conta arquivos, abas (tabelas) e o total de linhas de dados.
 */
function auditarBancoDeDadosSirius() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  
  try {
    const config = getGlobalConfig(); // Puxa a sua constante CONFIG
    const planilhas = config.planilhas;
    
    let totalArquivos = 0;
    let totalAbas = 0;
    let totalLinhasGerais = 0;
    const relatorioDetalhado = [];

    Logger.log("Iniciando auditoria do banco de dados... Isso pode levar alguns segundos.");

    // Percorre cada chave do objeto de planilhas (principal, usuarios, equipamentos, etc)
    for (const key in planilhas) {
      const spreadsheetId = planilhas[key];
      
      try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        totalArquivos++;
        
        const abas = ss.getSheets();
        
        abas.forEach(aba => {
          totalAbas++;
          const nomeAba = aba.getName();
          const qtdLinhas = aba.getLastRow(); // Pega a última linha com conteúdo
          
          totalLinhasGerais += qtdLinhas;
          
          relatorioDetalhado.push({
            modulo: key,
            arquivo: ss.getName(),
            aba: nomeAba,
            linhas: qtdLinhas
          });
        });
        
      } catch (e) {
        Logger.log(`⚠️ Aviso: Não foi possível acessar a planilha '${key}' (ID: ${spreadsheetId}). Erro: ${e.message}`);
      }
    }

    // --- EXIBIÇÃO DOS RESULTADOS ---
    Logger.log("\n==================================================");
    Logger.log("📊 RELATÓRIO DE BANCO DE DADOS - PROJETO SIRIUS 📊");
    Logger.log("==================================================");
    Logger.log(`📁 Arquivos de Planilha Conectados: ${totalArquivos}`);
    Logger.log(`📑 Total de Abas (Tabelas/Entidades): ${totalAbas}`);
    Logger.log(`📈 Total de Linhas (Registros + Cabeçalhos): ${totalLinhasGerais.toLocaleString('pt-BR')}`);
    Logger.log("==================================================\n");
    
    Logger.log("--- Detalhamento por Tabela ---");
    // Ordena para mostrar as maiores tabelas primeiro
    relatorioDetalhado.sort((a, b) => b.linhas - a.linhas);
    
    relatorioDetalhado.forEach(item => {
      Logger.log(`[${item.modulo}] ${item.aba}: ${item.linhas.toLocaleString('pt-BR')} linhas`);
    });

    return { totalArquivos, totalAbas, totalLinhasGerais, relatorioDetalhado };

  } catch (erro) {
    Logger.log("Erro crítico na auditoria: " + erro.stack);
  } finally {
    lock.releaseLock();
  }
}
