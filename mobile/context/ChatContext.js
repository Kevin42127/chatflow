import React, { createContext, useState, useEffect, useContext } from 'react';
import { sendMessage as apiSendMessage } from '../services/api';
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

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const loadHistory = async () => {
    const history = await loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;

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
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        role: 'assistant',
        content: `錯誤: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
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
        sendMessage,
        clearChatHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
