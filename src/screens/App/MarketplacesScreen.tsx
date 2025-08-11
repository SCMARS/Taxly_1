import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  TextInput,
  Alert,
  Switch,
  Dimensions,
} from "react-native";
import { Button } from "../../components/Button";
import { mockMarketplaces } from "../../services/mockData";

const { width } = Dimensions.get("window");

interface MarketplacesScreenProps {
  navigation: any;
}

export const MarketplacesScreen: React.FC<MarketplacesScreenProps> = ({ navigation }) => {
  const [marketplaces, setMarketplaces] = useState(mockMarketplaces);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleConnectMarketplace = (marketplaceId: string) => {
    const marketplace = marketplaces.find(m => m.id === marketplaceId);
    if (marketplace) {
      Alert.prompt(
        `Підключення до ${marketplace.name}`,
        "Введіть ваш API ключ:",
        [
          { text: "Скасувати", style: "cancel" },
          { 
            text: "Підключити", 
            onPress: (apiKey) => {
              if (apiKey) {
                const updatedMarketplaces = marketplaces.map(m => 
                  m.id === marketplaceId 
                    ? { ...m, apiKey, isConnected: true, lastSync: new Date().toISOString() }
                    : m
                );
                setMarketplaces(updatedMarketplaces);
                Alert.alert("Успіх", `${marketplace.name} успішно підключено!`);
              }
            }
          }
        ]
      );
    }
  };

  const handleDisconnectMarketplace = (marketplaceId: string) => {
    const marketplace = marketplaces.find(m => m.id === marketplaceId);
    Alert.alert(
      "Підтвердження",
      `Відключити ${marketplace?.name}?`,
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Відключити", 
          onPress: () => {
            const updatedMarketplaces = marketplaces.map(m => 
              m.id === marketplaceId 
                ? { ...m, apiKey: undefined, isConnected: false, lastSync: undefined }
                : m
            );
            setMarketplaces(updatedMarketplaces);
            Alert.alert("Успіх", `${marketplace?.name} відключено`);
          }
        }
      ]
    );
  };

  const handleSyncMarketplace = (marketplaceId: string) => {
    const marketplace = marketplaces.find(m => m.id === marketplaceId);
    Alert.alert(
      "Синхронізація",
      `Синхронізувати дані з ${marketplace?.name}?`,
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Синхронізувати", 
          onPress: () => {
            // Симуляция синхронизации
            setTimeout(() => {
              const updatedMarketplaces = marketplaces.map(m => 
                m.id === marketplaceId 
                  ? { ...m, lastSync: new Date().toISOString() }
                  : m
              );
              setMarketplaces(updatedMarketplaces);
              Alert.alert("Успіх", `Дані з ${marketplace?.name} синхронізовано!`);
            }, 2000);
          }
        }
      ]
    );
  };

  const handleManualUpload = () => {
    navigation.navigate("ManualUpload");
  };

  const getMarketplaceIcon = (name: string) => {
    switch (name) {
      case 'Rozetka': return '🛒';
      case 'Prom': return '📱';
      case 'OLX': return '📋';
      case 'Kasta': return '🎯';
      case 'Amazon': return '📦';
      default: return '🏪';
    }
  };

  const getConnectionStatus = (isConnected: boolean) => {
    return isConnected ? "Підключено" : "Не підключено";
  };

  const getConnectionColor = (isConnected: boolean) => {
    return isConnected ? "#50C878" : "#FF6B6B";
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return "Ніколи";
    const date = new Date(lastSync);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConnectedCount = () => {
    return marketplaces.filter(m => m.isConnected).length;
  };

  const getTotalMarketplaces = () => marketplaces.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Маркетплейси</Text>
          <Text style={styles.subtitle}>
            Управління інтеграцією з торговими майданчиками
          </Text>
        </Animated.View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Статистика підключень */}
          <Animated.View
            style={[
              styles.statsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Статистика підключень</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🔗</Text>
                <Text style={styles.statNumber}>{getConnectedCount()}</Text>
                <Text style={styles.statLabel}>Підключено</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📊</Text>
                <Text style={styles.statNumber}>{getTotalMarketplaces()}</Text>
                <Text style={styles.statLabel}>Всього доступно</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⏰</Text>
                <Text style={styles.statNumber}>
                  {marketplaces.filter(m => m.isConnected && m.lastSync).length}
                </Text>
                <Text style={styles.statLabel}>Активних</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📈</Text>
                <Text style={styles.statNumber}>
                  {Math.round((getConnectedCount() / getTotalMarketplaces()) * 100)}%
                </Text>
                <Text style={styles.statLabel}>Покриття</Text>
              </View>
            </View>
          </Animated.View>

          {/* Список маркетплейсів */}
          <Animated.View
            style={[
              styles.marketplacesSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Доступні маркетплейси</Text>
            {marketplaces.map((marketplace, index) => (
              <Animated.View
                key={marketplace.id}
                style={[
                  styles.marketplaceCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30 + index * 20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.marketplaceHeader}>
                  <View style={styles.marketplaceInfo}>
                    <Text style={styles.marketplaceIcon}>
                      {getMarketplaceIcon(marketplace.name)}
                    </Text>
                    <View style={styles.marketplaceDetails}>
                      <Text style={styles.marketplaceName}>{marketplace.name}</Text>
                      <Text style={styles.marketplaceType}>
                        {marketplace.type === 'api' ? 'API інтеграція' : 'Ручне завантаження'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.marketplaceStatus}>
                    <Text style={[
                      styles.statusText,
                      { color: getConnectionColor(marketplace.isConnected) }
                    ]}>
                      {getConnectionStatus(marketplace.isConnected)}
                    </Text>
                  </View>
                </View>

                {marketplace.isConnected && (
                  <View style={styles.connectionDetails}>
                    <Text style={styles.lastSyncText}>
                      Остання синхронізація: {formatLastSync(marketplace.lastSync)}
                    </Text>
                    <Text style={styles.apiKeyText}>
                      API ключ: {marketplace.apiKey ? '***' + marketplace.apiKey.slice(-4) : 'Не вказано'}
                    </Text>
                  </View>
                )}

                <View style={styles.marketplaceActions}>
                  {!marketplace.isConnected ? (
                    <Button
                      title="Підключити"
                      onPress={() => handleConnectMarketplace(marketplace.id)}
                      style={styles.actionButton}
                      variant="primary"
                    />
                  ) : (
                    <>
                      <Button
                        title="Синхронізувати"
                        onPress={() => handleSyncMarketplace(marketplace.id)}
                        style={styles.actionButton}
                        variant="primary"
                      />
                      <Button
                        title="Відключити"
                        onPress={() => handleDisconnectMarketplace(marketplace.id)}
                        style={styles.actionButton}
                        variant="secondary"
                      />
                    </>
                  )}
                </View>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Налаштування синхронізації */}
          <Animated.View
            style={[
              styles.syncSettings,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Налаштування синхронізації</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Автоматична синхронізація</Text>
                <Text style={styles.settingDescription}>
                  Автоматично синхронізувати дані кожні 6 годин
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: "#333", true: "#4A90E2" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push-сповіщення</Text>
                <Text style={styles.settingDescription}>
                  Отримувати сповіщення про нові замовлення
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: "#333", true: "#4A90E2" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Збереження історії</Text>
                <Text style={styles.settingDescription}>
                  Зберігати історію синхронізацій протягом 90 днів
                </Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: "#333", true: "#4A90E2" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </Animated.View>

          {/* Ручне завантаження */}
          <Animated.View
            style={[
              styles.manualUpload,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>📁 Ручне завантаження</Text>
            <View style={styles.manualUploadCard}>
              <Text style={styles.manualUploadText}>
                Якщо у вас немає можливості підключити API, ви можете завантажувати дані вручну через CSV або Excel файли.
              </Text>
              <Button
                title="Завантажити файл"
                onPress={handleManualUpload}
                style={styles.uploadButton}
                variant="primary"
              />
              <Text style={styles.uploadNote}>
                Підтримуються формати: .csv, .xlsx, .xls
              </Text>
            </View>
          </Animated.View>

          {/* Швидкі дії */}
          <Animated.View
            style={[
              styles.quickActions,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Швидкі дії</Text>
            <Button
              title="Синхронізувати всі"
              onPress={() => {
                const connectedMarketplaces = marketplaces.filter(m => m.isConnected);
                if (connectedMarketplaces.length === 0) {
                  Alert.alert("Помилка", "Немає підключених маркетплейсів");
                  return;
                }
                Alert.alert(
                  "Синхронізація",
                  `Синхронізувати ${connectedMarketplaces.length} маркетплейсів?`,
                  [
                    { text: "Скасувати", style: "cancel" },
                    { 
                      text: "Синхронізувати", 
                      onPress: () => {
                        Alert.alert("Успіх", "Всі маркетплейси синхронізовано!");
                      }
                    }
                  ]
                );
              }}
              style={styles.quickActionButton}
              variant="primary"
            />
            <Button
              title="Налаштування API"
              onPress={() => navigation.navigate("APISettings")}
              style={styles.quickActionButton}
              variant="secondary"
            />
            <Button
              title="Історія синхронізацій"
              onPress={() => navigation.navigate("SyncHistory")}
              style={styles.quickActionButton}
              variant="secondary"
            />
          </Animated.View>
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
    backgroundColor: "#000000",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 8,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
  },
  marketplacesSection: {
    marginBottom: 30,
  },
  marketplaceCard: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  marketplaceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  marketplaceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  marketplaceIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  marketplaceDetails: {
    flex: 1,
  },
  marketplaceName: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  marketplaceType: {
    fontSize: 14,
    color: "#999",
  },
  marketplaceStatus: {
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  connectionDetails: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  lastSyncText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  apiKeyText: {
    fontSize: 14,
    color: "#999",
  },
  marketplaceActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  syncSettings: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  manualUpload: {
    marginBottom: 30,
  },
  manualUploadCard: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  manualUploadText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  uploadButton: {
    marginBottom: 16,
    minWidth: 200,
  },
  uploadNote: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  quickActions: {
    marginBottom: 30,
  },
  quickActionButton: {
    marginBottom: 12,
  },
}); 