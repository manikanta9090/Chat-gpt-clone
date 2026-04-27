import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from "./components/Sidebar/Sidebar";
import ChatContainer from "./components/Chat/ChatContainer";
import SharedChat from "./components/SharedChat";
import TopBar from "./components/TopBar/TopBar";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <ChatProvider>
      <Router>
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TopBar />
            <Routes>
              <Route path="/" element={<ChatContainer />} />
              <Route path="/chat/:shareId" element={<SharedChat />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;
