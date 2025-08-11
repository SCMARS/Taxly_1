# 🔑 Настройка OpenAI API ключа

## Шаг 1: Получение API ключа

1. Перейдите на [OpenAI Platform](https://platform.openai.com/api-keys)
2. Войдите в свой аккаунт
3. Нажмите **"Create new secret key"**
4. Скопируйте сгенерированный ключ

## Шаг 2: Обновление кода

В файле `src/services/aiService.ts` замените:

```typescript
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY_HERE', // ← Замените на ваш ключ
  dangerouslyAllowBrowser: true
});
```

На:

```typescript
const openai = new OpenAI({
  apiKey: 'sk-proj-ваш-реальный-ключ-здесь',
  dangerouslyAllowBrowser: true
});
```

## Шаг 3: Безопасность

⚠️ **ВАЖНО**: Никогда не коммитьте API ключи в Git!
- Используйте `.env` файлы для продакшена
- Добавьте `.env` в `.gitignore`
- Для разработки можно использовать прямо в коде

## Шаг 4: Тестирование

После обновления ключа:
1. Перезапустите приложение
2. Попробуйте AI функции
3. Проверьте логи на ошибки

## Пример использования

```typescript
// Получение бизнес рекомендаций
const recommendations = await AIService.getBusinessRecommendations();

// Анализ финансовых метрик
const analysis = await AIService.analyzeFinancialMetrics();

// Планирование налогов
const taxPlan = await AIService.planTaxes();
``` 