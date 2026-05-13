import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex gap-3 md:gap-4 max-w-4xl mx-auto px-4 md:px-6 py-4 group ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
            : 'bg-gradient-to-r from-green-500 to-emerald-600'
        } shadow-lg`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}>
        {/* Role Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-xs font-medium mb-2 ${
            isUser ? 'text-blue-400' : 'text-green-400'
          }`}
        >
          {isUser ? 'You' : 'Assistant'}
        </motion.div>

        {/* Message Bubble */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className={`relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border ${
            isUser
              ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 border-blue-500/30 text-white ml-12'
              : 'bg-slate-800/90 border-white/10 text-gray-100 mr-12'
          }`}
        >
          {/* Copy Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200 ${
              isUser
                ? 'hover:bg-white/20 text-white/70 hover:text-white'
                : 'hover:bg-white/10 text-gray-400 hover:text-gray-200'
            } opacity-0 group-hover:opacity-100`}
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </motion.button>

          {/* Message Text */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-8">
            {message.text}
          </div>

          {/* Timestamp (optional) */}
          <div className={`text-xs mt-2 opacity-60 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
