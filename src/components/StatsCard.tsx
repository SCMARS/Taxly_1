import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  size?: 'small' | 'medium' | 'large';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  size = 'medium'
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          icon: styles.iconSmall,
          title: styles.titleSmall,
          value: styles.valueSmall,
          subtitle: styles.subtitleSmall,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          icon: styles.iconLarge,
          title: styles.titleLarge,
          value: styles.valueLarge,
          subtitle: styles.subtitleLarge,
        };
      default:
        return {
          container: styles.containerMedium,
          icon: styles.iconMedium,
          title: styles.titleMedium,
          value: styles.valueMedium,
          subtitle: styles.subtitleMedium,
        };
    }
  };

  const getTrendColor = () => {
    switch (trend?.type) {
      case 'positive': return '#50C878';
      case 'negative': return '#FF6B6B';
      default: return '#999';
    }
  };

  const getTrendIcon = () => {
    switch (trend?.type) {
      case 'positive': return 'trending-up';
      case 'negative': return 'trending-down';
      default: return 'trending-up';
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, sizeStyles.container]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={sizeStyles.icon.fontSize} color={color} />
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Icon 
              name={getTrendIcon()} 
              size={16} 
              color={getTrendColor()} 
            />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trend.value}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, sizeStyles.title]}>{title}</Text>
        <Text style={[styles.value, sizeStyles.value]}>{value}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, sizeStyles.subtitle]}>{subtitle}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#999',
    marginBottom: 8,
  },
  titleSmall: {
    fontSize: 12,
  },
  titleMedium: {
    fontSize: 14,
  },
  titleLarge: {
    fontSize: 16,
  },
  value: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  valueSmall: {
    fontSize: 18,
  },
  valueMedium: {
    fontSize: 20,
  },
  valueLarge: {
    fontSize: 24,
  },
  subtitle: {
    color: '#999',
  },
  subtitleSmall: {
    fontSize: 10,
  },
  subtitleMedium: {
    fontSize: 12,
  },
  subtitleLarge: {
    fontSize: 14,
  },
}); 