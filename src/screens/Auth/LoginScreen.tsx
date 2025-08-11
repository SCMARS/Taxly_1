import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Icon } from "../../components/Icon";
import { AuthService, AuthError } from "../../services/auth";

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Помилка", "Будь ласка, заповніть всі поля");
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.signInWithEmail(email.trim(), password);
      onLogin();
    } catch (error: any) {
      const authError = error as AuthError;
      Alert.alert("Помилка входу", authError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await AuthService.signInWithGoogle();
      onLogin();
    } catch (error: any) {
      const authError = error as AuthError;
      Alert.alert("Помилка Google входу", authError.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Icon name="account-circle" size={80} color="#FFFFFF" />
          <Text style={styles.title}>Вхід в систему</Text>
          <Text style={styles.subtitle}>
            Увійдіть в свій акаунт для продовження
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Введіть ваш email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="email"
            iconPosition="left"
          />

          <Input
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            placeholder="Введіть ваш пароль"
            secureTextEntry
            icon="lock"
            iconPosition="left"
          />

          <Button
            title="Увійти"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>або</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Увійти через Google"
            onPress={handleGoogleLogin}
            loading={isGoogleLoading}
            variant="outline"
            style={styles.googleButton}
            icon="google"
          />

          <View style={styles.registerSection}>
            <Text style={styles.registerText}>
              Немає акаунту?{" "}
            </Text>
            <Button
              title="Зареєструватися"
              onPress={onNavigateToRegister}
              variant="outline"
              style={styles.registerButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333",
  },
  dividerText: {
    color: "#CCCCCC",
    marginHorizontal: 15,
    fontSize: 14,
  },
  googleButton: {
    borderColor: "#4285F4",
    borderWidth: 2,
  },
  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  registerButton: {
    marginLeft: 5,
  },
}); 