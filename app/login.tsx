import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableWithoutFeedback // <--- Importe isso
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInAsDev, user } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Estado para o contador de toques secretos
  const [secretTaps, setSecretTaps] = useState(0); 

  // ... (Mantenha os useEffects de GoogleSignin.configure e redirecionamento iguais) ...
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '200711127791-l65o27hd9khb6l4l2to9nvru3ntj1fs7.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  // ... (Mantenha handleGoogleLoginNative igual) ...
  async function handleGoogleLoginNative() {
    // ... (código existente) ...
    try {
      setIsAuthenticating(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const userData = userInfo?.data?.user;

      if (!userData || !userData.email) throw new Error('Dados do Google inválidos');

      const googleUser = {
        email: userData.email,
        name: userData.name || '',
        picture: userData.photo || '',
        id: userData.id || '',
      };

      const result = await signInWithGoogle(googleUser);

      if (!result.success) {
        Alert.alert('Acesso negado', result.error || 'Usuário não autorizado');
        setIsAuthenticating(false);
      }
    } catch (error: any) {
      if (error?.code !== '12501') {
        console.error('Erro Google Sign-In:', error);
        Alert.alert('Erro', 'Falha ao autenticar com o Google');
      }
      setIsAuthenticating(false);
    }
  }

  async function handleDevLogin() {
    const res = await signInAsDev();
    if (!res.success) {
      Alert.alert('Erro', res.error);
    }
  }

  // Função para contar os toques na logo
  const handleSecretTap = () => {
    setSecretTaps(prev => prev + 1);
    if (secretTaps + 1 === 5) {
       Alert.alert("Modo Dev", "Faltam 2 toques...");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        
        {/* Envolvemos a Logo com TouchableWithoutFeedback para capturar o toque secreto */}
        <TouchableWithoutFeedback onPress={handleSecretTap}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>

        <Text style={styles.title}>Sirius Mobile</Text>
        <Text style={styles.subtitle}>
          Gestão de Engenharia Clínica
        </Text>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[
            styles.btnGoogle,
            isAuthenticating && styles.btnDisabled,
          ]}
          disabled={isAuthenticating}
          onPress={handleGoogleLoginNative}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#003366" />
          ) : (
            <>
              <MaterialIcons
                name="login"
                size={24}
                color="#003366"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.btnText}>
                Entrar com Google HSL
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* SÓ MOSTRA O BOTÃO SE O CONTADOR FOR >= 7 
           Isso esconde o botão de usuários normais
        */}
        {secretTaps >= 7 && (
          <TouchableOpacity
            style={styles.btnDev}
            onPress={handleDevLogin}
            disabled={isAuthenticating}
          >
            <Text style={styles.btnDevText}>
              [DEV] Acesso Bypass Liberado
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>
          Hospital Sírio-Libanês
        </Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // ... (Mantenha os estilos exatamente iguais) ...
  container: {
    flex: 1,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#E6F4FE',
    borderRadius: 50,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  spacer: {
    height: 20,
  },
  btnGoogle: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    elevation: 2,
    marginBottom: 15,
  },
  btnDisabled: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  btnDev: {
    padding: 10,
    marginTop: 10, // Adicionei um margin top para separar caso apareça
  },
  btnDevText: {
    fontSize: 12,
    color: '#D32F2F', // Mudei para vermelho para indicar que é modo debug
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 30,
    color: '#999',
    fontSize: 12,
  },
});