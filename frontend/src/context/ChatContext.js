import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShared, setIsShared] = useState(false);
  const [sharedChat, setSharedChat] = useState(null);

  const location = useLocation();

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      setIsShared(false);
      setSharedChat(null);
      const response = await fetch('http://localhost:5000/api/chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data);
        if (data.length > 0) {
          setCurrentChatId(data[0].id);
        } else {
          setCurrentChatId(null);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSharedChat = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/share/${id}`);
      if (response.ok) {
        const data = await response.json();
        const chatWithId = { ...data, id: data._id };
        setSharedChat(data);
        setChats([chatWithId]);
        setCurrentChatId(chatWithId.id);
        setIsShared(true);
      }
    } catch (error) {
      console.error('Error fetching shared chat:', error);
      setIsShared(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Route-based data fetching
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/chat/')) {
      const shareId = path.split('/chat/')[1];
      fetchSharedChat(shareId);
    } else {
      fetchChats();
    }
  }, [location.pathname, fetchChats, fetchSharedChat]);

  const createNewChat = useCallback(async () => {
    if (isShared) return;
    try {
      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Chat ${chats.length + 1}` }),
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }, [chats.length, isShared]);

  const selectChat = useCallback((chatId) => {
    if (isShared) return;
    setCurrentChatId(chatId);
  }, [isShared]);

  const deleteChat = useCallback(async (chatId) => {
    if (isShared) return;
    try {
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChats(prev => {
          const filtered = prev.filter(c => c.id !== chatId);
          if (filtered.length > 0 && currentChatId === chatId) {
            setCurrentChatId(filtered[0].id);
          } else if (filtered.length === 0) {
            setCurrentChatId(null);
          }
          return filtered;
        });
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }, [currentChatId, isShared]);

  const getCurrentMessages = useCallback(() => {
    if (isShared && sharedChat) {
      return sharedChat.messages || [];
    }
    if (!currentChatId) return [];
    const currentChat = chats.find(chat => chat.id === currentChatId);
    return currentChat ? currentChat.messages : [];
  }, [chats, currentChatId, isShared, sharedChat]);

  const sendMessage = useCallback(async (inputText) => {
    if (isShared) return;
    if (!inputText.trim() || !currentChatId) return;

    const userMessage = { role: 'user', text: inputText.trim() };

    // Optimistically add user message
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    try {
      // Get full conversation history for context
      const currentChat = chats.find(chat => chat.id === currentChatId);
      const conversationMessages = currentChat ? [...currentChat.messages, userMessage] : [userMessage];

      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationMessages,
          message: userMessage.text // Keep for backward compatibility
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const aiMessage = { role: 'ai', text: data.reply };

      // Save user message to DB
      try {
        await fetch(`http://localhost:5000/api/chats/${currentChatId}/message`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        });
      } catch (err) {
        console.warn('Could not save user message to DB:', err);
      }

      // Save AI message to DB
      try {
        await fetch(`http://localhost:5000/api/chats/${currentChatId}/message`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: aiMessage }),
        });
      } catch (err) {
        console.warn('Could not save AI message to DB:', err);
      }

      // Update title if this is the first message
      if (currentChat && currentChat.messages.length === 0) {
        try {
          await fetch(`http://localhost:5000/api/chats/${currentChatId}/title`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: inputText.slice(0, 30) }),
          });
        } catch (err) {
          console.warn('Could not update chat title:', err);
        }
      }

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove user message on error
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: chat.messages.slice(0, -1) }
            : chat
        )
      );
      throw err;
    }
  }, [chats, currentChatId, isShared]);

  const value = {
    chats,
    currentChatId,
    loading,
    isShared,
    sharedChat,
    createNewChat,
    selectChat,
    deleteChat,
    getCurrentMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
