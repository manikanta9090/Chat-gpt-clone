import { useState, useCallback } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import './Chat.css';

const ChatContainer = ({ onNewChat: onNewChatFromParent }) => {
  const [chats, setChats] = useState([
    { id: 1, title: "Chat 1", messages: [] }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);

  const getCurrentMessages = () => {
    const currentChat = chats.find(chat => chat.id === currentChatId);
    return currentChat ? currentChat.messages : [];
  };

  const handleNewChat = useCallback(() => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    if (onNewChatFromParent) onNewChatFromParent();
  }, [chats.length, onNewChatFromParent]);

  const handleSelectChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
  }, []);

  const handleSendMessage = useCallback(async (inputText) => {
    if (!inputText.trim() || !currentChatId) return;

    const userMessage = { role: 'user', text: inputText.trim() };

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
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: chat.messages.slice(0, -1) }
            : chat
        )
      );
    }
  }, [currentChatId]);

  const currentMessages = getCurrentMessages();

  return (
    <div className="chat-container">
      <MessageList messages={currentMessages} />
      <ChatInput
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
      />
    </div>
  );
};

export default ChatContainer;
