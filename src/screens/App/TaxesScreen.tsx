import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { mockTaxes } from "../../services/mockData";

interface TaxesScreenProps {
  navigation: any;
}

export const TaxesScreen: React.FC<TaxesScreenProps> = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredTaxes = useMemo(() => {
    return mockTaxes.filter((tax) => {
      const matchesPeriod = selectedPeriod === "all" || tax.period === selectedPeriod;
      const matchesStatus = selectedStatus === "all" || tax.isPaid === (selectedStatus === "paid");
      return matchesPeriod && matchesStatus;
    });
  }, [selectedPeriod, selectedStatus]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTaxTypeName = (type: string) => {
    switch (type) {
      case "esv": return "ЄСВ";
      case "single_tax": return "Єдиний податок";
      case "other": return "Інші податки";
      default: return type;
    }
  };

  const getTaxTypeIcon = (type: string) => {
    switch (type) {
      case "esv": return "account-balance";
      case "single_tax": return "receipt";
      case "other": return "description";
      default: return "account-balance";
    }
  };

  const getTaxTypeColor = (type: string) => {
    switch (type) {
      case "esv": return "#FF6B6B";
      case "single_tax": return "#4A90E2";
      case "other": return "#F39C12";
      default: return "#999";
    }
  };

  const getPeriodName = (period: string) => {
    const [year, month] = period.split('-');
    const monthNames = [
      'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
      'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const totalTaxes = filteredTaxes.reduce((sum, tax) => sum + tax.amount, 0);
  const paidTaxes = filteredTaxes.filter(tax => tax.isPaid).reduce((sum, tax) => sum + tax.amount, 0);
  const pendingTaxes = filteredTaxes.filter(tax => !tax.isPaid).reduce((sum, tax) => sum + tax.amount, 0);

  const handleMarkAsPaid = (taxId: string) => {
    Alert.alert(
      "Підтвердження оплати",
      "Позначити податок як оплачений?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Підтвердити", 
          onPress: () => {
            // Тут будет логика обновления статуса
            Alert.alert("Успішно", "Податок позначено як оплачений");
          }
        }
      ]
    );
  };

  const handleAddReceipt = (taxId: string) => {
    navigation.navigate("AddReceipt", { taxId });
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
          <Text style={styles.headerTitle}>Податки</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("TaxSettings")}
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
          {/* Статистика */}
          <View style={styles.statsContainer}>
            <Card variant="elevated" padding="medium" style={styles.statCard}>
              <View style={styles.statContent}>
                <Icon name="account-balance" size={24} color="#FF6B6B" />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{formatCurrency(totalTaxes)}</Text>
                  <Text style={styles.statLabel}>Загальна сума</Text>
                </View>
              </View>
            </Card>
            
            <Card variant="elevated" padding="medium" style={styles.statCard}>
              <View style={styles.statContent}>
                <Icon name="check-circle" size={24} color="#50C878" />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{formatCurrency(paidTaxes)}</Text>
                  <Text style={styles.statLabel}>Оплачено</Text>
                </View>
              </View>
            </Card>
            
            <Card variant="elevated" padding="medium" style={styles.statCard}>
              <View style={styles.statContent}>
                <Icon name="schedule" size={24} color="#F39C12" />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{formatCurrency(pendingTaxes)}</Text>
                  <Text style={styles.statLabel}>Очікує оплати</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Фільтри */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Фільтри</Text>
            
            {/* Фільтр по періоду */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Період</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedPeriod === "all" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedPeriod("all")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedPeriod === "all" && styles.filterChipTextActive
                  ]}>
                    Всі
                  </Text>
                </TouchableOpacity>
                
                {Array.from(new Set(mockTaxes.map(tax => tax.period))).map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.filterChip,
                      selectedPeriod === period && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedPeriod === period && styles.filterChipTextActive
                    ]}>
                      {getPeriodName(period)}
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
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedStatus === "paid" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedStatus("paid")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedStatus === "paid" && styles.filterChipTextActive
                  ]}>
                    Оплачено
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedStatus === "pending" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedStatus("pending")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedStatus === "pending" && styles.filterChipTextActive
                  ]}>
                    Очікує оплати
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          {/* Список податків */}
          <View style={styles.taxesSection}>
            <View style={styles.taxesHeader}>
              <Text style={styles.taxesTitle}>Податки</Text>
              <Text style={styles.taxesCount}>({filteredTaxes.length})</Text>
            </View>
            
            {filteredTaxes.length === 0 ? (
              <Card variant="outlined" padding="large" style={styles.emptyCard}>
                <View style={styles.emptyContent}>
                  <Icon name="account-balance" size={48} color="#999" />
                  <Text style={styles.emptyTitle}>Податків не знайдено</Text>
                  <Text style={styles.emptySubtitle}>
                    Спробуйте змінити фільтри або додати новий податок
                  </Text>
                </View>
              </Card>
            ) : (
              filteredTaxes.map((tax) => (
                <Card
                  key={tax.id}
                  variant="default"
                  padding="medium"
                  style={styles.taxCard}
                >
                  <View style={styles.taxHeader}>
                    <View style={styles.taxType}>
                      <View style={[
                        styles.taxTypeIcon,
                        { backgroundColor: getTaxTypeColor(tax.type) + '20' }
                      ]}>
                        <Icon name={getTaxTypeIcon(tax.type)} size={20} color={getTaxTypeColor(tax.type)} />
                      </View>
                      <View style={styles.taxTypeInfo}>
                        <Text style={styles.taxTypeName}>
                          {getTaxTypeName(tax.type)}
                        </Text>
                        <Text style={styles.taxPeriod}>
                          {getPeriodName(tax.period)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={[
                      styles.statusBadge,
                      { 
                        backgroundColor: tax.isPaid ? '#50C878' + '20' : '#F39C12' + '20' 
                      }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: tax.isPaid ? '#50C878' : '#F39C12' }
                      ]}>
                        {tax.isPaid ? 'Оплачено' : 'Очікує оплати'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.taxDetails}>
                    <View style={styles.taxAmount}>
                      <Text style={styles.amountLabel}>Сума:</Text>
                      <Text style={styles.amountValue}>
                        {formatCurrency(tax.amount)}
                      </Text>
                    </View>
                    
                    <View style={styles.taxDates}>
                      <View style={styles.dateItem}>
                        <Text style={styles.dateLabel}>Термін оплати:</Text>
                        <Text style={[
                          styles.dateValue,
                          { color: new Date(tax.dueDate) < new Date() ? '#FF6B6B' : '#999' }
                        ]}>
                          {formatDate(tax.dueDate)}
                        </Text>
                      </View>
                      
                      {tax.isPaid && tax.paymentDate && (
                        <View style={styles.dateItem}>
                          <Text style={styles.dateLabel}>Дата оплати:</Text>
                          <Text style={styles.dateValue}>
                            {formatDate(tax.paymentDate)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.taxActions}>
                    {!tax.isPaid ? (
                      <Button
                        title="Позначити як оплачений"
                        onPress={() => handleMarkAsPaid(tax.id)}
                        variant="primary"
                        style={styles.actionButton}
                      />
                    ) : (
                      <View style={styles.paidActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleAddReceipt(tax.id)}
                        >
                          <Icon name="receipt" size={20} color="#4A90E2" />
                          <Text style={styles.actionButtonText}>Додати чек</Text>
                        </TouchableOpacity>
                        
                        {tax.receipt && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("ViewReceipt", { taxId: tax.id })}
                          >
                            <Icon name="visibility" size={20} color="#50C878" />
                            <Text style={styles.actionButtonText}>Переглянути чек</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                </Card>
              ))
            )}
          </View>

          {/* Швидкі дії */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Швидкі дії</Text>
            <View style={styles.actionsGrid}>
                             <TouchableOpacity
                 style={styles.quickActionButton}
                 onPress={() => navigation.navigate("AddTax")}
                 activeOpacity={0.7}
               >
                <View style={[styles.actionIcon, { backgroundColor: '#4A90E2' + '20' }]}>
                  <Icon name="add" size={24} color="#4A90E2" />
                </View>
                <Text style={styles.actionText}>Додати податок</Text>
              </TouchableOpacity>

                             <TouchableOpacity
                 style={styles.quickActionButton}
                 onPress={() => navigation.navigate("TaxCalculator")}
                 activeOpacity={0.7}
               >
                <View style={[styles.actionIcon, { backgroundColor: '#50C878' + '20' }]}>
                  <Icon name="calculate" size={24} color="#50C878" />
                </View>
                <Text style={styles.actionText}>Калькулятор податків</Text>
              </TouchableOpacity>

                             <TouchableOpacity
                 style={styles.quickActionButton}
                 onPress={() => navigation.navigate("TaxCalendar")}
                 activeOpacity={0.7}
               >
                <View style={[styles.actionIcon, { backgroundColor: '#F39C12' + '20' }]}>
                  <Icon name="event" size={24} color="#F39C12" />
                </View>
                <Text style={styles.actionText}>Календар податків</Text>
              </TouchableOpacity>

                             <TouchableOpacity
                 style={styles.quickActionButton}
                 onPress={() => navigation.navigate("TaxReports")}
                 activeOpacity={0.7}
               >
                <View style={[styles.actionIcon, { backgroundColor: '#9B59B6' + '20' }]}>
                  <Icon name="assessment" size={24} color="#9B59B6" />
                </View>
                <Text style={styles.actionText}>Звіти по податках</Text>
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
  
  // Податки
  taxesSection: {
    marginBottom: 20,
  },
  taxesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  taxesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  taxesCount: {
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
  
  // Картка податку
  taxCard: {
    marginBottom: 16,
  },
  taxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  taxType: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taxTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taxTypeInfo: {
    flex: 1,
  },
  taxTypeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  taxPeriod: {
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
  
  taxDetails: {
    marginBottom: 16,
  },
  taxAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: "#999",
  },
  amountValue: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  taxDates: {
    gap: 8,
  },
  dateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
    color: "#999",
  },
  dateValue: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  
  taxActions: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  paidActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#4A90E2",
    marginLeft: 8,
  },
  
  // Швидкі дії
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
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
}); 