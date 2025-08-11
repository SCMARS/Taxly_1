import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DashboardScreen } from "../screens/App/DashboardScreen";
import { OrdersScreen } from "../screens/App/OrdersScreen";
import { AnalyticsScreen } from "../screens/App/AnalyticsScreen";
import { TaxesScreen } from "../screens/App/TaxesScreen";
import { DocumentsScreen } from "../screens/App/DocumentsScreen";
import { ProfileScreen } from "../screens/App/ProfileScreen";
import { SettingsScreen } from "../screens/App/SettingsScreen";
import { AIScreen } from "../screens/App/AIScreen";
import { MarketplacesScreen } from "../screens/App/MarketplacesScreen";

export type AppStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Analytics: undefined;
  Taxes: undefined;
  Documents: undefined;
  Profile: undefined;
  Settings: undefined;
  AI: undefined;
  Marketplaces: undefined;
  AddOrder: undefined;
  AddExpense: undefined;
  AddTax: undefined;
  OrderDetail: { order: any };
  Payment: { taxId: string };
  AddReceipt: { taxId: string };
  ManualUpload: undefined;
  ExportReport: undefined;
  AnalyticsSettings: undefined;
  Comparison: undefined;
  GenerateReport: undefined;
  TaxSettings: undefined;
  AISettings: undefined;
  AnalysisHistory: undefined;
  ExportReports: undefined;
  APISettings: undefined;
  SyncHistory: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

interface AppStackProps {
  onLogout: () => void;
}

export const AppStack: React.FC<AppStackProps> = ({ onLogout }) => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#000000" },
      }}
    >
      <Stack.Screen name="Dashboard">
        {(props) => <DashboardScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Taxes" component={TaxesScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AI" component={AIScreen} />
      <Stack.Screen name="Marketplaces" component={MarketplacesScreen} />
      
      {/* Заглушки для навигации */}
      <Stack.Screen 
        name="AddOrder" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="AddExpense" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="AddTax" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="OrderDetail" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="Payment" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="AddReceipt" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="ManualUpload" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="ExportReport" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="AnalyticsSettings" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="Comparison" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="GenerateReport" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="TaxSettings" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="AISettings" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="AnalysisHistory" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="ExportReports" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="APISettings" 
        component={DashboardScreen} // Заглушка
      />
      <Stack.Screen 
        name="SyncHistory" 
        component={DashboardScreen} // Заглушка
      />
    </Stack.Navigator>
  );
}; 