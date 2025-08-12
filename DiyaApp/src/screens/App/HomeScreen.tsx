import React, { useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Animated 
} from 'react-native';
import { 
  Text,
  FAB,
  Badge,
  useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuickAccessCard } from '../../components/QuickAccessCard';
import { TransactionItem } from '../../components/TransactionItem';
import { mockUser, mockTransactions, mockQuickAccess, mockNotifications } from '../../services/mockData';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  
  const headerOpacity = React.useRef(new Animated.Value(0)).current;
  const balanceOpacity = React.useRef(new Animated.Value(0)).current;
  const balanceScale = React.useRef(new Animated.Value(0.8)).current;
  const quickAccessOpacity = React.useRef(new Animated.Value(0)).current;
  const transactionsOpacity = React.useRef(new Animated.Value(0)).current;
  


  React.useEffect(() => {
  
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(balanceOpacity, {
      toValue: 1,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(balanceScale, {
      toValue: 1,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(quickAccessOpacity, {
      toValue: 1,
      duration: 500,
      delay: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(transactionsOpacity, {
      toValue: 1,
      duration: 500,
      delay: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerAnimatedStyle = {
    opacity: headerOpacity,
  };

  const balanceAnimatedStyle = {
    opacity: balanceOpacity,
    transform: [{ scale: balanceScale }],
  };

  const quickAccessAnimatedStyle = {
    opacity: quickAccessOpacity,
  };

  const transactionsAnimatedStyle = {
    opacity: transactionsOpacity,
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(balance);
  };

  const formatLastUpdate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleQuickAccessPress = (route: string) => {
    console.log('Navigate to:', route);
    // Тут буде навігація
  };

  const handleAddTransaction = () => {
    
    
  };

  const hasUnreadNotifications = mockNotifications.some(n => !n.isRead);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0E0E0E" />
      
      {/* Верхня панель */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Привіт, {mockUser.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            {hasUnreadNotifications && (
              <Badge style={styles.notificationBadge} size={8} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Блок балансу */}
        <Animated.View style={[styles.balanceContainer, balanceAnimatedStyle]}>
          <Text style={styles.balanceLabel}>Баланс</Text>
          <Text style={styles.balanceAmount}>{formatBalance(mockUser.balance)}</Text>
          <Text style={styles.lastUpdate}>
            Оновлено {formatLastUpdate(mockUser.lastUpdate)}
          </Text>
        </Animated.View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTransaction}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        {/* Швидкий доступ */}
        <Animated.View style={[styles.quickAccessSection, quickAccessAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Швидкий доступ</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickAccessScroll}
          >
            {mockQuickAccess.map((item, index) => (
              <QuickAccessCard
                key={item.id}
                item={item}
                index={index}
                onPress={handleQuickAccessPress}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Останні операції */}
        <Animated.View style={[styles.transactionsSection, transactionsAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Останні операції</Text>
          <View style={styles.transactionsList}>
            {mockTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                index={index}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* FAB для додавання транзакції */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddTransaction}
        color="#FFFFFF"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    lineHeight: 28,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 16,
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F44336',
  },
  profileButton: {
    marginLeft: 8,
    padding: 8,
  },
  profileIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  balanceContainer: {
    backgroundColor: '#1A1A1A',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  balanceAmount: {
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    lineHeight: 40,
  },
  lastUpdate: {
    fontSize: 14,
    color: '#888888',
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  addButton: {
    position: 'absolute',
    top: 120,
    right: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2979FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2979FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    lineHeight: 36,
  },
  quickAccessSection: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
    lineHeight: 24,
  },
  quickAccessScroll: {
    paddingLeft: 0,
  },
  transactionsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  transactionsList: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    margin: 1,
    right: 0,
    bottom: 0,
    backgroundColor: '#2979FF',
  },
});
