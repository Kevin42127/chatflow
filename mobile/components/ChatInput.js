import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { platformStyles, getPlatformStyle } from '../utils/platformStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatInput = ({ onSend, loading }) => {
  const { colors, t } = useTheme();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    if (text.trim() && !loading) {
      onSend(text);
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <View style={[styles.container, { paddingBottom: Platform.OS === 'android' ? insets.bottom + 20 : 30 }]}>
        <View style={[styles.inputContainer, focused && styles.inputFocused, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text, borderBottomColor: focused ? colors.border : 'transparent' }]}
            value={text}
            onChangeText={setText}
            placeholder={t.placeholder || "輸入訊息..."}
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            textAlignVertical="center"
            enablesReturnKeyAutomatically={true}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim() || loading}
            style={[styles.sendButton, (!text.trim() || loading) && styles.sendButtonDisabled]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={20}
              color={(!text.trim() || loading) ? colors.textSecondary : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,        // 減少頂部padding
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'relative',
    zIndex: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,        // 減少垂直padding，讓輸入框更矮
    borderWidth: 1,
  },
  inputFocused: {
    borderWidth: 1,
    borderBottomColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 4,
    paddingVertical: 8,
    textAlignVertical: 'center',
    maxHeight: 80,
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    minWidth: 36,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatInput;
