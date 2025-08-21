import React, { useState, useEffect } from 'react';
import { FiTrash2, FiMessageSquare, FiX } from 'react-icons/fi';
import { chatHistoryService } from '../lib/supabase';
import './ChatHistory.css';

const ChatHistory = ({ isOpen, onClose, userId, onLoadConversation, currentConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatHistoryService.getUserConversations(userId);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      loadConversations();
    }
  }, [isOpen, userId, loadConversations]);

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await chatHistoryService.deleteConversation(conversationId);
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  const handleLoadConversation = (conversation) => {
    onLoadConversation(conversation);
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="chat-history-overlay">
      <div className="chat-history-sidebar">
        <div className="chat-history-header">
          <h2>Chat History</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="chat-history-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <FiMessageSquare size={48} />
              <p>No conversations yet</p>
              <span>Start chatting to see your history here</span>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    currentConversationId === conversation.id ? 'active' : ''
                  }`}
                  onClick={() => handleLoadConversation(conversation)}
                >
                  <div className="conversation-content">
                    <h3 className="conversation-title">{conversation.title}</h3>
                    <p className="conversation-date">
                      {formatDate(conversation.updated_at)}
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
