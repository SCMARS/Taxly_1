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
      const metrics = await BusinessDataService.getBusinessMetrics();
      const marketplacePerformance = await BusinessDataService.getMarketplacePerformance();
      
      const prompt = `Проаналізуй наступні бізнес дані українського ФОП та надай 5 практичних рекомендацій:

Доходи: ${metrics.revenue} грн
Витрати: ${metrics.expenses} грн
Прибуток: ${metrics.profit} грн
Кількість замовлень: ${metrics.ordersCount}
Середній чек: ${metrics.averageOrderValue} грн
Кількість клієнтів: ${metrics.customerCount}
Податкові зобов'язання: ${metrics.taxObligations} грн
Грошовий потік: ${metrics.cashFlow} грн

Маркетплейси: ${marketplacePerformance.map(mp => `${mp.name}: ${mp.revenue} грн, ${mp.orders} замовлень`).join(', ')}

Надай рекомендації по:
1. Оптимізації цін та збільшенню прибутку
2. Управлінню складом та логістикою
3. Прогнозуванню продажів
4. Податковому плануванню
5. Розвитку на маркетплейсах

Формат: коротка назва, детальний опис, пріоритет (low/medium/high).`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseRecommendations(response);
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
4. Податковому плануванні
5. Прогнозуванні на наступні місяці

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
      const recommendations: AIRecommendation[] = [];
      const lines = response.split('\n').filter(line => line.trim());
      
      lines.forEach((line, index) => {
        if (line.includes(':')) {
          const [title, description] = line.split(':').map(s => s.trim());
          recommendations.push({
            id: `rec-${index}`,
            type: 'price_optimization',
            title: title || `Рекомендація ${index + 1}`,
            description: description || 'Описание недоступно',
            priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      });

      return recommendations.length > 0 ? recommendations : this.getMockRecommendations();
    } catch (error) {
      console.error('Ошибка парсинга рекомендаций:', error);
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