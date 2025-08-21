import React, { useState, useRef } from 'react';
import { FiSend, FiImage, FiMic, FiX } from 'react-icons/fi';
import './MessageInput.css';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit triggered:', { message: message.trim(), hasImage: !!selectedImage, disabled });
    if ((message.trim() || selectedImage) && !disabled) {
      console.log('Sending message with image:', selectedImage?.name);
      onSendMessage(message, selectedImage);
      setMessage('');
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageSelect = (e) => {
    console.log('File input triggered', e.target.files);
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      console.log('Image selected:', file.name, file.type);
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('Image preview created');
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No valid image file selected');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="message-input-container">
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Selected" className="preview-image" />
          <button type="button" className="remove-image-btn" onClick={removeImage}>
            <FiX />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-wrapper">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Select models to start chatting..." : selectedImage ? "Ask about this image..." : "Ask me anything..."}
            className="message-textarea"
            rows="1"
            disabled={disabled}
          />
          <div className="input-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button 
              type="button" 
              className="action-btn" 
              disabled={disabled}
              onClick={() => {
                console.log('Image button clicked');
                fileInputRef.current?.click();
              }}
            >
              <FiImage />
            </button>
            <button type="button" className="action-btn" disabled={disabled}>
              <FiMic />
            </button>
            <button 
              type="submit" 
              className="send-btn"
              disabled={disabled || (!message.trim() && !selectedImage)}
            >
              <FiSend />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
