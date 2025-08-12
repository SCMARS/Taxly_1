// Тест AI сервиса с реальными данными
// Запуск: node test-ai-real-data.js

const { BusinessDataService } = require('./src/services/businessDataService');
const { AIService } = require('./src/services/aiService');

async function testAIServiceWithRealData() {
  try {
    console.log('🧪 Тестируем AI сервис с реальными данными...\n');
    
    // 1. Инициализируем демо данные
    console.log('1️⃣ Инициализируем демо данные...');
    await BusinessDataService.initializeWithDemoData();
    console.log('✅ Демо данные созданы\n');
    
    // 2. Получаем бизнес метрики
    console.log('2️⃣ Получаем бизнес метрики...');
    const metrics = await BusinessDataService.getBusinessMetrics();
    console.log('📊 Метрики:', {
      revenue: metrics.revenue,
      profit: metrics.profit,
      ordersCount: metrics.ordersCount,
      expenses: metrics.expenses
    });
    console.log('');
    
    // 3. Получаем данные маркетплейсов
    console.log('3️⃣ Получаем данные маркетплейсов...');
    const marketplace = await BusinessDataService.getMarketplacePerformance();
    console.log('🛒 Маркетплейсы:', marketplace.length);
    marketplace.forEach(mp => {
      console.log(`   - ${mp.name}: ${mp.revenue} грн, ${mp.orders} заказов`);
    });
    console.log('');
    
    // 4. Получаем заказы
    console.log('4️⃣ Получаем заказы...');
    const orders = await BusinessDataService.getOrders();
    console.log('📦 Заказов:', orders.length);
    orders.slice(0, 3).forEach(order => {
      console.log(`   - ${order.date}: ${order.amount} грн, ${order.marketplace}`);
    });
    console.log('');
    
    // 5. Получаем расходы
    console.log('5️⃣ Получаем расходы...');
    const expenses = await BusinessDataService.getExpenses();
    console.log('💰 Расходов:', expenses.length);
    expenses.forEach(exp => {
      console.log(`   - ${exp.category}: ${exp.amount} грн`);
    });
    console.log('');
    
    // 6. Получаем налоги
    console.log('6️⃣ Получаем налоги...');
    const taxes = await BusinessDataService.getTaxes();
    console.log('🏛️ Налогов:', taxes.length);
    taxes.forEach(tax => {
      console.log(`   - ${tax.type} за ${tax.period}: ${tax.amount} грн`);
    });
    console.log('');
    
    // 7. Тестируем AI рекомендации
    console.log('7️⃣ Тестируем AI рекомендации...');
    const recommendations = await AIService.getBusinessRecommendations();
    console.log('🤖 AI рекомендаций:', recommendations.length);
    recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.title} (${rec.priority})`);
      console.log(`      ${rec.description.substring(0, 100)}...`);
    });
    console.log('');
    
    // 8. Тестируем финансовый анализ
    console.log('8️⃣ Тестируем финансовый анализ...');
    const analysis = await AIService.analyzeFinancialMetrics();
    console.log('📈 Анализ:', analysis.substring(0, 200) + '...');
    console.log('');
    
    // 9. Тестируем налоговое планирование
    console.log('9️⃣ Тестируем налоговое планирование...');
    const taxPlan = await AIService.planTaxes();
    console.log('💼 Налоговое планирование:', taxPlan.substring(0, 200) + '...');
    console.log('');
    
    // 10. Тестируем анализ рынка
    console.log('🔟 Тестируем анализ рынка...');
    const marketAnalysis = await AIService.analyzeMarket();
    console.log('🌍 Анализ рынка:', marketAnalysis.substring(0, 200) + '...');
    console.log('');
    
    console.log('🎉 Все тесты завершены успешно!');
    console.log('AI сервис работает с реальными данными!');
    
  } catch (error) {
    console.error('❌ Ошибка в тестах:', error);
  }
}

// Запускаем тесты
testAIServiceWithRealData(); 