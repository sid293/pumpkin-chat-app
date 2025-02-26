import React, { useState } from 'react';
import './MessageInput.css';
import UserInfo from './UserInfo';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const userData = {
    name: 'Daina Moore',
    phone: '+032165487924',
    email: 'dianamoore@gmail.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  return (
    <div className="message-input-container">
      <button
        className="user-icon-button"
        onClick={() => setShowUserInfo(true)}
      >
        <img src={userData.avatar} alt="User" className="user-icon" />
      </button>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <UserInfo
        isVisible={showUserInfo}
        onClose={() => setShowUserInfo(false)}
        userData={userData}
      />
    </div>
  );
};

export default MessageInput;
