import React from "react";
import { MessageSquare } from "lucide-react";

function HistoryList() {
  const chats = [
    { id: 1, title: "Chat 1", active: true },
    { id: 2, title: "Chat 2", active: false },
    { id: 3, title: "Chat 3", active: false },
  ];

  return (
    <div className="history-section">
      <p className="history-title">History</p>

      <div className="history-list">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`history-item ${chat.active ? "active" : ""}`}
          >
            <MessageSquare size={16} />
            <span className="history-text">{chat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;
