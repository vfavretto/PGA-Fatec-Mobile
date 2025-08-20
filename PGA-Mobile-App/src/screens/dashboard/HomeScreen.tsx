import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface StatsData {
  totalProjetos: number;
  projetosPendentes: number;
  projetosCompletos: number;
  proximosVencimentos: number;
}

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<StatsData>({
    totalProjetos: 0,
    projetosPendentes: 0,
    projetosCompletos: 0,
    proximosVencimentos: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // Simular dados do dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalProjetos: 12,
        projetosPendentes: 5,
        projetosCompletos: 7,
        proximosVencimentos: 3,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

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

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color 
  }: { 
    title: string; 
    value: number; 
    icon: keyof typeof Ionicons.glyphMap; 
    color: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardLeft}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={[styles.statIconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="#ffffff" />
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header com informações do usuário */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Bem-vindo,</Text>
          <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ae0f0a" />
        </TouchableOpacity>
      </View>

      {/* Cards de estatísticas */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        
        <StatCard
          title="Total de Projetos"
          value={stats.totalProjetos}
          icon="folder"
          color="#007AFF"
        />
        
        <StatCard
          title="Projetos Pendentes"
          value={stats.projetosPendentes}
          icon="time"
          color="#FF9500"
        />
        
        <StatCard
          title="Projetos Completos"
          value={stats.projetosCompletos}
          icon="checkmark-circle"
          color="#34C759"
        />
        
        <StatCard
          title="Próximos Vencimentos"
          value={stats.proximosVencimentos}
          icon="warning"
          color="#FF3B30"
        />
      </View>

      {/* Seção de ações rápidas */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>Novo Projeto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="list" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>Ver Todos os Projetos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>Relatórios</Text>
        </TouchableOpacity>
      </View>

      {/* Informações do sistema */}
      <View style={styles.systemInfoContainer}>
        <Text style={styles.sectionTitle}>Sistema PGA 2025</Text>
        <Text style={styles.systemInfoText}>
          Plano de Gestão Anual - FATEC
        </Text>
        <Text style={styles.versionText}>Versão Mobile 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCardLeft: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
  statTitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    fontWeight: '500',
  },
  systemInfoContainer: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 20,
  },
  systemInfoText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 14,
    color: '#999999',
  },
});

export default HomeScreen;
