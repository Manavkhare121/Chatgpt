import React, { useState } from 'react';
import ChatMobileBar from '../Components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../Components/chat/ChatSidebar.jsx';
import ChatMessages from '../Components/chat/ChatMessages.jsx';
import ChatComposer from '../Components/chat/ChatComposer.jsx';
import '../Components/chat/ChatLayout.css';

const Home = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleNewChat = () => {
    setMessages([]);
    setSidebarOpen(false);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      type: 'user',
      content: input
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="chat-layout minimal">
      
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={handleNewChat}
      />

      <ChatSidebar
        chats={[]} 
        activeChatId={null}
        onSelectChat={() => {}}
        onNewChat={handleNewChat}
        open={sidebarOpen}
      />

      <main className="chat-main" role="main">

        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="chip">Early Preview</div>
            <h1>ChatGPT Clone</h1>
            <p>
              Ask anything. Paste text, brainstorm ideas, or get quick explanations.
            </p>
          </div>
        )}

        <ChatMessages messages={messages} isSending={false} />

        <ChatComposer
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          isSending={false}
        />

      </main>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
