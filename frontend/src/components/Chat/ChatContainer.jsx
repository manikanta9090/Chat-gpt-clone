import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { useChat } from '../../context/ChatContext';

const ChatContainer = () => {
  const { getCurrentMessages, createNewChat, sendMessage, loading, isShared } = useChat();
  const currentMessages = getCurrentMessages();
  const [isTyping, setIsTyping] = useState(false);

  const handleNewChat = useCallback(() => {
    createNewChat();
  }, [createNewChat]);

  const handleSendMessage = useCallback(async (inputText) => {
    setIsTyping(true);
    try {
      await sendMessage(inputText);
    } finally {
      setIsTyping(false);
    }
  }, [sendMessage]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="ml-4 text-gray-400"
        >
          Loading conversation...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <MessageList messages={currentMessages} isTyping={isTyping} />
      <ChatInput
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        disabled={isShared}
        isTyping={isTyping}
      />

      {/* Shared Chat Indicator */}
      <AnimatePresence>
        {isShared && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-80 right-0 px-6 pointer-events-none"
          >
            <div className="max-w-4xl mx-auto">
              <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                <p className="text-amber-400 text-sm font-medium">
                  📖 This is a shared read-only chat
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatContainer;
