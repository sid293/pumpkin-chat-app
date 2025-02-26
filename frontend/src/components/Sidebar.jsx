import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import './Sidebar.css';

const Sidebar = ({ socket, onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if(!socket) {
        console.log("socket undefined")
        return
    }

    socket.on('users', ({ users = [] }) => {
      try {
        const currentUser = JSON.parse(sessionStorage.getItem('userData'));
        const filteredUsers = users.filter(user => 
          user && user.username && currentUser && currentUser.username && user.username !== currentUser.username
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error processing users:', error);
        setUsers([]);
      }
    });
    
    return () => {
      socket.off('users');
    };
  }, [socket]);

  useEffect(() => {
    const filtered = users.filter(user => {
      const query = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
    });
    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="chat-title">chat</h1>
        <input 
          type="text" 
          placeholder="Search by username or email" 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="chat-list">
        {filteredUsers.map((user) => (
          <div 
            key={`${user.id}-${user.username}`}
            className="chat-item" 
            onClick={() => onUserSelect(user)}
          >
            <div className="chat-avatar" style={{ position: 'relative' }}>
              {user.username.split(' ').map(word => word[0]).join('')}
              {user.isOnline && (
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
            
            <div className="chat-info">
              <div className="chat-header">
                <span className="chat-name">{user.username}</span>
              </div>
              <div className="chat-message">
                {user.isOnline ? 'Online' : `Last seen: ${new Date(user.lastSeen).toLocaleString()}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;