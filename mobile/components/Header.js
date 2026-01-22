import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { platformStyles, getPlatformStyle } from '../utils/platformStyles';

const Header = ({ onClearHistory }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.spacer} />
        <TouchableOpacity onPress={onClearHistory} style={styles.clearButton}>
          <Ionicons 
            name={Platform.OS === 'ios' ? 'trash-outline' : 'trash-outline'} 
            size={24} 
            color={getPlatformStyle(platformStyles.colors.ios.text, platformStyles.colors.android.text)} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...getPlatformStyle(
      {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C6C6C8',
      },
      {
        backgroundColor: '#FFFFFF',
        elevation: 4,
      }
    ),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: getPlatformStyle(16, 16),
    paddingVertical: getPlatformStyle(12, 12),
    height: getPlatformStyle(44, 56),
  },
  spacer: {
    flex: 1,
  },
  clearButton: {
    padding: 8,
  },
});

export default Header;
