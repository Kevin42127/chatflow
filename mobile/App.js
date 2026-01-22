import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import ChatScreen from './components/ChatScreen';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ChatProvider>
          <StatusBar style="auto" />
          {showSplash ? (
            <SplashScreen onFinish={handleSplashFinish} />
          ) : (
            <ChatScreen />
          )}
        </ChatProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
