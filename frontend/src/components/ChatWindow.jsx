import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import UserInfo from './UserInfo';
import './ChatWindow.css';

const ChatWindow = ({ selectedUser, socket }) => {
  const [message, setMessage] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [messages, setMessages] = useState([]);
  const currentUser = JSON.parse(sessionStorage.getItem('userData'));

  useEffect(() => {
    if (!socket) {
      console.log("no socket");
      return;
    }

    // Handle incoming private messages
    const handlePrivateMessage = ({from, message, time}) => {
      
      // Store messages in localStorage regardless of selected user
      const storageKey = `chat_messages_${from.username}`;
      const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Find existing sender group or create new one
      let senderGroup = storedMessages.find(group => group.from === from.username);
      if (!senderGroup) {
        senderGroup = {
          from: from.username,
          messages: []
        };
        storedMessages.push(senderGroup);
      }
      
      // Add message to sender's messages array
      senderGroup.messages.push({
        text: message.text,
        timestamp: message.time
      });
      
      localStorage.setItem(storageKey, JSON.stringify(storedMessages));

      // Only update UI if message is from/to selected user
      // if (selectedUser && (from.id === selectedUser.id || message.receiverId === selectedUser.id)) {
      if (selectedUser && (from.username === selectedUser.username || message.receiverId === selectedUser.id)) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

    // socket event listeners
    socket.on('message', handlePrivateMessage);

    // Cleanup function
    return () => {
      socket.off('message', handlePrivateMessage);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      // Load stored messages for the selected user
      const storageKey = `chat_messages_${selectedUser.username}`;
      const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Find messages for the selected user
      const userMessages = storedMessages.find(group => group.from === selectedUser.username);
      
      if (userMessages) {
        // Transform stored messages to match the expected format
        const formattedMessages = userMessages.messages.map(msg => ({
          id: Date.now() + Math.random(), // Generate a unique ID
          text: msg.text,
          time: msg.timestamp,
          isMe: msg.sender === currentUser.username // Set isMe based on message sender
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    }
  }, [selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      const newMessage = {
        id: Date.now(),
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderId: socket.id,
        receiverId: selectedUser.id,
        isMe: true
      };

      // Store message in localStorage
      const storageKey = `chat_messages_${selectedUser.username}`;
      const storedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Find existing sender group or create new one
      let senderGroup = storedMessages.find(group => group.from === selectedUser.username);
      if (!senderGroup) {
        senderGroup = {
          from: selectedUser.username,
          messages: []
        };
        storedMessages.push(senderGroup);
      }
      
      // Add message to sender's messages array with sender information
      senderGroup.messages.push({
        text: message,
        timestamp: newMessage.time,
        sender: currentUser.username // Add sender information
      });
      
      localStorage.setItem(storageKey, JSON.stringify(storedMessages));

      socket.emit('message', {
        to: selectedUser,
        from: currentUser,
        message: newMessage
      });

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  if (!selectedUser) {
    return <div className="chat-window" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="no-chat-selected" style={{ fontSize: '1.5rem', color: '#666', padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Select a chat to start messaging</div>
    </div>;
  }

  return (
    <div className="chat-window ${showUserInfo ? 'user-info-open' : ''}" style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'hidden' }}>
      <div className="chat-header">
        <div className="chat-contact" onClick={() => setShowUserInfo(true)}>
          <div className="contact-avatar" style={{ position: 'relative' }}>
            {selectedUser.username.split(' ').map(word => word[0]).join('')}
            {selectedUser.isOnline && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#44b700',
                  borderRadius: '50%',
                  border: '2px solid white'
                }}
              />
            )}
          </div>
          <div className="contact-info">
            <div className="contact-name">{selectedUser.username}</div>
            <div className="contact-status">
              {selectedUser.isOnline ? 'Online' : `Last seen: ${new Date(selectedUser.lastSeen).toLocaleString()}`}
            </div>
          </div>
        </div>
      </div>
      
      <div className="messages-container" style={{ flex: 1, overflowY: 'auto', padding: '20px', marginBottom: '0', height: 'calc(100vh - 140px)' }}>
        {selectedUser && messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isMe ? 'message-sent' : 'message-received'}`}>
            <div className="message-content">{msg.text}</div>
            <div className="message-time">{msg.time}</div>
          </div>
        ))}
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '1px solid #e0e0e0', backgroundColor: '#f5f5f5', position: 'sticky', bottom: 0, zIndex: 1 }}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
          style={{
            padding: '12px',
            borderRadius: '20px',
            border: '1px solid #e0e0e0',
            color:'black',
            backgroundColor: '#fff',
            width: '100%',
            marginRight: '10px',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          className="send-button"
          style={{
            padding: '12px 24px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          Send
        </button>
      </form>

      <UserInfo
        isVisible={showUserInfo}
        onClose={() => setShowUserInfo(false)}
        userData={{
          name: selectedUser.username,
          email: selectedUser.email,
          avatar: selectedUser.avatar || 'https://via.placeholder.com/150'
        }}
      />
    </div>
  );
};

export default ChatWindow;