import { useCallback } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useChat } from '../../context/ChatContext';
import './Chat.css';

const ChatContainer = () => {
  const { getCurrentMessages, createNewChat, sendMessage } = useChat();

  const currentMessages = getCurrentMessages();

  const handleNewChat = useCallback(() => {
    createNewChat();
  }, [createNewChat]);

  const handleSendMessage = useCallback(async (inputText) => {
    await sendMessage(inputText);
  }, [sendMessage]);

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
