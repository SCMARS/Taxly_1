import { 
  User, 
  Marketplace, 
  Order, 
  OrderItem, 
  Expense, 
  Tax, 
  Analytics, 
  TopProduct, 
  AIRecommendation, 
  Notification, 
  Document 
} from '../types';

// Mock пользователь ФОП
export const mockUser: User = {
  id: '1',
  name: 'Олександр Петренко',
  email: 'alex@fop.com',
  phone: '+380501234567',
  fopGroup: 3,
  registrationDate: '2024-01-01',
  lastUpdate: '2024-01-15T10:30:00Z'
};

// Mock маркетплейсы
export const mockMarketplaces: Marketplace[] = [
  {
    id: '1',
    name: 'Rozetka',
    type: 'api',
    apiKey: 'rz_123456789',
    isConnected: true,
    lastSync: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Prom',
    type: 'api',
    apiKey: 'pm_987654321',
    isConnected: true,
    lastSync: '2024-01-15T08:30:00Z'
  },
  {
    id: '3',
    name: 'OLX',
    type: 'manual',
    isConnected: false
  }
];

// Mock товары
const mockProducts: OrderItem[] = [
  {
    id: '1',
    name: 'Смартфон iPhone 15',
    sku: 'IPH15-128',
    quantity: 1,
    unitPrice: 45000,
    totalPrice: 45000,
    category: 'Електроніка'
  },
  {
    id: '2',
    name: 'Навушники AirPods Pro',
    sku: 'AP-PRO-2',
    quantity: 2,
    unitPrice: 8500,
    totalPrice: 17000,
    category: 'Аксесуари'
  },
  {
    id: '3',
    name: 'Чохол для iPhone',
    sku: 'CASE-IPH15',
    quantity: 1,
    unitPrice: 1200,
    totalPrice: 1200,
    category: 'Аксесуари'
  }
];

// Mock заказы
export const mockOrders: Order[] = [
  {
    id: '1',
    marketplaceId: '1',
    orderNumber: 'RZ-2024-001',
    date: '2024-01-15',
    customerName: 'Іван Коваленко',
    customerPhone: '+380671234567',
    items: [mockProducts[0]],
    totalAmount: 45000,
    commission: 2250,
    netAmount: 42750,
    status: 'completed',
    paymentMethod: 'card',
    notes: 'Доставка до пошти'
  },
  {
    id: '2',
    marketplaceId: '2',
    orderNumber: 'PM-2024-001',
    date: '2024-01-14',
    customerName: 'Марія Шевченко',
    customerPhone: '+380631234567',
    items: [mockProducts[1], mockProducts[2]],
    totalAmount: 18200,
    commission: 910,
    netAmount: 17290,
    status: 'completed',
    paymentMethod: 'card'
  },
  {
    id: '3',
    marketplaceId: '1',
    orderNumber: 'RZ-2024-002',
    date: '2024-01-13',
    customerName: 'Петро Іваненко',
    customerPhone: '+380501234567',
    items: [mockProducts[0]],
    totalAmount: 45000,
    commission: 2250,
    netAmount: 42750,
    status: 'pending',
    paymentMethod: 'transfer'
  }
];

// Mock расходы
export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2024-01-15',
    category: 'advertising',
    description: 'Реклама в Google Ads',
    amount: 5000,
    isTaxDeductible: true
  },
  {
    id: '2',
    date: '2024-01-14',
    category: 'logistics',
    description: 'Доставка товарів',
    amount: 1500,
    isTaxDeductible: true
  },
  {
    id: '3',
    date: '2024-01-13',
    category: 'office',
    description: 'Канцелярія',
    amount: 800,
    isTaxDeductible: false
  }
];

// Mock налоги
export const mockTaxes: Tax[] = [
  {
    id: '1',
    type: 'esv',
    period: '2024-01',
    amount: 1544,
    dueDate: '2024-02-20',
    isPaid: false
  },
  {
    id: '2',
    type: 'single_tax',
    period: '2024-01',
    amount: 1000,
    dueDate: '2024-02-20',
    isPaid: false
  },
  {
    id: '3',
    type: 'esv',
    period: '2023-12',
    amount: 1544,
    dueDate: '2024-01-20',
    isPaid: true,
    paymentDate: '2024-01-18'
  }
];

