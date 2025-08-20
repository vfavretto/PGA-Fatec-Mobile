import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Screens
import LoginScreen from '@screens/auth/LoginScreen';
import HomeScreen from '@screens/dashboard/HomeScreen';
import ProjectsScreen from '@screens/projects/ProjectsScreen';
import SettingsScreen from '@screens/settings/SettingsScreen';

// Icons
import { Ionicons } from '@expo/vector-icons';

// Stack Navigator para navegação principal
const Stack = createNativeStackNavigator();
// Tab Navigator para navegação inferior
const Tab = createBottomTabNavigator();

// Navegação autenticada com tabs
const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Projetos') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Configurações') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={HomeScreen}
        options={{ headerTitle: 'PGA - Dashboard' }}
      />
      <Tab.Screen 
        name="Projetos" 
        component={ProjectsScreen}
        options={{ headerTitle: 'Projetos' }}
      />
      <Tab.Screen 
        name="Configurações" 
        component={SettingsScreen}
        options={{ headerTitle: 'Configurações' }}
      />
    </Tab.Navigator>
  );
};

// Componente de loading
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

// Navegador principal da aplicação
export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={AuthenticatedTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
