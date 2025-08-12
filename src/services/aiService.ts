import OpenAI from 'openai';
import { BusinessDataService, BusinessMetrics, MarketplacePerformance } from './businessDataService';

// TODO: Замените на ваш OpenAI API ключ
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY_HERE', // Замените на реальный ключ
  dangerouslyAllowBrowser: true // Только для разработки
});

export interface AIRecommendation {
  id: string;
  type: 'price_optimization' | 'inventory_management' | 'sales_forecast' | 'tax_reminder';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export class AIService {
  // Получение бизнес рекомендаций на основе реальных данных
  static async getBusinessRecommendations(): Promise<AIRecommendation[]> {
    try {
      console.log('Загружаем бизнес данные для AI анализа...');
      
      const metrics = await BusinessDataService.getBusinessMetrics();
      const marketplacePerformance = await BusinessDataService.getMarketplacePerformance();
      const orders = await BusinessDataService.getOrders();
      const expenses = await BusinessDataService.getExpenses();
      const taxes = await BusinessDataService.getTaxes();
      
      console.log('Бизнес данные загружены:', {
        revenue: metrics.revenue,
        profit: metrics.profit,
        ordersCount: metrics.ordersCount,
        expenses: metrics.expenses
      });
      
      const prompt = `Проаналізуй наступні бізнес дані українського ФОП та надай 5 практичних рекомендацій:

ФІНАНСОВІ ПОКАЗНИКИ:
- Дохід: ${metrics.revenue} грн
- Витрати: ${metrics.expenses} грн
- Прибуток: ${metrics.profit} грн
- Кількість замовлень: ${metrics.ordersCount}
- Середній чек: ${metrics.averageOrderValue} грн
- Кількість клієнтів: ${metrics.customerCount}
- Податкові зобов'язання: ${metrics.taxObligations} грн
- Грошовий потік: ${metrics.cashFlow} грн

МАРКЕТПЛЕЙСИ:
${marketplacePerformance.map(mp => 
  `- ${mp.name}: дохід ${mp.revenue} грн, ${mp.orders} замовлень, середній чек ${mp.averageOrder} грн, комісія ${mp.commission} грн`
).join('\n')}

ЗАМОВЛЕННЯ (останні 5):
${orders.slice(-5).map(order => 
  `- ${order.date}: ${order.amount} грн, ${order.marketplace}, ${order.customerName}`
).join('\n')}

      ВИТРАТИ (категорії):
${Object.entries(expenses.reduce((acc, exp) => {
  acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
  return acc;
}, {} as Record<string, number>)).map(([category, amount]) => 
  `- ${category}: ${amount} грн`
).join('\n')}

ПОДАТКИ:
${taxes.filter(tax => !tax.isPaid).map(tax => 
  `- ${tax.type} за ${tax.period}: ${tax.amount} грн (термін: ${tax.dueDate})`
).join('\n')}

АНАЛІЗ ТА РЕКОМЕНДАЦІЇ:
1. Аналіз рентабельності та оптимізація цін
2. Управління витратами та оптимізація логістики
3. Стратегія розвитку на маркетплейсах
4. Податкове планування та оптимізація
5. Прогнозування продажів та управління складом

Формат відповіді:
Назва: [коротка назва]
Опис: [детальний опис з конкретними цифрами]
Пріоритет: [high/medium/low]
Тип: [price_optimization/inventory_management/sales_forecast/tax_reminder]

Відповідай українською мовою з практичними кроками.`;
      
      console.log('Отправляем запрос к OpenAI...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || '';
      console.log('Получен ответ от OpenAI:', response.substring(0, 200) + '...');
      
      const recommendations = this.parseRecommendations(response);
      console.log('Спарсено рекомендаций:', recommendations.length);
      
      return recommendations;
    } catch (error) {
      console.error('Ошибка получения рекомендаций:', error);
      return this.getMockRecommendations();
    }
  }

  // Анализ финансовых метрик на основе реальных данных
  static async analyzeFinancialMetrics(): Promise<string> {
    try {
      const metrics = await BusinessDataService.getBusinessMetrics();
      const profitTrends = await BusinessDataService.getProfitTrends();
      
      const prompt = `Проаналізуй наступні фінансові метрики українського ФОП та надай детальний аналіз з рекомендаціями:

Поточні показники:
- Дохід: ${metrics.revenue} грн
- Витрати: ${metrics.expenses} грн
- Прибуток: ${metrics.profit} грн
- Кількість замовлень: ${metrics.ordersCount}
- Середній чек: ${metrics.averageOrderValue} грн
- Грошовий потік: ${metrics.cashFlow} грн

Тренди прибутку по місяцях: ${profitTrends.map(t => `${t.date}: ${t.profit} грн`).join(', ')}

Фокус на:
1. Аналізі рентабельності
2. Оптимізації витрат
3. Збільшенні прибутку
4. Податковому плануванню
5. Прогнозуванню на наступні місяці

Надай практичні рекомендації українською мовою.`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.6,
      });

      return completion.choices[0]?.message?.content || 'Не удалось проанализировать метрики';
    } catch (error) {
      console.error('Ошибка анализа метрик:', error);
      return 'Анализ временно недоступен. Попробуйте позже.';
    }
  }

