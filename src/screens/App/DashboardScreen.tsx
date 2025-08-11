import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from "react-native";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { MetricCard } from "../../components/MetricCard";
import { StatsCard } from "../../components/StatsCard";
import { Icon } from "../../components/Icon";
import { 
  mockUser, 
  mockAnalytics, 
  mockTopProducts, 
  mockAIRecommendations, 
  mockTaxes,
  mockOrders,
  getTotalRevenue,
  getTotalExpenses,
  getTotalProfit,
  getOrdersCount,
  getPendingTaxes
} from "../../services/mockData";

interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
}

interface DashboardScreenProps {
  navigation: any;
  onLogout?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
  onLogout,
}) => {
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

  const dashboardCards: DashboardCard[] = [
    {
      id: "1",
      title: "Продажі",
      subtitle: "Управління замовленнями",
      icon: "shopping-cart",
      color: "#4A90E2",
      route: "Orders",
    },
    {
      id: "2",
      title: "Аналітика",
      subtitle: "Звіти та статистика",
      icon: "analytics",
      color: "#50C878",
      route: "Analytics",
    },
    {
      id: "3",
      title: "Податки",
      subtitle: "ФОП податки та звіти",
      icon: "account-balance",
      color: "#FF6B6B",
      route: "Taxes",
    },
    {
      id: "4",
      title: "Документи",
      subtitle: "Чеки та рахунки",
      icon: "receipt",
      color: "#9B59B6",
      route: "Documents",
    },
    {
      id: "5",
      title: "AI Помічник",
      subtitle: "Рекомендації та прогнози",
      icon: "robot",
      color: "#F39C12",
      route: "AI",
    },
    {
      id: "6",
      title: "Налаштування",
      subtitle: "Маркетплейси та API",
      icon: "settings",
      color: "#E74C3C",
      route: "Settings",
    },
  ];

  const handleCardPress = (route: string) => {
    if (route === "Profile" && onLogout) {
      navigation.navigate(route, { onLogout });
    } else {
      navigation.navigate(route);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTaxDueDate = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>ФОП Помічник</Text>
              <Text style={styles.headerSubtitle}>Управління бізнесом</Text>
            </View>
            <TouchableOpacity onPress={onLogout || (() => {})} style={styles.logoutButton}>
              <Icon name="logout" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Основні показники з горизонтальною прокруткою */}
          <Animated.View
            style={[
              styles.statsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Основні показники</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsScrollContent}
            >
              <StatsCard
                icon="account-balance-wallet"
                value={formatCurrency(getTotalRevenue())}
                title="Виручка"
                subtitle="Загальна виручка"
                color="#4A90E2"
                size="medium"
                trend={{ value: "+12.5%", type: "positive" }}
              />
              <StatsCard
                icon="trending-up"
                value={formatCurrency(getTotalProfit())}
                title="Прибуток"
                subtitle="Чистий прибуток"
                color="#50C878"
                size="medium"
                trend={{ value: "+8.3%", type: "positive" }}
              />
              <StatsCard
                icon="shopping-cart"
                value={getOrdersCount().toString()}
                title="Замовлень"
                subtitle="Кількість замовлень"
                color="#F39C12"
                size="medium"
                trend={{ value: "+15.2%", type: "positive" }}
              />
              <StatsCard
                icon="account-balance"
                value={formatCurrency(getTotalExpenses())}
                title="Витрати"
                subtitle="Загальні витрати"
                color="#FF6B6B"
                size="medium"
                trend={{ value: "-5.1%", type: "negative" }}
              />
            </ScrollView>
          </Animated.View>

          {/* Ближчі платежі */}
          <Animated.View
            style={[
              styles.taxesSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Ближчі платежі</Text>
            {getPendingTaxes().slice(0, 3).map((tax) => {
              const daysLeft = getTaxDueDate(tax.dueDate);
              return (
                <Card key={tax.id} variant="outlined" padding="medium">
                  <View style={styles.taxItem}>
                    <View style={styles.taxInfo}>
                      <View style={styles.taxHeader}>
                        <Icon 
                          name={tax.type === 'esv' ? 'account-balance' : 'payment'} 
                          size={20} 
                          color={daysLeft <= 7 ? '#FF6B6B' : '#4A90E2'} 
                        />
                        <Text style={styles.taxName}>
                          {tax.type === 'esv' ? 'ЕСВ' : 'Єдиний податок'} ({tax.period})
                        </Text>
                      </View>
                      <Text style={styles.taxAmount}>{formatCurrency(tax.amount)}</Text>
                    </View>
                    <View style={styles.taxDue}>
                      <Text style={[styles.dueText, daysLeft <= 7 ? styles.dueUrgent : styles.dueNormal]}>
                        {daysLeft > 0 ? `Залишилось ${daysLeft} дн.` : 'Прострочено!'}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </Animated.View>

          {/* Основні функції по 2 в ряд */}
          <Animated.View
            style={[
              styles.cardsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Основні функції</Text>
            <View style={styles.cardsGrid}>
              {dashboardCards.map((card, index) => (
                <Animated.View
                  key={card.id}
                  style={[
                    styles.cardWrapper,
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
                  <Card
                    variant="elevated"
                    padding="large"
                    onPress={() => handleCardPress(card.route)}
                    style={[styles.dashboardCard, { borderLeftColor: card.color }] as any}
                  >
                    <View style={styles.cardContent}>
                      <View style={[styles.cardIcon, { backgroundColor: card.color + '20' }]}>
                        <Icon name={card.icon} size={28} color={card.color} />
                      </View>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                    </View>
                  </Card>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* AI Рекомендації */}
          <Animated.View
            style={[
              styles.aiSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>AI Рекомендації</Text>
            {mockAIRecommendations.slice(0, 2).map((rec) => (
              <Card key={rec.id} variant="default" padding="medium">
                <View style={styles.aiCard}>
                  <View style={styles.aiHeader}>
                    <View style={styles.aiTitleContainer}>
                      <Icon name="info" size={20} color="#F39C12" />
                      <Text style={styles.aiTitle}>{rec.title}</Text>
                    </View>
                    <View style={[
                      styles.priorityBadge, 
                      rec.priority === 'high' ? styles.priorityHigh :
                      rec.priority === 'medium' ? styles.priorityMedium : styles.priorityLow
                    ]}>
                      <Text style={styles.priorityText}>
                        {rec.priority === 'high' ? 'Важливо' : 
                         rec.priority === 'medium' ? 'Середньо' : 'Низько'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.aiDescription}>{rec.description}</Text>
                </View>
              </Card>
            ))}
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
            <View style={styles.quickActionsGrid}>
              <Button
                title="Додати продаж"
                onPress={() => navigation.navigate("AddOrder")}
                style={styles.quickActionButton}
                variant="primary"
                icon="add"
                size="medium"
                fullWidth
              />
              <Button
                title="Додати витрату"
                onPress={() => navigation.navigate("AddExpense")}
                style={styles.quickActionButton}
                variant="outline"
                icon="edit"
                size="medium"
                fullWidth
              />
              <Button
                title="Синхронізувати"
                onPress={() => navigation.navigate("Marketplaces")}
                style={styles.quickActionButton}
                variant="secondary"
                icon="sync"
                size="medium"
                fullWidth
              />
            </View>
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  logoutButton: {
    padding: 8,
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
  statsScrollContent: {
    paddingRight: 20,
  },
  taxesSection: {
    marginBottom: 30,
  },
  taxItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taxInfo: {
    flex: 1,
  },
  taxHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taxName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
    fontWeight: "600",
  },
  taxAmount: {
    fontSize: 18,
    color: "#4A90E2",
    fontWeight: "bold",
  },
  taxDue: {
    alignItems: "flex-end",
  },
  dueText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dueNormal: {
    color: "#50C878",
  },
  dueUrgent: {
    color: "#FF6B6B",
  },
  cardsContainer: {
    marginBottom: 60,
    paddingHorizontal: 4,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  dashboardCard: {
    borderLeftWidth: 4,
    minHeight: 140,
    marginHorizontal: 0,
  },
  cardContent: {
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
  },
  aiSection: {
    marginBottom: 30,
    marginTop: 40,
  },
  aiCard: {
    width: "100%",
  },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  aiTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  priorityHigh: {
    backgroundColor: "#FF6B6B",
  },
  priorityMedium: {
    backgroundColor: "#F39C12",
  },
  priorityLow: {
    backgroundColor: "#50C878",
  },
  priorityText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  aiDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 30,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionButton: {
    marginBottom: 0,
  },
}); 