import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, Send, Paperclip, StopCircle } from "lucide-react";

const ChatInput = ({ onSendMessage, onNewChat, disabled = false, isTyping = false }) => {
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
    if (!inputText.trim() || isLoading || disabled) return;

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
    if (disabled) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 🎤 Toggle Voice
  const toggleVoiceInput = () => {
    if (disabled || !recognitionRef.current) {
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
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setInputText(`[File: ${file.name}]`);
    }
  };

  // Focus input when component mounts
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 md:left-80 p-4 md:p-6 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <motion.div
          className={`backdrop-blur-xl bg-slate-800/90 border border-white/10 rounded-2xl shadow-2xl p-4 pointer-events-auto ${
            disabled ? 'opacity-50' : ''
          }`}
          whileHover={!disabled ? { scale: 1.01 } : {}}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-end gap-3">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* New Chat Button */}
            <motion.button
              whileHover={!disabled ? { scale: 1.1, rotate: 90 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              onClick={onNewChat}
              disabled={disabled}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              title="New Chat"
            >
              <Plus size={20} />
            </motion.button>

            {/* File Upload Button */}
            <motion.button
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              onClick={triggerFileInput}
              disabled={disabled}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
              title="Upload File"
            >
              <Paperclip size={20} />
            </motion.button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={disabled ? "Read-only mode" : "Type your message..."}
                disabled={disabled}
                rows={1}
                className="w-full bg-transparent border-0 text-white placeholder-gray-400 outline-none resize-none min-h-[20px] max-h-32 py-1 leading-relaxed"
              />
            </div>

            {/* Voice Button */}
            <motion.button
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.9 } : {}}
              onClick={toggleVoiceInput}
              disabled={disabled}
              className={`p-2.5 rounded-xl transition-all duration-200 disabled:cursor-not-allowed ${
                isListening
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title={isListening ? "Stop Recording" : "Voice Input"}
            >
              <AnimatePresence mode="wait">
                {isListening ? (
                  <motion.div
                    key="stop"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StopCircle size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mic"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Mic size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Send Button */}
            <motion.button
              whileHover={!disabled && inputText.trim() ? { scale: 1.05 } : {}}
              whileTap={!disabled && inputText.trim() ? { scale: 0.95 } : {}}
              onClick={handleSend}
              disabled={disabled || isLoading || !inputText.trim()}
              className={`p-2.5 rounded-xl transition-all duration-200 disabled:cursor-not-allowed ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                  : 'bg-gray-600 text-gray-400'
              }`}
              title="Send Message"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Send size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-500 mt-3"
        >
          AI Assistant can make mistakes. Consider checking important information.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ChatInput;