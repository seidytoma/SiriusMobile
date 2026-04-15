import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator, // <--- Importado
  Platform,
  Keyboard,
  Animated,
  Easing
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SiriusApi } from '../src/services/SiriusApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const COLORS = {
  primary: '#003366',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  subtext: '#666666',
  success: '#34C759',
  error: '#D32F2F',
  warning: '#FF9500', 
  occupiedBg: '#FFF3E0', 
  selectedBg: '#E6F4FE', 
  inputBg: '#F0F0F0'
};

interface SetorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (selectedIds: string[]) => void;
  currentSelectedIds: string[];
  cachedSetores: any[];
  currentUser: any;
  cachedPresets?: any;
  onUpdatePresets?: (presets: any) => void;
  isLoading?: boolean; // <--- NOVA PROP
}

export default function SetorModal({
  visible,
  onClose,
  onSave,
  currentSelectedIds,
  cachedSetores,
  currentUser,
  cachedPresets = {},
  onUpdatePresets,
  isLoading = false // <--- Valor padrão
}: SetorModalProps) {
  
  // --- ESTADOS ---
  const insets = useSafeAreaInsets(); // <--- ADICIONE AQUI
  const [activeTab, setActiveTab] = useState<'setores' | 'grupos'>('setores');
  const [localIds, setLocalIds] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const [presets, setPresets] = useState<any>(cachedPresets);
  const [newPresetName, setNewPresetName] = useState('');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [loadingPreset, setLoadingPreset] = useState(false);

  // --- TOAST ---
  const [toast, setToast] = useState({ visible: false, title: '', message: '', type: 'success' });
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-20)).current;

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, title, message, type });
    Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true })
    ]).start();
    setTimeout(() => {
        Animated.parallel([
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(toastTranslateY, { toValue: -20, duration: 300, useNativeDriver: true })
        ]).start(() => setToast(t => ({ ...t, visible: false })));
    }, 3000);
  };

  // --- EFEITOS ---
  useEffect(() => {
    if (visible) {
      setLocalIds([...currentSelectedIds]);
      setSearchText('');
      setIsCreatingPreset(false);
      if (cachedPresets && Object.keys(cachedPresets).length > 0) {
        setPresets(cachedPresets);
      }
    }
  }, [visible, currentSelectedIds, cachedPresets]);

  const toggleSetor = (id: string) => {
    setLocalIds(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      return [...prev, id];
    });
  };

  const handleSave = () => {
    onSave(localIds);
    onClose();
  };

  // --- AÇÕES DE GRUPO ---
  const handleApplyPreset = (presetIds: string[]) => {
    setLocalIds(presetIds);
    showToast("Grupo Aplicado", `${presetIds.length} setores foram selecionados.`, 'success');
  };

  const handleCreatePreset = async () => {
    if (!newPresetName.trim()) {
      showToast("Atenção", "Digite um nome para o grupo.", "error");
      return;
    }
    if (localIds.length === 0) {
      showToast("Atenção", "Selecione setores primeiro.", "error");
      return;
    }
    
    setLoadingPreset(true);
    try {
      const newPresets = { ...presets, [newPresetName]: localIds };
      setPresets(newPresets);
      if (onUpdatePresets) onUpdatePresets(newPresets);

      const response = await SiriusApi.managePresets(
          'save', 
          String(currentUser.id), 
          { [newPresetName]: localIds }
      );

      if (response && response.success === false) throw new Error(response.error);
      
      setNewPresetName('');
      setIsCreatingPreset(false);
      showToast("Sucesso", "Grupo salvo!", "success");
      Keyboard.dismiss(); 

    } catch (error: any) {
      console.log("Erro salvar preset:", error);
      showToast("Erro", "Salvo apenas localmente.", "error");
    } finally {
      setLoadingPreset(false);
    }
  };

  const handleDeletePreset = async (name: string) => {
    Alert.alert("Excluir", `Apagar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Apagar", 
        style: 'destructive',
        onPress: async () => {
          const newPresets = { ...presets };
          delete newPresets[name];
          setPresets(newPresets);
          if (onUpdatePresets) onUpdatePresets(newPresets);
          try { await SiriusApi.managePresets('delete', String(currentUser.id), { [name]: [] }); } catch(e) {}
          showToast("Removido", "Grupo excluído.", "info");
        }
      }
    ]);
  };

  // --- RENDERIZADORES ---
  const renderSetorItem = ({ item }: { item: any }) => {
    const id = String(item.cc_id);
    const isSelected = localIds.includes(id);
    const isOccupiedByOther = item.responsavel_nome && String(item.responsavel_id) !== String(currentUser?.id);

    let cardStyle = styles.card;
    let statusText = "Livre";
    let statusColor = COLORS.success;
    let statusIcon = "check-circle";

    if (isSelected) {
        cardStyle = styles.cardSelected;
        if (isOccupiedByOther) {
            statusText = `Assumindo de ${item.responsavel_nome}`; 
            statusColor = COLORS.warning;
            statusIcon = "swap-horiz";
        } else {
            statusText = "Selecionado (Você)";
            statusColor = COLORS.primary;
            statusIcon = "check-circle";
        }
    } else {
        if (isOccupiedByOther) {
            cardStyle = styles.cardOccupied;
            statusText = `Ocupado: ${item.responsavel_nome}`;
            statusColor = COLORS.subtext;
            statusIcon = "lock";
        }
    }

    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={() => toggleSetor(id)}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={item.cc_descricao}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.cc_descricao}</Text>
          <View style={[styles.checkbox, isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
             {isSelected && <MaterialIcons name="check" size={16} color="white" />}
          </View>
        </View>
        <View style={styles.statusRow}>
            <MaterialIcons name={statusIcon as any} size={14} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGrupoItem = ({ item }: { item: string }) => {
     const count = presets[item]?.length || 0;
     return (
       <View style={styles.grupoCard}>
         <View style={{flex: 1}}>
           <Text style={styles.grupoTitle}>{item}</Text>
           <Text style={styles.grupoSubtitle}>{count} setores</Text>
         </View>
         <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => handleApplyPreset(presets[item])} style={styles.btnApply}>
              <Text style={styles.btnApplyText}>Usar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeletePreset(item)}
              style={styles.btnDelete}
              accessibilityRole="button"
              accessibilityLabel={`Excluir grupo ${item}`}
            >
              <MaterialIcons name="delete" size={20} color={COLORS.error} />
            </TouchableOpacity>
         </View>
       </View>
     );
  };

  const filteredSetores = cachedSetores.filter(s => 
    s.cc_descricao.toLowerCase().includes(searchText.toLowerCase()) ||
    (s.responsavel_nome && s.responsavel_nome.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        {/* TOAST */}
        {toast.visible && (
            <Animated.View style={[
                styles.toastContainer, 
                { opacity: toastOpacity, transform: [{ translateY: toastTranslateY }], borderLeftColor: toast.type === 'success' ? COLORS.success : (toast.type === 'error' ? COLORS.error : COLORS.primary)}
            ]}>
                <View style={[styles.toastIcon, { backgroundColor: toast.type === 'success' ? '#E8F5E9' : (toast.type === 'error' ? '#FFEBEE' : '#E3F2FD') }]}>
                    <MaterialIcons name={toast.type === 'success' ? 'check-circle' : (toast.type === 'error' ? 'error' : 'info')} size={24} color={toast.type === 'success' ? COLORS.success : (toast.type === 'error' ? COLORS.error : COLORS.primary)} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.toastTitle}>{toast.title}</Text>
                    <Text style={styles.toastMessage}>{toast.message}</Text>
                </View>
            </Animated.View>
        )}

        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Gerenciar Setores</Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityLabel="Fechar modal de setores"
              accessibilityRole="button"
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabs} accessibilityRole="tablist">
             <TouchableOpacity
               style={[styles.tab, activeTab === 'setores' && styles.tabActive]}
               onPress={() => setActiveTab('setores')}
               accessibilityRole="tab"
               accessibilityState={{ selected: activeTab === 'setores' }}
             >
               <Text style={[styles.tabText, activeTab === 'setores' && styles.tabTextActive]}>Setores</Text>
             </TouchableOpacity>
             <TouchableOpacity
               style={[styles.tab, activeTab === 'grupos' && styles.tabActive]}
               onPress={() => setActiveTab('grupos')}
               accessibilityRole="tab"
               accessibilityState={{ selected: activeTab === 'grupos' }}
             >
               <Text style={[styles.tabText, activeTab === 'grupos' && styles.tabTextActive]}>Meus Grupos</Text>
             </TouchableOpacity>
          </View>

          {activeTab === 'setores' ? (
            <>
              <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color="#999" />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Buscar..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              {/* LÓGICA DE LOADING VISUAL */}
              {isLoading && cachedSetores.length === 0 ? (
                <View style={styles.loadingContainer}>
                   <ActivityIndicator size="large" color={COLORS.primary} />
                   <Text style={styles.loadingText}>Sincronizando setores...</Text>
                   <Text style={styles.loadingSubtext}>Isso pode levar alguns segundos.</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredSetores}
                  keyExtractor={(item) => String(item.cc_id)}
                  renderItem={renderSetorItem}
                  contentContainerStyle={styles.listContent}
                  initialNumToRender={10}
                  keyboardShouldPersistTaps="handled" 
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="search-off" size={40} color="#DDD" />
                        <Text style={styles.emptyText}>Nenhum setor encontrado.</Text>
                    </View>
                  }
                />
              )}
            </>
          ) : (
            <View style={{flex: 1}}>
                <View style={styles.createGroupContainer}>
                    {!isCreatingPreset ? (
                    <TouchableOpacity style={styles.btnNewGroup} onPress={() => setIsCreatingPreset(true)}>
                        <MaterialIcons name="add" size={20} color={COLORS.primary} />
                        <Text style={styles.btnNewGroupText}>Salvar seleção atual como Grupo</Text>
                    </TouchableOpacity>
                    ) : (
                    <View style={styles.newGroupForm}>
                        <TextInput 
                            style={styles.groupInput}
                            placeholder="Nome do grupo..."
                            value={newPresetName}
                            onChangeText={setNewPresetName}
                            autoFocus={true} 
                            returnKeyType="done"
                            onSubmitEditing={handleCreatePreset}
                        />
                        {loadingPreset ? <ActivityIndicator color={COLORS.primary} style={{marginRight: 10}} /> : (
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={handleCreatePreset}
                                style={styles.btnConfirmGroup}
                                accessibilityRole="button"
                                accessibilityLabel="Confirmar criação do grupo"
                            >
                                <MaterialIcons name="check" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setIsCreatingPreset(false)}
                                style={styles.btnCancelGroup}
                                accessibilityRole="button"
                                accessibilityLabel="Cancelar criação do grupo"
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        )}
                    </View>
                    )}
                </View>

                <FlatList 
                    data={Object.keys(presets)}
                    keyExtractor={item => item}
                    renderItem={renderGrupoItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum grupo salvo.</Text>}
                    keyboardShouldPersistTaps="handled"
                />
            </View>
          )}

          {/* O Footer fica normal. Ele vai subir automaticamente 
            porque o <View style={styles.container}> acima empurrou ele. */}
          <View style={styles.footer}>
             <Text style={styles.selectionCount}>{localIds.length} selecionados</Text>
             <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
               <Text style={styles.btnSaveText}>Confirmar</Text>
             </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { height: height * 0.90, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20 },
  
  toastContainer: {
    position: 'absolute', top: 50, left: 20, right: 20,
    backgroundColor: 'white', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 10,
    zIndex: 9999, borderLeftWidth: 6,
  },
  toastIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  toastTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
  toastMessage: { fontSize: 13, color: COLORS.subtext },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  
  tabs: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE', marginBottom: 10 },
  tab: { marginRight: 20, paddingBottom: 10 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, color: '#999', fontWeight: '600' },
  tabTextActive: { color: COLORS.primary, fontWeight: 'bold' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.inputBg, marginHorizontal: 20, paddingHorizontal: 10, borderRadius: 8, height: 40, marginBottom: 10 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },

  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  
  // ESTILOS DE LOADING E EMPTY
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 15, fontSize: 16, fontWeight: '600', color: COLORS.primary },
  loadingSubtext: { fontSize: 12, color: '#999', marginTop: 5 },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 10, fontSize: 14 },

  card: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
  cardSelected: { backgroundColor: COLORS.selectedBg, padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1.5, borderColor: COLORS.primary },
  cardOccupied: { backgroundColor: COLORS.occupiedBg, padding: 15, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#FFE0B2' },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1 },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: '#CCC', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { fontSize: 11, fontWeight: 'bold', marginLeft: 4 },

  grupoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#EEE', elevation: 1 },
  grupoTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  grupoSubtitle: { fontSize: 12, color: '#666' },
  btnApply: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 10 },
  btnApplyText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  btnDelete: { padding: 6 },
  
  createGroupContainer: { marginHorizontal: 20, marginBottom: 15, marginTop: 5 },
  btnNewGroup: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#E3F2FD', borderRadius: 8, justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.primary },
  btnNewGroupText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 5 },
  newGroupForm: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8, padding: 8 },
  groupInput: { flex: 1, paddingHorizontal: 10, height: 45, backgroundColor: 'white', borderRadius: 6, marginRight: 8 },
  btnConfirmGroup: { backgroundColor: COLORS.success, padding: 10, borderRadius: 6, marginRight: 8, alignItems: 'center', justifyContent:'center' },
  btnCancelGroup: { backgroundColor: '#DDD', padding: 10, borderRadius: 6, alignItems: 'center', justifyContent:'center' },

  footer: { padding: 20, borderTopWidth: 1, borderColor: '#EEE', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectionCount: { color: '#666', fontWeight: '600' },
  btnSave: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  btnSaveText: { color: 'white', fontWeight: 'bold' }
});