// Mock аналитика
export const mockAnalytics: Analytics = {
  period: 'month',
  startDate: '2024-01-01',
  endDate: '2024-01-15',
  revenue: 108200,
  expenses: 7300,
  profit: 100900,
  ordersCount: 3,
  averageOrderValue: 36067,
  
  // Детальна аналітика по періодах
  weeklyRevenue: 25000,
  weeklyOrders: 1,
  weeklyProfit: 23000,
  monthlyRevenue: 108200,
  monthlyOrders: 3,
  monthlyProfit: 100900,
  yearlyRevenue: 108200,
  yearlyOrders: 3,
  yearlyProfit: 100900,
  
  // Виручка по маркетплейсах
  revenueByMarketplace: [
    {
      marketplaceId: '1', // Rozetka
      revenue: 65000
    },
    {
      marketplaceId: '2', // Prom
      revenue: 43200
    }
  ],
  
  // Категорії витрат
  expenseCategories: [
    {
      name: 'Реклама',
      amount: 3000,
      percentage: 41,
      color: '#FF6B6B'
    },
    {
      name: 'Логістика',
      amount: 2500,
      percentage: 34,
      color: '#F39C12'
    },
    {
      name: 'Офіс',
      amount: 1200,
      percentage: 16,
      color: '#9B59B6'
    },
    {
      name: 'Інші',
      amount: 600,
      percentage: 9,
      color: '#50C878'
    }
  ]
};

// Mock топ товаров
export const mockTopProducts: TopProduct[] = [
  {
    id: '1',
    name: 'Смартфон iPhone 15',
    totalSales: 2,
    totalRevenue: 90000,
    ordersCount: 2,
    averagePrice: 45000,
    revenue: 90000,
    orders: 2,
    category: 'Електроніка'
  },
  {
    id: '2',
    name: 'Навушники AirPods Pro',
    totalSales: 2,
    totalRevenue: 17000,
    ordersCount: 1,
    averagePrice: 8500,
    revenue: 17000,
    orders: 1,
    category: 'Аксесуари'
  },
  {
    id: '3',
    name: 'Чохол для iPhone',
    totalSales: 1,
    totalRevenue: 1200,
    ordersCount: 1,
    averagePrice: 1200,
    revenue: 1200,
    orders: 1,
    category: 'Аксесуари'
  }
];

// Mock AI рекомендации
export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'price_optimization',
    title: 'Оптимізація цін',
    description: 'На основі аналізу конкурентів рекомендуємо збільшити ціну на iPhone 15 на 5%',
    priority: 'medium',
    isRead: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    type: 'sales_forecast',
    title: 'Прогноз продажів',
    description: 'Очікується збільшення продажів на 15% у лютому на основі сезонності',
    priority: 'low',
    isRead: false,
    createdAt: '2024-01-15T09:30:00Z'
  },
  {
    id: '3',
    type: 'tax_reminder',
    title: 'Нагадування про податки',
    description: 'Не забудьте сплатити ЕСВ та єдиний податок до 20 лютого',
    priority: 'high',
    isRead: false,
    createdAt: '2024-01-15T09:00:00Z'
  }
];

// Mock уведомления
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'tax_due',
    title: 'Строк сплати податків',
    message: 'До 20 лютого потрібно сплатити ЕСВ та єдиний податок',
    isRead: false,
    createdAt: '2024-01-15T10:00:00Z',
    actionUrl: '/taxes'
  },
  {
    id: '2',
    type: 'new_order',
    title: 'Новий замовник',
    message: 'Отримано нове замовлення RZ-2024-002 на суму 45,000 грн',
    isRead: false,
    createdAt: '2024-01-15T09:45:00Z',
    actionUrl: '/orders'
  },
  {
    id: '3',
    type: 'sales_change',
    title: 'Зміна продажів',
    message: 'Продажі зросли на 25% порівняно з минулим тижнем',
    isRead: true,
    createdAt: '2024-01-15T09:00:00Z'
  }
];

// Mock документы
export const mockDocuments: Document[] = [
  {
    id: '1',
    type: 'receipt',
    name: 'Чек за рекламу Google Ads',
    url: 'https://example.com/receipt1.jpg',
    uploadDate: '2024-01-15',
    category: 'Реклама',
    amount: 5000,
    relatedOrderId: undefined
  },
  {
    id: '2',
    type: 'invoice',
    name: 'Рахунок за доставку',
    url: 'https://example.com/invoice1.pdf',
    uploadDate: '2024-01-14',
    category: 'Логістика',
    amount: 1500,
    relatedOrderId: undefined
  },
  {
    id: '3',
    type: 'tax_form',
    name: 'Форма 1-ДФ',
    url: 'https://example.com/tax_form.pdf',
    uploadDate: '2024-01-10',
    category: 'Податки',
    amount: undefined
  }
];

// Функции для работы с данными
export const getTotalRevenue = () => mockOrders.reduce((sum, order) => sum + order.netAmount, 0);
export const getTotalExpenses = () => mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
export const getTotalProfit = () => getTotalRevenue() - getTotalExpenses();
export const getOrdersCount = () => mockOrders.length;
export const getPendingTaxes = () => mockTaxes.filter(tax => !tax.isPaid);
export const getUnreadNotifications = () => mockNotifications.filter(notif => !notif.isRead); 