import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  AppState,
  Alert,
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SiriusApi } from '../../src/services/SiriusApi';
import SetorModal from '../../components/SetorModal';
import { useAuth } from '../../src/context/AuthContext';
import { verificarEscalonamentoGlobal } from '../../src/services/ChamadosLogic';
import { registerBackgroundFetchAsync } from '../../src/services/BackgroundService';

const COLORS = {
  primary: '#003366', background: '#F2F2F7', card: '#FFFFFF',
  text: '#1C1C1E', subtext: '#666666', critical: '#D32F2F',
  warning: '#F57C00', success: '#34C759', mySector: '#E6F4FE',
  timeText: '#0066CC', iconColor: '#546E7A', activeSection: '#E8F5E9'
};

const CACHE_CHAMADOS = '@Sirius:chamados_cache';
const CACHE_SETORES_IDS = '@Sirius:meus_setores_ids';
const CACHE_SETORES_LISTA = '@Sirius:lista_completa_setores';
const CACHE_LAST_SYNC = '@Sirius:last_sector_sync';
const CACHE_PRESETS = '@Sirius:user_presets'; 

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user: currentUser, signOut } = useAuth();
  
  const [sections, setSections] = useState<any[]>([]);
  const [meusSetoresIds, setMeusSetoresIds] = useState<string[]>([]);
  
  // [CORREÇÃO 1] Ref para manter os IDs sempre frescos dentro dos Listeners
  const setoresIdsRef = useRef<string[]>([]); 

  const [todosSetores, setTodosSetores] = useState<any[]>([]); 
  const [todosPresets, setTodosPresets] = useState<any>({}); 
  
  const [modalVisible, setModalVisible] = useState(false);
  // [NOVO] Controle do Modal de Logout
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // [NOVO] Ação confirmada de sair
  const confirmLogout = () => {
      setLogoutModalVisible(false); // Fecha o modal
      setSections([]);              // Limpa visualmente a lista
      setMeusSetoresIds([]);        // Limpa setores
      signOut();                    // Chama o logout real do contexto
  };
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [now, setNow] = useState(new Date());

  const lastManualRefresh = useRef<number>(0); 
  const REFRESH_COOLDOWN = 4000;


  
  // 2. CORREÇÃO DO BUG "CRASH SILENCIOSO" (Mounted Ref)
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // ... (useRefs e states existentes)

  // Função para confirmar saída
  const handleLogout = () => {
    Alert.alert(
      "Sair do Sirius",
      "Deseja realmente desconectar sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: () => {
             // Limpa estados locais antes de sair para evitar erros
             setSections([]);
             setMeusSetoresIds([]);
             signOut();
          }
        }
      ]
    );
  };

  // Atualiza a Ref sempre que o Estado mudar
  useEffect(() => {
    setoresIdsRef.current = meusSetoresIds;
  }, [meusSetoresIds]);

  // 1. LÓGICA DE ORGANIZAÇÃO (BLINDADA)
  const organizarChamados = useCallback((listaChamados: any[], idsSetores: string[]) => {
    if (!Array.isArray(listaChamados)) return;
    if (!currentUser) return;

    // --- CORREÇÃO: BLINDAGEM CONTRA TELA BRANCA ---
    // Se a lista de chamados tem itens, mas a lista de setores está vazia (ainda carregando),
    // aborta a organização para não filtrar tudo e mostrar "0 chamados" por engano.
    if (listaChamados.length > 0 && (!idsSetores || idsSetores.length === 0)) {
        console.log("🛡️ organizarChamados: Abortado (Aguardando IDs de setores)");
        return;
    }
    // ------------------------------------------------

    const myId = currentUser?.id ? String(currentUser.id) : '';
    const myName = currentUser?.name || '';

    const emAtendimentoPorMim: any[] = [];
    const pendentesMeuSetor: any[] = [];
    const pendentesOutros: any[] = [];

    listaChamados.forEach(c => {
      const tecnicoNome = c.tecnico_nome || '';
      const usuarioId = c.usuario_id ? String(c.usuario_id) : '';

      const isMyService = c.chamado_status === 'Em Atendimento' &&
        (usuarioId === myId || (myName && tecnicoNome === myName));
      
      const isMySector = idsSetores.includes(String(c.cc_id));
      c.isMySector = isMySector;

      if (isMyService) emAtendimentoPorMim.push(c);
      else if (isMySector) pendentesMeuSetor.push(c);
      else pendentesOutros.push(c);
    });

    const sorter = (a: any, b: any) => {
      if (a.chamado_prioridade === 'Crítica' && b.chamado_prioridade !== 'Crítica') return -1;
      if (a.chamado_prioridade !== 'Crítica' && b.chamado_prioridade === 'Crítica') return 1;
      return new Date(a.chamado_dataabertura).getTime() - new Date(b.chamado_dataabertura).getTime();
    };

    emAtendimentoPorMim.sort((a, b) => new Date(a.chamado_inicioatendimento).getTime() - new Date(b.chamado_inicioatendimento).getTime());
    pendentesMeuSetor.sort(sorter);
    pendentesOutros.sort(sorter);

    const resultSections = [];
    if (emAtendimentoPorMim.length > 0) resultSections.push({ title: 'EM EXECUÇÃO (MEUS)', data: emAtendimentoPorMim, type: 'active' });
    if (pendentesMeuSetor.length > 0) resultSections.push({ title: 'MEU SETOR (PENDENTES)', data: pendentesMeuSetor, type: 'my_sector' });
    if (pendentesOutros.length > 0) resultSections.push({ title: 'OUTROS SETORES', data: pendentesOutros, type: 'others' });

    setSections(resultSections);
  }, [currentUser]);

  // ... dentro de HomeScreen ...

  // ... (dentro de HomeScreen)

  const handleLoadChamados = async (ids: string[], isSilent = false, force = false, preserveState = false, ringingDelay = 0) => {
    
    // [UX] Se for manual, mostra o spinner nativo, mas NÃO limpa a lista (não usamos setLoading(true))
    if (!isSilent) setRefreshing(true);

    // 1. GARANTIA DE SETORES (O "Porteiro")
    // Se não soubermos quais setores filtrar, usamos a última memória conhecida (Ref) ou o Disco.
    let idsFinais = (ids && ids.length > 0) ? ids : setoresIdsRef.current;
    
    // Se a memória falhar, tenta ler do armazenamento físico
    if (!idsFinais || idsFinais.length === 0) {
        try {
            const storedIds = await AsyncStorage.getItem(CACHE_SETORES_IDS);
            if (storedIds) {
                idsFinais = JSON.parse(storedIds);
                setoresIdsRef.current = idsFinais; // Atualiza a memória para a próxima
            }
        } catch(e) {}
    }

    // Se mesmo assim não temos IDs, abortamos para não limpar a tela erradamente
    if (!idsFinais || idsFinais.length === 0) {
        console.log("⛔ Abortando atualização: IDs de setores não encontrados.");
        if (isMountedRef.current) {
            setRefreshing(false); 
            // IMPORTANTE: Não setamos setLoading(false) aqui se for a primeira carga,
            // pois queremos que ele tente novamente ou mostre o modal de setores vazio,
            // mas não queremos que ele renderize uma lista de chamados vazia.
            if (!loading) setRefreshing(false);
        }
        return; 
    }

    try {
      // 2. BUSCA INTELIGENTE (Smart Sync)
      // Tenta buscar no servidor. Se falhar, o 'verificarEscalonamentoGlobal' (que ajustamos antes)
      // já tem a proteção de não apagar o cache local se vier resposta vazia inválida.
      await verificarEscalonamentoGlobal(force, ringingDelay);
      
      if (isMountedRef.current) setSyncError(false);

      // 3. LEITURA E ATUALIZAÇÃO SUAVE
      // Agora lemos o cache (que pode ser novo ou o velho, se a rede falhou)
      const cacheAtualizado = await AsyncStorage.getItem(CACHE_CHAMADOS);
      
      if (cacheAtualizado && isMountedRef.current) {
        const novosChamados = JSON.parse(cacheAtualizado);
        const listaVazia = !Array.isArray(novosChamados) || novosChamados.length === 0;

        // [REGRA DE OURO]
        // Se vier vazio e for uma notificação/silent update -> IGNORA (Proteção contra sumiço)
        if (listaVazia && preserveState) {
            console.log("🛡️ Proteção ativa: Lista vazia em background ignorada.");
        } 
        // Se tem dados, o React fará a transição suave (Diffing).
        // Ele NÃO vai piscar a tela. Ele vai ver: "O chamado 1 mudou o texto? Atualiza. O 2 é igual? Mantém."
        else if (!listaVazia) {
             organizarChamados(novosChamados, idsFinais);
        }
        // Só aceitamos limpar a tela se REALMENTE a lista vier vazia explicitamente do usuário (ex: filtro limpo)
        // E se não estivermos protegendo o estado.
        else if (listaVazia && !preserveState && sections.length > 0) {
             // Opcional: Você pode até comentar essa linha se quiser que NUNCA fique vazio sem querer
             organizarChamados([], idsFinais); 
        }
      }

    } catch (error) {
      console.log("Erro no sync (Visual mantido):", error);
      if (isMountedRef.current) setSyncError(true);
      // Perceba: NÃO chamamos setSections([]) aqui. O erro ocorre, mas a tela fica intacta.
    } finally {
      if (isMountedRef.current) {
        setLoading(false); // Remove o loading inicial (tela cheia)
        setRefreshing(false); // Remove o spinner do topo
      }
    }
  };

  // 2. INICIALIZAÇÃO
  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!currentUser) return; 

      try {
        const [idsCache, setoresCache, presetsCache] = await Promise.all([
          AsyncStorage.getItem(CACHE_SETORES_IDS),
          AsyncStorage.getItem(CACHE_SETORES_LISTA),
          AsyncStorage.getItem(CACHE_PRESETS)
        ]);

        const ids = idsCache ? JSON.parse(idsCache) : [];
        
        if (isMounted) {
          setMeusSetoresIds(ids);
          setoresIdsRef.current = ids; // Atualiza Ref imediatamente
          if (setoresCache) setTodosSetores(JSON.parse(setoresCache));
          if (presetsCache) setTodosPresets(JSON.parse(presetsCache));
        }

        const chamadosCache = await AsyncStorage.getItem(CACHE_CHAMADOS);
        if (chamadosCache && isMounted) {
           organizarChamados(JSON.parse(chamadosCache), ids);
        }

        if (isMounted) setLoading(false);

        if (ids.length === 0 && isMounted) setModalVisible(true);

        await registerBackgroundFetchAsync();
        if (ids.length > 0) {
            handleLoadChamados(ids, true, false); 
        }
        sincronizarSetoresEmBackground();

      } catch (e) {
        console.log("Erro init:", e);
        if (isMounted) setLoading(false);
      }
    }

    init();
    return () => { isMounted = false; };
  }, [currentUser]);

  // 3. LISTENERS DE NOTIFICAÇÃO (COM BLINDAGEM ANTI-TELA BRANCA)
  useEffect(() => {
    // A) Quando clica na notificação (Fundo/Fechado)
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      handleLoadChamados(setoresIdsRef.current, false, true, false);
    });

    // B) Quando a notificação CHEGA com o app aberto (FOREGROUND)
    const receivedSub = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log("🔔 Notificação recebida em Foreground!");
      
      const data = notification.request.content.data;

      // --- INJEÇÃO OTIMISTA BLINDADA ---
      if (data && data.chamado_data) {
        try {
            // 1. Garante que temos os IDs dos setores ANTES de mexer na tela
            let idsSeguros = setoresIdsRef.current;
            
            // Se a memória falhar, tenta o disco rapidamente
            if (!idsSeguros || idsSeguros.length === 0) {
                const stored = await AsyncStorage.getItem(CACHE_SETORES_IDS);
                if (stored) idsSeguros = JSON.parse(stored);
            }

            // [TRAVA DE SEGURANÇA]: Se ainda assim não tiver IDs, ABORTA a injeção.
            // É melhor não mostrar o novo chamado agora do que piscar a tela.
            // O handleLoadChamados abaixo vai tentar buscar do servidor depois.
            if (idsSeguros && idsSeguros.length > 0) {
                
                const novoChamado = typeof data.chamado_data === 'string' 
                    ? JSON.parse(data.chamado_data) 
                    : data.chamado_data;

                const cacheAtual = await AsyncStorage.getItem(CACHE_CHAMADOS);
                let lista = cacheAtual ? JSON.parse(cacheAtual) : [];

                // Evita duplicatas
                const existe = lista.find((c: any) => String(c.chamado_id) === String(novoChamado.chamado_id));
                
                if (!existe) {
                    console.log("🚀 Injetando novo chamado (Seguro)...");
                    lista.push(novoChamado);
                    
                    // Salva e Atualiza
                    await AsyncStorage.setItem(CACHE_CHAMADOS, JSON.stringify(lista));
                    organizarChamados(lista, idsSeguros); // Agora seguro pois idsSeguros > 0
                }
            } else {
                console.log("⚠️ Injeção abortada: IDs de setores não carregados ainda.");
            }

        } catch (e) {
            console.log("Erro na injeção otimista:", e);
        }
      }

      // --- SYNC DE SEGURANÇA ---
      // Baixa do servidor para garantir consistência final
      handleLoadChamados(setoresIdsRef.current, true, true, true); 
    });

    return () => {
      responseSub.remove();
      receivedSub.remove();
    };
  }, []);

  // 4. MUDANÇA DE ESTADO DO APP (Minimizar/Reabrir) - COM PROTEÇÃO DE CACHE
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active') {
        // Lógica de "Janela de Proteção":
        // Se o usuário mexeu em algo há menos de 20 segundos, NÃO forçamos o download do servidor.
        // Confiamos no Cache Local Otimista.
        let deveForcarDownload = true;
        
        try {
            const lastAction = await AsyncStorage.getItem('@Sirius:last_action_timestamp');
            if (lastAction) {
                const diff = new Date().getTime() - Number(lastAction);
                // Se a ação foi há menos de 20 segundos (tempo do Google Sheets processar)
                if (diff < 20000) {
                    console.log("🛡️ Proteção Ativa: Mantendo Cache Local (Ação recente).");
                    deveForcarDownload = false;
                }
            }
        } catch(e) {}

        // Se deveForcarDownload = false, ele usa o Smart Sync. 
        // Se o servidor ainda tiver a lista velha, o Smart Sync vai ignorar e manter o nosso cache novo.
        // [NOVO] ringingDelay = 120 (Soneca de 2 min) para não fazer barulho enquanto o usuário usa o app
        // [FIX] preserveState = true para evitar que a lista desapareça (pisque) durante o resume
        handleLoadChamados(setoresIdsRef.current, true, deveForcarDownload, true, 120);
        
      } else if (nextState === 'background') {
        // [NOVO] ringingDelay = 0 (Imediato) para garantir que volte a tocar se não tiver atendido
        verificarEscalonamentoGlobal(true, 0);
      }
    });
    return () => sub.remove();
  }, []);

  // 5. ATUALIZAÇÃO AO VOLTAR (FOCUS) - BLINDADO
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const refreshVisual = async () => {
        try {
          // [PROTEÇÃO 1] IDs dos Setores
          // Verifica a Ref. Se estiver vazia, corre no disco para garantir.
          let idsSeguros = setoresIdsRef.current;
          
          if (!idsSeguros || idsSeguros.length === 0) {
             const storedIds = await AsyncStorage.getItem(CACHE_SETORES_IDS);
             if (storedIds) {
                 idsSeguros = JSON.parse(storedIds);
                 // Atualiza a ref para as próximas vezes
                 setoresIdsRef.current = idsSeguros; 
             }
          }

          // [PROTEÇÃO 2] Abortar Missão
          // Se mesmo buscando no disco não achou IDs, NÃO MEXA NA TELA.
          // É melhor mostrar a lista "velha" do que limpar a tela erradamente.
          if (!idsSeguros || idsSeguros.length === 0) {
             console.log("⛔ Focus Effect: Abortado (Sem IDs de setores para filtrar).");
             return; 
          }

          // [PROTEÇÃO 3] Chamados
          const cacheChamados = await AsyncStorage.getItem(CACHE_CHAMADOS);
          
          if (isActive && cacheChamados) {
            const lista = JSON.parse(cacheChamados);
            
            // Só atualiza se tiver dados válidos. 
            // Se o cache estiver corrompido ou vazio, mantém o que está na tela.
            if (Array.isArray(lista) && lista.length > 0) {
               organizarChamados(lista, idsSeguros);
            }
          }
        } catch (e) {
          console.log("Erro silencioso no Focus:", e);
        }
      };

      refreshVisual();

      return () => {
        isActive = false;
      };
    }, [currentUser]) // Recarrega se o usuário mudar
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = () => {
    const time = new Date().getTime();
    if (time - lastManualRefresh.current < REFRESH_COOLDOWN) return;
    lastManualRefresh.current = time;
    handleLoadChamados(meusSetoresIds, false, true);
  };

  const sincronizarSetoresEmBackground = async () => {
    try {
      const lastSync = await AsyncStorage.getItem(CACHE_LAST_SYNC);
      const nowMs = new Date().getTime();
      if (!lastSync || (nowMs - Number(lastSync)) > (86400000)) { 
        const setores = await SiriusApi.getSetores();
        if (setores?.length) {
          await AsyncStorage.setItem(CACHE_SETORES_LISTA, JSON.stringify(setores));
          await AsyncStorage.setItem(CACHE_LAST_SYNC, String(nowMs));
          setTodosSetores(setores);
        }
      }
    } catch (e) {}
  };

  const getTempoDecorrido = (item: any) => {
    const dataRef = item.chamado_status === 'Em Atendimento' ? item.chamado_inicioatendimento : item.chamado_dataabertura;
    if (!dataRef) return "0m";
    const diff = now.getTime() - new Date(dataRef).getTime();
    if (diff < 0) return "0m";
    const min = Math.floor(diff / 60000);
    const h = Math.floor(min / 60);
    return h > 0 ? `${h}h ${min % 60}m` : `${min} min`;
  };

  const renderItem = ({ item, section }: any) => {
    const isActive = section.type === 'active';
    const isCritical = item.chamado_prioridade === 'Crítica';
    
    let equipText = "Geral"; 
    if (item.equipamento_descricaocompleta) {
        equipText = item.equipamento_descricaocompleta.split(' - ')[0];
        if (item.equipamento_tag) {
            equipText += ` (TAG: ${item.equipamento_tag})`;
        }
    } else if (item.equipamento_id) {
        equipText = `Equipamento ID: ${item.equipamento_id}`;
    }

    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.cardActive, item.isMySector && !isActive && styles.cardMySector, isCritical && styles.cardCritical]}
        activeOpacity={0.7}
        onPress={() => {
            router.push({ 
                pathname: "/(tabs)/chamados/[id]", 
                params: { 
                    id: item.chamado_id, 
                    data: JSON.stringify(item) 
                } 
            });
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            {/* Exibe ID ou Número Sequencial se houver */}
            <Text style={styles.cardId}>{item.chamado_numero || ''}</Text>
            {isActive && <View style={styles.workingBadge}><ActivityIndicator size="small" color="white" style={{ transform: [{ scale: 0.6 }] }} /><Text style={styles.workingText}>TRABALHANDO</Text></View>}
            {item.isMySector && !isActive && <View style={styles.mySectorBadge}><MaterialIcons name="star" size={10} color="white" /><Text style={styles.mySectorText}>MEU SETOR</Text></View>}
            {!item.isMySector && !isActive && <View style={styles.otherSectorBadge}><MaterialIcons name="domain" size={10} color="#666" /><Text style={styles.otherSectorText}>OUTRO SETOR</Text></View>}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: item.chamado_status === 'Em Atendimento' ? COLORS.success : COLORS.warning }]}>
            <Text style={styles.statusText}>{item.chamado_status}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.chamado_descricaoproblema}</Text>
        <View style={styles.divider} />
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}><MaterialIcons name="location-on" size={16} color={COLORS.iconColor} /><Text style={styles.detailText} numberOfLines={1}>{item.cc_descricao}</Text></View>
          <View style={styles.detailRow}><MaterialIcons name="biotech" size={16} color={COLORS.iconColor} /><Text style={styles.detailText} numberOfLines={1}>{equipText}</Text></View>
          <View style={styles.detailRow}><MaterialIcons name="person" size={16} color={COLORS.iconColor} /><Text style={styles.detailText}>{item.chamado_usuarioaberturanome || 'Solicitante'}</Text></View>
        </View>
        <View style={styles.footer}>
          <View style={[styles.timeContainer, isActive && { backgroundColor: '#E8F5E9' }]}>
            <MaterialIcons name={isActive ? "timer" : "access-time"} size={14} color={isActive ? COLORS.success : COLORS.timeText} />
            <Text style={[styles.timeText, isActive && { color: COLORS.success }]}>{getTempoDecorrido(item)}</Text>
          </View>
          {isCritical && <View style={styles.criticalBadge}><MaterialIcons name="priority-high" size={12} color="white" /><Text style={styles.criticalText}>CRÍTICO</Text></View>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section: { title, type } }: any) => {
    let titleColor = COLORS.subtext;
    if (type === 'active') titleColor = COLORS.success;
    if (type === 'my_sector') titleColor = COLORS.primary;
    return <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>;
  };

  // SUBSTITUA APENAS DAQUI PRA BAIXO:
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* HEADER NOVO COM BOTÃO SAIR */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.headerTitle}>Chamados</Text>
          <Text style={styles.headerSubtitle}>
            {loading ? 'Carregando...' : (meusSetoresIds.length > 0 ? `${meusSetoresIds.length} setores monitorados` : 'Toque no filtro para selecionar')}
          </Text>
        </View>
        
        {/* Container para alinhar os dois botões na direita */}
        <View style={{ flexDirection: 'row' }}>
            {/* 1. BOTÃO SAIR (Vermelho) */}
            <TouchableOpacity 
              style={[styles.btnFilter, { backgroundColor: '#D32F2F', marginRight: 10 }]}
              onPress={() => setLogoutModalVisible(true)} // <--- MUDE PARA ISSO
              accessibilityLabel="Sair do aplicativo"
              accessibilityHint="Abre a confirmação para desconectar sua conta"
              accessibilityRole="button"
            >
              <MaterialIcons name="logout" size={20} color="white" />
            </TouchableOpacity>

            {/* 2. BOTÃO FILTRO (Transparente) */}
            <TouchableOpacity
              style={styles.btnFilter}
              onPress={() => setModalVisible(true)}
              accessibilityLabel="Filtrar chamados"
              accessibilityHint="Abre a seleção de setores monitorados"
              accessibilityRole="button"
            >
              <MaterialIcons name="filter-list" size={24} color="white" />
            </TouchableOpacity>
        </View>
      </View>

      {/* MENSAGEM DE ERRO OFFLINE (SE HOUVER) */}
      {syncError && (
        <View style={{backgroundColor: '#FFCC00', paddingVertical: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
          <MaterialIcons name="wifi-off" size={16} color="#333" style={{marginRight:6}} />
          <Text style={{fontSize: 12, fontWeight: 'bold', color: '#333'}}>
            Modo Offline (Exibindo dados salvos)
          </Text>
        </View>
      )}

      {/* LISTA DE CHAMADOS */}
      <SectionList
        sections={sections} // O React vai atualizar isso suavemente quando o estado mudar
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => String(item.chamado_id)}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        
        // Controle do Refresh (O spinner do topo)
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                colors={[COLORS.primary]} 
                // No iOS, isso ajuda a manter a lista estável
                tintColor={COLORS.primary} 
            />
        }
        
        // AQUI ESTÁ O AJUSTE VISUAL:
        // Removemos a trava estrita. Agora ele mostra mensagem mesmo se não tiver setores,
        // orientando o usuário corretamente.
        ListEmptyComponent={
            (!loading && !refreshing && sections.length === 0) ? (
                <View style={{ alignItems: 'center', marginTop: 100 }} accessibilityRole="alert">
                    <MaterialIcons 
                        name={meusSetoresIds.length > 0 ? "inbox" : "filter-list"} 
                        size={60} 
                        color="#DDD" 
                    />
                    <Text style={styles.emptyText}>
                        {meusSetoresIds.length > 0 
                            ? "Nenhum chamado pendente!" 
                            : "Nenhum setor selecionado"}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#AAA', marginTop: 5 }}>
                        {meusSetoresIds.length > 0 
                            ? "Puxe para atualizar" 
                            : "Toque no ícone de filtro acima"}
                    </Text>
                </View>
            ) : null
        }
        
        stickySectionHeadersEnabled={false}
      />
      
      {/* MODAL DE SETORES */}
      <SetorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentUser={currentUser}
        currentSelectedIds={meusSetoresIds}
        cachedSetores={todosSetores} 
        cachedPresets={todosPresets}
        isLoading={todosSetores.length === 0}
        onUpdatePresets={(newPresets: any) => {
            setTodosPresets(newPresets);
            AsyncStorage.setItem(CACHE_PRESETS, JSON.stringify(newPresets));
        }}
        onSave={async (novosIds: string[]) => {
          setMeusSetoresIds(novosIds);
          setoresIdsRef.current = novosIds;
          await AsyncStorage.setItem(CACHE_SETORES_IDS, JSON.stringify(novosIds));
          const cache = await AsyncStorage.getItem(CACHE_CHAMADOS);
          if (cache) organizarChamados(JSON.parse(cache), novosIds);

          setRefreshing(true); 
          try {
            await SiriusApi.saveResponsabilidades(novosIds, currentUser);
            await handleLoadChamados(novosIds, false, true);
          } catch (e) { console.log(e); } 
          finally { setRefreshing(false); }
        }}
      />

      {/* --- NOVO MODAL DE LOGOUT --- */}
      <Modal 
        visible={logoutModalVisible} 
        transparent 
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.logoutModalContainer}>
                {/* Ícone de Topo */}
                <View style={styles.logoutIconContainer}>
                    <MaterialIcons name="logout" size={32} color={COLORS.primary} />
                </View>

                {/* Textos */}
                <Text style={styles.logoutTitle}>Sair do Sirius</Text>
                <Text style={styles.logoutMessage}>Deseja realmente desconectar sua conta?</Text>

                {/* Botões */}
                <View style={styles.logoutButtonsRow}>
                    <TouchableOpacity 
                        style={styles.btnCancelLogout} 
                        onPress={() => setLogoutModalVisible(false)}
                    >
                        <Text style={styles.btnCancelLogoutText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.btnConfirmLogout} 
                        onPress={confirmLogout}
                    >
                        <Text style={styles.btnConfirmLogoutText}>Sim, Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
} // <--- FIM DA FUNÇÃO HomeScreen

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  btnFilter: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
  listContent: { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginVertical: 12, letterSpacing: 1 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, borderLeftWidth: 5, borderLeftColor: COLORS.subtext },
  cardActive: { borderLeftColor: COLORS.success, borderColor: COLORS.success, borderWidth: 0.5 },
  cardMySector: { borderLeftColor: COLORS.primary, backgroundColor: COLORS.mySector },
  cardCritical: { borderLeftColor: COLORS.critical, backgroundColor: '#FFEBEE' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardId: { fontSize: 13, fontWeight: 'bold', color: COLORS.subtext },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  workingBadge: { backgroundColor: COLORS.success, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  workingText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
  mySectorBadge: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  mySectorText: { color: 'white', fontSize: 9, fontWeight: 'bold', marginLeft: 2 },
  otherSectorBadge: { backgroundColor: '#EEEEEE', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  otherSectorText: { color: '#666', fontSize: 9, fontWeight: 'bold', marginLeft: 2 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 8 },
  detailsContainer: { marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailText: { fontSize: 13, color: COLORS.subtext, marginLeft: 6, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  timeText: { fontSize: 12, color: COLORS.timeText, fontWeight: 'bold', marginLeft: 4 },
  criticalBadge: { backgroundColor: COLORS.critical, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  criticalText: { color: 'white', fontSize: 10, fontWeight: 'bold', marginLeft: 2 },
  emptyText: { textAlign: 'center', marginTop: 100, color: COLORS.subtext, fontSize: 16 },

  // --- ESTILOS DO MODAL DE LOGOUT ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  logoutModalContainer: {
    backgroundColor: 'white',
    width: '85%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  logoutIconContainer: {
    backgroundColor: '#E6F4FE', // Azul bem claro
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  logoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center'
  },
  logoutMessage: {
    fontSize: 15,
    color: COLORS.subtext,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22
  },
  logoutButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12
  },
  btnCancelLogout: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  btnCancelLogoutText: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 16
  },
  btnConfirmLogout: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F', // Vermelho Crítico
    elevation: 2
  },
  btnConfirmLogoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});