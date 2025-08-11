import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { Icon } from "./Icon";

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  editable?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  onIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  editable,
  icon,
  iconPosition = "left",
  onIconPress,
  style,
  inputStyle,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (isFocused) {
      baseStyle.push(styles.containerFocused as any);
    }
    
    if (error) {
      baseStyle.push(styles.containerError as any);
    }
    
    if (disabled) {
      baseStyle.push(styles.containerDisabled as any);
    }
    
    return baseStyle;
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = (
      <Icon
        name={icon}
        size={20}
        color={isFocused ? "#4A90E2" : "#999"}
      />
    );

    if (onIconPress) {
      return (
        <TouchableOpacity
          onPress={onIconPress}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          {iconElement}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.iconContainer}>
        {iconElement}
      </View>
    );
  };

  const renderPasswordToggle = () => {
    if (!secureTextEntry) return null;
    
    return (
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={styles.passwordToggle}
        activeOpacity={0.7}
      >
        <Icon
          name={showPassword ? "visibility" : "visibility-off"}
          size={20}
          color="#999"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {label && (
        <Text style={[styles.label, error ? styles.labelError : null]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {iconPosition === "left" && renderIcon()}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable !== undefined ? editable : !disabled}
          maxLength={maxLength}
        />
        
        {iconPosition === "right" && renderIcon()}
        {renderPasswordToggle()}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  containerFocused: {
    borderColor: "#4A90E2",
  },
  containerError: {
    borderColor: "#FF6B6B",
  },
  containerDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  labelError: {
    color: "#FF6B6B",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingVertical: 12,
    lineHeight: 20,
  },
  inputMultiline: {
    textAlignVertical: "top",
    paddingTop: 12,
    paddingBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    width: 20,
    alignItems: "center",
  },
  iconButton: {
    marginRight: 12,
    padding: 4,
  },
  passwordToggle: {
    marginLeft: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    color: "#FF6B6B",
    marginTop: 8,
    marginLeft: 4,
  },
}); 