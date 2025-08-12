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
} from "react-native";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { AIService, AIRecommendation, AIConversation } from "../../services/aiService";
import { BusinessDataService, BusinessMetrics, MarketplacePerformance } from "../../services/businessDataService";

interface AIScreenProps {
  navigation: any;
}

export const AIScreen: React.FC<AIScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [marketplacePerformance, setMarketplacePerformance] = useState<MarketplacePerformance[]>([]);
  const [conversation, setConversation] = useState<AIConversation>({
    id: 'conv_1',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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

    // Инициализируем данные и загружаем AI рекомендации
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      // Инициализируем демо данные, если их нет
      await BusinessDataService.initializeWithDemoData();
      
      // Загружаем реальные бизнес данные
      const metrics = await BusinessDataService.getBusinessMetrics();
      const marketplace = await BusinessDataService.getMarketplacePerformance();
      
      setBusinessMetrics(metrics);
      setMarketplacePerformance(marketplace);
      
      // Загружаем AI рекомендации на основе реальных данных
      await loadAIRecommendations();
    } catch (error) {
      console.error('Ошибка инициализации данных:', error);
    }
  };

  const loadAIRecommendations = async () => {
    try {
      setIsGenerating(true);
      console.log('Загружаем AI рекомендации...');
      
      const recommendations = await AIService.getBusinessRecommendations();
      console.log('Получены рекомендации:', recommendations.length);
      
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Ошибка при загрузке AI рекомендаций:', error);
      // Показываем базовые рекомендации при ошибке
      setAiRecommendations([
        {
          id: 'rec-1',
          type: 'price_optimization',
          title: 'Оптимізація цін',
          description: 'Проаналізуйте конкурентні ціни та оптимізуйте свою цінову стратегію',
          priority: 'high',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'rec-2',
          type: 'tax_reminder',
          title: 'Податкове планування',
          description: 'Плануйте податки заздалегідь для уникнення штрафів',
          priority: 'high',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = [
    { id: "all", name: "Всі", color: "#999" },
    { id: "price_optimization", name: "Ціни", color: "#4A90E2" },
    { id: "inventory_management", name: "Склад", color: "#50C878" },
    { id: "sales_forecast", name: "Прогнози", color: "#F39C12" },
    { id: "tax_reminder", name: "Податки", color: "#FF6B6B" },
  ];

  const filteredRecommendations = aiRecommendations.filter((rec) => {
    if (selectedCategory !== "all" && rec.type !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      return (
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#FF6B6B";
      case "medium":
        return "#F39C12";
      case "low":
        return "#50C878";
      default:
        return "#999";
    }
  };

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case "high":
        return "Високий";
      case "medium":
        return "Середній";
      case "low":
        return "Низький";
      default:
        return "Не визначено";
    }
  };

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      const insights = await AIService.analyzeMarket();
      Alert.alert("AI Аналіз ринку", insights);
    } catch (error) {
      console.error('Ошибка при генерации инсайтов:', error);
      Alert.alert("Помилка", "Не удалось сгенерировать инсайты");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const userMsg = {
      role: 'user' as const,
      content: userMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, userMsg],
      updatedAt: new Date().toISOString()
    };
    setConversation(updatedConversation);
    setUserMessage("");
    setIsTyping(true);

    try {
      const aiResponse = await AIService.chatWithAI(userMsg.content, updatedConversation);

      const aiMsg = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Ошибка при получении ответа от AI:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinancialAnalysis = async () => {
    try {
      const analysis = await AIService.analyzeFinancialMetrics();
      Alert.alert("Фінансовий аналіз", analysis);
    } catch (error) {
      console.error('Ошибка при финансовом анализе:', error);
      Alert.alert("Помилка", "Не удалось провести финансовый анализ");
    }
  };

  const handleTaxPlanning = async () => {
    try {
      const taxPlan = await AIService.planTaxes();
      Alert.alert("Податкове планування", taxPlan);
    } catch (error) {
      console.error('Ошибка при налоговом планировании:', error);
      Alert.alert("Помилка", "Не удалось спланировать налоги");
    }
  };

  const getMarketplaceInsights = () => {
    if (!marketplacePerformance.length) {
      return [
        {
          name: 'Немає даних',
          revenue: 0,
          orders: 0,
          avgOrder: 0
        }
      ];
    }

    return marketplacePerformance.map(mp => ({
      name: mp.name,
      revenue: mp.revenue,
      orders: mp.orders,
      avgOrder: mp.averageOrder
    }));
  };

  const getProfitTrend = () => {
    if (!businessMetrics) return [];
    
    // Имитируем тренд на основе текущих данных
    return [
      { month: 'Січ', profit: businessMetrics.profit * 0.8 },
      { month: 'Лют', profit: businessMetrics.profit * 0.9 },
      { month: 'Бер', profit: businessMetrics.profit },
      { month: 'Кві', profit: businessMetrics.profit * 1.1 },
      { month: 'Тра', profit: businessMetrics.profit * 1.2 }
    ];
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('uk-UA')} грн`;
  };

  const handleRecommendationPress = (recommendation: AIRecommendation) => {
    Alert.alert(
      `Рекомендація: ${recommendation.title}`,
      recommendation.description,
      [{ text: "ОК", onPress: () => console.log("Рекомендація натиснута") }]
    );
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
          <Text style={styles.title}>AI Помічник</Text>
          <Text style={styles.subtitle}>
            Штучний інтелект для аналізу та рекомендацій
          </Text>
        </Animated.View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* AI Чат */}
          <Animated.View
            style={[
              styles.aiChatSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>💬 Чат з AI</Text>
            <Card variant="elevated" padding="large">
              {/* История чата */}
              <ScrollView style={styles.chatHistory} showsVerticalScrollIndicator={false}>
                {conversation.messages.map((msg, index) => (
                  <View key={index} style={[
                    styles.messageContainer,
                    msg.role === 'user' ? styles.userMessage : styles.aiMessage
                  ]}>
                    <Text style={[
                      styles.messageText,
                      msg.role === 'user' ? styles.userMessageText : styles.aiMessageText
                    ]}>
                      {msg.content}
                    </Text>
                    <Text style={styles.messageTime}>
                      {new Date(msg.timestamp).toLocaleTimeString('uk-UA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                ))}
                {isTyping && (
                  <View style={[styles.messageContainer, styles.aiMessage]}>
                    <Text style={[styles.messageText, styles.aiMessageText]}>
                      AI друкує...
                    </Text>
                  </View>
                )}
              </ScrollView>
              
              {/* Поле ввода */}
              <View style={styles.chatInputContainer}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Задайте питання про ваш бізнес..."
                  value={userMessage}
                  onChangeText={setUserMessage}
                  placeholderTextColor="#999"
                  multiline
                />
                <Button
                  title="Надіслати"
                  onPress={handleSendMessage}
                  style={styles.sendButton}
                  variant="primary"
                  disabled={!userMessage.trim() || isTyping}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Швидкий аналіз */}
          <Animated.View
            style={[
              styles.quickAnalysis,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>📊 Швидкий аналіз</Text>
            <View style={styles.analysisGrid}>
              <Card variant="elevated" padding="medium" style={styles.analysisCard}>
                <Text style={styles.analysisIcon}>📈</Text>
                <Text style={styles.analysisTitle}>Тренд прибутку</Text>
                <Text style={styles.analysisText}>
                  {getProfitTrend().map(item => `${item.month}: ${formatCurrency(item.profit)}`).join('\n')}
                </Text>
              </Card>
              <Card variant="elevated" padding="medium" style={styles.analysisCard}>
                <Text style={styles.analysisIcon}>🎯</Text>
                <Text style={styles.analysisTitle}>AI Рекомендація</Text>
                <Text style={styles.analysisText}>
                  Зосередьтеся на розширенні асортименту в найприбутковіших категоріях
                </Text>
              </Card>
            </View>
          </Animated.View>

          {/* Швидкі дії AI */}
          <Animated.View
            style={[
              styles.quickActions,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>🚀 Швидкі дії AI</Text>
            <View style={styles.quickActionsGrid}>
              <Button
                title="Фінансовий аналіз"
                onPress={handleFinancialAnalysis}
                style={styles.quickActionButton}
                variant="primary"
                icon="analytics"
              />
              <Button
                title="Налогове планування"
                onPress={handleTaxPlanning}
                style={styles.quickActionButton}
                variant="secondary"
                icon="account-balance"
              />
              <Button
                title="Новий аналіз"
                onPress={handleGenerateInsights}
                style={styles.quickActionButton}
                variant="secondary"
                icon="refresh"
                disabled={isGenerating}
              />
            </View>
          </Animated.View>

          {/* Фільтри рекомендацій */}
          <Animated.View
            style={[
              styles.filtersSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Фільтр рекомендацій</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterButton,
                    selectedCategory === category.id && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedCategory === category.id && styles.filterButtonTextActive,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* AI Рекомендації */}
          <View style={styles.aiSection}>
            <View style={styles.sectionHeader}>
              <Icon name="psychology" size={24} color="#FFD700" />
              <Text style={styles.sectionTitle}>AI Рекомендації</Text>
              {isGenerating && (
                <View style={styles.loadingIndicator}>
                  <Text style={styles.loadingText}>AI аналізує дані...</Text>
                </View>
              )}
            </View>
            
            {/* Информация о реальных данных */}
            {businessMetrics && (
              <View style={styles.dataInfo}>
                <Text style={styles.dataInfoTitle}>📊 Аналіз на основі реальних даних:</Text>
                <Text style={styles.dataInfoText}>
                  Дохід: {businessMetrics.revenue} грн | Прибуток: {businessMetrics.profit} грн | 
                  Замовлень: {businessMetrics.ordersCount} | Клієнтів: {businessMetrics.customerCount}
                </Text>
              </View>
            )}
            
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((recommendation) => (
                <TouchableOpacity
                  key={recommendation.id}
                  style={[
                    styles.recommendationCard,
                    recommendation.priority === 'high' && styles.highPriority,
                    recommendation.priority === 'medium' && styles.mediumPriority,
                    recommendation.priority === 'low' && styles.lowPriority,
                  ]}
                  onPress={() => handleRecommendationPress(recommendation)}
                >
                  <View style={styles.recommendationHeader}>
                    <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                    <View style={[
                      styles.priorityBadge,
                      recommendation.priority === 'high' && styles.highPriorityBadge,
                      recommendation.priority === 'medium' && styles.mediumPriorityBadge,
                      recommendation.priority === 'low' && styles.lowPriorityBadge,
                    ]}>
                      <Text style={styles.priorityText}>
                        {recommendation.priority === 'high' ? 'Високий' : 
                         recommendation.priority === 'medium' ? 'Середній' : 'Низький'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
                  <Text style={styles.recommendationDate}>
                    {new Date(recommendation.createdAt).toLocaleDateString('uk-UA')}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noRecommendations}>
                <Icon name="psychology" size={48} color="#666" />
                <Text style={styles.noRecommendationsText}>
                  {isGenerating ? 'AI аналізує ваші дані...' : 'Натисніть "Отримати рекомендації" для аналізу'}
                </Text>
              </View>
            )}
            
            <Button
              title={isGenerating ? "AI аналізує..." : "Отримати рекомендації"}
              onPress={loadAIRecommendations}
              disabled={isGenerating}
              style={styles.getRecommendationsButton}
            />
          </View>

          {/* Аналіз маркетплейсів */}
          <Animated.View
            style={[
              styles.marketplaceAnalysis,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>🏪 Аналіз маркетплейсів</Text>
            {getMarketplaceInsights().map((insight, index) => (
              <Card key={index} variant="elevated" padding="large" style={styles.marketplaceCard}>
                <View style={styles.marketplaceHeader}>
                  <Text style={styles.marketplaceName}>{insight.name}</Text>
                  <Text style={styles.marketplaceRevenue}>
                    {formatCurrency(insight.revenue)}
                  </Text>
                </View>
                <View style={styles.marketplaceStats}>
                  <Text style={styles.marketplaceStat}>
                    Замовлень: {insight.orders}
                  </Text>
                  <Text style={styles.marketplaceStat}>
                    Середній чек: {formatCurrency(insight.avgOrder)}
                  </Text>
                </View>
                <View style={styles.marketplaceRecommendation}>
                  <Text style={styles.recommendationLabel}>AI Рекомендація:</Text>
                  <Text style={styles.recommendationText}>
                    {insight.name === 'Rozetka' 
                      ? 'Збільшіть рекламний бюджет для зростання продажів'
                      : insight.name === 'Prom'
                      ? 'Оптимізуйте ціни для конкурентоспроможності'
                      : 'Розгляньте можливість розширення на нові платформи'
                    }
                  </Text>
                </View>
              </Card>
            ))}
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
  aiChatSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  chatContainer: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
  },
  chatInput: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: "top",
  },
  askButton: {
    alignSelf: "flex-end",
  },
  quickAnalysis: {
    marginBottom: 30,
  },
  analysisGrid: {
    flexDirection: "row",
    gap: 16,
  },
  analysisCard: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
  },
  analysisIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  analysisTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  analysisText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  filtersSection: {
    marginBottom: 30,
  },
  filtersScroll: {
    paddingRight: 20,
  },
  filterButton: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  filterButtonActive: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  recommendationsSection: {
    marginBottom: 30,
  },
  recommendationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  generateButton: {
    minWidth: 120,
  },
  recommendationCard: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendationType: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  priorityText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  recommendationDescription: {
    fontSize: 16,
    color: "#999",
    lineHeight: 22,
    marginBottom: 16,
  },
  recommendationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 16,
  },
  recommendationDate: {
    fontSize: 14,
    color: "#999",
  },
  recommendationActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#4A90E2",
    fontWeight: "600",
  },
  marketplaceAnalysis: {
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
  marketplaceName: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  marketplaceRevenue: {
    fontSize: 18,
    color: "#4A90E2",
    fontWeight: "bold",
  },
  marketplaceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  marketplaceStat: {
    fontSize: 14,
    color: "#999",
  },
  marketplaceRecommendation: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 16,
  },
  recommendationLabel: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 30,
  },
  quickActionButton: {
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "column",
    gap: 12,
  },
  chatHistory: {
    flex: 1,
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4A90E2",
    borderRadius: 16,
    padding: 12,
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#333",
    borderRadius: 16,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  aiMessageText: {
    color: "#999",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  sendButton: {
    marginLeft: 12,
  },
  actionItemsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  actionItemsTitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  actionItem: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  aiSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingIndicator: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#999",
  },
  dataInfo: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  dataInfoTitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  dataInfoText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  noRecommendations: {
    alignItems: "center",
    paddingVertical: 30,
  },
  noRecommendationsText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
  getRecommendationsButton: {
    marginTop: 16,
  },
  highPriority: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  mediumPriority: {
    borderLeftWidth: 4,
    borderLeftColor: "#F39C12",
  },
  lowPriority: {
    borderLeftWidth: 4,
    borderLeftColor: "#50C878",
  },
  highPriorityBadge: {
    backgroundColor: "#FF6B6B",
  },
  mediumPriorityBadge: {
    backgroundColor: "#F39C12",
  },
  lowPriorityBadge: {
    backgroundColor: "#50C878",
  },
}); 