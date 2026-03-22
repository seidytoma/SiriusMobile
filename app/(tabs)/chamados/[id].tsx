// app/chamados/[id].tsx

import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, 
  Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, FlatList 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SiriusApi } from '../../../src/services/SiriusApi';
import { stopRinging } from '../../../src/services/ChamadosLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/context/AuthContext';

const COLORS = { 
  primary: '#003366', 
  background: '#F2F2F7', 
  card: '#FFFFFF', 
  text: '#1C1C1E', 
  subtext: '#8E8E93', 
  success: '#34C759', 
  warning: '#FF9500', 
  danger: '#D32F2F', 
  disabled: '#A0A0A0', // Nova cor para botão travado
  chatMe: '#DCF8C6', 
  chatOther: '#FFFFFF'
};

const CACHE_KEY = '@Sirius:chamados_cache';

export default function ChamadoDetalhes() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [chamado, setChamado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [activeTab, setActiveTab] = useState('detalhes');
  const [timer, setTimer] = useState("00:00:00");

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [laudo, setLaudo] = useState("");
  const [derivacao, setDerivacao] = useState("Resolvido");

  const [processingAction, setProcessingAction] = useState(false);
  
  // [NOVO] Estado para saber se o usuário já está ocupado em outro chamado
  const [userIsBusy, setUserIsBusy] = useState(false);

  // SCROLL AUTOMÁTICO SEGURO
  useEffect(() => {
    if (messages.length > 0) {
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100);
    }
  }, [messages]);

  // AUTO-START
  useEffect(() => {
    if (params.autoStart === 'true' && chamado && chamado.chamado_status === 'Aberto') {
      // Se o usuário estiver ocupado, o auto-start não deve forçar o atendimento
      if (!userIsBusy) {
          setTimeout(() => {
            handleAtender();
          }, 500);
      }
    }
  }, [params.autoStart, chamado, userIsBusy]);

  // [NOVO] VERIFICA SE O TÉCNICO JÁ TEM CHAMADO EM ABERTO
  useEffect(() => {
    const checkBusy = async () => {
        if (!user || !chamado) return;
        try {
            const cache = await AsyncStorage.getItem(CACHE_KEY);
            if (cache) {
                const lista = JSON.parse(cache);
                // Procura se tem algum chamado QUE NÃO SEJA ESTE
                // que esteja "Em Atendimento" com o nome deste usuário
                const ocupado = lista.find((c: any) => 
                    String(c.chamado_id) !== String(chamado.chamado_id) && // Não é o atual
                    c.chamado_status === 'Em Atendimento' && // Está rodando
                    (c.tecnico_nome === user.name || c.tecnico_email === user.email) // É meu
                );
                
                if (ocupado) {
                    console.log(`Usuário ocupado no chamado ${ocupado.chamado_id}`);
                    setUserIsBusy(true);
                } else {
                    setUserIsBusy(false);
                }
            }
        } catch (e) {}
    };
    checkBusy();
  }, [chamado, user]);

  const renderEquipamentoText = (item: any) => {
    if (!item) return <Text style={{color: COLORS.subtext}}>Carregando...</Text>;
    const id = item.equipamento_id;
    const desc = item.equipamento_descricaocompleta;
    
    if (desc) {
      return <Text style={{color: COLORS.text, fontSize: 15, lineHeight: 22}}>{desc}</Text>;
    }
    if (id) {
      return (
        <Text style={{color: COLORS.subtext, fontSize: 14, fontStyle: 'italic'}}>
          Equipamento ID: {id} {'\n'}<Text style={{fontSize: 12}}>(Descrição não encontrada)</Text>
        </Text>
      );
    }
    return <Text style={{color: COLORS.text, fontSize: 15}}>Geral / Instalação / Predial</Text>;
  };

  useEffect(() => {
    let isMounted = true; // Previne atualização de estado se o componente desmontar

    const loadChamado = async () => {
      const { id, data } = params;
      const idBusca = id ? String(id).trim() : null;

      if (!idBusca) {
        if (isMounted) {
          setErrorMsg("ID inválido.");
          setLoading(false);
        }
        return;
      }

      // 1. Tenta usar dados passados por navegação (Mais rápido - Optimistic UI)
      if (data && typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          if (parsed && String(parsed.chamado_id).trim() === idBusca) {
            if (isMounted) {
              setChamado(parsed);
              setLoading(false);
            }
            // Mesmo achando nos params, vamos tentar atualizar em background silenciosamente?
            // Por enquanto, não, para evitar o erro de conexão visual.
            return;
          }
        } catch (e) {}
      }

      // 2. Tenta buscar do Cache Local
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const lista = JSON.parse(cache);
          const itemCache = lista.find((c: any) => String(c.chamado_id).trim() === idBusca);
          if (itemCache) {
            if (isMounted) {
              setChamado(itemCache);
              setLoading(false);
            }
            return; // Se achou no cache, mostra e para.
          }
        }
      } catch (e) {}

      // 3. Busca na API (Último recurso)
      if (isMounted) setLoading(true);
      
      try {
        const chamadosAPI = await SiriusApi.getChamadosAbertos();
        
        if (!isMounted) return;

        if (Array.isArray(chamadosAPI)) {
          const encontrado = chamadosAPI.find((c: any) => String(c.chamado_id).trim() === idBusca);
          if (encontrado) {
            setChamado(encontrado);
            setErrorMsg(''); // Limpa erro se houver
          } else {
            // Se baixou a lista e não tá nela, provavelmente foi fechado ou não é seu setor
            setErrorMsg("Chamado não encontrado na lista de ativos.");
          }
        } else {
          // Se falhou a rede, mas já tínhamos o chamado (ex: via params que falhou parse), 
          // não faz nada. Mas se chamado for null, exibe erro.
          if (!chamado) {
             setErrorMsg("Não foi possível carregar os dados. Verifique sua conexão.");
          }
        }
      } catch (e) {
        if (isMounted && !chamado) {
           setErrorMsg("Erro crítico ao conectar com o servidor.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadChamado();

    return () => { isMounted = false; };
  }, [params.id, params.data]); // Removido dependência cíclica desnecessária

  useEffect(() => {
    if (!chamado) return;
    const updateTimer = () => {
      const startString = chamado?.chamado_status === 'Em Atendimento' 
        ? chamado?.chamado_inicioatendimento 
        : chamado?.chamado_dataabertura;
      
      if (!startString) return;
      const start = new Date(startString).getTime();
      const diff = new Date().getTime() - start;
      if (diff < 0) return;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimer(`${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`);
    };
    const interval = setInterval(updateTimer, 1000);
    updateTimer(); 
    return () => clearInterval(interval);
  }, [chamado?.chamado_status, chamado?.chamado_id]);

  const loadChat = async () => {
    if (!chamado?.chamado_id) return;
    const res = await SiriusApi.getComentarios(chamado.chamado_id);
    if (Array.isArray(res)) {
       if (res.length !== messages.length || messages.length === 0) {
           setMessages(res);
       }
    }
  };

  useEffect(() => {
    if (activeTab === 'chat' && chamado?.chamado_id) {
      loadChat();
      const chatInterval = setInterval(loadChat, 5000); 
      return () => clearInterval(chatInterval);
    }
  }, [activeTab, chamado?.chamado_id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!chamado?.chamado_id) {
        Alert.alert("Erro", "Identificador do chamado não encontrado.");
        return;
    }
    
    const msgTexto = newMessage;
    setNewMessage("");
    setSendingMsg(true);

    const nomeUsuario = user?.name || "Eu";
    const emailUsuario = user?.email || "";

    const tempMsg = { 
      usuario_nome: nomeUsuario, 
      usuario: nomeUsuario, 
      usuario_email: emailUsuario,
      mensagem: msgTexto, 
      data_hora: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, tempMsg]);

    try {
      await SiriusApi.enviarComentario(
        chamado.chamado_id,
        nomeUsuario,
        emailUsuario,
        msgTexto
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleAtender = async () => {
    // [NOVO] Bloqueia se já estiver ocupado
    if (userIsBusy) {
        Alert.alert("Ação Bloqueada", "Você já possui um chamado em andamento. Finalize-o antes de iniciar outro.");
        return;
    }

    if (!chamado?.chamado_id || processingAction) return;

    // 1. PARA O BARULHO IMEDIATAMENTE
    stopRinging(chamado.chamado_id);

    // 2. Trava a UI, mas vamos atualizar visualmente já
    setProcessingAction(true);

    const backupChamado = { ...chamado }; 
    const backupCache = await AsyncStorage.getItem(CACHE_KEY);

    try {
      await AsyncStorage.setItem('@Sirius:last_action_timestamp', String(new Date().getTime()));
      const dataOtimista = new Date().toISOString();
      const novoStatus = "Em Atendimento";

      // 3. ATUALIZAÇÃO OTIMISTA (Visual Instantâneo)
      setChamado((prev: any) => ({
        ...prev,
        chamado_status: novoStatus,
        chamado_inicioatendimento: dataOtimista,
        tecnico_nome: user?.name || "Eu"
      }));

      if (backupCache) {
        const lista = JSON.parse(backupCache);
        const novaLista = lista.map((item: any) => {
          if (String(item.chamado_id) === String(chamado.chamado_id)) {
            return { 
              ...item, 
              chamado_status: novoStatus, 
              chamado_inicioatendimento: dataOtimista, 
              tecnico_nome: user?.name || "Eu" 
            };
          }
          return item;
        });
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(novaLista));
      }

      const res = await SiriusApi.iniciarAtendimento(chamado.chamado_id, user?.name || "Técnico");
      
      if (!res.success) throw new Error(res.error || "O servidor recusou o atendimento.");

      if (res.inicioAtendimento) {
        const dataOficial = res.inicioAtendimento;
        setChamado((prev: any) => ({ ...prev, chamado_inicioatendimento: dataOficial }));
      }

    } catch (error: any) {
      Alert.alert("Erro de Sincronização", "Não foi possível assumir o chamado. Verifique sua conexão.");
      setChamado(backupChamado);
      if (backupCache) await AsyncStorage.setItem(CACHE_KEY, backupCache);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleEncerrar = async () => {
    if (!laudo.trim() || !chamado?.chamado_id) return Alert.alert("Atenção", "O laudo é obrigatório.");

    setModalVisible(false);
    setProcessingAction(true);

    try {
      await AsyncStorage.setItem('@Sirius:last_action_timestamp', String(new Date().getTime()));
      const cacheAtual = await AsyncStorage.getItem(CACHE_KEY);
      if (cacheAtual) {
        const lista = JSON.parse(cacheAtual);
        const novaLista = lista.filter((item: any) => String(item.chamado_id) !== String(chamado.chamado_id));
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(novaLista));
      }

      Alert.alert("Sucesso", "Chamado finalizado!", [
        { 
          text: "OK", 
          onPress: () => {
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)');
          }
        }
      ]);

      SiriusApi.encerrarChamado({ 
        chamado_id: chamado.chamado_id, 
        laudo, 
        derivacao 
      }).catch(err => console.error("Erro sync encerramento:", err));

    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar dados locais.");
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) return <View style={[styles.center, {backgroundColor: COLORS.background}]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  if (loading) return <View style={[styles.center, {backgroundColor: COLORS.background}]}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  
  if (errorMsg || !chamado) return (
    <View style={styles.center}>
      <MaterialIcons name="error-outline" size={60} color={COLORS.subtext} />
      <Text style={{color: COLORS.subtext, marginTop: 10, textAlign: 'center', marginHorizontal: 20}}>
        {errorMsg || "Não foi possível carregar o chamado."}
      </Text>
      <TouchableOpacity 
        style={[styles.btnAction, { marginTop: 20, backgroundColor: COLORS.primary, width: 200 }]}
        onPress={() => router.replace('/(tabs)')} // Volta para lista para forçar refresh lá
      >
        <Text style={{color: 'white', fontWeight: 'bold'}}>VOLTAR PARA LISTA</Text>
      </TouchableOpacity>
    </View>
  );

  // Determina se o botão deve estar travado (User Ocupado E status do chamado atual é Aberto)
  const isButtonLocked = userIsBusy && chamado?.chamado_status === 'Aberto';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top:15, bottom:15, left:15, right:15}}>
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Chamado</Text>
      </View>

      <View style={styles.tabContainer} accessibilityRole="tablist">
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'detalhes' && styles.tabActive]}
          onPress={() => setActiveTab('detalhes')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'detalhes' }}
        >
          <Text style={[styles.tabText, activeTab === 'detalhes' && styles.tabTextActive]}>DETALHES</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'chat' && styles.tabActive]}
          onPress={() => setActiveTab('chat')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'chat' }}
        >
          <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>CHAT ({messages.length})</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        {activeTab === 'detalhes' ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.timerCard}>
               <Text style={styles.timerLabel}>{chamado?.chamado_status === 'Em Atendimento' ? "TEMPO DE ATENDIMENTO" : "AGUARDANDO HÁ"}</Text>
               <Text style={[styles.timerValue, {color: chamado?.chamado_status === 'Em Atendimento' ? COLORS.success : COLORS.warning}]}>{timer}</Text>
               <View style={[styles.statusBadge, { backgroundColor: chamado?.chamado_status === 'Em Atendimento' ? COLORS.success : COLORS.warning }]}>
                 <Text style={styles.statusText}>{chamado?.chamado_status}</Text>
               </View>
            </View>

            <InfoSection title="Solicitação" content={chamado?.chamado_descricaoproblema} isCritical={chamado?.chamado_prioridade === 'Crítica'} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SOLICITANTE</Text>
              <View style={styles.card}>
                <RowIcon icon="person" text={chamado?.chamado_contato_nome || chamado?.chamado_usuarioaberturanome || "Não informado"} />
                <View style={styles.divider} />
                <RowIcon icon="phone" text={chamado?.chamado_contato_telefone || "Ramal não informado"} />
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>LOCAL E EQUIPAMENTO</Text>
              <View style={styles.card}>
                <RowIcon icon="location-on" text={chamado?.cc_descricao} />
                <View style={styles.divider} />
                <View style={{flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8}}>
                   <MaterialIcons name="biotech" size={20} color={COLORS.primary} style={{marginRight: 10, marginTop: 2}} />
                   <View style={{flex: 1}}>
                      {renderEquipamentoText(chamado)}
                   </View>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.chatContainer} 
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            <FlatList 
              ref={flatListRef} 
              data={messages} 
              keyExtractor={(_, i) => i.toString()}
              
              renderItem={({item}) => {
                const isMe = (user?.email && item.usuario_email === user.email) || 
                             (item.usuario === (user?.name || "Eu")) ||
                             (item.usuario_nome === (user?.name || "Eu"));

                return (
                  <View style={[styles.msgBubble, isMe ? styles.msgMe : styles.msgOther]}>
                    <Text style={styles.msgUser}>
                        {isMe ? "Você" : (item.usuario_nome || item.usuario)}
                    </Text>
                    <Text style={styles.msgText}>{item.mensagem}</Text>
                  </View>
                );
              }} 
              contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}
            />
            
            <View style={[
                styles.inputContainer, 
                { paddingBottom: Math.max(insets.bottom, 10) }
            ]}>
              <TextInput 
                style={styles.chatInput} 
                placeholder="Escreva..." 
                value={newMessage} 
                onChangeText={setNewMessage}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                style={[styles.sendBtn, (!newMessage.trim() || sendingMsg) && { opacity: 0.5 }]}
                disabled={!newMessage.trim() || sendingMsg}
                accessibilityRole="button"
                accessibilityLabel="Enviar mensagem"
                accessibilityState={{ disabled: !newMessage.trim() || sendingMsg }}
              >
                {sendingMsg ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <MaterialIcons name="send" size={24} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>

      {activeTab === 'detalhes' && (
        <View style={[
            styles.footer, 
            { paddingBottom: Math.max(insets.bottom, 20) } 
        ]}>
          <TouchableOpacity 
            style={[
              styles.btnAction, 
              // Lógica de cores:
              // 1. Se estiver ocupado com outro chamado -> CINZA (Disabled)
              // 2. Se for este chamado e já estiver rodando -> VERDE
              // 3. Padrão -> AZUL
              isButtonLocked ? { backgroundColor: COLORS.disabled } :
              (chamado?.chamado_status !== 'Aberto' ? { backgroundColor: COLORS.success } : {}),
              
              processingAction && {opacity: 0.7}
            ]} 
            onPress={() => {
              if (isButtonLocked) {
                  Alert.alert("Ação Bloqueada", "Você já está em atendimento em outro chamado. Finalize-o primeiro.");
                  return;
              }
              if (chamado.chamado_status === 'Aberto') {
                handleAtender();
              } else {
                setLaudo(""); 
                setDerivacao("Resolvido"); 
                setModalVisible(true);
              }
            }}
            disabled={processingAction} // Não desabilita se isButtonLocked, para permitir clicar e ver o alerta
          >
            {/*
                UX OTIMIZADA: Se estiver processando, mas o status JÁ mudou (Otimista),
                mostra o botão normal (apenas travado) em vez do Spinner.
                Isso dá a sensação de "Instantâneo".
            */}
            {processingAction && chamado?.chamado_status === 'Aberto' ? (
               <ActivityIndicator color="white" />
            ) : (
               <>
                 <MaterialIcons 
                    name={isButtonLocked ? "lock" : (chamado?.chamado_status === 'Aberto' ? "play-arrow" : "check-circle")} 
                    size={28} 
                    color="white" 
                 />
                 <Text style={{color: 'white', fontWeight: 'bold', marginLeft: 10}}>
                   {isButtonLocked ? "EM ATENDIMENTO (OUTRO)" : 
                   (chamado?.chamado_status === 'Aberto' ? "INICIAR ATENDIMENTO" : "FINALIZAR")}
                 </Text>
               </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Finalizar Chamado</Text>
            
            <TextInput 
              style={styles.input} 
              multiline 
              value={laudo} 
              onChangeText={setLaudo} 
              placeholder="Descreva o serviço realizado..." 
            />
            
            <View style={styles.optionsRow}>
              {['Resolvido', 'Manutenção Corretiva', 'Erro de Operação'].map(opt => (
                <TouchableOpacity 
                  key={opt} 
                  style={[styles.optionChip, derivacao === opt && styles.optionSelected]} 
                  onPress={() => setDerivacao(opt)}
                >
                  <Text style={{fontSize: 12, color: derivacao === opt ? 'white' : 'black'}}>{opt}</Text>
                </TouchableOpacity>
              ))}</View>
            
            <TouchableOpacity style={styles.btnModalConfirm} onPress={handleEncerrar}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>CONFIRMAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{alignItems: 'center', marginTop: 15}} 
              onPress={() => {
                setModalVisible(false);
                setLaudo(""); 
              }}
            >
              <Text style={{color: COLORS.subtext}}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const InfoSection = ({title, content, isCritical}: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    <View style={styles.card}>
      <Text style={styles.textBody}>{content || "Sem descrição"}</Text>
      {isCritical && <View style={styles.criticalBadge}><MaterialIcons name="error" size={16} color={COLORS.danger} /><Text style={styles.criticalText}>Crítica</Text></View>}
    </View>
  </View>
);

const RowIcon = ({icon, text}: any) => (
  <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8}}>
    <MaterialIcons name={icon} size={20} color={COLORS.primary} style={{marginRight: 10}} />
    <Text style={{color: COLORS.text, fontSize: 15, flex: 1}}>{String(text || '')}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.primary },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 4, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#FFF' },
  tabText: { color: 'rgba(255,255,255,0.6)', fontWeight: 'bold' },
  tabTextActive: { color: '#FFF' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  timerCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20, elevation: 2 },
  timerLabel: { color: COLORS.subtext, fontSize: 11, fontWeight: 'bold' },
  timerValue: { fontSize: 40, fontWeight: 'bold', marginVertical: 5, color: '#333' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.subtext, marginBottom: 6 },
  card: { backgroundColor: COLORS.card, padding: 15, borderRadius: 12, elevation: 1 },
  textBody: { fontSize: 16, color: COLORS.text, lineHeight: 22 },
  criticalBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#FFF5F5', padding: 6, borderRadius: 6 },
  criticalText: { color: COLORS.danger, fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 5 },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderColor: '#EEE' },
  btnAction: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  chatContainer: { flex: 1, backgroundColor: '#E5DDD5' },
  msgBubble: { padding: 10, borderRadius: 10, marginBottom: 8, maxWidth: '80%', marginHorizontal: 10, marginTop: 5, flexShrink: 1 },
  msgMe: { alignSelf: 'flex-end', backgroundColor: COLORS.chatMe },
  msgOther: { alignSelf: 'flex-start', backgroundColor: COLORS.chatOther },
  msgUser: { fontSize: 10, fontWeight: 'bold', color: COLORS.primary },
  msgText: { fontSize: 15 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  sendBtn: { width: 40, height: 40, backgroundColor: COLORS.primary, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 15 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, height: 100, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 15 },
  optionChip: { padding: 10, borderRadius: 20, backgroundColor: '#F0F0F0' },
  optionSelected: { backgroundColor: COLORS.primary },
  btnModalConfirm: { backgroundColor: COLORS.success, padding: 15, borderRadius: 12, alignItems: 'center' }
});