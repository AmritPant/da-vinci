import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './ModelPanel.css';

const ModelPanel = ({ model, messages, isLoading }) => {
  const getProviderColor = (provider) => {
    const colors = {
      openai: '#10A37F',
      anthropic: '#D97706',
      deepseek: '#3B82F6',
      google: '#EA4335',
      xai: '#8B5CF6'
    };
    return colors[provider] || '#6B7280';
  };

  return (
    <div className="model-panel">
      <div className="model-header">
        <div className="model-info">
          <div 
            className="model-indicator"
            style={{ backgroundColor: getProviderColor(model.provider) }}
          ></div>
          <h3 className="model-title">{model.name}</h3>
        </div>
        <div className="model-status">
          {isLoading && <div className="loading-spinner"></div>}
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation with {model.name}</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-content">
                {message.image && (
                  <div className="message-image">
                    <img src={message.image} alt="User uploaded" />
                  </div>
                )}
                {message.role === 'assistant' && !message.isError ? (
                  <MarkdownRenderer content={message.content} />
                ) : (
                  message.content
                )}
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message assistant loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelPanel;
