
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  fopGroup: 2 | 3; 
  registrationDate: string;
  lastUpdate: string;
}

// Маркетплейсы
export interface Marketplace {
  id: string;
  name: 'Rozetka' | 'Prom' | 'OLX' | 'Kasta' | 'Amazon';
  type: 'api' | 'manual';
  apiKey?: string;
  isConnected: boolean;
  lastSync?: string;
}

// Заказы/продажи
export interface Order {
  id: string;
  marketplaceId: string;
  orderNumber: string;
  date: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  commission: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'card' | 'cash' | 'transfer';
  notes?: string;
}

// Товары в заказе
export interface OrderItem {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

// Расходы
export interface Expense {
  id: string;
  date: string;
  category: 'advertising' | 'logistics' | 'office' | 'other';
  description: string;
  amount: number;
  receipt?: string; // URL к фото чека
  isTaxDeductible: boolean;
}

// Налоги для ФОП
export interface Tax {
  id: string;
  type: 'esv' | 'single_tax' | 'other';
  period: string; // YYYY-MM
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paymentDate?: string;
  receipt?: string;
}

// Аналитика
export interface Analytics {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  revenue: number;
  expenses: number;
  profit: number;
  ordersCount: number;
  averageOrderValue: number;
  
  // Дополнительные поля для детальной аналитики
  weeklyRevenue: number;
  weeklyOrders: number;
  weeklyProfit: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  monthlyProfit: number;
  yearlyRevenue: number;
  yearlyOrders: number;
  yearlyProfit: number;
  
  // Виручка по маркетплейсах
  revenueByMarketplace: Array<{
    marketplaceId: string;
    revenue: number;
  }>;
  
  // Категорії витрат
  expenseCategories: Array<{
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}

// Топ товаров
export interface TopProduct {
  id: string;
  name: string;
  totalSales: number;
  totalRevenue: number;
  ordersCount: number;
  averagePrice: number;
  revenue: number;
  orders: number;
  category: string;
}

// AI рекомендации
export interface AIRecommendation {
  id: string;
  type: 'price_optimization' | 'inventory_management' | 'sales_forecast' | 'tax_reminder';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
}

// Уведомления
export interface Notification {
  id: string;
  type: 'tax_due' | 'sales_change' | 'new_order' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Документы
export interface Document {
  id: string;
  type: 'receipt' | 'invoice' | 'tax_form' | 'other';
  name: string;
  url: string;
  uploadDate: string;
  category: string;
  amount?: number;
  relatedOrderId?: string;
  relatedTaxId?: string;
}

// Настройки уведомлений
export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  taxReminders: boolean;
  salesAlerts: boolean;
  newOrders: boolean;
  systemUpdates: boolean;
}

// API интеграции
export interface APIIntegration {
  marketplaceId: string;
  apiKey: string;
  isActive: boolean;
  lastSync: string;
  syncFrequency: 'hourly' | 'daily' | 'weekly';
  autoSync: boolean;
}

// Типы для навигации
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Analytics: undefined;
  Taxes: undefined;
  Documents: undefined;
  Profile: { onLogout?: () => void };
  Settings: undefined;
  AI: undefined;
  Marketplaces: undefined;
  AddOrder: undefined;
  AddExpense: undefined;
  AddTax: undefined;
  OrderDetail: { order: any };
  Payment: { taxId: string };
  AddReceipt: { taxId: string };
  ManualUpload: undefined;
  ExportReport: undefined;
  AnalyticsSettings: undefined;
  Comparison: undefined;
  GenerateReport: undefined;
  TaxSettings: undefined;
  AISettings: undefined;
  AnalysisHistory: undefined;
  ExportReports: undefined;
  APISettings: undefined;
  SyncHistory: undefined;
}; 