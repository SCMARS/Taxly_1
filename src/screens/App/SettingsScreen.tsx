import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from "react-native";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { mockUser } from "../../services/mockData";

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taxReminders, setTaxReminders] = useState(true);
  const [salesAlerts, setSalesAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);

  const handleResetSettings = () => {
    Alert.alert(
      "Скидання налаштувань",
      "Всі налаштування будуть повернуті до значень за замовчуванням. Продовжити?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Скинути", 
          style: "destructive",
          onPress: () => {
            // Тут будет логика сброса настроек
            Alert.alert("Успішно", "Налаштування скинуто");
          }
        }
      ]
    );
  };

  const handleExportSettings = () => {
    Alert.alert(
      "Експорт налаштувань",
      "Налаштування будуть експортовані у файл. Продовжити?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Експортувати", 
          onPress: () => {
            Alert.alert("Успішно", "Налаштування експортовано");
          }
        }
      ]
    );
  };

  const settingsSections = [
    {
      title: "Сповіщення",
      icon: "notifications",
      color: "#4A90E2",
      items: [
        {
          title: "Push-сповіщення",
          description: "Отримувати сповіщення в додатку",
          type: "switch",
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          title: "Email-сповіщення",
          description: "Отримувати сповіщення на пошту",
          type: "switch",
          value: emailNotifications,
          onValueChange: setEmailNotifications,
        },
        {
          title: "Податкові нагадування",
          description: "Нагадування про сплату податків",
          type: "switch",
          value: taxReminders,
          onValueChange: setTaxReminders,
        },
        {
          title: "Зміни продажів",
          description: "Сповіщення про зміни в продажах",
          type: "switch",
          value: salesAlerts,
          onValueChange: setSalesAlerts,
        },
        {
          title: "Системні оновлення",
          description: "Сповіщення про оновлення додатку",
          type: "switch",
          value: systemUpdates,
          onValueChange: setSystemUpdates,
        },
      ],
    },
    {
      title: "Синхронізація",
      icon: "sync",
      color: "#50C878",
      items: [
        {
          title: "Автосинхронізація",
          description: "Автоматично синхронізувати дані",
          type: "switch",
          value: autoSync,
          onValueChange: setAutoSync,
        },
        {
          title: "Частота синхронізації",
          description: "Налаштувати частоту синхронізації",
          type: "navigation",
          action: "SyncSettings",
        },
        {
          title: "API ключі",
          description: "Управління API ключами маркетплейсів",
          type: "navigation",
          action: "APISettings",
        },
      ],
    },
    {
      title: "Безпека",
      icon: "security",
      color: "#F39C12",
      items: [
        {
          title: "Біометрична автентифікація",
          description: "Використовувати відбиток пальця або Face ID",
          type: "switch",
          value: biometricAuth,
          onValueChange: setBiometricAuth,
        },
        {
          title: "Змінити пароль",
          description: "Оновити пароль для входу",
          type: "navigation",
          action: "ChangePassword",
        },
        {
          title: "Двофакторна автентифікація",
          description: "Налаштувати 2FA",
          type: "navigation",
          action: "TwoFactorAuth",
        },
      ],
    },
    {
      title: "Інтерфейс",
      icon: "palette",
      color: "#9B59B6",
      items: [
        {
          title: "Темна тема",
          description: "Використовувати темну тему",
          type: "switch",
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          title: "Розмір шрифту",
          description: "Налаштувати розмір тексту",
          type: "navigation",
          action: "FontSettings",
        },
        {
          title: "Мова",
          description: "Змінити мову інтерфейсу",
          type: "navigation",
          action: "LanguageSettings",
        },
      ],
    },
    {
      title: "Дані",
      icon: "storage",
      color: "#FF6B6B",
      items: [
        {
          title: "Експорт даних",
          description: "Експортувати всі дані у файл",
          type: "navigation",
          action: "ExportData",
        },
        {
          title: "Резервне копіювання",
          description: "Створити резервну копію",
          type: "navigation",
          action: "BackupData",
        },
        {
          title: "Очистити кеш",
          description: "Видалити тимчасові файли",
          type: "action",
          action: "clearCache",
        },
      ],
    },
  ];

  const handleItemAction = (item: any) => {
    if (item.type === "navigation" && item.action) {
      navigation.navigate(item.action);
    } else if (item.type === "action" && item.action === "clearCache") {
      Alert.alert(
        "Очищення кешу",
        "Кеш буде очищено. Продовжити?",
        [
          { text: "Скасувати", style: "cancel" },
          { 
            text: "Очистити", 
            onPress: () => {
              Alert.alert("Успішно", "Кеш очищено");
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Налаштування</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Help")}
            style={styles.helpButton}
          >
            <Icon name="help" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Інформація про користувача */}
          <Card variant="elevated" padding="medium" style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Icon name="person" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{mockUser.name}</Text>
                <Text style={styles.userEmail}>{mockUser.email}</Text>
                <Text style={styles.userRole}>ФОП {mockUser.fopGroup} групи</Text>
              </View>
            </View>
          </Card>

          {/* Секції налаштувань */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: section.color + '20' }]}>
                  <Icon name={section.icon} size={24} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              <Card variant="default" padding="medium" style={styles.settingsCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <View style={styles.settingItem}>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingTitle}>{item.title}</Text>
                        <Text style={styles.settingDescription}>
                          {item.description}
                        </Text>
                      </View>
                      
                      {item.type === "switch" ? (
                        <Switch
                          value={item.value}
                          onValueChange={item.onValueChange}
                          trackColor={{ false: "#333", true: section.color }}
                          thumbColor={item.value ? "#FFFFFF" : "#999"}
                        />
                      ) : (
                        <TouchableOpacity
                          style={styles.navigationButton}
                          onPress={() => handleItemAction(item)}
                          activeOpacity={0.7}
                        >
                          <Icon name="arrow-forward" size={20} color="#999" />
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.separator} />
                    )}
                  </View>
                ))}
              </Card>
            </View>
          ))}

          {/* Додаткові дії */}
          <View style={styles.additionalActions}>
            <Text style={styles.sectionTitle}>Додаткові дії</Text>
            
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleExportSettings}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#50C878' + '20' }]}>
                  <Icon name="download" size={24} color="#50C878" />
                </View>
                <Text style={styles.actionText}>Експорт налаштувань</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleResetSettings}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B' + '20' }]}>
                  <Icon name="refresh" size={24} color="#FF6B6B" />
                </View>
                <Text style={styles.actionText}>Скинути налаштування</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("PrivacyPolicy")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#4A90E2' + '20' }]}>
                  <Icon name="privacy-tip" size={24} color="#4A90E2" />
                </View>
                <Text style={styles.actionText}>Політика конфіденційності</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("TermsOfService")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#F39C12' + '20' }]}>
                  <Icon name="description" size={24} color="#F39C12" />
                </View>
                <Text style={styles.actionText}>Умови використання</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Версія додатку */}
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Версія 1.0.0</Text>
            <Text style={styles.buildText}>Build 2024.01.15</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  helpButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Інформація про користувача
  userCard: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#999",
  },
  
  // Секції налаштувань
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  settingsCard: {
    gap: 0,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 18,
  },
  navigationButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
  },
  
  // Додаткові дії
  additionalActions: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  actionButton: {
    width: "48%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 18,
  },
  
  // Інформація про версію
  versionInfo: {
    alignItems: "center",
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  buildText: {
    fontSize: 14,
    color: "#999",
  },
}); 