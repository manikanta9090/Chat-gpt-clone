import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import Menu from "./Menu";
import HistoryList from "./HistoryList";
import UserProfile from "./UserProfile";
import { useChat } from "../../context/ChatContext";

function Sidebar() {
  const { chats, currentChatId, createNewChat, selectChat, deleteChat, isShared, loading } = useChat();

  const handleNewChat = useCallback(() => {
    if (!isShared) {
      createNewChat();
    }
  }, [createNewChat, isShared]);

  const handleSelectChat = useCallback((chatId) => {
    if (!isShared) {
      selectChat(chatId);
    }
  }, [selectChat, isShared]);

  const handleDeleteChat = useCallback((chatId) => {
    if (!isShared) {
      deleteChat(chatId);
    }
  }, [deleteChat, isShared]);

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-80 h-screen bg-slate-900/90 backdrop-blur-2xl border-r border-white/10 flex flex-col shadow-2xl fixed md:relative z-50 md:z-auto"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Assistant</h1>
        </div>

        {/* New Chat Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          disabled={isShared}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>

        <Menu />
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <div className="p-6">
        <HistoryList
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          isShared={isShared}
          loading={loading}
        />
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-white/10 bg-slate-800/20">
        <UserProfile />
      </div>
    </motion.div>
  );
}

export default Sidebar;
