# 🚀 Быстрая настройка Google OAuth

## 📱 Что нужно сделать СЕЙЧАС:

### 1. Firebase Console (5 минут)
- Перейти: https://console.firebase.google.com/project/web-app-ff2eb
- **Authentication** → **Sign-in method** → Включить **Google**
- **Project Settings** → **Your apps** → Android app
- Добавить SHA-1: `CA:37:7B:8A:E5:5F:D7:D2:33:F6:4D:63:65:70:36:19:81:15:9E:06`

### 2. Google Cloud Console (3 минуты)
- Перейти: https://console.cloud.google.com/apis/credentials
- Скопировать **OAuth 2.0 Client ID** (начинается с `727366597782-...`)

### 3. Обновить код (1 минута)
В файле `src/services/auth.ts` заменить:
```typescript
private static readonly GOOGLE_CLIENT_ID = "ВАШ_РЕАЛЬНЫЙ_CLIENT_ID";
```

### 4. Перезапустить приложение
```bash
npx expo start
```

## ✅ После этого Google OAuth будет работать!

## 🔍 Если что-то не работает:
- Проверить SHA-1 fingerprint в Firebase
- Проверить Client ID в коде
- Убедиться что Google включен в Authentication
- Проверить схему `com.taxly.app` в app.json 