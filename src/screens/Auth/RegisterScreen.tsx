import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Icon } from "../../components/Icon";
import { AuthService, AuthError } from "../../services/auth";

interface RegisterScreenProps {
  navigation: any;
  onRegister: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  navigation,
  onRegister,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть ваше ім'я");
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть email");
      return false;
    }
    
    if (!phone.trim()) {
      Alert.alert("Помилка", "Будь ласка, введіть номер телефону");
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert("Помилка", "Пароль повинен містити мінімум 6 символів");
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Помилка", "Паролі не співпадають");
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await AuthService.signUpWithEmail(email.trim(), password);
      Alert.alert(
        "Успішно!", 
        "Акаунт створено! Тепер ви можете увійти.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error: any) {
      const authError = error as AuthError;
      Alert.alert("Помилка реєстрації", authError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Icon name="business" size={80} color="#4A90E2" />
            </View>
            <Text style={styles.title}>Створення акаунту</Text>
            <Text style={styles.subtitle}>
              Зареєструйтеся для початку роботи
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="Повне ім'я"
              value={name}
              onChangeText={setName}
              icon="person"
              iconPosition="left"
              editable={!isLoading}
            />

            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="email"
              iconPosition="left"
              editable={!isLoading}
            />

            <Input
              placeholder="Номер телефону"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="phone"
              iconPosition="left"
              editable={!isLoading}
            />

            <Input
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon="lock"
              iconPosition="left"
              editable={!isLoading}
            />

            <Input
              placeholder="Підтвердіть пароль"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon="lock"
              iconPosition="left"
              editable={!isLoading}
            />

            <Button
              title={isLoading ? "Створення..." : "Зареєструватися"}
              onPress={handleRegister}
              style={styles.registerButton}
              variant="primary"
              disabled={isLoading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Вже є акаунт? </Text>
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Login")}
              >
                Увійти
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#999",
    fontSize: 16,
  },
  linkText: {
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "600",
  },
}); 