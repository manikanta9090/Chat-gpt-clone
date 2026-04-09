import React from "react";
import { Plus } from "lucide-react";
import Menu from "./Menu";
import HistoryList from "./HistoryList";
import UserProfile from "./UserProfile";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <button className="new-chat-btn">
          <Plus size={18} />
          <span>New chat</span>
        </button>
        <Menu />
      </div>

      <div className="sidebar-middle">
        <HistoryList />
      </div>

      <div className="sidebar-bottom">
        <UserProfile />
      </div>
    </div>
  );
}

export default Sidebar;
