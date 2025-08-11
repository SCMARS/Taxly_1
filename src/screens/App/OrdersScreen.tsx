import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { mockOrders, mockMarketplaces } from "../../services/mockData";

interface OrdersScreenProps {
  navigation: any;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      
      const matchesMarketplace = selectedMarketplace === "all" || order.marketplaceId === selectedMarketplace;
      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
      
      return matchesSearch && matchesMarketplace && matchesStatus;
    });
  }, [searchQuery, selectedMarketplace, selectedStatus]);

  const getMarketplaceName = (marketplaceId: string) => {
    const marketplace = mockMarketplaces.find(m => m.id === marketplaceId);
    return marketplace?.name || "Невідомо";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#50C878";
      case "pending": return "#F39C12";
      case "cancelled": return "#FF6B6B";
      default: return "#999";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Завершено";
      case "pending": return "В обробці";
      case "cancelled": return "Скасовано";
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.netAmount, 0);
  const totalOrders = filteredOrders.length;

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
          <Text style={styles.headerTitle}>Продажі</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddOrder")}
            style={styles.addButton}
          >
            <Icon name="add" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Статистика */}
          <View style={styles.statsContainer}>
            <Card variant="elevated" padding="medium" style={styles.statCard}>
              <View style={styles.statContent}>
                <Icon name="shopping-cart" size={24} color="#4A90E2" />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{totalOrders}</Text>
                  <Text style={styles.statLabel}>Замовлень</Text>
                </View>
              </View>
            </Card>
            
            <Card variant="elevated" padding="medium" style={styles.statCard}>
              <View style={styles.statContent}>
                <Icon name="account-balance-wallet" size={24} color="#50C878" />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{formatCurrency(totalRevenue)}</Text>
                  <Text style={styles.statLabel}>Виручка</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Пошук */}
          <Card variant="default" padding="medium" style={styles.searchCard}>
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Пошук за номером замовлення або ім'ям клієнта"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </Card>

          {/* Фільтри */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Фільтри</Text>
            
            {/* Фільтр по маркетплейсу */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Маркетплейс</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedMarketplace === "all" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedMarketplace("all")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedMarketplace === "all" && styles.filterChipTextActive
                  ]}>
                    Всі
                  </Text>
                </TouchableOpacity>
                
                {mockMarketplaces.map((marketplace) => (
                  <TouchableOpacity
                    key={marketplace.id}
                    style={[
                      styles.filterChip,
                      selectedMarketplace === marketplace.id && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedMarketplace(marketplace.id)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedMarketplace === marketplace.id && styles.filterChipTextActive
                    ]}>
                      {marketplace.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Фільтр по статусу */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Статус</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedStatus === "all" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedStatus("all")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedStatus === "all" && styles.filterChipTextActive
                  ]}>
                    Всі
                  </Text>
                </TouchableOpacity>
                
                {["completed", "pending", "cancelled"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterChip,
                      selectedStatus === status && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedStatus === status && styles.filterChipTextActive
                    ]}>
                      {getStatusText(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Список замовлень */}
          <View style={styles.ordersSection}>
            <View style={styles.ordersHeader}>
              <Text style={styles.ordersTitle}>Замовлення</Text>
              <Text style={styles.ordersCount}>({filteredOrders.length})</Text>
            </View>
            
            {filteredOrders.length === 0 ? (
              <Card variant="outlined" padding="large" style={styles.emptyCard}>
                <View style={styles.emptyContent}>
                  <Icon name="shopping-cart" size={48} color="#999" />
                  <Text style={styles.emptyTitle}>Замовлень не знайдено</Text>
                  <Text style={styles.emptySubtitle}>
                    Спробуйте змінити фільтри або пошуковий запит
                  </Text>
                </View>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  variant="default"
                  padding="medium"
                  style={styles.orderCard}
                  onPress={() => navigation.navigate("OrderDetail", { order })}
                >
                  <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>{order.date}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(order.status) }
                      ]}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderDetails}>
                    <View style={styles.customerInfo}>
                      <Icon name="person" size={16} color="#999" />
                      <Text style={styles.customerName}>{order.customerName || "Клієнт не вказано"}</Text>
                    </View>
                    
                    <View style={styles.marketplaceInfo}>
                      <Icon name="store" size={16} color="#999" />
                      <Text style={styles.marketplaceName}>
                        {getMarketplaceName(order.marketplaceId)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <View key={item.id} style={styles.orderItem}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                        <Text style={styles.itemPrice}>
                          {formatCurrency(item.totalPrice)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.orderFooter}>
                    <View style={styles.orderTotals}>
                      <Text style={styles.totalLabel}>Сума:</Text>
                      <Text style={styles.totalAmount}>
                        {formatCurrency(order.totalAmount)}
                      </Text>
                    </View>
                    
                    <View style={styles.orderTotals}>
                      <Text style={styles.totalLabel}>Комісія:</Text>
                      <Text style={styles.commissionAmount}>
                        {formatCurrency(order.commission)}
                      </Text>
                    </View>
                    
                    <View style={styles.orderTotals}>
                      <Text style={styles.totalLabel}>Чистий прибуток:</Text>
                      <Text style={styles.netAmount}>
                        {formatCurrency(order.netAmount)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))
            )}
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Статистика
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
  },
  
  // Пошук
  searchCard: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 8,
  },
  
  // Фільтри
  filtersContainer: {
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  filterChipText: {
    fontSize: 14,
    color: "#999",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  
  // Замовлення
  ordersSection: {
    marginBottom: 20,
  },
  ordersHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  ordersCount: {
    fontSize: 16,
    color: "#999",
    marginLeft: 8,
  },
  
  // Пустий стан
  emptyCard: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContent: {
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  
  // Картка замовлення
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  marketplaceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  marketplaceName: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    marginRight: 12,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#999",
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
  },
  
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 16,
  },
  orderTotals: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: "#999",
  },
  totalAmount: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  commissionAmount: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
  },
  netAmount: {
    fontSize: 16,
    color: "#50C878",
    fontWeight: "bold",
  },
}); 