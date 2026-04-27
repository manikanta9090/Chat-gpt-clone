import React from "react";
import { MessageSquare, Trash2 } from "lucide-react";

function HistoryList({ chats, currentChatId, onSelectChat, onDeleteChat, isShared }) {
  const handleKeyDown = (e, chatId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectChat(chatId);
    }
  };

  return (
    <div className="history-section">
      <p className="history-title">History</p>

      <div className="history-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`history-item ${chat.id === currentChatId ? "active" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => onSelectChat(chat.id)}
            onKeyDown={(e) => handleKeyDown(e, chat.id)}
          >
            <div className="history-item-content">
              <MessageSquare size={16} />
              <span className="history-text">{chat.title}</span>
            </div>
            {!isShared && (
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                aria-label="Delete chat"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;
