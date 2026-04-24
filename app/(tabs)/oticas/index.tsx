import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SiriusApi } from '../../../src/services/SiriusApi';

const COLORS = { primary: '#003366', background: '#F2F2F7', card: '#FFFFFF', text: '#1C1C1E', accent: '#6f42c1' };

export default function OticasScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [serial, setSerial] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CQ de Óticas</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Número de Série</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: SN123456" 
            value={serial} 
            onChangeText={setSerial}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.btnAction}>
            <Text style={styles.btnText}>Iniciar Laudo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 4 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  btnBack: { padding: 8 },
  content: { padding: 20 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, elevation: 2 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 12, marginBottom: 20 },
  btnAction: { backgroundColor: COLORS.accent, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
