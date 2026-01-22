import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '../context/ThemeContext';
import { platformStyles, getPlatformStyle } from '../utils/platformStyles';

const MessageBubble = ({ message, isUser }) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const bubbleStyle = isUser ? { backgroundColor: colors.userBubble } : { backgroundColor: colors.aiBubble };
  const textStyle = isUser ? { color: '#FFFFFF' } : { color: colors.text };

  const markdownStyles = {
    body: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 20.25,
    },
    heading1: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    heading2: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    strong: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 15,
    },
    b: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 15,
    },
    em: {
      color: colors.text,
      fontStyle: 'italic',
    },
    link: {
      color: colors.text,
      textDecorationLine: 'underline',
    },
    list_item: {
      color: colors.text,
      fontSize: 15,
      marginBottom: 4,
    },
    list: {
      color: colors.text,
      marginBottom: 8,
    },
    code_inline: {
      backgroundColor: colors.surface,
      color: colors.textSecondary,
      fontFamily: 'monospace',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    code_block: {
      backgroundColor: colors.surface,
      color: colors.textSecondary,
      fontFamily: 'monospace',
      padding: 8,
      borderRadius: 6,
      marginBottom: 8,
    },
    blockquote: {
      backgroundColor: colors.surface,
      borderLeftWidth: 3,
      borderLeftColor: colors.border,
      paddingLeft: 8,
      marginBottom: 8,
    },
  };

  if (message.isError) {
    return (
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          { alignSelf: 'flex-start' },
        ]}
      >
        <View style={[styles.errorBubble, bubbleStyle]}>
          <Text style={styles.errorText}>{message.content}</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View style={[styles.bubble, bubbleStyle]}>
        {isUser ? (
          <Text style={textStyle} numberOfLines={0}>
            {message.content}
          </Text>
        ) : (
          <Markdown 
            style={markdownStyles}
            rules={{
              strong: (node, children, parent, styles) => (
                <Text key={node.key} style={styles.strong}>
                  {children}
                </Text>
              ),
            }}
          >
            {message.content}
          </Markdown>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '70%',
    marginVertical: 5,
    marginHorizontal: 0,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    ...getPlatformStyle(
      {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 0,
      },
      {
        elevation: 1,
      }
    ),
  },
  userBubble: {
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 16,
  },
  aiBubble: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 16,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20.25,
  },
  aiText: {
    fontSize: 15,
    lineHeight: 20.25,
  },
  errorBubble: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: getPlatformStyle(16, 16),
  },
});

const markdownStyles = {
  body: {
    color: '#111111',
    fontSize: 15,
    lineHeight: 20.25,
  },
  heading1: {
    color: '#111111',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heading2: {
    color: '#111111',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  strong: {
    color: '#111111',
    fontWeight: 'bold',
    fontSize: 15,
  },
  b: {
    color: '#111111',
    fontWeight: 'bold',
    fontSize: 15,
  },
  em: {
    color: '#111111',
    fontStyle: 'italic',
  },
  link: {
    color: '#0B93F6',
    textDecorationLine: 'underline',
  },
  list_item: {
    color: '#111111',
    fontSize: 15,
    marginBottom: 4,
  },
  list: {
    color: '#111111',
    marginBottom: 8,
  },
  code_inline: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    fontFamily: 'monospace',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    fontFamily: 'monospace',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  blockquote: {
    backgroundColor: '#F9FAFB',
    borderLeftWidth: 3,
    borderLeftColor: '#D1D5DB',
    paddingLeft: 8,
    marginBottom: 8,
  },
};

export default MessageBubble;
