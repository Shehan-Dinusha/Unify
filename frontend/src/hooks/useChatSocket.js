import { useState, useEffect, useCallback } from 'react';

/**
 * A mock hook to simulate WebSocket communication.
 * This can be easily replaced with actual Socket.io or WebSocket logic.
 */
export const useChatSocket = (userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      setIsConnected(true);
      console.log('Chat socket connected for user:', userId);
    }, 1000);

    return () => {
      clearTimeout(timer);
      setIsConnected(false);
    };
  }, [userId]);

  /**
   * Simulate sending a message via WebSocket
   */
  const sendMessage = useCallback((messageData) => {
    console.log('Sending message via socket:', messageData);
    
    // Simulate an echo or automated response for demonstration
    if (messageData.text.toLowerCase().includes('hello')) {
      setTimeout(() => {
        setLastMessage({
          id: `socket-${Date.now()}`,
          sender: messageData.receiverName || 'System',
          text: `Hello! I'm ${messageData.receiverName}. How can I help you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          convId: messageData.convId
        });
      }, 1500);
    }
  }, []);

  return { isConnected, sendMessage, lastMessage };
};
