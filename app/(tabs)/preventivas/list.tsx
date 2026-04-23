import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SiriusApi } from '../../../src/services/SiriusApi';

const COLORS = {
  primary: '#003366', background: '#F2F2F7', card: '#FFFFFF',
  text: '#1C1C1E', subtext: '#666666',
  danger: '#D32F2F', warning: '#F57C00', success: '#34C759', info: '#007AFF',
};

const KpiCard = ({ title, value, color, isActive, onPress }: any) => (
  <TouchableOpacity style={[styles.kpiCard, { borderBottomColor: color }, isActive && styles.kpiActive]} onPress={onPress}>
    <Text style={[styles.kpiValue, { color }]}>{value}</Text>
    <Text style={styles.kpiTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function PreventivasListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({});

  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await SiriusApi.getMinhasPreventivas();
      if (response.success && response.data) {
        setAllTasks(response.data.tarefas || []);
        setKpis(response.data.kpis || {});
      } else {
        // Tratar erro
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      // Filtro de KPI
      if (activeKpiFilter) {
        if (activeKpiFilter === 'Proximo Mês') {
          if (!task.is_proximo_mes) return false;
        } else {
          if (task.status !== activeKpiFilter) return false;
        }
      }

      // Filtro de Busca
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const tag = (task.tag || '').toLowerCase();
        const desc = (task.descricao || '').toLowerCase();
        if (!tag.includes(term) && !desc.includes(term)) {
          return false;
        }
      }

      return true;
    });
  }, [allTasks, activeKpiFilter, searchTerm]);

  const toggleKpiFilter = (kpi: string) => {
    if (activeKpiFilter === kpi) {
      setActiveKpiFilter(null);
    } else {
      setActiveKpiFilter(kpi);
    }
  };

  const renderTaskItem = ({ item }: { item: any }) => {
    let badgeColor = COLORS.info;
    let borderColor = COLORS.info;

    if (item.status === 'Atrasada') {
      badgeColor = COLORS.danger;
      borderColor = COLORS.danger;
    } else if (item.status === 'Este Mês') {
      badgeColor = COLORS.warning;
      borderColor = COLORS.warning;
    } else {
      badgeColor = COLORS.success;
      borderColor = COLORS.success;
    }

    return (
      <View style={[styles.taskCard, { borderLeftColor: borderColor }]}>
        <View style={styles.taskHeader}>
          <View style={[styles.statusBadge, { backgroundColor: `${badgeColor}20`, borderColor: badgeColor }]}>
            <Text style={[styles.statusText, { color: badgeColor }]}>{item.status}</Text>
          </View>
          <Text style={styles.taskLocation}><MaterialIcons name="location-on" size={12} /> {item.setor}</Text>
        </View>
        <Text style={styles.taskTitle}>{item.descricao}</Text>
        <Text style={styles.taskTag}>TAG: {item.tag}</Text>
        <TouchableOpacity style={styles.btnIniciar} onPress={() => Alert.alert("Em Breve", "A execução da preventiva será implementada.")}>
          <MaterialIcons name="play-arrow" size={20} color="white" />
          <Text style={styles.btnIniciarText}>INICIAR O.S.</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Preventivas</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.equipamento_id + item.plano_id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <View style={styles.kpiContainer}>
                <KpiCard title="Atrasadas" value={kpis.atrasadas || 0} color={COLORS.danger} isActive={activeKpiFilter === 'Atrasada'} onPress={() => toggleKpiFilter('Atrasada')} />
                <KpiCard title="Este Mês" value={kpis.esteMes || 0} color={COLORS.warning} isActive={activeKpiFilter === 'Este Mês'} onPress={() => toggleKpiFilter('Este Mês')} />
                <KpiCard title="Próx. Mês" value={kpis.proximoMes || 0} color={COLORS.info} isActive={activeKpiFilter === 'Proximo Mês'} onPress={() => toggleKpiFilter('Proximo Mês')} />
              </View>
              <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={COLORS.subtext} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar por TAG ou descrição..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="check-circle-outline" size={60} color="#DDD" />
              <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  backButton: { position: 'absolute', left: 20, top: 52, zIndex: 1 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  listContent: { padding: 16, paddingBottom: 100 },
  kpiContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16, gap: 10 },
  kpiCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2, borderBottomWidth: 4 },
  kpiActive: { backgroundColor: '#E6F4FE', transform: [{ scale: 1.05 }] },
  kpiValue: { fontSize: 24, fontWeight: 'bold' },
  kpiTitle: { fontSize: 11, color: COLORS.subtext, fontWeight: '600', textTransform: 'uppercase', marginTop: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 12, marginBottom: 16, elevation: 1 },
  searchInput: { flex: 1, height: 45, marginLeft: 8, fontSize: 16 },
  taskCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, borderLeftWidth: 5 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  taskLocation: { fontSize: 12, color: COLORS.subtext, fontWeight: '600' },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginVertical: 8 },
  taskTag: { fontSize: 13, color: COLORS.subtext, backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  btnIniciar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.success, borderRadius: 10, paddingVertical: 10, marginTop: 16 },
  btnIniciarText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#AAA', marginTop: 16 },
});

