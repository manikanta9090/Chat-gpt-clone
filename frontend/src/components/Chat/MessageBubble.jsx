import './Chat.css';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
      <div className="message-role">
        {isUser ? 'You' : 'Assistant'}
      </div>
      <div className="message-text">
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
