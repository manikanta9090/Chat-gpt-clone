import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import MessageBubble from './Chat/MessageBubble';
import './Chat/Chat.css';

const SharedChat = () => {
  const { shareId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSharedChat = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/share/${shareId}`);
      if (!response.ok) {
        throw new Error('Chat not found');
      }
      const chat = await response.json();
      setMessages(chat.messages || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [shareId]);

  useEffect(() => {
    fetchSharedChat();
  }, [fetchSharedChat]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#343541',
        color: '#ececf1'
      }}>
        Loading shared chat...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#343541',
        color: '#ef4444'
      }}>
        <p>Error: {error}</p>
        <Link to="/" style={{ color: '#10a37f', marginTop: '16px' }}>
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#343541' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#ababad', marginTop: '48px' }}>
              This shared chat is empty.
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedChat;
