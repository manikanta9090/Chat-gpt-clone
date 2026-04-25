import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import Menu from "./Menu";
import HistoryList from "./HistoryList";
import UserProfile from "./UserProfile";
import "./Sidebar.css";

function Sidebar() {
  const [chats, setChats] = useState([
    { id: 1, title: "Chat 1", active: true },
    { id: 2, title: "Chat 2", active: false },
    { id: 3, title: "Chat 3", active: false },
  ]);

  const handleSelectChat = useCallback((chatId) => {
    setChats(prev => prev.map(c => ({ ...c, active: c.id === chatId })));
  }, []);

  const handleDeleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
  }, []);

  const handleNewChat = useCallback(() => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      active: true,
    };
    setChats(prev => [newChat, ...prev.map(c => ({ ...c, active: false }))]);
  }, [chats.length]);

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
