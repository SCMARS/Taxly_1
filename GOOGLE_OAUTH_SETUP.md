# Настройка Google OAuth для Firebase

## Шаг 1: Настройка в Firebase Console

1. Перейдите в [Firebase Console](https://console.firebase.google.com/project/web-app-ff2eb)
2. Выберите проект `web-app-ff2eb`
3. Перейдите в **Authentication** → **Sign-in method**
4. Включите **Google** как метод входа
5. Добавьте **Support email**: `gleb270975@gmail.com`
6. Сохраните настройки

## Шаг 2: Настройка Android в Firebase Console

1. В Firebase Console перейдите в **Project Settings** → **Your apps**
2. Найдите Android приложение или создайте новое
3. Добавьте **SHA-1 fingerprint**:
   ```
   CA:37:7B:8A:E5:5F:D7:D2:33:F6:4D:63:65:70:36:19:81:15:9E:06
   ```
4. Добавьте **SHA-256 fingerprint**:
   ```
   90:A3:45:D5:E8:3F:F6:87:33:66:75:2C:DB:62:39:87:C7:64:50:F5:03:BF:81:90:CB:E6:53:03:D6:1A:14:DA
   ```

## Шаг 3: Получение OAuth 2.0 Client ID

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Выберите проект `web-app-ff2eb`
3. Перейдите в **APIs & Services** → **Credentials**
4. Найдите **OAuth 2.0 Client IDs** или создайте новый
5. Скопируйте **Client ID**

## Шаг 4: Обновление кода

Замените в `src/services/auth.ts`:

```typescript
private static readonly GOOGLE_CLIENT_ID = "ВАШ_РЕАЛЬНЫЙ_CLIENT_ID";
```

## Шаг 5: Настройка схемы в app.json

Убедитесь, что в `app.json` есть:

```json
{
  "expo": {
    "scheme": "com.taxly.app"
  }
}
```

## Шаг 6: Тестирование

1. Перезапустите приложение
2. Попробуйте войти через Google
3. Должен открыться браузер для аутентификации

## Возможные проблемы:

- **"Invalid client"** - неправильный Client ID
- **"Redirect URI mismatch"** - неправильная схема в app.json
- **"Permission denied"** - Google OAuth не включен в Firebase
- **"SHA-1 mismatch"** - неправильный fingerprint в Firebase Console

## Важные заметки:

- **SHA-1 fingerprint** нужен для Android приложений
- **Debug keystore** используется для разработки
- **Release keystore** нужен для продакшена
- **Package name** должен совпадать с `com.taxly.app` в app.json 