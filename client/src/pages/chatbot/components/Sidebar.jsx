import React, { useState } from 'react';
import './Sidebar.css';
import menuIcon from './icons/menu-icon.svg';
import newChatIcon from './icons/new-chat-icon.svg';
import settingsIcon from './icons/settings-icon.svg';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <img src={menuIcon} alt="Toggle Sidebar" />
      </div>
      {isOpen && (
        <div className="sidebar-content">
          <div className="user-info">
            <div className="user-avatar">N</div>
            <div className="user-name">NyaAI Chatbot</div>
          </div>
          <div className="sidebar-options">
            <div className="option">
              <img src={newChatIcon} alt="New Chat" />
              <span>New Chat</span>
            </div>
            <div className="option">
              <img src={settingsIcon} alt="Settings" />
              <span>Settings</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;