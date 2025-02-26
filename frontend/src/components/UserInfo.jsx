import React from 'react';
import './UserInfo.css';

const UserInfo = ({ isVisible, onClose, userData }) => {
  return (
    <div className={`user-info-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="user-info-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="user-info-content">
          <div className="user-avatar">
            {userData.name.split(' ').map(word => word[0]).join('')}
          </div>
          <div className="user-details">
            <h2>{userData.name}</h2>
            <p className="user-phone">{userData.phone}</p>
            <p className="user-email">{userData.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;