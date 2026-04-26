import { useState, useRef, useEffect } from "react";
import { Plus, Mic, Send, Paperclip } from "lucide-react";

const ChatInput = ({ onSendMessage, onNewChat }) => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // 🎤 Voice Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Voice started");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice:", transcript);

      // ✅ Fill input with voice text
      setInputText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Voice ended");
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  // 📏 Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [inputText]);

  // 📤 Send Message
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const message = inputText.trim();
    setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      await onSendMessage(message);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ⌨️ Enter key send
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 🎤 Toggle Voice
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice not supported. Use Chrome.");
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  // 📎 File Upload
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setInputText(`[File: ${file.name}]`);
    }
  };

  // 🎨 Styles
  const containerStyle = {
    position: "fixed",
    bottom: 0,
    left: "260px",
    right: 0,
    padding: "16px",
    backgroundColor: "#202123",
    borderTop: "1px solid #2f2f2f",
    display: "flex",
    justifyContent: "center",
  };

  const inputWrapperStyle = {
    maxWidth: "768px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#40414f",
    borderRadius: "12px",
    padding: "10px",
  };

  const iconButtonStyle = {
    background: "transparent",
    border: "none",
    color: "#ababad",
    cursor: "pointer",
    padding: "6px",
  };

  const textareaStyle = {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    outline: "none",
    resize: "none",
  };

  const sendButtonStyle = {
    backgroundColor: isLoading ? "#565869" : "#10a37f",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={inputWrapperStyle}>
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {/* ➕ New Chat */}
        <button onClick={onNewChat} style={iconButtonStyle}>
          <Plus size={20} />
        </button>

        {/* 📎 Upload */}
        <button onClick={triggerFileInput} style={iconButtonStyle}>
          <Paperclip size={20} />
        </button>

        {/* 📝 Input */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Send a message..."
          style={textareaStyle}
          rows={1}
        />

        {/* 🎤 Voice */}
        <button
          onClick={toggleVoiceInput}
          style={{
            ...iconButtonStyle,
            color: isListening ? "red" : "#ababad",
          }}
        >
          <Mic size={20} />
        </button>

        {/* ➤ Send */}
        <button onClick={handleSend} style={sendButtonStyle}>
          {isLoading ? "..." : <Send size={18} />}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ChatInput;