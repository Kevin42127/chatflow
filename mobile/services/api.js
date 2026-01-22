import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 生成或獲取用戶ID
const getUserId = async () => {
  try {
    let userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      await AsyncStorage.setItem('userId', userId);
    }
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return 'anonymous';
  }
};

export const sendMessage = async (messages) => {
  try {
    const userId = await getUserId();
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      
      // 處理使用限制錯誤
      if (response.status === 429) {
        const limitError = new Error(errorData.error || 'Daily usage limit exceeded');
        limitError.code = 'USAGE_LIMIT_EXCEEDED';
        limitError.remaining = errorData.remaining || 0;
        limitError.limit = errorData.limit || 20;
        throw limitError;
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const getUsage = async () => {
  try {
    const userId = await getUserId();
    const response = await fetch(`${API_BASE_URL}/api/usage?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get usage info');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Usage API error:', error);
    throw error;
  }
};
