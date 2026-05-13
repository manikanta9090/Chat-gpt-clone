import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Trash2, Clock } from "lucide-react";

function HistoryList({ chats, currentChatId, onSelectChat, onDeleteChat, onClose, isShared, loading = false }) {
  const handleKeyDown = (e, chatId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectChat(chatId);
      onClose();
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-gray-600 rounded animate-pulse" />
          <div className="h-3 bg-gray-600 rounded animate-pulse w-20" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-600 rounded" />
                <div className="h-3 bg-gray-600 rounded flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No chats yet</p>
        <p className="text-gray-600 text-xs">Start a new conversation</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Recent Chats</h3>
      </div>

      <div className="space-y-1">
        {chats.map((chat, index) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              chat.id === currentChatId
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                : 'hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
            role="button"
            tabIndex={0}
            onClick={() => {
              onSelectChat(chat.id);
              onClose();
            }}
            onKeyDown={(e) => handleKeyDown(e, chat.id)}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className={`w-4 h-4 flex-shrink-0 ${
                chat.id === currentChatId ? 'text-blue-400' : 'text-gray-500'
              }`} />
              <span className={`text-sm truncate ${
                chat.id === currentChatId ? 'text-white font-medium' : 'text-gray-300'
              }`}>
                {chat.title}
              </span>
            </div>

            {!isShared && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/20 transition-all duration-200"
                aria-label="Delete chat"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;
