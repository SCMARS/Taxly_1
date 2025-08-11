import React from 'react';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#FFFFFF', style }) => {
  // Маппинг названий иконок на соответствующие библиотеки
  const iconMap: { [key: string]: { library: any; name: string } } = {
    // Dashboard icons
    'dashboard': { library: MaterialIcons, name: 'dashboard' },
    'analytics': { library: MaterialIcons, name: 'analytics' },
    'shopping-cart': { library: MaterialIcons, name: 'shopping-cart' },
    'receipt': { library: MaterialIcons, name: 'receipt' },
    'account-balance': { library: MaterialIcons, name: 'account-balance' },
    'settings': { library: MaterialIcons, name: 'settings' },
    'robot': { library: MaterialIcons, name: 'psychology' },
    'store': { library: MaterialIcons, name: 'store' },
    
    // Financial icons
    'trending-up': { library: MaterialIcons, name: 'trending-up' },
    'trending-down': { library: MaterialIcons, name: 'trending-down' },
    'account-balance-wallet': { library: MaterialIcons, name: 'account-balance-wallet' },
    'payment': { library: MaterialIcons, name: 'payment' },
    'credit-card': { library: MaterialIcons, name: 'credit-card' },
    'cash': { library: MaterialIcons, name: 'attach-money' },
    'transfer': { library: MaterialIcons, name: 'swap-horiz' },
    
    // Status icons
    'check-circle': { library: MaterialIcons, name: 'check-circle' },
    'error': { library: MaterialIcons, name: 'error' },
    'warning': { library: MaterialIcons, name: 'warning' },
    'info': { library: MaterialIcons, name: 'info' },
    'pending': { library: MaterialIcons, name: 'schedule' },
    'completed': { library: MaterialIcons, name: 'done' },
    'cancelled': { library: MaterialIcons, name: 'cancel' },
    
    // Action icons
    'add': { library: MaterialIcons, name: 'add' },
    'edit': { library: MaterialIcons, name: 'edit' },
    'delete': { library: MaterialIcons, name: 'delete' },
    'search': { library: MaterialIcons, name: 'search' },
    'filter': { library: MaterialIcons, name: 'filter-list' },
    'download': { library: MaterialIcons, name: 'download' },
    'upload': { library: MaterialIcons, name: 'upload' },
    'sync': { library: MaterialIcons, name: 'sync' },
    'refresh': { library: MaterialIcons, name: 'refresh' },
    
    // Navigation icons
    'arrow-back': { library: MaterialIcons, name: 'arrow-back' },
    'arrow-forward': { library: MaterialIcons, name: 'arrow-forward' },
    'menu': { library: MaterialIcons, name: 'menu' },
    'close': { library: MaterialIcons, name: 'close' },
    'more-vert': { library: MaterialIcons, name: 'more-vert' },
    'logout': { library: MaterialIcons, name: 'logout' },
    
    // Business icons
    'business': { library: MaterialIcons, name: 'business' },
    'storefront': { library: MaterialIcons, name: 'storefront' },
    'inventory': { library: MaterialIcons, name: 'inventory' },
    'shopping-bag': { library: MaterialIcons, name: 'shopping-bag' },
    'local-shipping': { library: MaterialIcons, name: 'local-shipping' },
    'local-offer': { library: MaterialIcons, name: 'local-offer' },
    'verified': { library: MaterialIcons, name: 'verified' },
    'event': { library: MaterialIcons, name: 'event' },
    'vpn-key': { library: MaterialIcons, name: 'vpn-key' },
    'person': { library: MaterialIcons, name: 'person' },
    'lock': { library: MaterialIcons, name: 'lock' },
    
    // Additional icons
    'history': { library: MaterialIcons, name: 'history' },
    'dark-mode': { library: MaterialIcons, name: 'dark-mode' },
    'language': { library: MaterialIcons, name: 'language' },
    'security': { library: MaterialIcons, name: 'security' },
    'backup': { library: MaterialIcons, name: 'backup' },
    'delete-forever': { library: MaterialIcons, name: 'delete-forever' },
    'update': { library: MaterialIcons, name: 'update' },
    'visibility': { library: MaterialIcons, name: 'visibility' },
    'visibility-off': { library: MaterialIcons, name: 'visibility-off' },
    
    // Document icons
    'description': { library: MaterialIcons, name: 'description' },
    'picture-as-pdf': { library: MaterialIcons, name: 'picture-as-pdf' },
    'image': { library: MaterialIcons, name: 'image' },
    'folder': { library: MaterialIcons, name: 'folder' },
    'attach-file': { library: MaterialIcons, name: 'attach-file' },
    
    // Notification icons
    'notifications': { library: MaterialIcons, name: 'notifications' },
    'notifications-none': { library: MaterialIcons, name: 'notifications-none' },
    'email': { library: MaterialIcons, name: 'email' },
    'phone': { library: MaterialIcons, name: 'phone' },
    
    // Chart icons
    'bar-chart': { library: MaterialIcons, name: 'bar-chart' },
    'pie-chart': { library: MaterialIcons, name: 'pie-chart' },
    'show-chart': { library: MaterialIcons, name: 'show-chart' },
    'timeline': { library: MaterialIcons, name: 'timeline' },
    
    // Default fallback
    'default': { library: MaterialIcons, name: 'help' },
  };

  const iconConfig = iconMap[name] || iconMap['default'];
  const IconComponent = iconConfig.library;

  return (
    <IconComponent
      name={iconConfig.name as any}
      size={size}
      color={color}
      style={style}
    />
  );
}; 