import { useCallback } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useChat } from '../../context/ChatContext';
import './Chat.css';

const ChatContainer = () => {
  const { getCurrentMessages, createNewChat, sendMessage, loading } = useChat();

  const currentMessages = getCurrentMessages();

  const handleNewChat = useCallback(() => {
    createNewChat();
  }, [createNewChat]);

  const handleSendMessage = useCallback(async (inputText) => {
    await sendMessage(inputText);
  }, [sendMessage]);

  if (loading) {
    return (
      <div className="chat-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#ababad' }}>Loading chats...</div>
      </div>
    );
  }

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
