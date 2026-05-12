import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Share2, LogOut } from "lucide-react";

const TopBar = () => {
  const { currentChatId } = useChat();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

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
      {currentChatId && (
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
      )}
      <button
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2f'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#565869',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ececf1',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </button>
    </div>
  );
};

export default TopBar;