  // Планирование налогов на основе реальных данных
  static async planTaxes(): Promise<string> {
    try {
      const metrics = await BusinessDataService.getBusinessMetrics();
      const taxes = await BusinessDataService.getTaxes();
      const unpaidTaxes = taxes.filter(tax => !tax.isPaid);
      
      const prompt = `Допоможи українському ФОП спланувати податки на основі реальних даних:

Фінансові показники:
- Дохід: ${metrics.revenue} грн
- Витрати: ${metrics.expenses} грн
- Прибуток: ${metrics.profit} грн
- Грошовий потік: ${metrics.cashFlow} грн

Поточні податкові зобов'язання: ${metrics.taxObligations} грн

Несплачені податки:
${unpaidTaxes.map(tax => `- ${tax.type} за ${tax.period}: ${tax.amount} грн (термін: ${tax.dueDate})`).join('\n')}

Надай рекомендації по:
1. Розрахунку податку на прибуток
2. Плануванню ЄСВ
3. Оптимізації податкової бази
4. Плануванню платежів
5. Уникненню штрафів

Відповідай українською мовою з конкретними цифрами.`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content || 'Не удалось спланировать налоги';
    } catch (error) {
      console.error('Ошибка планирования налогов:', error);
      return 'Планирование налогов временно недоступно. Попробуйте позже.';
    }
  }

  // Анализ рынка на основе реальных данных
  static async analyzeMarket(): Promise<string> {
    try {
      const marketplacePerformance = await BusinessDataService.getMarketplacePerformance();
      const profitTrends = await BusinessDataService.getProfitTrends();
      
      const prompt = `Проаналізуй ринкові дані українського ФОП та надай стратегічні рекомендації:

Продуктивність на маркетплейсах:
${marketplacePerformance.map(mp => 
  `- ${mp.name}: дохід ${mp.revenue} грн, ${mp.orders} замовлень, середній чек ${mp.averageOrder} грн, комісія ${mp.commission} грн, чистий дохід ${mp.netRevenue} грн`
).join('\n')}

Тренди прибутку: ${profitTrends.map(t => `${t.date}: ${t.profit} грн`).join(', ')}

Надай аналіз та рекомендації по:
1. Стратегії розвитку на маркетплейсах
2. Оптимізації комісій та витрат
3. Розширенню на нові платформи
4. Покращенню конкурентоспроможності
5. Прогнозуванню ринкових змін

Відповідай українською мовою з практичними кроками.`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'Не удалось проанализировать рынок';
    } catch (error) {
      console.error('Ошибка анализа рынка:', error);
      return 'Анализ рынка временно недоступен. Попробуйте позже.';
    }
  }

