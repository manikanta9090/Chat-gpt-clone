import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([
    { id: 1, title: 'Chat 1', messages: [] }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);

  const createNewChat = useCallback(() => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  }, [chats.length]);

  const selectChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      // If we deleted the current chat, switch to another one
      if (chatId === currentChatId && filtered.length > 0) {
        setCurrentChatId(filtered[0].id);
      }
      return filtered;
    });
  }, [currentChatId]);

  const getCurrentMessages = useCallback(() => {
    const currentChat = chats.find(chat => chat.id === currentChatId);
    return currentChat ? currentChat.messages : [];
  }, [chats, currentChatId]);

  const sendMessage = useCallback(async (inputText) => {
    if (!inputText.trim() || !currentChatId) return;

    const userMessage = { role: 'user', text: inputText.trim() };

    // Add user message
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title: chat.messages.length === 0 ? inputText.slice(0, 30) : chat.title
            }
          : chat
      )
    );

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const aiMessage = { role: 'ai', text: data.reply };

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
  }, [currentChatId]);

  const value = {
    chats,
    currentChatId,
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
