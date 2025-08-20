import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useAuth } from '@context/AuthContext';

type ErrorType = "credentials" | "server" | "connection" | "validation" | null;

const LoginScreen = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    senha: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errorType) {
      setErrorType(null);
      setErrorMessage("");
    }
  };

  const validateForm = (): boolean => {
    if (!credentials.email) {
      setErrorType("validation");
      setErrorMessage("Por favor, informe seu email.");
      return false;
    }

    if (!credentials.email.includes("@")) {
      setErrorType("validation");
      setErrorMessage("Por favor, informe um email válido.");
      return false;
    }

    if (!credentials.senha) {
      setErrorType("validation");
      setErrorMessage("Por favor, informe sua senha.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setErrorType(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Tentando fazer login...'); // Debug
      const success = await login(credentials.email, credentials.senha);
      console.log('Login success:', success); // Debug

      if (!success) {
        setErrorType("credentials");
        setErrorMessage(
          "Email ou senha incorretos. Verifique suas credenciais e tente novamente."
        );
      }
    } catch (err: any) {
      console.error('Erro no login:', err); // Debug
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setErrorType("credentials");
          setErrorMessage(
            "Email ou senha incorretos. Verifique suas credenciais e tente novamente."
          );
        } else if (err.response.status >= 500) {
          setErrorType("server");
          setErrorMessage(
            "Erro no servidor. Por favor, tente novamente mais tarde."
          );
        } else {
          setErrorType("server");
          setErrorMessage(
            err.response.data?.message ||
              "Ocorreu um erro durante o login. Tente novamente."
          );
        }
      } else if (err.request) {
        setErrorType("connection");
        setErrorMessage(
          "Não foi possível conectar ao servidor. Verifique sua conexão de internet."
        );
      } else {
        setErrorType("server");
        setErrorMessage(
          "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Recuperação de Senha",
      "Para recuperar sua senha, entre em contato com o administrador do sistema ou envie um email para suporte@pga.fatec.sp.gov.br",
      [{ text: "OK" }]
    );
  };

  const handleRequestAccess = () => {
    Alert.alert(
      "Solicitar Acesso",
      "Para solicitar acesso ao sistema, entre em contato com o administrador da sua unidade ou envie um email para suporte@pga.fatec.sp.gov.br informando:\n\n• Nome completo\n• Email institucional\n• Código da unidade Fatec",
      [{ text: "OK" }]
    );
  };

  const renderErrorMessage = () => {
    if (!errorMessage) return null;

    let backgroundColor = "#fef2f2";
    let textColor = "#991b1b";
    let borderColor = "#fecaca";

    if (errorType === "validation") {
      backgroundColor = "#fffbeb";
      textColor = "#92400e";
      borderColor = "#fed7aa";
    }

    return (
      <View style={[styles.errorContainer, { backgroundColor, borderColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          {errorMessage}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/400x600/1e40af/ffffff?text=FATEC' }}
        style={styles.backgroundImage}
        blurRadius={4}
      >
        <View style={styles.overlay} />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/200x80/ffffff/000000?text=FATEC+LOGO' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>
            Plano de Gestão Anual - PGA 2025
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>
            <Text style={styles.cardSubtitle}>
              Entre com suas credenciais para acessar o sistema.
            </Text>

            {renderErrorMessage()}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    errorType === "validation" && !credentials.email && styles.inputError
                  ]}
                  value={credentials.email}
                  onChangeText={(value) => handleChange('email', value)}
                  placeholder="Digite seu email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={[
                    styles.input,
                    errorType === "validation" && !credentials.senha && styles.inputError
                  ]}
                  value={credentials.senha}
                  onChangeText={(value) => handleChange('senha', value)}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotPasswordText}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRequestAccess}
                style={styles.requestAccessContainer}
              >
                <Text style={styles.requestAccessText}>
                  Solicitar acesso ao sistema
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 200,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 18,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D3748',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#4A5568',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#ae0f0a',
    fontWeight: '500',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#ae0f0a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  requestAccessContainer: {
    alignSelf: 'center',
    marginTop: 16,
  },
  requestAccessText: {
    fontSize: 16,
    color: '#ae0f0a',
    fontWeight: '500',
  },
});

export default LoginScreen;
