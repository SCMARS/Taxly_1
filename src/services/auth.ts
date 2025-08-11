import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from './firebase';
import { firestoreService } from './firebase';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

export interface AuthError {
  code: string;
  message: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  fopGroup?: 2 | 3;
  phone?: string;
  businessName?: string;
  registrationDate: string;
  lastUpdate: string;
}

export class AuthService {
  // Google OAuth конфигурация - используем веб-клиент Firebase
  private static readonly GOOGLE_CLIENT_ID = "727366597782-google-oauth-client-id.apps.googleusercontent.com";
  private static readonly GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: 'com.taxly.app',
    path: 'auth'
  });

  // Вход через email и пароль
  static async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Получаем или создаем профиль пользователя
      await this.getOrCreateUserProfile(userCredential.user);
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Регистрация через email и пароль
  static async signUpWithEmail(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Создаем профиль пользователя
      await this.createUserProfile(userCredential.user);
      
      return userCredential;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Вход через Google (упрощенная версия для тестирования)
  static async signInWithGoogle(): Promise<{ user: UserProfile }> {
    try {
      // Создаем запрос на аутентификацию
      const request = new AuthSession.AuthRequest({
        clientId: this.GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: this.GOOGLE_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
        },
      });

      // Открываем браузер для аутентификации
      const result = await request.promptAsync({});

      if (result.type === 'success' && result.params.code) {
        // Обмениваем код на токен
        const tokenResponse = await this.exchangeCodeForToken(result.params.code);
        
        // Создаем Firebase credential
        const credential = GoogleAuthProvider.credential(tokenResponse.id_token);
        
        // Входим в Firebase
        const userCredential = await signInWithCredential(auth, credential);
        
        // Получаем или создаем профиль пользователя
        await this.getOrCreateUserProfile(userCredential.user);
        
        // Получаем профиль пользователя
        const profile = await this.getUserProfile(userCredential.user.uid);
        if (profile) {
          return { user: profile };
        } else {
          throw new Error('Не удалось получить профиль пользователя');
        }
      } else {
        throw new Error('Аутентификация Google была отменена');
      }
    } catch (error: any) {
      console.error('Ошибка Google аутентификации:', error);
      // Временно возвращаем заглушку для тестирования
      throw new Error('Google аутентификация временно недоступна. Используйте email/пароль.');
    }
  }

  // Обмен кода на токен
  private static async exchangeCodeForToken(code: string) {
    try {
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: this.GOOGLE_CLIENT_ID,
          redirect_uri: this.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка обмена кода на токен');
      }

      return await response.json();
    } catch (error) {
      console.error('Ошибка обмена токена:', error);
      throw error;
    }
  }

  // Выход
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Получить текущего пользователя
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Слушатель изменения состояния аутентификации
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Получить профиль пользователя
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const profile = await firestoreService.getDocument('users', uid);
      if (profile) {
        return profile as unknown as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Ошибка получения профиля пользователя:', error);
      return null;
    }
  }

  // Создать профиль пользователя
  private static async createUserProfile(user: User): Promise<void> {
    try {
      const userProfile: Omit<UserProfile, 'uid'> = {
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        fopGroup: 3, // По умолчанию 3 группа
        phone: '',
        businessName: '',
        registrationDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };

      await firestoreService.createDocument('users', userProfile, user.uid);
    } catch (error) {
      console.error('Ошибка создания профиля пользователя:', error);
    }
  }

  // Получить или создать профиль пользователя
  private static async getOrCreateUserProfile(user: User): Promise<void> {
    try {
      const existingProfile = await this.getUserProfile(user.uid);
      if (!existingProfile) {
        await this.createUserProfile(user);
      }
    } catch (error) {
      console.error('Ошибка получения/создания профиля пользователя:', error);
    }
  }

  // Обновить профиль пользователя
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      return await firestoreService.updateDocument('users', uid, {
        ...updates,
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Ошибка обновления профиля пользователя:', error);
      return false;
    }
  }

  // Обработка ошибок Firebase Auth
  private static handleAuthError(error: any): AuthError {
    let message = 'Произошла ошибка при аутентификации';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Користувача з таким email не знайдено';
        break;
      case 'auth/wrong-password':
        message = 'Невірний пароль';
        break;
      case 'auth/invalid-email':
        message = 'Невірний формат email';
        break;
      case 'auth/weak-password':
        message = 'Пароль занадто слабкий (мінімум 6 символів)';
        break;
      case 'auth/email-already-in-use':
        message = 'Користувач з таким email вже існує';
        break;
      case 'auth/too-many-requests':
        message = 'Забагато спроб входу. Спробуйте пізніше';
        break;
      case 'auth/network-request-failed':
        message = 'Помилка мережі. Перевірте з\'єднання';
        break;
      default:
        message = error.message || message;
    }

    return {
      code: error.code || 'unknown',
      message
    };
  }
} 