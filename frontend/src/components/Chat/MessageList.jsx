import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Sparkles } from 'lucide-react';

const MessageList = ({ messages, isTyping = false }) => {
  if (messages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-6 py-12"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-semibold text-white mb-3"
          >
            Start a conversation
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-sm leading-relaxed"
          >
            Ask me anything! I'm here to help with questions, creative tasks, and problem-solving.
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 py-6"
    >
      <div className="space-y-6 pb-32">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MessageList;
