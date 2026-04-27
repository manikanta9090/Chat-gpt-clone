import React, { useCallback } from "react";
import { Plus } from "lucide-react";
import Menu from "./Menu";
import HistoryList from "./HistoryList";
import UserProfile from "./UserProfile";
import { useChat } from "../../context/ChatContext";
import "./Sidebar.css";

function Sidebar() {
  const { chats, currentChatId, createNewChat, selectChat, deleteChat, isShared } = useChat();

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
    <div className="sidebar">
      <div className="sidebar-top">
        <button 
          className="new-chat-btn" 
          onClick={handleNewChat}
          disabled={isShared}
          style={{
            opacity: isShared ? 0.5 : 1,
            cursor: isShared ? 'not-allowed' : 'pointer',
            pointerEvents: isShared ? 'none' : 'auto'
          }}
        >
          <Plus size={18} />
          <span>New chat</span>
        </button>
        <Menu />
      </div>

      <div className="sidebar-middle">
        <HistoryList
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          isShared={isShared}
        />
      </div>

      <div className="sidebar-bottom">
        <UserProfile />
      </div>
    </div>
  );
}

export default Sidebar;
