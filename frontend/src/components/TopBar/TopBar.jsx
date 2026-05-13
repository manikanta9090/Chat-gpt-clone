import { motion } from 'framer-motion';
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Share2, Check } from "lucide-react";
import { useState } from 'react';

const TopBar = () => {
  const { currentChatId } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    if (!currentChatId) {
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
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (error) {
      console.error('Error sharing chat:', error);
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-slate-900/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6"
    >
      {/* Left side - Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {currentChatId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            {shareCopied ? (
              <>
                <Check size={16} className="text-green-400" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={16} />
                Share Chat
              </>
            )}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/profile')}
          className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 group"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TopBar;
