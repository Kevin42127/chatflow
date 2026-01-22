import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import Switch from './Switch';

const APP_VERSION = '1.0.0';

const SettingsScreen = ({ visible, onClose }) => {
  const { clearChatHistory, messages } = useChat();
  const { isDarkMode, language, colors, t, toggleDarkMode, changeLanguage } = useTheme();
  const insets = useSafeAreaInsets();
  const [showLanguageModal, setShowLanguageModal] = React.useState(false);

  const handleLanguageSelect = (lang) => {
    changeLanguage(lang);
    setShowLanguageModal(false);
  };

  const handleClearHistory = () => {
    // 檢查是否有對話紀錄
    if (!messages || messages.length === 0) {
      Alert.alert('提示', '目前沒有對話紀錄可以清除');
      return;
    }
    
    Alert.alert(
      t.clearHistory,
      t.clearHistoryConfirm,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.confirm,
          style: 'destructive',
          onPress: async () => {
            await clearChatHistory();
            Alert.alert('完成', '對話紀錄已刪除');
            onClose();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.topBackground, { height: insets.top + 55, backgroundColor: colors.headerBg }]} />
        <SafeAreaView style={styles.safeArea} edges={[]}>
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
            <Text style={[styles.title, { color: colors.text }]}>{t.settings}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name="moon-outline" size={20} color={colors.text} style={styles.settingIcon} />
                  <Text style={[styles.settingText, { color: colors.text }]}>{t.darkMode}</Text>
                </View>
                <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
              </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setShowLanguageModal(true)}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="language-outline" size={20} color={colors.text} style={styles.settingIcon} />
                  <View style={styles.languageContent}>
                    <Text style={[styles.settingText, { color: colors.text }]}>{t.language}</Text>
                    <Text style={[styles.languageValue, { color: colors.textSecondary }]}>{language === 'zh' ? t.chinese : t.english}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={[styles.settingRow, (!messages || messages.length === 0) && styles.settingRowDisabled]}
                onPress={handleClearHistory}
                disabled={!messages || messages.length === 0}
              >
                <View style={styles.settingLeft}>
                  <Ionicons 
                    name="trash-outline" 
                    size={20} 
                    color={(!messages || messages.length === 0) ? colors.textSecondary : "#EF4444"} 
                    style={styles.settingIcon} 
                  />
                  <Text style={[styles.buttonText, (!messages || messages.length === 0) ? styles.disabledText : styles.dangerText]}>
                    {t.clearHistory}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.text} style={styles.settingIcon} />
                  <Text style={[styles.settingText, { color: colors.text }]}>{t.appVersion}</Text>
                </View>
                <Text style={[styles.versionText, { color: colors.textSecondary }]}>{APP_VERSION}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.languageModal, { backgroundColor: colors.surface }]}>
            <View style={styles.languageModalHeader}>
              <Text style={[styles.languageModalTitle, { color: colors.text }]}>{t.language}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'zh' && styles.languageOptionSelected, { borderColor: colors.border }]}
              onPress={() => handleLanguageSelect('zh')}
            >
              <Text style={[styles.languageOptionText, { color: colors.text }]}>{t.chinese}</Text>
              {language === 'zh' && (
                <Ionicons name="checkmark" size={20} color={colors.text} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageOption, language === 'en' && styles.languageOptionSelected, { borderColor: colors.border }]}
              onPress={() => handleLanguageSelect('en')}
            >
              <Text style={[styles.languageOptionText, { color: colors.text }]}>{t.english}</Text>
              {language === 'en' && (
                <Ionicons name="checkmark" size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    position: 'relative',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  languageContent: {
    flex: 1,
  },
  languageValue: {
    fontSize: 14,
    marginTop: 2,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  dangerText: {
    color: '#EF4444',
  },
  disabledText: {
    color: '#999999',
  },
  // Language Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  languageModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  languageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  languageModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  languageOptionSelected: {
    borderWidth: 2,
  },
  languageOptionText: {
    fontSize: 16,
  },
});

export default SettingsScreen;
