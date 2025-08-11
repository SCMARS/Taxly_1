import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/auth';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const initializeAuth = async () => {
      try {
        // Проверяем текущее состояние аутентификации при запуске
        unsubscribe = await AuthService.onAuthStateChanged((user) => {
          setIsAuthenticated(!!user);
          setIsLoading(false);
          setAuthError(null);
        });
      } catch (error) {
        console.error('Ошибка инициализации аутентификации:', error);
        setAuthError('Ошибка инициализации аутентификации');
        setIsLoading(false);
      }
    };

    // Небольшая задержка для полной инициализации React Native
    const timer = setTimeout(() => {
      initializeAuth();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      setAuthError('Ошибка при выходе');
    }
  };

  if (isLoading) {
    // Экран загрузки
    return null;
  }

  if (authError) {
    // Экран ошибки аутентификации
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App">
            {() => <AppStack onLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {() => <AuthStack onLogin={handleLogin} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 