import { Platform, StyleSheet } from 'react-native';

export const platformStyles = {
  colors: {
    ios: {
      primary: '#007AFF',
      secondary: '#8E8E93',
      background: '#F2F2F7',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#8E8E93',
    },
    android: {
      primary: '#6200EE',
      secondary: '#03DAC6',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#757575',
    },
  },
  spacing: {
    ios: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    android: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
  },
  borderRadius: {
    ios: {
      small: 12,
      medium: 18,
      large: 24,
    },
    android: {
      small: 4,
      medium: 8,
      large: 16,
    },
  },
  shadows: {
    ios: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    },
    android: {
      small: { elevation: 2 },
      medium: { elevation: 4 },
      large: { elevation: 8 },
    },
  },
  fonts: {
    ios: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
      sizes: {
        small: 14,
        medium: 17,
        large: 20,
        xlarge: 34,
      },
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
      sizes: {
        small: 14,
        medium: 16,
        large: 20,
        xlarge: 24,
      },
    },
  },
};

export const getPlatformStyle = (iosStyle, androidStyle) => {
  return Platform.select({
    ios: iosStyle,
    android: androidStyle,
  });
};

export const createPlatformStyles = (styles) => {
  return StyleSheet.create(
    Object.keys(styles).reduce((acc, key) => {
      acc[key] = typeof styles[key] === 'object' && styles[key].ios
        ? getPlatformStyle(styles[key].ios, styles[key].android)
        : styles[key];
      return acc;
    }, {})
  );
};
