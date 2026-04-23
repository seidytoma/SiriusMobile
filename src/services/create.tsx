import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SiriusApi } from '../../../src/services/SiriusApi';

const COLORS = {
  primary: '#003366', background: '#F2F2F7', card: '#FFFFFF',
  text: '#1C1C1E', subtext: '#666666', info: '#0DCAF0',
};

export default function HelioScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rms, setRms] = useState<any[]>([]);
  const [selectedRm, setSelectedRm] = useState('');
  
  const [dataMedicao, setDataMedicao] = useState(new Date().toISOString().split('T')[0]);
  const [nivel, setNivel] = useState('');
  const [tipoEvento, setTipoEvento] = useState('Leitura');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    async function loadRMs() {
      const response = await SiriusApi.getRMsParaHelio();
      setIsLoading(false);
      if (response.success) {
        setRms(response.data);
      } else {
        Alert.alert('Erro', response.error || 'Falha ao buscar equipamentos de RM.');
      }
    }
    loadRMs();
  }, []);

  const handleSubmit = async () => {
    if (!selectedRm) return Alert.alert("Atenção", "Selecione o equipamento.");
    if (!dataMedicao) return Alert.alert("Atenção", "Preencha a data da medição.");
    
    const nivelNum = parseFloat(nivel.replace(',', '.'));
    if (isNaN(nivelNum) || nivelNum < 0 || nivelNum > 100) {
      return Alert.alert("Valor Inválido", "O nível percentual deve estar entre 0 e 100.");
    }

    setIsSubmitting(true);
    
    // Alinhamento de data para a tabela Desktop (mesma lógica do web)
    const [year, month, day] = dataMedicao.split('-');
    const dataEscolhida = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0));
    const diaSemana = dataEscolhida.getUTCDay();
    const dataDomingo = new Date(dataEscolhida);
    dataDomingo.setUTCDate(dataEscolhida.getUTCDate() - diaSemana);
    dataDomingo.setUTCHours(0, 0, 0, 0);

    const payload = [{
      equipamento_id: selectedRm,
      helio_data_medicao: dataDomingo.toISOString(),
      helio_nivel_percentual: nivelNum,
      helio_tipo_evento: tipoEvento,
      helio_observacao: observacao
    }];

    const response = await SiriusApi.saveHelioReadings(payload);
    setIsSubmitting(false);

    if (response.success) {
      Alert.alert("Salvo!", "Nível de hélio registrado com sucesso.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } else {
      Alert.alert("Erro", response.error || "Não foi possível salvar o apontamento.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nível de Hélio (RM)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: COLORS.info }]}>
          
          <Text style={styles.label}>Equipamento</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedRm}
              onValueChange={(itemValue) => setSelectedRm(itemValue)}
              style={styles.picker}
            >
              {isLoading ? (
                  <Picker.Item label="Carregando equipamentos..." value="" />
              ) : (
                  <>
                      <Picker.Item label="Selecione a ressonância magnética..." value="" />
                      {rms.map(rm => (
                        <Picker.Item key={rm.id} label={rm.nome} value={rm.id} />
                      ))}
                  </>
              )}
            </Picker>
          </View>

          <Text style={styles.label}>Data da Medição (YYYY-MM-DD)</Text>
          <TextInput
            style={[styles.input, { color: COLORS.primary, fontWeight: 'bold' }]}
            value={dataMedicao}
            onChangeText={setDataMedicao}
            placeholder="Ex: 2026-10-15"
          />

          <Text style={styles.label}>Nível Atual (%)</Text>
          <View style={styles.nivelContainer}>
            <TextInput
              style={styles.nivelInput}
              value={nivel}
              onChangeText={setNivel}
              keyboardType="decimal-pad"
              placeholder="Ex: 55.4"
            />
            <View style={styles.percentSymbol}>
              <Text style={{fontWeight: 'bold', color: COLORS.subtext, fontSize: 18}}>%</Text>
            </View>
          </View>

          <Text style={styles.label}>Tipo de Evento</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoEvento}
              onValueChange={(itemValue) => setTipoEvento(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Leitura de Rotina" value="Leitura" />
              <Picker.Item label="Reabastecimento" value="Reabastecimento" />
            </Picker>
          </View>

          <Text style={styles.label}>Observações (Opcional)</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            multiline
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Detalhes da medição..."
          />

          <TouchableOpacity style={styles.buttonSubmit} onPress={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.buttonSubmitText}><MaterialIcons name="save" size={18} color="white"/> Salvar Apontamento</Text>}
          </TouchableOpacity>
        </View>
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
  label: { fontSize: 12, fontWeight: 'bold', color: COLORS.subtext, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: COLORS.background, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 16 },
  pickerContainer: { backgroundColor: COLORS.background, borderRadius: 10, marginBottom: 16, justifyContent: 'center' },
  picker: { height: 50, ...(Platform.OS === 'ios' && { color: COLORS.text, fontSize: 16 }) },
  nivelContainer: { flexDirection: 'row', marginBottom: 16, backgroundColor: COLORS.background, borderRadius: 10, overflow: 'hidden' },
  nivelInput: { flex: 1, padding: 12, fontSize: 20, fontWeight: 'bold', color: COLORS.danger },
  percentSymbol: { backgroundColor: '#E0E0E0', justifyContent: 'center', paddingHorizontal: 16 },
  buttonSubmit: { backgroundColor: COLORS.info, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16, flexDirection: 'row', justifyContent: 'center' },
  buttonSubmitText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});
