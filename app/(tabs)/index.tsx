import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SetorModal from '../../../components/SetorModal';
import { useAuth } from '../../../src/context/AuthContext';
import { registerBackgroundFetchAsync } from '../../../src/services/BackgroundService';
import { verificarEscalonamentoGlobal } from '../../../src/services/ChamadosLogic';
import { SiriusApi } from '../../../src/services/SiriusApi';

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

export default function ChamadosListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [sections, setSections] = useState<any[]>([]);
  const [meusSetoresIds, setMeusSetoresIds] = useState<string[]>([]);
  
  const setoresIdsRef = useRef<string[]>([]); 

  const [todosSetores, setTodosSetores] = useState<any[]>([]); 
  const [todosPresets, setTodosPresets] = useState<any>({}); 
  
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [now, setNow] = useState(new Date());

  const lastManualRefresh = useRef<number>(0); 
  const REFRESH_COOLDOWN = 4000;

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    setoresIdsRef.current = meusSetoresIds;
  }, [meusSetoresIds]);

  const organizarChamados = useCallback((listaChamados: any[], idsSetores: string[]) => {
    if (!Array.isArray(listaChamados) || !currentUser) return;

    if (listaChamados.length > 0 && (!idsSetores || idsSetores.length === 0)) {
        console.log("🛡️ organizarChamados: Abortado (Aguardando IDs de setores)");
        return;
    }

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

  const handleLoadChamados = async (ids: string[], isSilent = false, force = false, preserveState = false, ringingDelay = 0) => {
    if (!isSilent) setRefreshing(true);

    let idsFinais = (ids && ids.length > 0) ? ids : setoresIdsRef.current;
    
    if (!idsFinais || idsFinais.length === 0) {
        try {
            const storedIds = await AsyncStorage.getItem(CACHE_SETORES_IDS);
            if (storedIds) {
                idsFinais = JSON.parse(storedIds);
                setoresIdsRef.current = idsFinais;
            }
        } catch(e) {}
    }

    if (!idsFinais || idsFinais.length === 0) {
        console.log("⛔ Abortando atualização: IDs de setores não encontrados.");
        if (isMountedRef.current) {
            if (!loading) setRefreshing(false);
        }
        return; 
    }

    try {
      await verificarEscalonamentoGlobal(force, ringingDelay);
      
      if (isMountedRef.current) setSyncError(false);

      const cacheAtualizado = await AsyncStorage.getItem(CACHE_CHAMADOS);
      
      if (cacheAtualizado && isMountedRef.current) {
        const novosChamados = JSON.parse(cacheAtualizado);
        const listaVazia = !Array.isArray(novosChamados) || novosChamados.length === 0;

        if (listaVazia && preserveState) {
            console.log("🛡️ Proteção ativa: Lista vazia em background ignorada.");
        } 
        else if (!listaVazia) {
             organizarChamados(novosChamados, idsFinais);
        }
        else if (listaVazia && !preserveState && sections.length > 0) {
             organizarChamados([], idsFinais); 
        }
      }

    } catch (error) {
      console.log("Erro no sync (Visual mantido):", error);
      if (isMountedRef.current) setSyncError(true);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

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
          setoresIdsRef.current = ids;
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

  useEffect(() => {
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      handleLoadChamados(setoresIdsRef.current, false, true, false);
    });

    const receivedSub = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log("🔔 Notificação recebida em Foreground!");
      
      const data = notification.request.content.data;

      if (data && data.chamado_data) {
        try {
            let idsSeguros = setoresIdsRef.current;
            
            if (!idsSeguros || idsSeguros.length === 0) {
                const stored = await AsyncStorage.getItem(CACHE_SETORES_IDS);
                if (stored) idsSeguros = JSON.parse(stored);
            }

            if (idsSeguros && idsSeguros.length > 0) {
                
                const novoChamado = typeof data.chamado_data === 'string' 
                    ? JSON.parse(data.chamado_data) 
                    : data.chamado_data;

                const cacheAtual = await AsyncStorage.getItem(CACHE_CHAMADOS);
                let lista = cacheAtual ? JSON.parse(cacheAtual) : [];

                const existe = lista.find((c: any) => String(c.chamado_id) === String(novoChamado.chamado_id));
                
                if (!existe) {
                    console.log("🚀 Injetando novo chamado (Seguro)...");
                    lista.push(novoChamado);
                    
                    await AsyncStorage.setItem(CACHE_CHAMADOS, JSON.stringify(lista));
                    organizarChamados(lista, idsSeguros);
                }
            } else {
                console.log("⚠️ Injeção abortada: IDs de setores não carregados ainda.");
            }

        } catch (e) {
            console.log("Erro na injeção otimista:", e);
        }
      }

      handleLoadChamados(setoresIdsRef.current, true, true, true); 
    });

    return () => {
      responseSub.remove();
      receivedSub.remove();
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active') {
        let deveForcarDownload = true;
        
        try {
            const lastAction = await AsyncStorage.getItem('@Sirius:last_action_timestamp');
            if (lastAction) {
                const diff = new Date().getTime() - Number(lastAction);
                if (diff < 20000) {
                    console.log("🛡️ Proteção Ativa: Mantendo Cache Local (Ação recente).");
                    deveForcarDownload = false;
                }
            }
        } catch(e) {}

        handleLoadChamados(setoresIdsRef.current, true, deveForcarDownload, true, 120);
        
      } else if (nextState === 'background') {
        verificarEscalonamentoGlobal(true, 0);
      }
    });
    return () => sub.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const refreshVisual = async () => {
        try {
          let idsSeguros = setoresIdsRef.current;
          
          if (!idsSeguros || idsSeguros.length === 0) {
             const storedIds = await AsyncStorage.getItem(CACHE_SETORES_IDS);
             if (storedIds) {
                 idsSeguros = JSON.parse(storedIds);
                 setoresIdsRef.current = idsSeguros; 
             }
          }

          if (!idsSeguros || idsSeguros.length === 0) {
             console.log("⛔ Focus Effect: Abortado (Sem IDs de setores para filtrar).");
             return; 
          }

          const cacheChamados = await AsyncStorage.getItem(CACHE_CHAMADOS);
          
          if (isActive && cacheChamados) {
            const lista = JSON.parse(cacheChamados);
            
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
    }, [currentUser])
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

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 20, top: insets.top + 12, zIndex: 1 }}>
            <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Chamados</Text>
          <Text style={styles.headerSubtitle}>
            {loading ? 'Carregando...' : (meusSetoresIds.length > 0 ? `${meusSetoresIds.length} setores monitorados` : 'Toque no filtro para selecionar')}
          </Text>
        </View>
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

      {syncError && (
        <View style={{backgroundColor: '#FFCC00', paddingVertical: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
          <MaterialIcons name="wifi-off" size={16} color="#333" style={{marginRight:6}} />
          <Text style={{fontSize: 12, fontWeight: 'bold', color: '#333'}}>
            Modo Offline (Exibindo dados salvos)
          </Text>
        </View>
      )}

      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => String(item.chamado_id)}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                colors={[COLORS.primary]} 
                tintColor={COLORS.primary} 
            />
        }
        
        ListEmptyComponent={
            (!loading && !refreshing && sections.length === 0) ? (
                <View style={{ alignItems: 'center', marginTop: 100 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
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
  emptyText: { fontSize: 16, color: '#AAA', marginTop: 20, textAlign: 'center' },
});
