import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Platform, ActivityIndicator, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../context/ThemeContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import SettingsScreen from './SettingsScreen';
import SplashScreen from './SplashScreen';
import { platformStyles, getPlatformStyle } from '../utils/platformStyles';

const ChatScreen = () => {
  const { messages, loading, sendMessage } = useChat();
  const { colors, t } = useTheme();
  const flatListRef = useRef(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }) => {
    return <MessageBubble message={item} isUser={item.role === 'user'} />;
  };

  const handleGoHome = () => {
    setShowSplash(true);
  };

  const renderEmpty = () => {
    const quickPrompts = [
      t.quickPrompts.dinner,
      t.quickPrompts.weekend,
      t.quickPrompts.travel,
      t.quickPrompts.health,
      t.quickPrompts.about
    ];

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t.startConversation}</Text>
        <View style={styles.quickPromptsContainer}>
          {quickPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickPromptButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => sendMessage(prompt)}
            >
              <Text style={[styles.quickPromptText, { color: colors.text }]}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={colors.text}
        />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>AI 正在思考...</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.topBackground, { height: insets.top + 60, backgroundColor: colors.headerBg }]} />
      <SafeAreaView style={styles.safeArea} edges={[]}>
        {!showSplash && (
          <>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 12), borderBottomColor: colors.border }]}>
              <TouchableOpacity
                onPress={handleGoHome}
                style={styles.homeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons name="home" size={24} color={colors.text} />
              </TouchableOpacity>
              <View style={styles.headerSpacer} />
              <TouchableOpacity
                onPress={() => setSettingsVisible(true)}
                style={styles.settingsButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons name="settings-outline" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => `message-${index}-${item.timestamp}`}
              contentContainerStyle={[
                styles.listContent,
                messages.length === 0 && styles.listContentEmpty,
              ]}
              ListEmptyComponent={renderEmpty}
              ListFooterComponent={renderFooter}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
            />
            <ChatInput onSend={sendMessage} loading={loading} />
          </>
        )}
      </SafeAreaView>
      <SettingsScreen
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
      {showSplash && (
        <View style={[styles.splashOverlay, { backgroundColor: colors.background }]}>
          <SplashScreen
            onFinish={() => setShowSplash(false)}
          />
        </View>
      )}
    </KeyboardAvoidingView>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    position: 'relative',
    zIndex: 10,
  },
  headerSpacer: {
    flex: 1,
  },
  homeButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: getPlatformStyle(18, 18),
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
  },
  quickPromptsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  quickPromptButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    width: '80%',
    maxWidth: 280,
  },
  quickPromptText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});

export default ChatScreen;
