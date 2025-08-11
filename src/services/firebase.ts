import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBPazOxsqYlRWAPL2DAL6Ings4bMNrQrTo",
  authDomain: "web-app-ff2eb.firebaseapp.com",
  projectId: "web-app-ff2eb",
  storageBucket: "web-app-ff2eb.firebasestorage.app",
  messagingSenderId: "727366597782",
  appId: "1:727366597782:web:8bff73a29a4c26785d56b7",
  measurementId: "G-8RGF3NSSHY"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Получение сервисов
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Временное решение: локальное хранилище для обхода проблем с правами доступа
export const localFirestoreService = {
  // Создание документа
  async createDocument(collectionName: string, data: any, documentId?: string) {
    try {
      const id = documentId || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const documentData = {
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const key = `${collectionName}_${id}`;
      await AsyncStorage.setItem(key, JSON.stringify(documentData));
      
      // Также сохраняем в список документов коллекции
      const collectionKey = `collection_${collectionName}`;
      const existingDocs = await AsyncStorage.getItem(collectionKey);
      const docs = existingDocs ? JSON.parse(existingDocs) : [];
      docs.push(id);
      await AsyncStorage.setItem(collectionKey, JSON.stringify(docs));
      
      return id;
    } catch (error) {
      console.error('Ошибка создания документа:', error);
      throw error;
    }
  },

  // Получение документа по ID
  async getDocument(collectionName: string, documentId: string) {
    try {
      const key = `${collectionName}_${documentId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Ошибка получения документа:', error);
      throw error;
    }
  },

  // Получение всех документов из коллекции
  async getDocuments(collectionName: string, filters?: any[], orderByField?: string, limitCount?: number) {
    try {
      const collectionKey = `collection_${collectionName}`;
      const docIds = await AsyncStorage.getItem(collectionKey);
      
      if (!docIds) return [];
      
      const ids = JSON.parse(docIds);
      const documents: any[] = [];
      
      for (const id of ids) {
        const doc = await this.getDocument(collectionName, id);
        if (doc) {
          documents.push(doc);
        }
      }
      
      // Применяем фильтры
      let filteredDocs = documents;
      if (filters && filters.length > 0) {
        filteredDocs = documents.filter(doc => {
          return filters.every(filter => {
            const value = doc[filter.field];
            switch (filter.operator) {
              case '==': return value === filter.value;
              case '!=': return value !== filter.value;
              case '>': return value > filter.value;
              case '<': return value < filter.value;
              case '>=': return value >= filter.value;
              case '<=': return value <= filter.value;
              default: return true;
            }
          });
        });
      }
      
      // Сортируем
      if (orderByField) {
        filteredDocs.sort((a, b) => {
          const aVal = a[orderByField];
          const bVal = b[orderByField];
          if (aVal < bVal) return 1;
          if (aVal > bVal) return -1;
          return 0;
        });
      }
      
      // Ограничиваем количество
      if (limitCount) {
        filteredDocs = filteredDocs.slice(0, limitCount);
      }
      
      return filteredDocs;
    } catch (error) {
      console.error('Ошибка получения документов:', error);
      throw error;
    }
  },

  // Обновление документа
  async updateDocument(collectionName: string, documentId: string, data: any) {
    try {
      const existingDoc = await this.getDocument(collectionName, documentId);
      if (!existingDoc) {
        throw new Error('Документ не найден');
      }
      
      const updatedDoc = {
        ...existingDoc,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      const key = `${collectionName}_${documentId}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedDoc));
      
      return true;
    } catch (error) {
      console.error('Ошибка обновления документа:', error);
      throw error;
    }
  },

  // Удаление документа
  async deleteDocument(collectionName: string, documentId: string) {
    try {
      const key = `${collectionName}_${documentId}`;
      await AsyncStorage.removeItem(key);
      
      // Удаляем из списка коллекции
      const collectionKey = `collection_${collectionName}`;
      const existingDocs = await AsyncStorage.getItem(collectionKey);
      if (existingDocs) {
        const docs = JSON.parse(existingDocs);
        const filteredDocs = docs.filter((id: string) => id !== documentId);
        await AsyncStorage.setItem(collectionKey, JSON.stringify(filteredDocs));
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка удаления документа:', error);
      throw error;
    }
  }
};

// Экспорт сервисов
export { auth, db, storage };
export const firestoreService = localFirestoreService;

// Функции для работы с Storage (упрощенные)
export const storageService = {
  // Загрузка файла (заглушка)
  async uploadFile(file: any, path: string): Promise<string> {
    try {
      // Временно возвращаем заглушку
      return `https://via.placeholder.com/150?text=${encodeURIComponent(path)}`;
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      throw error;
    }
  },

  // Получение URL файла (заглушка)
  async getFileURL(path: string): Promise<string> {
    try {
      return `https://via.placeholder.com/150?text=${encodeURIComponent(path)}`;
    } catch (error) {
      console.error('Ошибка получения URL файла:', error);
      throw error;
    }
  }
};

export default app; 