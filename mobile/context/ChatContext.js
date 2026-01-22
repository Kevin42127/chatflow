import React, { createContext, useState, useEffect, useContext } from 'react';
import { sendMessage as apiSendMessage, getUsage } from '../services/api';
import { saveChatHistory, loadChatHistory, clearChatHistory as clearStorage } from '../services/storage';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState({ remaining: 20, limit: 20, used: 0 });

  useEffect(() => {
    loadHistory();
    loadUsage();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const loadUsage = async () => {
    try {
      // 暫時禁用使用限制檢查
      console.log('Usage check disabled temporarily');
    } catch (error) {
      console.error('Failed to load usage:', error);
    }
  };

  const loadHistory = async () => {
    const history = await loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // 暫時禁用使用限制檢查
    // if (usage.remaining <= 0) {
    //   setError('今日使用次數已用完，請明天再試');
    //   return;
    // }

    const userMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const messageHistory = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content,
      }));

      const response = await apiSendMessage(messageHistory);
      const aiMessage = {
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'No response',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // 暫時禁用使用次數更新
      // if (response.usage) {
      //   setUsage(response.usage);
      // } else {
      //   await loadUsage();
      // }
    } catch (err) {
      if (err.code === 'USAGE_LIMIT_EXCEEDED') {
        setError(`今日使用次數已用完 (${err.limit}/${err.limit})`);
        setUsage({ remaining: err.remaining, limit: err.limit, used: err.limit - err.remaining });
      } else {
        setError(err.message);
        const errorMessage = {
          role: 'assistant',
          content: `錯誤: ${err.message}`,
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = async () => {
    setMessages([]);
    await clearStorage();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        usage,
        sendMessage,
        clearChatHistory,
        loadUsage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
