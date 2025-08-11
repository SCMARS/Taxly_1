import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
} from "react-native";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { mockDocuments, mockOrders } from "../../services/mockData";

interface DocumentsScreenProps {
  navigation: any;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      const matchesType = selectedType === "all" || doc.type === selectedType;
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [selectedCategory, selectedType, searchQuery]);

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

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "receipt": return "Чек";
      case "invoice": return "Рахунок";
      case "tax_form": return "Податкова форма";
      case "other": return "Інше";
      default: return type;
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "receipt": return "receipt";
      case "invoice": return "description";
      case "tax_form": return "account-balance";
      case "other": return "insert-drive-file";
      default: return "description";
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "receipt": return "#50C878";
      case "invoice": return "#4A90E2";
      case "tax_form": return "#FF6B6B";
      case "other": return "#F39C12";
      default: return "#999";
    }
  };

  const getOrderInfo = (orderId?: string) => {
    if (!orderId) return null;
    return mockOrders.find(order => order.id === orderId);
  };

  const totalDocuments = filteredDocuments.length;
  const totalSize = filteredDocuments.reduce((sum, doc) => sum + (doc.amount || 0), 0);

  const handleViewDocument = (document: any) => {
    // Тут будет логика просмотра документа
    Alert.alert("Перегляд документа", `Відкриваю: ${document.name}`);
  };

  const handleDeleteDocument = (documentId: string) => {
    Alert.alert(
      "Видалення документа",
      "Ви впевнені, що хочете видалити цей документ?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити", 
          style: "destructive",
          onPress: () => {
            // Тут будет логика удаления
            Alert.alert("Успішно", "Документ видалено");
          }
        }
      ]
    );
  };

  const categories = Array.from(new Set(mockDocuments.map(doc => doc.category)));
  const types = Array.from(new Set(mockDocuments.map(doc => doc.type)));

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
          <Text style={styles.headerTitle}>Документи</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ManualUpload")}
            style={styles.uploadButton}
          >
            <Icon name="cloud-upload" size={24} color="#4A90E2" />
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
                <Icon name="folder" size={24} color="#4A90E2" />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{totalDocuments}</Text>
                  <Text style={styles.statLabel}>Документів</Text>
                </View>
              </View>
            </Card>
            
            <Card variant="elevated" padding="medium" style={styles.statCard}>
              <View style={styles.statContent}>
                <Icon name="account-balance-wallet" size={24} color="#50C878" />
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{formatCurrency(totalSize)}</Text>
                  <Text style={styles.statLabel}>Загальна сума</Text>
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
                placeholder="Пошук по назві документа"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </Card>

          {/* Фільтри */}
          <View style={styles.filtersContainer}>
            <Text style={styles.filtersTitle}>Фільтри</Text>
            
            {/* Фільтр по категорії */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Категорія</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedCategory === "all" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedCategory("all")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedCategory === "all" && styles.filterChipTextActive
                  ]}>
                    Всі
                  </Text>
                </TouchableOpacity>
                
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      selectedCategory === category && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedCategory === category && styles.filterChipTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Фільтр по типу */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Тип документа</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    selectedType === "all" && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedType("all")}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedType === "all" && styles.filterChipTextActive
                  ]}>
                    Всі
                  </Text>
                </TouchableOpacity>
                
                {types.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      selectedType === type && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedType === type && styles.filterChipTextActive
                    ]}>
                      {getDocumentTypeName(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Список документів */}
          <View style={styles.documentsSection}>
            <View style={styles.documentsHeader}>
              <Text style={styles.documentsTitle}>Документи</Text>
              <Text style={styles.documentsCount}>({filteredDocuments.length})</Text>
            </View>
            
            {filteredDocuments.length === 0 ? (
              <Card variant="outlined" padding="large" style={styles.emptyCard}>
                <View style={styles.emptyContent}>
                  <Icon name="folder" size={48} color="#999" />
                  <Text style={styles.emptyTitle}>Документів не знайдено</Text>
                  <Text style={styles.emptySubtitle}>
                    Спробуйте змінити фільтри або додати новий документ
                  </Text>
                </View>
              </Card>
            ) : (
              filteredDocuments.map((document) => {
                const relatedOrder = getOrderInfo(document.relatedOrderId);
                
                return (
                  <Card
                    key={document.id}
                    variant="default"
                    padding="medium"
                    style={styles.documentCard}
                  >
                    <View style={styles.documentHeader}>
                      <View style={styles.documentType}>
                        <View style={[
                          styles.documentTypeIcon,
                          { backgroundColor: getDocumentTypeColor(document.type) + '20' }
                        ]}>
                          <Icon 
                            name={getDocumentTypeIcon(document.type)} 
                            size={20} 
                            color={getDocumentTypeColor(document.type)} 
                          />
                        </View>
                        <View style={styles.documentTypeInfo}>
                          <Text style={styles.documentTypeName}>
                            {getDocumentTypeName(document.type)}
                          </Text>
                          <Text style={styles.documentCategory}>
                            {document.category}
                          </Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.moreButton}
                        onPress={() => {
                          Alert.alert(
                            "Дії з документом",
                            document.name,
                            [
                              { text: "Переглянути", onPress: () => handleViewDocument(document) },
                              { text: "Видалити", style: "destructive", onPress: () => handleDeleteDocument(document.id) },
                              { text: "Скасувати", style: "cancel" }
                            ]
                          );
                        }}
                      >
                        <Icon name="more-vert" size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.documentContent}>
                      <Text style={styles.documentName} numberOfLines={2}>
                        {document.name}
                      </Text>
                      
                      <View style={styles.documentDetails}>
                        <View style={styles.detailItem}>
                          <Icon name="schedule" size={16} color="#999" />
                          <Text style={styles.detailText}>
                            {formatDate(document.uploadDate)}
                          </Text>
                        </View>
                        
                        {document.amount && (
                          <View style={styles.detailItem}>
                            <Icon name="account-balance-wallet" size={16} color="#999" />
                            <Text style={styles.detailText}>
                              {formatCurrency(document.amount)}
                            </Text>
                          </View>
                        )}
                        
                        {relatedOrder && (
                          <View style={styles.detailItem}>
                            <Icon name="shopping-cart" size={16} color="#999" />
                            <Text style={styles.detailText}>
                              Замовлення: {relatedOrder.orderNumber}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.documentActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleViewDocument(document)}
                        activeOpacity={0.7}
                      >
                        <Icon name="visibility" size={20} color="#4A90E2" />
                        <Text style={styles.actionButtonText}>Переглянути</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate("EditDocument", { documentId: document.id })}
                        activeOpacity={0.7}
                      >
                        <Icon name="edit" size={20} color="#F39C12" />
                        <Text style={styles.actionButtonText}>Редагувати</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                );
              })
            )}
          </View>

          {/* Швидкі дії */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Швидкі дії</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("ManualUpload")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#4A90E2' + '20' }]}>
                  <Icon name="cloud-upload" size={24} color="#4A90E2" />
                </View>
                <Text style={styles.actionText}>Завантажити документ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("ScanDocument")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#50C878' + '20' }]}>
                  <Icon name="camera-alt" size={24} color="#50C878" />
                </View>
                <Text style={styles.actionText}>Сканувати документ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("DocumentTemplates")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#F39C12' + '20' }]}>
                  <Icon name="description" size={24} color="#F39C12" />
                </View>
                <Text style={styles.actionText}>Шаблони документів</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate("DocumentExport")}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#9B59B6' + '20' }]}>
                  <Icon name="download" size={24} color="#9B59B6" />
                </View>
                <Text style={styles.actionText}>Експорт документів</Text>
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
  uploadButton: {
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
  
  // Документи
  documentsSection: {
    marginBottom: 20,
  },
  documentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  documentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  documentsCount: {
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
  
  // Картка документа
  documentCard: {
    marginBottom: 16,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  documentType: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentTypeInfo: {
    flex: 1,
  },
  documentTypeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  documentCategory: {
    fontSize: 14,
    color: "#999",
  },
  moreButton: {
    padding: 8,
  },
  
  documentContent: {
    marginBottom: 16,
  },
  documentName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
    lineHeight: 20,
  },
  documentDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
  },
  
  documentActions: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
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