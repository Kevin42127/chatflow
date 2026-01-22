import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('zh');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [isDarkMode, language]);

  const loadSettings = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
      const savedLanguage = await AsyncStorage.getItem('language');
      
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
      
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const colors = {
    light: {
      background: '#FFFFFF',
      surface: '#F5F7FB',
      text: '#111111',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      accent: '#007AFF',
      userBubble: '#007AFF',
      aiBubble: '#F3F4F6',
      headerBg: '#FFFFFF',
    },
    dark: {
      background: '#1C1C1E',
      surface: '#2C2C2E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      accent: '#0A84FF',
      userBubble: '#0A84FF',
      aiBubble: '#2C2C2E',
      headerBg: '#2C2C2E',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  const translations = {
    zh: {
      appTitle: 'ChatFlow',
      settings: '設定',
      chatHistory: '對話紀錄',
      appVersion: '應用程式版本',
      clearHistory: '清除對話紀錄',
      clearHistoryConfirm: '確定要清除所有對話紀錄嗎？',
      cancel: '取消',
      confirm: '確定',
      startConversation: '開始與 AI 對話吧',
      startChat: '開始聊天',
      placeholder: '輸入訊息...',
      aboutChatFlow: 'ChatFlow 是什麼',
      chatFlowIntro: 'ChatFlow 是一個現代化的 AI 對話平台，致力於提供流暢、智能的對話體驗',
      quickPrompts: {
        dinner: '推薦今天晚餐菜色',
        weekend: '週末活動建議',
        travel: '旅行規劃推薦',
        health: '健康生活小貼士',
        about: '介紹 ChatFlow',
        identity: '你是誰？',
      },
      usageLimit: '今日使用次數已用完，請明天再試',
      error: '錯誤',
      darkMode: '深色模式',
      language: '語言',
      chinese: '繁體中文',
      english: 'English',
    },
    en: {
      appTitle: 'ChatFlow',
      settings: 'Settings',
      chatHistory: 'Chat History',
      appVersion: 'App Version',
      clearHistory: 'Clear Chat History',
      clearHistoryConfirm: 'Are you sure you want to clear all chat history?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      startConversation: 'Start chatting with AI',
      startChat: 'Start Chat',
      placeholder: 'Type a message...',
      aboutChatFlow: 'What is ChatFlow',
      chatFlowIntro: 'ChatFlow is a modern AI conversation platform dedicated to providing smooth and intelligent dialogue experiences',
      quickPrompts: {
        dinner: 'Recommend dinner ideas',
        weekend: 'Weekend activity suggestions',
        travel: 'Travel planning recommendations',
        health: 'Health and wellness tips',
        about: 'About ChatFlow',
        identity: 'Who are you?',
      },
      usageLimit: 'Daily usage limit reached, please try again tomorrow',
      error: 'Error',
      darkMode: 'Dark Mode',
      language: 'Language',
      chinese: '繁體中文',
      english: 'English',
    },
  };

  const t = translations[language];

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        language,
        colors: currentColors,
        t,
        toggleDarkMode,
        changeLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
