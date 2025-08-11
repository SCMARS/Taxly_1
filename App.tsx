import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { RootNavigator } from './src/navigation/RootNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A90E2',
    accent: '#50C878',
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    placeholder: '#999',
    outline: '#333',
  },
  dark: true,
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <RootNavigator />
    </PaperProvider>
  );
} 