import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SiriusApi } from '../../../src/services/SiriusApi';

const COLORS = { primary: '#003366', background: '#F2F2F7', card: '#FFFFFF', subtext: '#666666', success: '#34C759' };

export default function RotasScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rotas, setRotas] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const hoje = new Date();
    const res = await SiriusApi.getRotasDoMes(hoje.getFullYear(), hoje.getMonth() + 1);
    if (res.success) setRotas(res.data.rotas);
    setLoading(false);
  }

  const toggleSelection = (chave: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(chave)) newSet.delete(chave);
    else newSet.add(chave);
    setSelectedIds(newSet);
  };

  const handleConfirm = async () => {
    if (selectedIds.size === 0) return;
    setIsSubmitting(true);
    
    const itemsToSave = Array.from(selectedIds).map(chave => {
      const [rota_id, data] = chave.split('|');
      return { rota_id, data_programada: data, status: 'Realizada', motivo: '' };
    });

    const res = await SiriusApi.salvarExecucaoRotaEmLote({ execucoes: itemsToSave });
    setIsSubmitting(false);
    
    if (res.success) {
      Alert.alert("Sucesso", "Rotas marcadas como realizadas!", [{ text: "OK", onPress: () => { setSelectedIds(new Set()); loadData(); } }]);
    } else {
      Alert.alert("Erro", "Falha ao salvar. Tente novamente.");
    }
  };

  const renderRota = ({ item }: any) => {
    const isSelectable = item.status === 'Hoje' || item.status === 'Vencida';
    const isSelected = selectedIds.has(item.chave_composta);

    return (
      <TouchableOpacity 
        style={[styles.card, isSelected && styles.cardSelected]} 
        disabled={!isSelectable}
        onPress={() => toggleSelection(item.chave_composta)}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {isSelectable ? (
            <MaterialIcons name={isSelected ? "check-circle" : "radio-button-unchecked"} size={26} color={isSelected ? COLORS.success : '#CCC'} />
          ) : (
            <MaterialIcons name="fact-check" size={26} color={COLORS.primary} />
          )}
          <View style={{flex: 1, marginLeft: 15}}>
            <Text style={styles.rotaTitle}>{item.cc_descricao}</Text>
            <Text style={styles.rotaSubtitle}>Data: {item.data_programada.split('-').reverse().join('/')}</Text>
          </View>
          <View style={[styles.badge, {backgroundColor: item.btnColor === 'danger' ? '#FFEBEB' : item.btnColor === 'success' ? '#E8F5E9' : '#E3F2FD'}]}>
            <Text style={{fontSize: 10, fontWeight: 'bold', color: item.btnColor === 'danger' ? '#D32F2F' : item.btnColor === 'success' ? '#2E7D32' : COLORS.primary}}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rotas de Inspeção</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
      ) : (
        <FlatList
          data={rotas}
          keyExtractor={(item) => item.chave_composta}
          renderItem={renderRota}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={{textAlign: 'center', color: COLORS.subtext}}>Nenhuma rota para hoje.</Text>}
        />
      )}

      {selectedIds.size > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Concluir ({selectedIds.size}) Selecionadas</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  backButton: { position: 'absolute', left: 20, top: 52, zIndex: 1 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 15, marginBottom: 10, elevation: 1, borderWidth: 1, borderColor: 'transparent' },
  cardSelected: { borderColor: COLORS.success, backgroundColor: '#F0FFF4' },
  rotaTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  rotaSubtitle: { fontSize: 13, color: COLORS.subtext, marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#EEE' },
  btnConfirm: { backgroundColor: COLORS.success, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