  // Чат с AI с контекстом реальных бизнес данных
  static async chatWithAI(message: string, conversation?: AIConversation): Promise<string> {
    try {
      const metrics = await BusinessDataService.getBusinessMetrics();
      const marketplacePerformance = await BusinessDataService.getMarketplacePerformance();
      
      const systemPrompt = `Ти - AI помічник для українських ФОП. У тебе є доступ до реальних бізнес даних:

Поточні показники:
- Дохід: ${metrics.revenue} грн
- Витрати: ${metrics.expenses} грн
- Прибуток: ${metrics.profit} грн
- Замовлення: ${metrics.ordersCount}
- Клієнти: ${metrics.customerCount}

Маркетплейси: ${marketplacePerformance.map(mp => `${mp.name} (${mp.revenue} грн)`).join(', ')}

Допомагай з бізнес питаннями, податками, фінансами та стратегією розвитку. Відповідай українською мовою на основі реальних даних користувача.`;
      
      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...(conversation?.messages.slice(-5).map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })) || []),
        { role: "user" as const, content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'Не удалось получить ответ';
    } catch (error) {
      console.error('Ошибка чата с AI:', error);
      return 'Извините, произошла ошибка. Попробуйте позже.';
    }
  }

  // Парсинг рекомендаций из AI ответа
  private static parseRecommendations(response: string): AIRecommendation[] {
    try {
      console.log('Парсим рекомендации из ответа OpenAI...');
      
      const recommendations: AIRecommendation[] = [];
      const lines = response.split('\n').filter(line => line.trim());
      
      let currentRecommendation: Partial<AIRecommendation> = {};
      let recommendationIndex = 0;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.toLowerCase().includes('назва:') || trimmedLine.toLowerCase().includes('назва:')) {
          // Если у нас есть предыдущая рекомендация, сохраняем её
          if (currentRecommendation.title && currentRecommendation.description) {
            recommendations.push({
              id: `rec-${recommendationIndex}`,
              type: currentRecommendation.type || 'price_optimization',
              title: currentRecommendation.title,
              description: currentRecommendation.description,
              priority: currentRecommendation.priority || 'medium',
              isRead: false,
              createdAt: new Date().toISOString()
            });
            recommendationIndex++;
          }
          
          // Начинаем новую рекомендацию
          currentRecommendation = {
            title: trimmedLine.split(':')[1]?.trim() || `Рекомендація ${recommendationIndex + 1}`
          };
        } else if (trimmedLine.toLowerCase().includes('опис:') || trimmedLine.toLowerCase().includes('опис:')) {
          currentRecommendation.description = trimmedLine.split(':')[1]?.trim() || 'Описание недоступно';
        } else if (trimmedLine.toLowerCase().includes('пріоритет:') || trimmedLine.toLowerCase().includes('пріоритет:')) {
          const priority = trimmedLine.split(':')[1]?.trim().toLowerCase();
          if (priority === 'high' || priority === 'medium' || priority === 'low') {
            currentRecommendation.priority = priority;
          }
        } else if (trimmedLine.toLowerCase().includes('тип:') || trimmedLine.toLowerCase().includes('тип:')) {
          const type = trimmedLine.split(':')[1]?.trim();
          if (type) {
            // Определяем тип по ключевым словам
            if (type.includes('цін') || type.includes('price')) {
              currentRecommendation.type = 'price_optimization';
            } else if (type.includes('склад') || type.includes('inventory')) {
              currentRecommendation.type = 'inventory_management';
            } else if (type.includes('продаж') || type.includes('sales')) {
              currentRecommendation.type = 'sales_forecast';
            } else if (type.includes('подат') || type.includes('tax')) {
              currentRecommendation.type = 'tax_reminder';
            } else {
              currentRecommendation.type = 'price_optimization';
            }
          }
        } else if (trimmedLine && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('•')) {
          // Если строка не пустая и не является списком, возможно это продолжение описания
          if (currentRecommendation.description && currentRecommendation.description.length < 200) {
            currentRecommendation.description += ' ' + trimmedLine;
          }
        }
      }
      
      // Добавляем последнюю рекомендацию
      if (currentRecommendation.title && currentRecommendation.description) {
        recommendations.push({
          id: `rec-${recommendationIndex}`,
          type: currentRecommendation.type || 'price_optimization',
          title: currentRecommendation.title,
          description: currentRecommendation.description,
          priority: currentRecommendation.priority || 'medium',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
      
      console.log(`Успешно спарсено ${recommendations.length} рекомендаций`);
      
      // Если не удалось спарсить структурированные рекомендации, пробуем простой парсинг
      if (recommendations.length === 0) {
        console.log('Пробуем простой парсинг...');
        return this.simpleParseRecommendations(response);
      }
      
      return recommendations;
    } catch (error) {
      console.error('Ошибка парсинга рекомендаций:', error);
      return this.getMockRecommendations();
    }
  }

  // Простой парсинг для случаев, когда структурированный не сработал
  private static simpleParseRecommendations(response: string): AIRecommendation[] {
    try {
      const recommendations: AIRecommendation[] = [];
      const lines = response.split('\n').filter(line => line.trim() && line.length > 10);
      
      lines.slice(0, 5).forEach((line, index) => {
        const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
        if (cleanLine.length > 20) {
          recommendations.push({
            id: `rec-${index}`,
            type: index < 2 ? 'price_optimization' : index < 4 ? 'inventory_management' : 'tax_reminder',
            title: cleanLine.substring(0, 50) + (cleanLine.length > 50 ? '...' : ''),
            description: cleanLine,
            priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      });
      
      return recommendations.length > 0 ? recommendations : this.getMockRecommendations();
    } catch (error) {
      console.error('Ошибка простого парсинга:', error);
      return this.getMockRecommendations();
    }
  }

  // Заглушки для случаев ошибок
  private static getMockRecommendations(): AIRecommendation[] {
    return [
      {
        id: 'rec-1',
        type: 'price_optimization',
        title: 'Оптимізація цін',
        description: 'Проаналізуйте конкурентні ціни та оптимізуйте свою цінову стратегію',
        priority: 'high',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'rec-2',
        type: 'tax_reminder',
        title: 'Податкове планування',
        description: 'Плануйте податки заздалегідь для уникнення штрафів',
        priority: 'high',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];
  }
} 