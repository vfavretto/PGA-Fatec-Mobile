import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Project {
  id: string;
  titulo: string;
  descricao: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  dataInicio: string;
  dataFim: string;
  responsavel: string;
  progresso: number;
}

const ProjectsScreen = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Pendente' | 'Em Andamento' | 'Concluído'>('Todos');

  const loadProjects = async () => {
    try {
      // Simular carregamento de projetos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProjects: Project[] = [
        {
          id: '1',
          titulo: 'Implementação de Sistema de Gestão',
          descricao: 'Desenvolvimento e implementação de novo sistema de gestão acadêmica',
          status: 'Em Andamento',
          dataInicio: '2025-01-15',
          dataFim: '2025-06-30',
          responsavel: 'João Silva',
          progresso: 65,
        },
        {
          id: '2',
          titulo: 'Modernização da Infraestrutura',
          descricao: 'Atualização da infraestrutura de TI da unidade',
          status: 'Pendente',
          dataInicio: '2025-03-01',
          dataFim: '2025-08-15',
          responsavel: 'Maria Santos',
          progresso: 0,
        },
        {
          id: '3',
          titulo: 'Programa de Capacitação Docente',
          descricao: 'Curso de capacitação para novos métodos de ensino',
          status: 'Concluído',
          dataInicio: '2024-08-01',
          dataFim: '2024-12-20',
          responsavel: 'Pedro Costa',
          progresso: 100,
        },
        {
          id: '4',
          titulo: 'Expansão do Laboratório',
          descricao: 'Ampliação dos laboratórios de informática',
          status: 'Em Andamento',
          dataInicio: '2025-02-01',
          dataFim: '2025-05-30',
          responsavel: 'Ana Rodrigues',
          progresso: 30,
        },
      ];
      
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os projetos');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchText, filterStatus, projects]);

  const filterProjects = () => {
    let filtered = projects;

    // Filtrar por texto de busca
    if (searchText) {
      filtered = filtered.filter(project => 
        project.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
        project.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
        project.responsavel.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtrar por status
    if (filterStatus !== 'Todos') {
      filtered = filtered.filter(project => project.status === filterStatus);
    }

    setFilteredProjects(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProjects();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return '#FF9500';
      case 'Em Andamento':
        return '#007AFF';
      case 'Concluído':
        return '#34C759';
      default:
        return '#666666';
    }
  };

  const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'Pendente':
        return 'time-outline';
      case 'Em Andamento':
        return 'play-circle-outline';
      case 'Concluído':
        return 'checkmark-circle-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.projectCard}
      onPress={() => Alert.alert('Projeto', `Detalhes do projeto: ${item.titulo}`)}
    >
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle} numberOfLines={2}>
          {item.titulo}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={16} 
            color="#ffffff" 
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.projectDescription} numberOfLines={2}>
        {item.descricao}
      </Text>

      <View style={styles.projectDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#666666" />
          <Text style={styles.detailText}>{item.responsavel}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666666" />
          <Text style={styles.detailText}>
            {formatDate(item.dataInicio)} - {formatDate(item.dataFim)}
          </Text>
        </View>
      </View>

      {item.status !== 'Pendente' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressPercentage}>{item.progresso}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${item.progresso}%`,
                  backgroundColor: getStatusColor(item.status)
                }
              ]} 
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const FilterButton = ({ 
    title, 
    isActive, 
    onPress 
  }: { 
    title: string; 
    isActive: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando projetos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar projetos..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999999"
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#666666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filtros de status */}
      <View style={styles.filtersContainer}>
        <FilterButton
          title="Todos"
          isActive={filterStatus === 'Todos'}
          onPress={() => setFilterStatus('Todos')}
        />
        <FilterButton
          title="Pendente"
          isActive={filterStatus === 'Pendente'}
          onPress={() => setFilterStatus('Pendente')}
        />
        <FilterButton
          title="Em Andamento"
          isActive={filterStatus === 'Em Andamento'}
          onPress={() => setFilterStatus('Em Andamento')}
        />
        <FilterButton
          title="Concluído"
          isActive={filterStatus === 'Concluído'}
          onPress={() => setFilterStatus('Concluído')}
        />
      </View>

      {/* Lista de projetos */}
      <FlatList
        data={filteredProjects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-outline" size={64} color="#cccccc" />
            <Text style={styles.emptyText}>Nenhum projeto encontrado</Text>
            <Text style={styles.emptySubtext}>
              {searchText || filterStatus !== 'Todos' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Você ainda não possui projetos cadastrados'
              }
            </Text>
          </View>
        }
      />

      {/* Botão de adicionar projeto */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => Alert.alert('Novo Projeto', 'Funcionalidade em desenvolvimento')}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
  },
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  projectDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ProjectsScreen;
