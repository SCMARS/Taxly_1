import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
} from "react-native";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { mockUser, mockNotifications, mockAIRecommendations } from "../../services/mockData";
import { RouteProp, useRoute } from "@react-navigation/native";

interface ProfileScreenProps {
  navigation: any;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, onLogout }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // Получаем onLogout из route params если не передан в props
  const route = useRoute<RouteProp<{ Profile: { onLogout?: () => void } }, 'Profile'>>();
  const logoutHandler = onLogout || route.params?.onLogout || (() => {});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Вихід з системи",
      "Ви впевнені, що хочете вийти?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Виййти", 
          style: "destructive",
          onPress: logoutHandler
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Видалення акаунту",
      "Ця дія незворотна. Ви впевнені?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Акаунт видалено", "Дякуємо за використання додатку");
          }
        }
      ]
    );
  };

  const getFOPGroupName = (group: number) => {
    switch (group) {
      case 1: return "1 група";
      case 2: return "2 група";
      case 3: return "3 група";
      default: return "Невідомо";
    }
  };

  const getFOPGroupColor = (group: number) => {
    switch (group) {
      case 1: return "#50C878";
      case 2: return "#4A90E2";
      case 3: return "#F39C12";
      default: return "#999";
    }
  };

  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;
  const unreadRecommendations = mockAIRecommendations.filter(r => !r.isRead).length;

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
          <Text style={styles.headerTitle}>Профіль</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={styles.settingsButton}
          >
            <Icon name="settings" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Профіль користувача */}
          <Card variant="elevated" padding="large" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Icon name="person" size={40} color="#FFFFFF" />
                </View>
                <View style={[
                  styles.fopGroupBadge,
                  { backgroundColor: getFOPGroupColor(mockUser.fopGroup) + '20' }
                ]}>
                  <Text style={[
                    styles.fopGroupText,
                    { color: getFOPGroupColor(mockUser.fopGroup) }
                  ]}>
                    {getFOPGroupName(mockUser.fopGroup)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{mockUser.name}</Text>
                <Text style={styles.userEmail}>{mockUser.email}</Text>
                {mockUser.phone && (
                  <Text style={styles.userPhone}>{mockUser.phone}</Text>
                )}
                <Text style={styles.registrationDate}>
                  Реєстрація: {formatDate(mockUser.registrationDate)}
                </Text>
              </View>
            </View>
            
            <View style={styles.profileActions}>
              <TouchableOpacity
                style={styles.profileActionButton}
                onPress={() => navigation.navigate("EditProfile")}
                activeOpacity={0.7}
              >
                <Icon name="edit" size={20} color="#4A90E2" />
                <Text style={styles.profileActionText}>Редагувати профіль</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.profileActionButton}
                onPress={() => navigation.navigate("ChangePassword")}
                activeOpacity={0.7}
              >
                <Icon name="lock" size={20} color="#F39C12" />
                <Text style={styles.profileActionText}>Змінити пароль</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Статистика */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Статистика</Text>
            <View style={styles.statsGrid}>
              <Card variant="default" padding="medium" style={styles.statCard}>
                <View style={styles.statContent}>
                  <Icon name="notifications" size={24} color="#FF6B6B" />
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>{unreadNotifications}</Text>
                    <Text style={styles.statLabel}>Непрочитаних повідомлень</Text>
                  </View>
                </View>
              </Card>
              
              <Card variant="default" padding="medium" style={styles.statCard}>
                <View style={styles.statContent}>
                  <Icon name="psychology" size={24} color="#9B59B6" />
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>{unreadRecommendations}</Text>
                    <Text style={styles.statLabel}>AI рекомендацій</Text>
                  </View>
                </View>
              </Card>
            </View>
          </View>

          {/* Налаштування */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Налаштування</Text>
            
            <Card variant="default" padding="medium" style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="notifications" size={24} color="#4A90E2" />
                  <View style={styles.settingDetails}>
                    <Text style={styles.settingTitle}>Сповіщення</Text>
                    <Text style={styles.settingDescription}>
                      Отримувати push-сповіщення
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#333", true: "#4A90E2" }}
                  thumbColor={notificationsEnabled ? "#FFFFFF" : "#999"}
                />
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="sync" size={24} color="#50C878" />
                  <View style={styles.settingDetails}>
                    <Text style={styles.settingTitle}>Автосинхронізація</Text>
                    <Text style={styles.settingDescription}>
                      Автоматично синхронізувати дані
                    </Text>
                  </View>
                </View>
                <Switch
                  value={autoSyncEnabled}
                  onValueChange={setAutoSyncEnabled}
                  trackColor={{ false: "#333", true: "#50C878" }}
                  thumbColor={autoSyncEnabled ? "#FFFFFF" : "#999"}
                />
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="dark-mode" size={24} color="#F39C12" />
                  <View style={styles.settingDetails}>
                    <Text style={styles.settingTitle}>Темна тема</Text>
                    <Text style={styles.settingDescription}>
                      Використовувати темну тему
                    </Text>
                  </View>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: "#333", true: "#F39C12" }}
                  thumbColor={darkModeEnabled ? "#FFFFFF" : "#999"}
                />
              </View>
            </Card>
          </View>

          {/* Швидкі дії */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Швидкі дії</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("Notifications")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B' + '20' }]}>
                  <Icon name="notifications" size={24} color="#FF6B6B" />
                </View>
                <Text style={styles.actionText}>Сповіщення</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("AI")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#9B59B6' + '20' }]}>
                  <Icon name="psychology" size={24} color="#9B59B6" />
                </View>
                <Text style={styles.actionText}>AI асистент</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("Help")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#4A90E2' + '20' }]}>
                  <Icon name="help" size={24} color="#4A90E2" />
                </View>
                <Text style={styles.actionText}>Допомога</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("About")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#50C878' + '20' }]}>
                  <Icon name="info" size={24} color="#50C878" />
                </View>
                <Text style={styles.actionText}>Про додаток</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Небезпечні дії */}
          <View style={styles.dangerSection}>
            <Text style={styles.sectionTitle}>Небезпечні дії</Text>
            
            <Card variant="outlined" padding="medium" style={styles.dangerCard}>
              <View style={styles.dangerItem}>
                <View style={styles.dangerInfo}>
                  <Icon name="logout" size={24} color="#F39C12" />
                  <View style={styles.dangerDetails}>
                    <Text style={styles.dangerTitle}>Вихід з системи</Text>
                    <Text style={styles.dangerDescription}>
                      Завершити поточну сесію
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.dangerButton}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dangerButtonText}>Виййти</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.separator} />
              
              <View style={styles.dangerItem}>
                <View style={styles.dangerInfo}>
                  <Icon name="delete-forever" size={24} color="#FF6B6B" />
                  <View style={styles.dangerDetails}>
                    <Text style={styles.dangerTitle}>Видалити акаунт</Text>
                    <Text style={styles.dangerDescription}>
                      Ця дія незворотна
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.dangerButton, styles.deleteButton]}
                  onPress={handleDeleteAccount}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Видалити</Text>
                </TouchableOpacity>
              </View>
            </Card>
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
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Профіль
  profileCard: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  fopGroupBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fopGroupText: {
    fontSize: 12,
    fontWeight: "600",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: "#4A90E2",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: "#999",
    marginBottom: 8,
  },
  registrationDate: {
    fontSize: 14,
    color: "#999",
  },
  profileActions: {
    flexDirection: "row",
    gap: 12,
  },
  profileActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
    flex: 1,
    justifyContent: "center",
  },
  profileActionText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  
  // Статистика
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  statInfo: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    lineHeight: 16,
  },
  
  // Налаштування
  settingsSection: {
    marginBottom: 20,
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
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingDetails: {
    marginLeft: 16,
    flex: 1,
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
  separator: {
    height: 1,
    backgroundColor: "#333",
  },
  
  // Швидкі дії
  quickActions: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  quickActionButton: {
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
  
  // Небезпечні дії
  dangerSection: {
    marginBottom: 20,
  },
  dangerCard: {
    borderColor: "#FF6B6B",
  },
  dangerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  dangerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dangerDetails: {
    marginLeft: 16,
    flex: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  dangerDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 18,
  },
  dangerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F39C12",
  },
  dangerButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
  },
  deleteButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
}); 