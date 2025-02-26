import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { initializeSocket, disconnectSocket } from '../services/socket';
import './Chat.css';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const username = userData.username;
    if (username) {
      let socketConnection = initializeSocket(userData);
      setSocket(socketConnection);
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="chat-container">
      <Sidebar socket={socket} onUserSelect={handleUserSelect} />
      <ChatWindow selectedUser={selectedUser} socket={socket} />
    </div>
  );
};

export default Chat;