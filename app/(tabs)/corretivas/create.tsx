import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/context/AuthContext';
import { SiriusApi } from '../../../src/services/SiriusApi';

const COLORS = {
  primary: '#003366', background: '#F2F2F7', card: '#FFFFFF',
  text: '#1C1C1E', subtext: '#666666', danger: '#D32F2F',
};

export default function CorretivaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [equipamento, setEquipamento] = useState<any>(null);
  const [falhas, setFalhas] = useState<any[]>([]);
  const [selectedFalha, setSelectedFalha] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    async function loadFalhas() {
      const falhasList = await SiriusApi.getFalhas();
      setFalhas(falhasList);
    }
    loadFalhas();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return Alert.alert("Atenção", "Digite a TAG ou Série do equipamento.");
    }
    setIsLoading(true);
    const response = await SiriusApi.findEquipamento(searchTerm);
    setIsLoading(false);

    if (response.success) {
      setEquipamento(response.data);
      setStep(2);
    } else {
      Alert.alert("Erro", response.message || response.error || "Equipamento não encontrado.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFalha || !descricao.trim()) {
      return Alert.alert("Atenção", "Selecione a falha e preencha a descrição.");
    }

    setIsSubmitting(true);
    const corretivaData = {
      equipamento_id: equipamento.equipamento_id,
      falha_id: selectedFalha,
      corretiva_descricao: descricao,
      usuario_id: user?.id,
      cc_id: equipamento.cc_id,
      corretiva_planejada: 'Não',
      corretiva_contratada: 'Não',
      statuscorretiva_id: '1' // Aberta
    };

    const response = await SiriusApi.saveCorretiva(corretivaData);
    setIsSubmitting(false);

    if (response.success) {
      Alert.alert("Sucesso", "Ordem de Serviço Corretiva aberta!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } else {
      Alert.alert("Falha ao Salvar", response.error || "Ocorreu um erro no servidor.");
    }
  };

  const resetState = () => {
    setStep(1);
    setSearchTerm('');
    setEquipamento(null);
    setDescricao('');
    setSelectedFalha('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => step === 1 ? router.back() : resetState()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abrir Corretiva</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.label}>TAG ou Nº de Série do Equipamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: EQ-1024"
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="characters"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Buscar</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.equipInfoCard}>
              <MaterialIcons name="build" size={24} color={COLORS.danger} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.equipTitle} numberOfLines={2}>{equipamento?.equipamento_descricaocompleta}</Text>
                <Text style={styles.equipTag}>TAG: {equipamento?.equipamento_tag}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Falha (Sintoma)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedFalha}
                  onValueChange={(itemValue) => setSelectedFalha(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione o problema..." value="" />
                  {falhas.map(falha => (
                    <Picker.Item key={falha.id} label={falha.text} value={falha.id} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Descrição Detalhada do Problema</Text>
              <TextInput
                style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                multiline
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva o que está acontecendo com o equipamento..."
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Gerar O.S.</Text>}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  backButton: { position: 'absolute', left: 20, top: 52, zIndex: 1 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  scrollContent: { padding: 20 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.subtext, marginBottom: 8 },
  input: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: COLORS.danger, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  equipInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${COLORS.danger}20`, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: `${COLORS.danger}50` },
  equipTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  equipTag: { fontSize: 13, color: COLORS.subtext, marginTop: 4 },
  pickerContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginBottom: 16,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    // No Android, o estilo é limitado. No iOS, podemos ser mais flexíveis.
    ...(Platform.OS === 'ios' && {
      color: COLORS.text,
      fontSize: 16,
    }),
  },
});
