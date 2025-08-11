import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { Icon } from "./Icon";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (variant === "secondary") {
      baseStyle.push(styles.secondaryButton as any);
    } else if (variant === "outline") {
      baseStyle.push(styles.outlineButton as any);
    }
    
    if (size === "small") {
      baseStyle.push(styles.smallButton as any);
    } else if (size === "large") {
      baseStyle.push(styles.largeButton as any);
    }
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth as any);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledButton as any);
    }
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return [styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle] as any;
  };

  const getIconColor = (): string => {
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
        return "#4A90E2";
      case "outline":
        return "#4A90E2";
      case "danger":
        return "#FFFFFF";
      default:
        return "#FFFFFF";
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 24;
      default:
        return 20;
    }
  };

  const renderIcon = () => {
    if (!icon || loading) return null;
    
    return (
      <Icon
        name={icon}
        size={getIconSize()}
        color={getIconColor()}
        style={[
          iconPosition === "left" ? styles.leftIcon : styles.rightIcon,
          size === "small" && styles.smallIcon,
        ]}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size={size === "small" ? "small" : "small"}
          color={variant === "primary" ? "#FFFFFF" : "#4A90E2"}
        />
      ) : (
        <>
          {iconPosition === "left" && renderIcon()}
          <Text style={getTextStyle()}>{title}</Text>
          {iconPosition === "right" && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: "#4A90E2",
  },
  secondaryButton: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  dangerButton: {
    backgroundColor: "#FF6B6B",
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  mediumButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  largeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  // States
  disabledButton: {
    opacity: 0.5,
  } as ViewStyle,
  
  // Layout
  fullWidth: {
    width: "100%",
  } as ViewStyle,
  
  // Text styles
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#4A90E2",
  },
  outlineText: {
    color: "#4A90E2",
  },
  dangerText: {
    color: "#FFFFFF",
  },
  
  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Icon styles
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  smallIcon: {
    marginRight: 6,
    marginLeft: 6,
  },
}); 