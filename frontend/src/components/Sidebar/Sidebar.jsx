import React, { useCallback } from "react";
import { Plus } from "lucide-react";
import Menu from "./Menu";
import HistoryList from "./HistoryList";
import UserProfile from "./UserProfile";
import { useChat } from "../../context/ChatContext";
import "./Sidebar.css";

function Sidebar() {
  const { chats, currentChatId, createNewChat, selectChat, deleteChat } = useChat();

  const handleNewChat = useCallback(() => {
    createNewChat();
  }, [createNewChat]);

  const handleSelectChat = useCallback((chatId) => {
    selectChat(chatId);
  }, [selectChat]);

  const handleDeleteChat = useCallback((chatId) => {
    deleteChat(chatId);
  }, [deleteChat]);

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <button className="new-chat-btn" onClick={handleNewChat}>
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
        />
      </div>

      <div className="sidebar-bottom">
        <UserProfile />
      </div>
    </div>
  );
}

export default Sidebar;
