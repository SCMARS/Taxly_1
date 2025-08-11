import { firestoreService } from './firebase';
import { AuthService } from './auth';

// Интерфейсы для бизнес данных
export interface BusinessMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  ordersCount: number;
  averageOrderValue: number;
  customerCount: number;
  taxObligations: number;
  cashFlow: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  amount: number;
  marketplace: string;
  customerName: string;
  customerEmail?: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  commission: number;
  netAmount: number;
  paymentMethod: 'card' | 'cash' | 'transfer';
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface Expense {
  id: string;
  userId: string;
  date: string;
  category: 'advertising' | 'logistics' | 'office' | 'inventory' | 'other';
  description: string;
  amount: number;
  receipt?: string;
  isTaxDeductible: boolean;
  vendor?: string;
}

export interface TaxRecord {
  id: string;
  userId: string;
  type: 'esv' | 'single_tax' | 'other';
  period: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paymentDate?: string;
  receipt?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  firstOrderDate: string;
  notes?: string;
}

export interface MarketplacePerformance {
  name: string;
  revenue: number;
  orders: number;
  averageOrder: number;
  commission: number;
  netRevenue: number;
  lastOrderDate: string;
}

export class BusinessDataService {
  // Получение текущего пользователя
  private static async getCurrentUserId(): Promise<string> {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Пользователь не аутентифицирован');
    }
    return currentUser.uid;
  }

  // Получение всех бизнес метрик
  static async getBusinessMetrics(): Promise<BusinessMetrics> {
    try {
      const userId = await this.getCurrentUserId();
      
      const orders = await this.getOrders();
      const expenses = await this.getExpenses();
      const taxes = await this.getTaxes();
      
      const revenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.netAmount, 0);
      
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const taxObligations = taxes
        .filter(tax => !tax.isPaid)
        .reduce((sum, tax) => sum + tax.amount, 0);
      
      const profit = revenue - totalExpenses - taxObligations;
      const ordersCount = orders.filter(order => order.status === 'completed').length;
      const averageOrderValue = ordersCount > 0 ? revenue / ordersCount : 0;
      
      const customers = await this.getCustomers();
      const customerCount = customers.length;
      
      const cashFlow = revenue - totalExpenses;

      return {
        revenue,
        expenses: totalExpenses,
        profit,
        ordersCount,
        averageOrderValue,
        customerCount,
        taxObligations,
        cashFlow
      };
    } catch (error) {
      console.error('Ошибка получения бизнес метрик:', error);
      return this.getDefaultMetrics();
    }
  }

  // Получение заказов
  static async getOrders(): Promise<Order[]> {
    try {
      const userId = await this.getCurrentUserId();
      return await firestoreService.getDocuments('orders', [
        { field: 'userId', operator: '==', value: userId }
      ], 'date');
    } catch (error) {
      console.error('Ошибка получения заказов:', error);
      return [];
    }
  }

  // Добавление заказа
  static async addOrder(order: Omit<Order, 'id' | 'userId'>): Promise<Order> {
    try {
      const userId = await this.getCurrentUserId();
      const orderWithUserId = { ...order, userId };
      
      const orderId = await firestoreService.createDocument('orders', orderWithUserId);
      
      // Обновляем клиента
      await this.updateCustomerStats(order.customerEmail || '', order.amount);
      
      return { ...orderWithUserId, id: orderId };
    } catch (error) {
      console.error('Ошибка добавления заказа:', error);
      throw error;
    }
  }

  // Обновление заказа
  static async updateOrder(orderId: string, updates: Partial<Order>): Promise<boolean> {
    try {
      return await firestoreService.updateDocument('orders', orderId, updates);
    } catch (error) {
      console.error('Ошибка обновления заказа:', error);
      return false;
    }
  }

  // Получение расходов
  static async getExpenses(): Promise<Expense[]> {
    try {
      const userId = await this.getCurrentUserId();
      return await firestoreService.getDocuments('expenses', [
        { field: 'userId', operator: '==', value: userId }
      ], 'date');
    } catch (error) {
      console.error('Ошибка получения расходов:', error);
      return [];
    }
  }

  // Добавление расхода
  static async addExpense(expense: Omit<Expense, 'id' | 'userId'>): Promise<Expense> {
    try {
      const userId = await this.getCurrentUserId();
      const expenseWithUserId = { ...expense, userId };
      
      const expenseId = await firestoreService.createDocument('expenses', expenseWithUserId);
      
      return { ...expenseWithUserId, id: expenseId };
    } catch (error) {
      console.error('Ошибка добавления расхода:', error);
      throw error;
    }
  }

  // Получение налоговых записей
  static async getTaxes(): Promise<TaxRecord[]> {
    try {
      const userId = await this.getCurrentUserId();
      return await firestoreService.getDocuments('taxes', [
        { field: 'userId', operator: '==', value: userId }
      ], 'dueDate');
    } catch (error) {
      console.error('Ошибка получения налогов:', error);
      return [];
    }
  }

  // Добавление налоговой записи
  static async addTax(tax: Omit<TaxRecord, 'id' | 'userId'>): Promise<TaxRecord> {
    try {
      const userId = await this.getCurrentUserId();
      const taxWithUserId = { ...tax, userId };
      
      const taxId = await firestoreService.createDocument('taxes', taxWithUserId);
      
      return { ...taxWithUserId, id: taxId };
    } catch (error) {
      console.error('Ошибка добавления налога:', error);
      throw error;
    }
  }

  // Получение клиентов
  static async getCustomers(): Promise<Customer[]> {
    try {
      const userId = await this.getCurrentUserId();
      return await firestoreService.getDocuments('customers', [
        { field: 'userId', operator: '==', value: userId }
      ], 'lastOrderDate');
    } catch (error) {
      console.error('Ошибка получения клиентов:', error);
      return [];
    }
  }

  // Добавление клиента
  static async addCustomer(customer: Omit<Customer, 'id' | 'userId' | 'totalSpent' | 'ordersCount' | 'firstOrderDate' | 'lastOrderDate'>): Promise<Customer> {
    try {
      const userId = await this.getCurrentUserId();
      const now = new Date().toISOString();
      
      const customerWithDefaults = {
        ...customer,
        userId,
        totalSpent: 0,
        ordersCount: 0,
        firstOrderDate: now,
        lastOrderDate: now
      };
      
      const customerId = await firestoreService.createDocument('customers', customerWithDefaults);
      
      return { ...customerWithDefaults, id: customerId };
    } catch (error) {
      console.error('Ошибка добавления клиента:', error);
      throw error;
    }
  }

  // Обновление статистики клиента
  private static async updateCustomerStats(email: string, orderAmount: number): Promise<void> {
    try {
      if (!email) return;
      
      const customers = await this.getCustomers();
      const customer = customers.find(c => c.email === email);
      
      if (customer) {
        await firestoreService.updateDocument('customers', customer.id, {
          totalSpent: customer.totalSpent + orderAmount,
          ordersCount: customer.ordersCount + 1,
          lastOrderDate: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Ошибка обновления статистики клиента:', error);
    }
  }

  // Анализ производительности маркетплейсов
  static async getMarketplacePerformance(): Promise<MarketplacePerformance[]> {
    try {
      const orders = await this.getOrders();
      const completedOrders = orders.filter(order => order.status === 'completed');
      
      const marketplaceMap = new Map<string, MarketplacePerformance>();
      
      completedOrders.forEach(order => {
        const existing = marketplaceMap.get(order.marketplace);
        
        if (existing) {
          existing.revenue += order.netAmount;
          existing.orders += 1;
          existing.commission += order.commission;
          existing.netRevenue += (order.netAmount - order.commission);
          existing.lastOrderDate = order.date;
        } else {
          marketplaceMap.set(order.marketplace, {
            name: order.marketplace,
            revenue: order.netAmount,
            orders: 1,
            averageOrder: order.netAmount,
            commission: order.commission,
            netRevenue: order.netAmount - order.commission,
            lastOrderDate: order.date
          });
        }
      });
      
      // Вычисляем средние значения
      marketplaceMap.forEach(performance => {
        performance.averageOrder = performance.revenue / performance.orders;
      });
      
      return Array.from(marketplaceMap.values());
    } catch (error) {
      console.error('Ошибка анализа маркетплейсов:', error);
      return [];
    }
  }

  // Получение трендов прибыли
  static async getProfitTrends(): Promise<{ date: string; profit: number }[]> {
    try {
      const orders = await this.getOrders();
      const expenses = await this.getExpenses();
      
      // Группируем по месяцам
      const monthlyData = new Map<string, { revenue: number; expenses: number }>();
      
      // Обрабатываем заказы
      orders.filter(order => order.status === 'completed').forEach(order => {
        const month = order.date.substring(0, 7); // YYYY-MM
        const existing = monthlyData.get(month);
        
        if (existing) {
          existing.revenue += order.netAmount;
        } else {
          monthlyData.set(month, { revenue: order.netAmount, expenses: 0 });
        }
      });
      
      // Обрабатываем расходы
      expenses.forEach(expense => {
        const month = expense.date.substring(0, 7);
        const existing = monthlyData.get(month);
        
        if (existing) {
          existing.expenses += expense.amount;
        } else {
          monthlyData.set(month, { revenue: 0, expenses: expense.amount });
        }
      });
      
      // Вычисляем прибыль и сортируем по дате
      return Array.from(monthlyData.entries())
        .map(([month, data]) => ({
          date: month,
          profit: data.revenue - data.expenses
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Ошибка получения трендов прибыли:', error);
      return [];
    }
  }

  // Получение дефолтных метрик
  private static getDefaultMetrics(): BusinessMetrics {
    return {
      revenue: 0,
      expenses: 0,
      profit: 0,
      ordersCount: 0,
      averageOrderValue: 0,
      customerCount: 0,
      taxObligations: 0,
      cashFlow: 0
    };
  }

  // Инициализация с демо данными
  static async initializeWithDemoData(): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      
      // Проверяем, есть ли уже данные
      const existingOrders = await this.getOrders();
      if (existingOrders.length > 0) {
        return; // Данные уже есть
      }

      // Создаем демо заказы
      const demoOrders: Omit<Order, 'id' | 'userId'>[] = [
        {
          date: '2024-01-15',
          amount: 2500,
          marketplace: 'Rozetka',
          customerName: 'Іван Петренко',
          customerEmail: 'ivan@example.com',
          status: 'completed',
          commission: 250,
          netAmount: 2250,
          paymentMethod: 'card',
          items: [
            { id: '1', name: 'Смартфон', quantity: 1, unitPrice: 2500, totalPrice: 2500, category: 'Електроніка' }
          ]
        },
        {
          date: '2024-01-20',
          amount: 1800,
          marketplace: 'Prom',
          customerName: 'Марія Коваленко',
          customerEmail: 'maria@example.com',
          status: 'completed',
          commission: 180,
          netAmount: 1620,
          paymentMethod: 'transfer',
          items: [
            { id: '2', name: 'Навушники', quantity: 1, unitPrice: 1800, totalPrice: 1800, category: 'Аксесуари' }
          ]
        }
      ];

      // Создаем демо расходы
      const demoExpenses: Omit<Expense, 'id' | 'userId'>[] = [
        {
          date: '2024-01-10',
          category: 'advertising',
          description: 'Google Ads',
          amount: 500,
          isTaxDeductible: true,
          vendor: 'Google'
        },
        {
          date: '2024-01-25',
          category: 'logistics',
          description: 'Доставка товарів',
          amount: 300,
          isTaxDeductible: true,
          vendor: 'Нова Пошта'
        }
      ];

      // Создаем демо налоги
      const demoTaxes: Omit<TaxRecord, 'id' | 'userId'>[] = [
        {
          type: 'single_tax',
          period: '2024-01',
          amount: 1000,
          dueDate: '2024-02-15',
          isPaid: false,
          notes: 'Єдиний податок за січень'
        }
      ];

      // Создаем демо клиентов
      const demoCustomers: Omit<Customer, 'id' | 'userId' | 'totalSpent' | 'ordersCount' | 'firstOrderDate' | 'lastOrderDate'>[] = [
        {
          name: 'Іван Петренко',
          email: 'ivan@example.com',
          phone: '+380501234567',
          notes: 'Постійний клієнт'
        },
        {
          name: 'Марія Коваленко',
          email: 'maria@example.com',
          phone: '+380671234567',
          notes: 'Новий клієнт'
        }
      ];

      // Добавляем демо данные
      for (const order of demoOrders) {
        await this.addOrder(order);
      }

      for (const expense of demoExpenses) {
        await this.addExpense(expense);
      }

      for (const tax of demoTaxes) {
        await this.addTax(tax);
      }

      for (const customer of demoCustomers) {
        await this.addCustomer(customer);
      }

      console.log('Демо данные успешно инициализированы в Firebase');
    } catch (error) {
      console.error('Ошибка инициализации демо данных:', error);
    }
  }
} 