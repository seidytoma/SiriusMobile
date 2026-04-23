import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { SiriusApi } from '../../src/services/SiriusApi';

const COLORS = {
  primary: '#003366', background: '#F2F2F7', card: '#FFFFFF',
  text: '#1C1C1E', subtext: '#666666',
  danger: '#D32F2F', warning: '#F57C00', success: '#34C759', info: '#007AFF',
  dark: '#343a40',
};

const modules = [
  { key: 'chamados', title: 'Meus Chamados', subtitle: 'Atendimento e escalonamento', icon: 'headset-mic', color: COLORS.primary, kpiKey: 'chamados' },
  { key: 'corretivas', title: 'Abrir Corretiva', subtitle: 'Abertura rápida de O.S.', icon: 'build', color: COLORS.danger, kpiKey: 'corretivas' },
  { key: 'erroOperacao', title: 'Erro de Operação', subtitle: 'Apoio e orientação ao usuário', icon: 'support-agent', color: COLORS.warning, kpiKey: 'erros' },
  { key: 'preventivas', title: 'Minhas Preventivas', subtitle: 'Acompanhamento e execução', icon: 'favorite', color: COLORS.success, kpiKey: 'preventivas' },
  { key: 'rotas', title: 'Rotas de Inspeção', subtitle: 'Acompanhamento do mês', icon: 'route', color: COLORS.info, kpiKey: 'rotas' },
  { key: 'jornada', title: 'Minha Jornada', subtitle: 'Apontamento de folgas e atestados', icon: 'event-available', color: COLORS.dark, kpiKey: null },
  { key: 'oticas', title: 'CQ de Óticas', subtitle: 'Laudo de qualidade', icon: 'science', color: '#6f42c1', kpiKey: null },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user: currentUser, signOut } = useAuth();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [kpis, setKpis] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    signOut();
  };

  const loadKpis = async () => {
    setRefreshing(true);
    const response = await SiriusApi.getHomeKPIs();
    if (response.success) {
      setKpis(response.data);
    } else {
      // Lidar com erro silenciosamente
      console.log("Erro ao buscar KPIs:", response.error);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadKpis();
    }, [])
  );

  const handleNavigation = (key: string) => {
    if (key === 'chamados') {
      router.push('/(tabs)/chamados/list');
    } else if (key === 'preventivas') {
      router.push('/(tabs)/preventivas/list');
    } else if (key === 'erroOperacao') {
      router.push('/(tabs)/erros/create');
    } else if (key === 'corretivas') {
      router.push('/(tabs)/corretivas/create');
    } else {
      Alert.alert("Em Breve", `O módulo "${key}" está em desenvolvimento.`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.headerTitle}>Sirius Mobile</Text>
          <Text style={styles.headerSubtitle}>
            Olá, {currentUser?.name || 'Técnico'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.btnHeader}
          onPress={() => setLogoutModalVisible(true)}
        >
          <MaterialIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadKpis} colors={[COLORS.primary]} />
        }
      >
        <Text style={styles.mainTitle}>Operações em Campo</Text>
        {modules.map(item => (
          <ActionCard 
            key={item.key}
            item={item}
            kpi={item.kpiKey && kpis ? kpis[item.kpiKey] : null}
            onPress={() => handleNavigation(item.key)}
          />
        ))}
      </ScrollView>
      
      <Modal 
        visible={logoutModalVisible} 
        transparent 
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContainer}>
            <View style={styles.logoutIconContainer}>
              <MaterialIcons name="logout" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.logoutTitle}>Sair do Sirius</Text>
            <Text style={styles.logoutMessage}>Deseja realmente desconectar sua conta?</Text>
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
}

const ActionCard = ({ item, kpi, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconWrapper, { backgroundColor: `${item.color}20` }]}>
      <MaterialIcons name={item.icon} size={24} color={item.color} />
    </View>
    <View style={styles.textWrapper}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
    </View>
    <View style={styles.kpiWrapper}>
      {kpi !== null && (
        <View style={styles.kpiBadge}>
          {kpi === undefined ? <ActivityIndicator size="small" color="#888" /> : <Text style={styles.kpiText}>{kpi}</Text>}
        </View>
      )}
      <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  btnHeader: { padding: 8 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 24 },
  mainTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.subtext, textTransform: 'uppercase', marginBottom: 16, letterSpacing: 0.5 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: 12, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  iconWrapper: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  textWrapper: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  cardSubtitle: { fontSize: 13, color: COLORS.subtext, marginTop: 2 },
  kpiWrapper: { flexDirection: 'row', alignItems: 'center' },
  kpiBadge: { backgroundColor: '#EFEFF4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8 },
  kpiText: { fontSize: 12, fontWeight: 'bold', color: COLORS.subtext },
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
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  logoutIconContainer: {
    backgroundColor: '#E6F4FE',
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
    marginBottom: 20,
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
    backgroundColor: COLORS.danger,
    elevation: 2
  },
  btnConfirmLogoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});
