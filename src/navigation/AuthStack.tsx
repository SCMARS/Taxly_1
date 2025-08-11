import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/Auth/LoginScreen";
import { RegisterScreen } from "../screens/Auth/RegisterScreen";
import { AuthStackParamList } from "../types";

const Stack = createStackNavigator<AuthStackParamList>();

interface AuthStackProps {
  onLogin: () => void;
}

export const AuthStack: React.FC<AuthStackProps> = ({ onLogin }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#000000" },
      }}
    >
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen 
            {...props} 
            onLogin={onLogin} 
            onNavigateToRegister={() => props.navigation.navigate('Register')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <RegisterScreen 
            {...props} 
            onRegister={onLogin}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}; 