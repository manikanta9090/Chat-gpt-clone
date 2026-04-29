import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { Share2, LogOut } from "lucide-react";

const TopBar = () => {
  const { currentChatId } = useChat();
  const { logout } = useAuth();

  const handleShare = async () => {
    if (!currentChatId) {
      alert("No chat selected to share");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/get-share-link/${currentChatId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const data = await response.json();
      const shareUrl = `${window.location.origin}/chat/${data.shareId}`;

      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    } catch (error) {
      console.error('Error sharing chat:', error);
      alert('Failed to copy link');
    }
  };

  // Only show share button if there's an active chat
  if (!currentChatId) {
    return null;
  }

  return (
    <div style={{
      padding: '12px 24px',
      backgroundColor: '#202123',
      borderBottom: '1px solid #2f2f2f',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '12px'
    }}>
      <button
        onClick={handleShare}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'transparent',
          border: '1px solid #565869',
          borderRadius: '8px',
          color: '#ececf1',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2f'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Share2 size={16} />
        Share chat
      </button>
      <button
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'transparent',
          border: '1px solid #565869',
          borderRadius: '8px',
          color: '#ececf1',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2f'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default TopBar;
