import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { StatsCard } from "../../components/StatsCard";
import { mockAnalytics, mockTopProducts, mockMarketplaces } from "../../services/mockData";

interface AnalyticsScreenProps {
  navigation: any;
}

const { width } = Dimensions.get("window");

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPeriodData = () => {
    switch (selectedPeriod) {
      case "week":
        return {
          revenue: mockAnalytics.weeklyRevenue,
          orders: mockAnalytics.weeklyOrders,
          profit: mockAnalytics.weeklyProfit,
        };
      case "month":
        return {
          revenue: mockAnalytics.monthlyRevenue,
          orders: mockAnalytics.monthlyOrders,
          profit: mockAnalytics.monthlyProfit,
        };
      case "year":
        return {
          revenue: mockAnalytics.yearlyRevenue,
          orders: mockAnalytics.yearlyOrders,
          profit: mockAnalytics.yearlyProfit,
        };
    }
  };

  const periodData = getPeriodData();

  const getMarketplaceRevenue = (marketplaceId: string) => {
    return mockAnalytics.revenueByMarketplace.find(r => r.marketplaceId === marketplaceId)?.revenue || 0;
  };

  const getMarketplaceName = (marketplaceId: string) => {
    const marketplace = mockMarketplaces.find(m => m.id === marketplaceId);
    return marketplace?.name || "Невідомо";
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
          <Text style={styles.headerTitle}>Аналітика</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AnalyticsSettings")}
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
          {/* Період аналітики */}
          <View style={styles.periodSelector}>
            <Text style={styles.periodTitle}>Період аналітики</Text>
            <View style={styles.periodButtons}>
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === "week" && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod("week")}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === "week" && styles.periodButtonTextActive
                ]}>
                  Тиждень
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === "month" && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod("month")}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === "month" && styles.periodButtonTextActive
                ]}>
                  Місяць
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.periodButton,
                  selectedPeriod === "year" && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod("year")}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === "year" && styles.periodButtonTextActive
                ]}>
                  Рік
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Основні показники */}
          <View style={styles.mainMetrics}>
            <Text style={styles.sectionTitle}>Основні показники</Text>
            <View style={styles.metricsGrid}>
              <StatsCard
                icon="account-balance-wallet"
                value={formatCurrency(periodData.revenue)}
                title="Виручка"
                subtitle={`За ${selectedPeriod === "week" ? "тиждень" : selectedPeriod === "month" ? "місяць" : "рік"}`}
                color="#4A90E2"
                size="large"
                trend={{ value: "+12.5%", type: "positive" }}
              />
              
              <StatsCard
                icon="trending-up"
                value={formatCurrency(periodData.profit)}
                title="Прибуток"
                subtitle={`За ${selectedPeriod === "week" ? "тиждень" : selectedPeriod === "month" ? "місяць" : "рік"}`}
                color="#50C878"
                size="large"
                trend={{ value: "+8.3%", type: "positive" }}
              />
              
              <StatsCard
                icon="shopping-cart"
                value={periodData.orders.toString()}
                title="Замовлень"
                subtitle={`За ${selectedPeriod === "week" ? "тиждень" : selectedPeriod === "month" ? "місяць" : "рік"}`}
                color="#F39C12"
                size="large"
                trend={{ value: "+15.2%", type: "positive" }}
              />
            </View>
          </View>

          {/* Виручка по маркетплейсах */}
          <View style={styles.marketplaceRevenue}>
            <Text style={styles.sectionTitle}>Виручка по маркетплейсах</Text>
            <Card variant="default" padding="large">
              {mockAnalytics.revenueByMarketplace.map((item, index) => (
                <View key={item.marketplaceId} style={styles.marketplaceItem}>
                  <View style={styles.marketplaceInfo}>
                    <View style={[styles.marketplaceIcon, { backgroundColor: '#4A90E2' + '20' }]}>
                      <Icon name="store" size={20} color="#4A90E2" />
                    </View>
                    <View style={styles.marketplaceDetails}>
                      <Text style={styles.marketplaceName}>
                        {getMarketplaceName(item.marketplaceId)}
                      </Text>
                      <Text style={styles.marketplaceRevenueText}>
                        {formatCurrency(item.revenue)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.revenueBar}>
                    <View 
                      style={[
                        styles.revenueBarFill,
                        { 
                          width: `${(item.revenue / Math.max(...mockAnalytics.revenueByMarketplace.map(r => r.revenue))) * 100}%`,
                          backgroundColor: '#4A90E2'
                        }
                      ]} 
                    />
                  </View>
                  
                  {index < mockAnalytics.revenueByMarketplace.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </Card>
          </View>

          {/* ТОП товари */}
          <View style={styles.topProducts}>
            <Text style={styles.sectionTitle}>ТОП товари</Text>
            <Card variant="default" padding="large">
              {mockTopProducts.slice(0, 5).map((product, index) => (
                <View key={product.id} style={styles.productItem}>
                  <View style={styles.productRank}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                  </View>
                  
                  <View style={styles.productStats}>
                    <Text style={styles.productRevenue}>
                      {formatCurrency(product.revenue)}
                    </Text>
                    <Text style={styles.productOrders}>
                      {product.orders} замовлень
                    </Text>
                  </View>
                  
                  {index < 4 && <View style={styles.separator} />}
                </View>
              ))}
            </Card>
          </View>

          {/* Категорії витрат */}
          <View style={styles.expenseCategories}>
            <Text style={styles.sectionTitle}>Категорії витрат</Text>
            <Card variant="default" padding="large">
              {mockAnalytics.expenseCategories.map((category, index) => (
                <View key={category.name} style={styles.expenseItem}>
                  <View style={styles.expenseInfo}>
                    <View style={[styles.expenseIcon, { backgroundColor: category.color + '20' }]}>
                      <Icon name="account-balance" size={20} color={category.color} />
                    </View>
                    <View style={styles.expenseDetails}>
                      <Text style={styles.expenseName}>{category.name}</Text>
                      <Text style={styles.expenseAmount}>
                        {formatCurrency(category.amount)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.expensePercentage}>
                    <Text style={styles.percentageText}>
                      {category.percentage}%
                    </Text>
                  </View>
                  
                  {index < mockAnalytics.expenseCategories.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </Card>
          </View>

          {/* Швидкі дії */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Швидкі дії</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("GenerateReport")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#50C878' + '20' }]}>
                  <Icon name="description" size={24} color="#50C878" />
                </View>
                <Text style={styles.actionText}>Згенерувати звіт</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("ExportReport")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#F39C12' + '20' }]}>
                  <Icon name="download" size={24} color="#F39C12" />
                </View>
                <Text style={styles.actionText}>Експорт даних</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("Comparison")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#9B59B6' + '20' }]}>
                  <Icon name="compare" size={24} color="#9B59B6" />
                </View>
                <Text style={styles.actionText}>Порівняння періодів</Text>
              </TouchableOpacity>
            </View>
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
  
  // Селектор періоду
  periodSelector: {
    marginBottom: 24,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  periodButtonTextActive: {
    color: "#FFFFFF",
  },
  
  // Основні показники
  mainMetrics: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  metricsGrid: {
    gap: 16,
  },
  
  // Виручка по маркетплейсах
  marketplaceRevenue: {
    marginBottom: 24,
  },
  marketplaceItem: {
    marginBottom: 16,
  },
  marketplaceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  marketplaceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  marketplaceDetails: {
    flex: 1,
  },
  marketplaceName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  marketplaceRevenueText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
  },
  revenueBar: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  revenueBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  
  // ТОП товари
  topProducts: {
    marginBottom: 24,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  productRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
    lineHeight: 20,
  },
  productCategory: {
    fontSize: 14,
    color: "#999",
  },
  productStats: {
    alignItems: "flex-end",
  },
  productRevenue: {
    fontSize: 16,
    color: "#50C878",
    fontWeight: "bold",
    marginBottom: 4,
  },
  productOrders: {
    fontSize: 12,
    color: "#999",
  },
  
  // Категорії витрат
  expenseCategories: {
    marginBottom: 24,
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  expenseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  expenseAmount: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  expensePercentage: {
    marginLeft: 16,
  },
  percentageText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
  },
  
  // Роздільники
  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 16,
  },
  
  // Швидкі дії
  quickActions: {
    marginBottom: 24,
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
}); 