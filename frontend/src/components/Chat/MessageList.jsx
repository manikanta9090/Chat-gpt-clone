import MessageBubble from './MessageBubble';
import './Chat.css';

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.length === 0 && (
        <div className="empty-state">
          Start a conversation...
        </div>
      )}
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
