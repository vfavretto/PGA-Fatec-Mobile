import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { useAuth } from '@context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair do sistema?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Suporte',
      'Entre em contato conosco:',
      [
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:suporte@pga.fatec.sp.gov.br'),
        },
        {
          text: 'Telefone',
          onPress: () => Linking.openURL('tel:+551140028300'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Sobre o PGA Mobile',
      'Sistema de Plano de Gestão Anual\nFATEC - Centro Paula Souza\n\nVersão 1.0.0\n\nDesenvolvido para facilitar o acesso e gestão dos projetos do PGA através de dispositivos móveis.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Política de Privacidade',
      'Em desenvolvimento. Por favor, consulte o portal oficial da FATEC para mais informações sobre nossa política de privacidade.',
      [{ text: 'OK' }]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    showArrow = true,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color="#999999" />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Perfil do usuário */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#ffffff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userId}>ID: {user?.pessoa_id}</Text>
          </View>
        </View>
      </View>

      {/* Configurações de conta */}
      <SectionHeader title="Conta" />
      <View style={styles.section}>
        <SettingItem
          icon="person-outline"
          title="Editar Perfil"
          subtitle="Alterar informações pessoais"
          onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em desenvolvimento')}
        />
        <SettingItem
          icon="key-outline"
          title="Alterar Senha"
          subtitle="Modificar senha de acesso"
          onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em desenvolvimento')}
        />
      </View>

      {/* Configurações de notificações */}
      <SectionHeader title="Notificações" />
      <View style={styles.section}>
        <SettingItem
          icon="notifications-outline"
          title="Notificações Push"
          subtitle="Receber notificações do sistema"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#f4f3f4', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            />
          }
          showArrow={false}
        />
        <SettingItem
          icon="sync-outline"
          title="Sincronização Automática"
          subtitle="Sincronizar dados automaticamente"
          rightElement={
            <Switch
              value={autoSyncEnabled}
              onValueChange={setAutoSyncEnabled}
              trackColor={{ false: '#f4f3f4', true: '#007AFF' }}
              thumbColor={autoSyncEnabled ? '#ffffff' : '#f4f3f4'}
            />
          }
          showArrow={false}
        />
      </View>

      {/* Configurações de aparência */}
      <SectionHeader title="Aparência" />
      <View style={styles.section}>
        <SettingItem
          icon="moon-outline"
          title="Modo Escuro"
          subtitle="Ativar tema escuro"
          rightElement={
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#f4f3f4', true: '#007AFF' }}
              thumbColor={darkModeEnabled ? '#ffffff' : '#f4f3f4'}
            />
          }
          showArrow={false}
        />
      </View>

      {/* Dados e armazenamento */}
      <SectionHeader title="Dados" />
      <View style={styles.section}>
        <SettingItem
          icon="download-outline"
          title="Sincronizar Dados"
          subtitle="Atualizar informações do servidor"
          onPress={() => Alert.alert('Sincronização', 'Dados sincronizados com sucesso!')}
        />
        <SettingItem
          icon="trash-outline"
          title="Limpar Cache"
          subtitle="Limpar dados temporários"
          onPress={() => 
            Alert.alert(
              'Limpar Cache',
              'Tem certeza que deseja limpar o cache do aplicativo?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Limpar', onPress: () => Alert.alert('Cache limpo', 'Cache do aplicativo foi limpo com sucesso!') }
              ]
            )
          }
        />
      </View>

      {/* Suporte e informações */}
      <SectionHeader title="Suporte" />
      <View style={styles.section}>
        <SettingItem
          icon="help-circle-outline"
          title="Central de Ajuda"
          subtitle="Perguntas frequentes e tutoriais"
          onPress={() => Alert.alert('Em desenvolvimento', 'Central de ajuda em desenvolvimento')}
        />
        <SettingItem
          icon="mail-outline"
          title="Contatar Suporte"
          subtitle="Enviar mensagem para nossa equipe"
          onPress={handleContactSupport}
        />
        <SettingItem
          icon="bug-outline"
          title="Reportar Problema"
          subtitle="Informar bugs ou sugestões"
          onPress={() => Linking.openURL('mailto:suporte@pga.fatec.sp.gov.br?subject=Problema no PGA Mobile')}
        />
      </View>

      {/* Informações legais */}
      <SectionHeader title="Legal" />
      <View style={styles.section}>
        <SettingItem
          icon="document-text-outline"
          title="Política de Privacidade"
          subtitle="Como tratamos seus dados"
          onPress={handlePrivacyPolicy}
        />
        <SettingItem
          icon="information-circle-outline"
          title="Sobre"
          subtitle="Informações do aplicativo"
          onPress={handleAbout}
        />
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Sair do Sistema</Text>
        </TouchableOpacity>
      </View>

      {/* Versão do app */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>PGA Mobile v1.0.0</Text>
        <Text style={styles.versionSubtext}>FATEC - Centro Paula Souza</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 2,
  },
  userId: {
    fontSize: 14,
    color: '#999999',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textTransform: 'uppercase',
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 20,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#cccccc',
  },
});

export default SettingsScreen;
