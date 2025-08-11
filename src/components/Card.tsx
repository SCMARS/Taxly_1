import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  onPress, 
  variant = 'default',
  padding = 'medium' 
}) => {
  const theme = useTheme();
  
  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[`padding_${padding}`]];
    
    switch (variant) {
      case 'elevated':
        return [...baseStyle, styles.elevated, { backgroundColor: theme.colors.surface }];
      case 'outlined':
        return [...baseStyle, styles.outlined, { borderColor: theme.colors.outline }];
      default:
        return [...baseStyle, styles.default, { backgroundColor: theme.colors.surface }];
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity 
        style={getCardStyle()} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginVertical: 8,
  },
  padding_small: {
    padding: 12,
  },
  padding_medium: {
    padding: 16,
  },
  padding_large: {
    padding: 20,
  },
  default: {
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
  },
}); 