import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./components/Sidebar/Sidebar";
import ChatContainer from "./components/Chat/ChatContainer";
import TopBar from "./components/TopBar/TopBar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

const MainApp = ({ user }) => {
  return (
    <Router key={user?.uid}>
      <ChatProvider>
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TopBar />
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Routes>
              <Route path="/" element={<ProtectedRoute><ChatContainer /></ProtectedRoute>} />
              <Route path="/chat/:shareId" element={<ChatContainer />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              </Routes>
            </div>
          </div>
        </div>
      </ChatProvider>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return <MainApp user={user} />;
};

export default App;
