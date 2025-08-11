import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';

interface MetricCardProps {
  icon: string;
  value: string;
  label: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  change,
  changeType = 'neutral',
  color = '#4A90E2',
  size = 'medium'
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return '#50C878';
      case 'negative': return '#FF6B6B';
      default: return '#999';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return 'trending-up';
      case 'negative': return 'trending-down';
      default: return 'trending-up';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          icon: styles.iconSmall,
          value: styles.valueSmall,
          label: styles.labelSmall,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          icon: styles.iconLarge,
          value: styles.valueLarge,
          label: styles.labelLarge,
        };
      default:
        return {
          container: styles.containerMedium,
          icon: styles.iconMedium,
          value: styles.valueMedium,
          label: styles.labelMedium,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, sizeStyles.container]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={sizeStyles.icon.fontSize} color={color} />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.value, sizeStyles.value]}>{value}</Text>
        <Text style={[styles.label, sizeStyles.label]}>{label}</Text>
        
        {change && (
          <View style={styles.changeContainer}>
            <Icon 
              name={getChangeIcon()} 
              size={16} 
              color={getChangeColor()} 
            />
            <Text style={[styles.changeText, { color: getChangeColor() }]}>
              {change}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerSmall: {
    padding: 12,
  },
  containerMedium: {
    padding: 16,
  },
  containerLarge: {
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconSmall: {
    fontSize: 20,
  },
  iconMedium: {
    fontSize: 24,
  },
  iconLarge: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  value: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  valueSmall: {
    fontSize: 16,
  },
  valueMedium: {
    fontSize: 18,
  },
  valueLarge: {
    fontSize: 24,
  },
  label: {
    color: '#999',
    marginBottom: 8,
  },
  labelSmall: {
    fontSize: 12,
  },
  labelMedium: {
    fontSize: 14,
  },
  labelLarge: {
    fontSize: 16,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
}); 