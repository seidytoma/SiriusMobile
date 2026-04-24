import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SiriusApi } from '../../../src/services/SiriusApi';

const COLORS = { primary: '#003366', background: '#F2F2F7', card: '#FFFFFF', text: '#1C1C1E', danger: '#D32F2F' };

export default function CriarErroScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!descricao.trim()) {
      Alert.alert('Aviso', 'Por favor, descreva o erro de operação.');
      return;
    }

    setLoading(true);
    const response = await SiriusApi.saveErroOperacao({ descricao });
    setLoading(false);

    if (response && response.success !== false) {
      Alert.alert('Sucesso', 'Erro de operação registado com sucesso.');
      router.back();
    } else {
      Alert.alert('Erro', response?.error || 'Não foi possível guardar.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registar Erro</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Descrição do Incidente</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="Descreva o que aconteceu..."
            multiline
            numberOfLines={4}
            value={descricao}
            onChangeText={setDescricao}
          />
          <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Gravar Registo</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  btnBack: { padding: 8 },
  card: { backgroundColor: COLORS.card, padding: 20, borderRadius: 16, elevation: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  inputArea: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 12, height: 120, textAlignVertical: 'top', marginBottom: 20 },
  button: { backgroundColor: COLORS.danger, padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
