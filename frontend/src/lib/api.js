// Centralized API configuration for production deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  CHATS: `${API_BASE_URL}/api/chats`,
  CHAT: (id) => `${API_BASE_URL}/api/chats/${id}`,
  CHAT_MESSAGE: (id) => `${API_BASE_URL}/api/chats/${id}/message`,
  CHAT_TITLE: (id) => `${API_BASE_URL}/api/chats/${id}/title`,
  SHARE_LINK: (id) => `${API_BASE_URL}/api/get-share-link/${id}`,
  SHARED_CHAT: (id) => `${API_BASE_URL}/api/share/${id}`,
  CHAT_COMPLETION: `${API_BASE_URL}/chat`,
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;