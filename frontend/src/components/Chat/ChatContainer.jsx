import { useCallback } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useChat } from '../../context/ChatContext';
import './Chat.css';

const ChatContainer = () => {
  const { getCurrentMessages, createNewChat, sendMessage, loading, isShared } = useChat();

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
        disabled={isShared}
      />
      {isShared && (
        <div style={{
          textAlign: 'center',
          padding: '8px',
          backgroundColor: '#2f2f2f',
          color: '#ababad',
          fontSize: '12px'
        }}>
          This is a shared read-only chat
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
