import { useState, useRef, useEffect } from 'react';
import { Plus, Mic, Send, Paperclip } from 'lucide-react';

const ChatInput = ({ messages, onSendMessage, onNewChat }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [inputText]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const message = inputText.trim();
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      await onSendMessage(message);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
      setInputText(prev => prev + ` [File: ${file.name}]`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const containerStyle = {
    position: 'fixed',
    bottom: 0,
    left: '260px',
    right: 0,
    padding: '16px 24px',
    backgroundColor: '#202123',
    borderTop: '1px solid #2f2f2f',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const inputWrapperStyle = {
    maxWidth: '768px',
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    backgroundColor: '#40414f',
    borderRadius: '12px',
    padding: '12px 16px',
    border: '1px solid #565869',
    boxSizing: 'border-box',
  };

  const iconButtonStyle = {
    background: 'transparent',
    border: 'none',
    color: '#ababad',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  };

  const textareaStyle = {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ececf1',
    fontSize: '16px',
    lineHeight: '1.4',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    maxHeight: '200px',
    minHeight: '24px',
    padding: '0',
    overflowY: 'auto',
  };

  const sendButtonStyle = {
    backgroundColor: isLoading ? '#565869' : '#10a37f',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
    flexShrink: 0,
    minWidth: '40px',
  };

  const loadingTextStyle = {
    color: '#ababad',
    fontSize: '13px',
    marginTop: '8px',
    textAlign: 'center',
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '8px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={inputWrapperStyle}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          aria-label="Upload file"
        />

        <button onClick={onNewChat} style={iconButtonStyle} title="New chat">
          <Plus size={20} />
        </button>

        <button
          onClick={triggerFileInput}
          style={iconButtonStyle}
          title="Upload file"
          disabled={isLoading}
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Send a message..."
          style={textareaStyle}
          disabled={isLoading}
          rows="1"
        />

        <button
          onClick={toggleVoiceInput}
          style={{
            ...iconButtonStyle,
            color: isListening ? '#ef4444' : '#ababad',
          }}
          title="Voice input"
          disabled={isLoading}
        >
          <Mic size={20} />
        </button>

        <button
          onClick={handleSend}
          disabled={isLoading || !inputText.trim()}
          style={sendButtonStyle}
          title="Send message"
        >
          {isLoading ? (
            <span style={{ fontSize: '18px', lineHeight: 1 }}>...</span>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      {isLoading && <div style={loadingTextStyle}>AI is typing...</div>}
      {error && <div style={errorTextStyle}>Error: {error}</div>}
    </div>
  );
};

export default ChatInput;
