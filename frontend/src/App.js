import Sidebar from "./components/Sidebar/Sidebar";
import ChatContainer from "./components/Chat/ChatContainer";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <ChatProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <ChatContainer />
      </div>
    </ChatProvider>
  );
}

export default App;
