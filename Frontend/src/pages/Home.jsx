import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import ChatMobileBar from '../Components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../Components/chat/ChatSidebar.jsx';
import ChatMessages from '../Components/chat/ChatMessages.jsx';
import ChatComposer from '../Components/chat/ChatComposer.jsx';
import '../Components/chat/ChatLayout.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  setChats
} from '../store/chatSlice.js';

const BACKEND_URL =
  import.meta.env.VITE_API_BASE ||
  "https://chatgpt-rag-1.onrender.com";

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const input = useSelector(state => state.chat.input);
  const isSending = useSelector(state => state.chat.isSending);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  useEffect(() => {

    axios.get(`${BACKEND_URL}/api/chat`, { withCredentials: true })
      .then(response => {
        dispatch(setChats(response.data.chats.reverse()));
      })
      .catch(err => console.error(err));

    const tempSocket = io(BACKEND_URL, {
      withCredentials: true,
    });

    tempSocket.on("ai-response", (messagePayload) => {
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          content: messagePayload.content
        }
      ]);

      dispatch(sendingFinished());
    });

    setSocket(tempSocket);

    return () => {
      tempSocket.disconnect();
    };

  }, [dispatch]);

  const handleNewChat = async () => {
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/chat`,
        { title },
        { withCredentials: true }
      );

      dispatch(startNewChat(response.data.chat));
      getMessages(response.data.chat._id);
      setSidebarOpen(false);

    } catch (error) {
      console.error(error);
    }
  };


  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;

    dispatch(sendingStarted());

    setMessages(prev => [
      ...prev,
      {
        type: 'user',
        content: trimmed
      }
    ]);

    dispatch(setInput(''));

    socket.emit("ai-message", {
      chat: activeChatId,
      content: trimmed
    });
  };

  
  const getMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/chat/messages/${chatId}`,
        { withCredentials: true }
      );

      setMessages(
        response.data.messages.map(m => ({
          type: m.role === 'user' ? 'user' : 'ai',
          content: m.content
        }))
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={handleNewChat}
      />

      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          dispatch(selectChat(id));
          setSidebarOpen(false);
          getMessages(id);
        }}
        onNewChat={handleNewChat}
        open={sidebarOpen}
      />

      <main className="chat-main" role="main">
        {messages.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Early Preview</div>
            <h1>ChatGPT Clone</h1>
            <p>
              Ask anything. Paste text, brainstorm ideas, or get quick explanations.
              Your chats stay in the sidebar so you can pick up where you left off.
            </p>
          </div>
        )}

        <ChatMessages messages={messages} isSending={isSending} />

        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => dispatch(setInput(v))}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}
      </main>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
